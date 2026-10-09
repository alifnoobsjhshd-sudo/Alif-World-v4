# Running this project on Replit

The site is a Vite and React app. Start the Replit preview with:

```sh
bun run dev -- --port 5000
```

The static Render build uses `npm install && npm run build`, as configured in `render.yaml`.

The virtual cursor touchpad is disabled by default. Enable it by setting either `CURSER=true` or `VITE_CURSER=true` in the environment, then restart the dev server.
