const express = require('express');
const fs = require('node:fs');
const path = require('node:path');

const instructionsPath = path.join(__dirname, '..', 'alif_world_ai_system_instructions.txt');
const systemInstructions = fs.readFileSync(instructionsPath, 'utf8');
const rateLimitBuckets = new Map();

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_REQUESTS = 12;
const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 4_000;
const MAX_HISTORY_LENGTH = 18_000;

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

function extractAssistantText(responseBody) {
  return (responseBody?.candidates?.[0]?.content?.parts ?? [])
    .map((part) => (typeof part?.text === 'string' ? part.text : ''))
    .filter(Boolean)
    .join('\n')
    .trim();
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
  ]
    .map(normalizeWebsiteUrl)
    .find(Boolean);

  return configuredUrl || null;
}

function safeProviderErrorDetails(responseBody) {
  const providerError = responseBody?.error;
  const safeValue = (value) => (
    typeof value === 'string' && /^[a-z\d_.:-]{1,80}$/i.test(value)
      ? value
      : null
  );

  return {
    code: Number.isInteger(providerError?.code) ? String(providerError.code) : safeValue(providerError?.code),
    status: safeValue(providerError?.status),
    type: safeValue(providerError?.type),
    param: safeValue(providerError?.param),
  };
}

function getProviderFailureMessage(status) {
  if (status === 400) return 'Gemini rejected the chat request. Check the model and message format.';
  if (status === 401 || status === 403) return 'Gemini rejected AI_API. Check that it is a valid Gemini API key with API access enabled.';
  if (status === 404) return 'The configured Gemini model was not found. Check GEMINI_MODEL or use gemini-3.8-flash.';
  if (status === 429) return 'Gemini is rate-limited or the account has no available quota. Please try again later.';
  return 'The assistant could not answer just now. Please try again.';
}

function createChatApiApp() {
  const api = express();
  api.set('trust proxy', 1);

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

    const apiKey = process.env.AI_API?.trim();
    if (!apiKey) {
      return res.status(503).json({ error: 'The assistant is not configured on this server yet.' });
    }

    try {
      const websiteUrl = getWebsiteUrl(req);
      const model = process.env.GEMINI_MODEL?.trim() || 'gemini-3.8-flash';
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

      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
        {
        method: 'POST',
        headers: {
          'x-goog-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemContext }] },
          contents: conversation.messages.map((message) => ({
            role: message.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: message.content }],
          })),
          generationConfig: { maxOutputTokens: 900 },
          store: false,
        }),
        signal: AbortSignal.timeout(90_000),
        },
      );

      const responseBody = await geminiResponse.json().catch(() => null);
      if (!geminiResponse.ok) {
        const details = safeProviderErrorDetails(responseBody);
        const diagnostic = Object.entries(details)
          .filter(([, value]) => value)
          .map(([key, value]) => `${key}=${value}`)
          .join(' ');
        console.error(`Gemini request failed with status ${geminiResponse.status}${diagnostic ? ` (${diagnostic})` : ''}.`);
        return res.status(502).json({ error: getProviderFailureMessage(geminiResponse.status) });
      }

      const reply = extractAssistantText(responseBody);
      if (!reply) {
        console.error('Gemini returned no assistant text.');
        return res.status(502).json({ error: 'The assistant returned an empty reply. Please try again.' });
      }

      return res.json({ reply });
    } catch (error) {
      const reason = error?.name === 'TimeoutError' || error?.name === 'AbortError'
        ? 'timed out'
        : 'failed';
      console.error(`Gemini request ${reason}.`);
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
