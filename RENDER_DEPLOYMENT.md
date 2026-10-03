# Complete Deployment Guide for Render (render.com)

This guide walks you through deploying the **Alif-World Portfolio** on [Render](https://render.com) as a high-performance, 100% free **Static Site** backed by Render's global CDN.

---

## ⚡ Why Render Static Site?
- **100% Free**: Unlimited bandwidth on Render's free static tier with free automated SSL.
- **Fast Global CDN**: Assets are served from edge caches worldwide with HTTP/2 and Brotli compression.
- **Zero Cold Starts**: Unlike free web services or containers that go to sleep after inactivity, static sites **never sleep** and load instantly.

---

## 🚀 Option 1: Automatic Blueprint Deployment (Easiest - 1 Click)

The repository already includes a pre-configured `render.yaml` file.

1. Push your code to your **GitHub** or **GitLab** account.
2. Log in to your [Render Dashboard](https://dashboard.render.com).
3. Click the **"New +"** button in the top navigation bar and select **"Blueprint"**.
4. Connect your GitHub/GitLab repository.
5. Render will automatically detect `render.yaml` and configure:
   - **Service Type**: Static Site
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `./dist`
   - **SPA Rewrite Rule**: `/*` → `/index.html` (Prevents 404 errors on `/projects`, `/journey`, etc.)
6. Click **"Apply"** — Render will build and deploy your site in ~1–2 minutes!

---

## 🛠️ Option 2: Manual Dashboard Deployment (Step-by-Step)

If you prefer to configure the service manually through the Render UI:

### Step 1: Push Code to GitHub / GitLab
Make sure your project repository is published to GitHub or GitLab:
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### Step 2: Create a New Static Site on Render
1. Open [dashboard.render.com](https://dashboard.render.com).
2. Click **"New +"** > **"Static Site"**.
3. Select and connect your repository from the list.

### Step 3: Configure Build & Runtime Settings
Enter the following exact configuration:

| Setting | Value | Notes |
|---|---|---|
| **Name** | `alif-world-portfolio` | Or any unique subdomain name you prefer |
| **Branch** | `main` | The default branch you push to |
| **Root Directory** | *(leave empty)* | Root of your repository |
| **Build Command** | `npm install && npm run build` | Installs dependencies and runs Vite build |
| **Publish Directory** | `dist` | Where Vite outputs static production assets |

---

### Step 4: CRITICAL — Set Up SPA Redirect / Rewrite Rule

> ⚠️ **Important for React Router Apps:**
> Because this application uses client-side routing (`/projects`, `/journey`, `/explore-works`, `/not-available`), directly loading or refreshing these URLs will return a **404 Not Found** unless you add a rewrite rule.

In the Render site settings:
1. Scroll down to the **"Redirects/Rewrites"** section.
2. Click **"Add Rule"**.
3. Configure the rule:
   - **Type**: `Rewrite`
   - **Source**: `/*`
   - **Destination**: `/index.html`
4. Click **"Save Changes"**.

---

### Step 5: (Optional) Environment Variables

If you are using client-side or build-time environment variables:
1. In your Render Static Site settings, go to **"Environment"**.
2. Click **"Add Environment Variable"**:
   - `NODE_VERSION`: `20.18.0` (Recommended to ensure modern Node compatibility)
   - `GEMINI_API_KEY`: *(Your Gemini API key if required)*
3. Click **"Save Changes"**.

---

### Step 6: Deploy & Verify
1. Click **"Create Static Site"** (or **"Manual Deploy"** > **"Deploy latest commit"**).
2. Watch the deployment log:
   ```text
   ==> Running build command 'npm install && npm run build'...
   vite v6.2.3 building for production...
   ✓ 89 modules transformed.
   dist/index.html                   2.8 kB │ gzip: 1.1 kB
   dist/assets/index-D1...js        450.2 kB │ gzip: 120.4 kB
   ==> Uploading build...
   ==> Your site is live at: https://alif-world-portfolio.onrender.com
   ```
3. Test your live URL:
   - Visit `https://your-site.onrender.com/` (Landing page)
   - Click to `/journey` and refresh the browser tab (Verifies SPA rewrite rule)
   - Click to `/projects` and `/explore-works`

---

## 🌐 Setting Up a Custom Domain (e.g. `yourname.dev` or `yourname.com`)

Render provides free SSL certificates for custom domains:
1. Go to your Static Site in the Render Dashboard.
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
| **404 Page Not Found on page reload (`/projects` or `/journey`)** | Missing SPA rewrite rule | Add a Rewrite rule: `Source: /*`, `Destination: /index.html` in the **Redirects/Rewrites** tab. |
| **Build Fails with Node version incompatibility** | Default builder using an older Node.js version | Add environment variable `NODE_VERSION` = `20.18.0` in the **Environment** tab. |
| **Outdated assets showing up after deploy** | Browser cache | Hard-refresh via `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac), or click **"Clear build cache & deploy"** in Render. |
