# Complete Deployment Guide for Render (render.com)

This guide deploys the **Alif-World Portfolio** on [Render](https://render.com) as one Node Web Service. The Express server serves the built portfolio and the private Grok chatbot API from the same service.

---

## Why a Node Web Service?

- The app needs a server-side `/api/chat` route so the Grok API key is never sent to visitors' browsers.
- The existing Express server serves both the built frontend and chatbot API; no separate API service is required.
- A Render Static Site cannot run the API route. The existing Render service must be changed to a Node Web Service.
- Replit secrets are separate from Render environment variables. Add `AI_API` to the Render service before testing live chat.

---

## Option 1: Deploy from the Blueprint

The repository already includes a pre-configured `render.yaml` file.

1. Push the project to your **GitHub** or **GitLab** repository.
2. Log in to the [Render Dashboard](https://dashboard.render.com), choose **New +** > **Blueprint**, and connect that repository.
3. Render detects `render.yaml` and should show a **Node Web Service** with these settings:
   - **Service Type**: Node Web Service
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/api/health`
4. Review every proposed change before applying it. A Static Site cannot run the chatbot API; if Render cannot safely update the existing resource, create a separate Web Service and keep the old site until the new one is verified.
5. In the new service's **Environment** settings, add `AI_API` with the Grok API key. `render.yaml` uses `sync: false`, so Render will not read a key from the repository. If Render prompts for it during Blueprint setup, enter it there instead.

---

## Option 2: Configure a Web Service manually

If you prefer to configure the service manually through the Render UI:

### Step 1: Push Code to GitHub / GitLab
Make sure your project repository is published to GitHub or GitLab:
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### Step 2: Create a Node Web Service on Render
1. Open [dashboard.render.com](https://dashboard.render.com).
2. Click **"New +"** > **"Web Service"**.
3. Select and connect your repository from the list.

### Step 3: Configure Build & Runtime Settings
Enter the following exact configuration:

| Setting | Value | Notes |
|---|---|---|
| **Name** | `alif-world-portfolio` | Or any unique subdomain name you prefer |
| **Branch** | `main` | The default branch you push to |
| **Root Directory** | *(leave empty)* | Root of your repository |
| **Runtime** | `Node` | Runs the existing Express server |
| **Build Command** | `npm install && npm run build` | Installs dependencies and builds the Vite frontend |
| **Start Command** | `npm start` | Serves the frontend and `/api/chat` |
| **Health Check Path** | `/api/health` | Confirms the server is responding |

---

### Step 4: Configure the chatbot secret

The chatbot's API key must stay on the server. Do not add it to Vite, `VITE_*` variables, or frontend code.

In the Render Web Service's **Environment** settings:
1. Add `AI_API` and enter the Grok API key there.
2. Keep the key in Render's server-side environment only. Do not add it to a `VITE_*` variable, client-side code, or source control.
3. Save the variable. Grok usage and any related charges are associated with the xAI account for that key.

The Express server already handles SPA routes such as `/projects`, `/journey`, and `/chat`; do not add a catch-all Render rewrite that could intercept `/api/chat`.

---

### Step 5: Deploy and verify

1. Create the Web Service or choose **Manual Deploy** > **Deploy latest commit**.
2. Confirm the build completes and the `npm start` process stays running.
3. Test the service URL shown in Render:
   - Open `/` to check the portfolio.
   - Open `/journey` and refresh to check the Express SPA fallback.
   - Open `/api/health`; it should return `{"status":"ok"}`.
   - Open `/chat`, send a message, and confirm the assistant replies.
4. If chat reports that the assistant is not configured, check that `AI_API` is saved in this Web Service's Environment settings, then redeploy.

The site keeps the conversation in page memory and sends only the latest 20 messages with each request. The API does not write visitor messages to a database or logs and sets `store: false` on xAI requests. Do not send passwords, API keys, or other sensitive information in chat.

---

## 🌐 Setting Up a Custom Domain (e.g. `yourname.dev` or `yourname.com`)

Render provides free SSL certificates for custom domains:
1. Go to your Web Service in the Render Dashboard.
2. Click **"Settings"** in the left sidebar.
3. Scroll to **"Custom Domains"** and click **"Add Custom Domain"**.
4. Enter your domain (e.g., `portfolio.yourname.com` or `yourname.com`).
5. In your DNS provider (Namecheap, Cloudflare, GoDaddy, Google Domains, etc.), add the DNS records specified by Render:
   - For subdomains (`portfolio.yourname.com`): Add a **CNAME** record pointing to your Render subdomain (`alif-world-portfolio.onrender.com`).
   - For apex/root domains (`yourname.com`): Add an **ANAME / ALIAS** record or Render's specified **A** record IP addresses.
6. Render automatically provisions a Let's Encrypt TLS/SSL certificate within minutes.

---

## 🔄 Automatic Continuous Deployment (CI/CD)

- Every time you run `git push origin main`, Render automatically detects new commits, compiles the production build, and updates your live site without downtime.
- If a build ever fails, your existing live site remains untouched until the issue is fixed.

---

## 🩺 Common Troubleshooting & Fixes

| Issue | Cause | Solution |
|---|---|---|
| **404 Page Not Found on page reload (`/projects` or `/journey`)** | Server is not running the current `server.cjs` fallback | Confirm the service uses `npm start` and is configured as a Node Web Service. |
| **Chat says the assistant is not configured** | `AI_API` is missing from Render | Add `AI_API` in the Render Web Service's Environment settings and redeploy. |
| **Build fails with a Node version incompatibility** | The selected Node runtime does not meet a dependency's requirements | Check the version shown in the deployment logs and set `NODE_VERSION` to an active version supported by Render and the project dependencies. |
| **Outdated assets showing up after deploy** | Browser cache | Hard-refresh via `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac), or click **"Clear build cache & deploy"** in Render. |
