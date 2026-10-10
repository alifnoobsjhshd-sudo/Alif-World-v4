import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { createRequire } from 'node:module';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

const require = createRequire(import.meta.url);
const { createChatApiApp } = require('./server/chat-api.cjs');

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  // Vite's .env.local values are not automatically copied into process.env.
  // The chat endpoint runs only in this Node dev server, so load its key here
  // without defining or exposing it to the browser bundle.
  if (!process.env.AI_API && env.AI_API) {
    process.env.AI_API = env.AI_API;
  }
  const virtualCursorEnabled = [env.CURSER, env.VITE_CURSER].some(
    (value) => value?.trim().toLowerCase() === 'true',
  );
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'alif-world-chat-api',
        configureServer(server) {
          server.middlewares.use(createChatApiApp());
        },
      },
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.CURSER': JSON.stringify(String(virtualCursorEnabled)),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true'
        ? null
        : { ignored: ['**/.local/skills/**', '**/.local/secondary_skills/**'] },
    },
  };
});
