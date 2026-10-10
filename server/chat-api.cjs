const express = require('express');
const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');
const { GoogleGenAI, ThinkingLevel } = require('@google/genai');

try {
  dotenv.config({ path: '.env.local' });
  dotenv.config();
} catch {}

const instructionsPath = path.join(__dirname, '..', 'alif_world_ai_system_instructions.txt');
let systemInstructions = '';
try {
  systemInstructions = fs.readFileSync(instructionsPath, 'utf8');
} catch (e) {
  console.warn('Could not read system instructions file:', e.message);
}

const rateLimitBuckets = new Map();

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_REQUESTS = 24;
const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 4_000;
const MAX_HISTORY_LENGTH = 18_000;

function getApiKey() {
  const candidate = process.env.AI_API || process.env.GEMINI_API_KEY;
  if (!candidate || typeof candidate !== 'string') return '';
  return candidate.trim().replace(/^["']|["']$/g, '').trim();
}

// Keep both environment variables synchronized
const resolvedKey = getApiKey();
if (resolvedKey) {
  if (!process.env.AI_API) process.env.AI_API = resolvedKey;
  if (!process.env.GEMINI_API_KEY) process.env.GEMINI_API_KEY = resolvedKey;
}

function consumeRateLimit(clientId) {
  const now = Date.now();
  const bucket = rateLimitBuckets.get(clientId);

  if (!bucket || bucket.resetAt <= now) {
    rateLimitBuckets.set(clientId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
  } else if (bucket.count >= RATE_LIMIT_REQUESTS) {
    return false;
  } else {
    bucket.count += 1;
  }

  if (rateLimitBuckets.size > 5_000) {
    for (const [key, value] of rateLimitBuckets) {
      if (value.resetAt <= now) rateLimitBuckets.delete(key);
    }
    if (rateLimitBuckets.size > 5_000) {
      const oldestKey = rateLimitBuckets.keys().next().value;
      if (oldestKey) rateLimitBuckets.delete(oldestKey);
    }
  }

  return true;
}

function getConversationMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return { error: 'Send a message to start the conversation.' };
  }

  let totalLength = 0;
  const normalized = [];

  for (const message of messages.slice(-MAX_MESSAGES)) {
    if (!message || !['user', 'assistant'].includes(message.role) || typeof message.content !== 'string') {
      return { error: 'The conversation format is invalid.' };
    }

    const content = message.content.trim();
    if (!content || content.length > MAX_MESSAGE_LENGTH) {
      return { error: `Each message must be between 1 and ${MAX_MESSAGE_LENGTH} characters.` };
    }

    totalLength += content.length;
    if (totalLength > MAX_HISTORY_LENGTH) {
      return { error: 'This conversation is too long. Start a new chat and try again.' };
    }

    normalized.push({ role: message.role, content });
  }

  if (normalized.at(-1)?.role !== 'user') {
    return { error: 'Send a new message to continue.' };
  }

  return { messages: normalized };
}

function normalizeWebsiteUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return null;

  try {
    const candidate = value.trim();
    const url = new URL(/^[a-z][a-z\d+.-]*:\/\//i.test(candidate) ? candidate : `https://${candidate}`);
    if (!['http:', 'https:'].includes(url.protocol) || !url.hostname || url.username || url.password) {
      return null;
    }
    return url.origin;
  } catch {
    return null;
  }
}

function getWebsiteUrl(req) {
  const requestOrigin = normalizeWebsiteUrl(`${req.protocol}://${req.get('host') || ''}`);
  if (requestOrigin) return requestOrigin;

  const configuredUrl = [
    process.env.PUBLIC_SITE_URL,
    process.env.RENDER_EXTERNAL_URL,
    process.env.RENDER_EXTERNAL_HOSTNAME,
    process.env.APP_URL,
  ]
    .map(normalizeWebsiteUrl)
    .find(Boolean);

  return configuredUrl || null;
}

function createChatApiApp() {
  const api = express();
  api.set('trust proxy', 1);

  // Health check endpoint accessible under /api/health
  api.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  api.use('/api/chat', (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');

    if (req.method !== 'POST') return next();

    const clientId = req.ip || req.socket?.remoteAddress || 'unknown';
    if (!consumeRateLimit(clientId)) {
      return res.status(429).json({ error: 'Too many messages. Please wait a minute and try again.' });
    }

    return next();
  });

  api.use('/api/chat', express.json({ limit: '32kb' }));

  api.post('/api/chat', async (req, res) => {
    const conversation = getConversationMessages(req.body?.messages);
    if (conversation.error) {
      return res.status(400).json({ error: conversation.error });
    }

    const apiKey = getApiKey();
    if (!apiKey) {
      return res.status(503).json({ error: 'The assistant is not configured on this server yet. Please ensure AI_API or GEMINI_API_KEY is set.' });
    }

    try {
      const websiteUrl = getWebsiteUrl(req);
      const model = process.env.GEMINI_MODEL?.trim() || 'gemini-3.1-flash-lite';
      const isLite = model.includes('lite');
      const thinkingLevel = isLite ? ThinkingLevel.MINIMAL : ThinkingLevel.LOW;

      const systemContext = [
        systemInstructions.trim(),
        ...(websiteUrl
          ? [[
              `Authoritative current portfolio website URL for this request: ${websiteUrl}`,
              'This URL is the live website address for the current environment. When asked for the portfolio or website URL, give this exact address; do not use any older URL from background instructions.',
              'Only append a page path when that route has been verified.',
            ].join('\n')]
          : []),
      ].join('\n\n');

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      // Prepare turn sequence, ensuring alternation between user and model
      const contents = [];
      for (const message of conversation.messages) {
        const role = message.role === 'assistant' ? 'model' : 'user';
        if (contents.length > 0 && contents[contents.length - 1].role === role) {
          contents[contents.length - 1].parts[0].text += '\n\n' + message.content;
        } else {
          contents.push({
            role,
            parts: [{ text: message.content }],
          });
        }
      }

      // Ensure first message is from user
      if (contents.length > 0 && contents[0].role !== 'user') {
        contents.shift();
      }

      const stream = await ai.models.generateContentStream({
        model,
        contents,
        config: {
          systemInstruction: systemContext,
          thinkingConfig: { thinkingLevel },
          maxOutputTokens: 900,
        },
      });

      const wantsStream = req.body?.stream === true || (req.headers.accept && req.headers.accept.includes('text/event-stream'));

      if (wantsStream) {
        res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache, no-transform');
        res.setHeader('Connection', 'keep-alive');
        if (typeof res.flushHeaders === 'function') {
          res.flushHeaders();
        }

        try {
          for await (const chunk of stream) {
            const text = chunk.text;
            if (text) {
              res.write(`data: ${JSON.stringify({ text })}\n\n`);
            }
          }
          res.write('data: [DONE]\n\n');
          return res.end();
        } catch (streamError) {
          console.error('Error during SSE stream:', streamError?.message || streamError);
          res.write(`data: ${JSON.stringify({ error: 'Stream interrupted' })}\n\n`);
          return res.end();
        }
      } else {
        let reply = '';
        for await (const chunk of stream) {
          reply += chunk.text || '';
        }
        reply = reply.trim();
        if (!reply) {
          console.error('Gemini returned no assistant text.');
          return res.status(502).json({ error: 'The assistant returned an empty reply. Please try again.' });
        }
        return res.json({ reply });
      }
    } catch (error) {
      console.error('Gemini request failed:', error?.message || error);
      const message = error?.message || '';
      if (message.includes('API_KEY_INVALID') || message.includes('API key not valid')) {
        return res.status(401).json({ error: 'Gemini rejected the API key. Please check that AI_API is valid.' });
      }
      if (message.includes('429') || message.includes('RESOURCE_EXHAUSTED')) {
        return res.status(429).json({ error: 'Gemini quota or rate limit exceeded. Please try again later.' });
      }
      return res.status(502).json({ error: 'The assistant is temporarily unavailable. Please try again.' });
    }
  });

  api.all('/api/chat', (req, res) => {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Use POST to send a chat message.' });
  });

  api.use('/api/chat', (error, req, res, next) => {
    if (res.headersSent) return next(error);
    if (error?.type === 'entity.too.large') {
      return res.status(413).json({ error: 'That conversation is too long to send.' });
    }
    if (error?.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'The chat request must contain valid JSON.' });
    }
    return res.status(500).json({ error: 'The chat request could not be processed.' });
  });

  return api;
}

module.exports = { createChatApiApp };
