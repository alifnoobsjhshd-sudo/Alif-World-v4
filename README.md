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
2. Set `AI_API` to your Gemini API key in Replit Secrets or your untracked local `.env.local` file. Do not prefix it with `VITE_`.
3. Run the app:
   `npm run dev`

## Deploy to Render

This app deploys as a **[Render](https://render.com) Node Web Service** so the portfolio and private Gemini chat endpoint can run in one service. Set `AI_API` in Render's service environment; Replit secrets are not copied to Render.

- For 1-click blueprint deployment or step-by-step dashboard instructions, see the complete guide: **[RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)**.
- A ready-to-use `render.yaml` Blueprint file is included in the project root.
