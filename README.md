<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/e4ee0c07-6416-4392-8f39-d8041ebf50b4

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to Render

This app is fully optimized for **[Render](https://render.com)** static site hosting (100% free, automated SSL, global edge CDN, and zero cold starts).

- For 1-click blueprint deployment or step-by-step dashboard instructions, see the complete guide: **[RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)**.
- A ready-to-use `render.yaml` Blueprint file is included in the project root.
