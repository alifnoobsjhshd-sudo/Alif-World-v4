const express = require('express');
const path = require('path');
const fs = require('fs');
const { createChatApiApp } = require('./server/chat-api.cjs');

const app = express();
const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');

app.set('trust proxy', 1);

// The same server handles Grok requests and serves the compiled SPA.
app.use(createChatApiApp());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Serve static assets from dist directory
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR, {
    maxAge: '1y',
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
    }
  }));

  // SPA fallback: return index.html for all other routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
} else {
  console.warn('Warning: dist directory not found. Please run npm run build first.');
  app.get('*', (req, res) => {
    res.status(503).send('Application is building or dist directory is missing.');
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Alif-World server listening on port ${PORT}`);
});
