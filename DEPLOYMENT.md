# Deployment Guide for Vercel (Frontend + Serverless Backend)

This guide walks you through deploying both the frontend and backend to Vercel as a single project with serverless API functions.

## Prerequisites

- GitHub account with your repo pushed
- Vercel account (vercel.com)
- PostgreSQL database (Vercel Postgres, Supabase, Railway, or ElephantSQL)

---

## Step 1: Create PostgreSQL Database

Choose one:

### Option A: Vercel Postgres (easiest if using Vercel)
1. Go to Vercel Dashboard → Storage
2. Click "Create Database" → "Postgres"
3. Connect to your project
4. Copy the `POSTGRES_PRISMA_URL` (this is your DATABASE_URL)

### Option B: Supabase (free tier)
1. Go to supabase.com → create project
2. In Project Settings → Database → Connection String
3. Copy the full connection string (with password)
4. Format: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`

### Option C: Railway
1. Go to railway.app → new project → PostgreSQL
2. Click on the Postgres service
3. Go to Variables tab
4. Copy `DATABASE_URL`

---

## Step 2: Generate Strong Secrets

Generate JWT secrets. Run this locally or use an online generator:

```powershell
# PowerShell - generate random strings
$secret1 = -join ((33..126) | Get-Random -Count 32 | % {[char]$_})
$secret2 = -join ((33..126) | Get-Random -Count 32 | % {[char]$_})
Write-Host "JWT_SECRET: $secret1"
Write-Host "JWT_REFRESH_SECRET: $secret2"
```

Or use: https://generate-random.org/encryption-key-generator (copy 32 random characters for each)

---

## Step 3: Set Up Vercel Project

1. **Login to Vercel** → Dashboard

2. **Import your GitHub repository**
   - Click "Add New..." → "Project"
   - Select your GitHub repo
   - Click "Import"

3. **Configure project settings**
   - **Project Name:** (auto-filled)
   - **Framework Preset:** "Other" (we handle build ourselves)
   - **Root Directory:** leave empty (repo root)
   - **Build Command:** `npm install && npm run build` (or leave as detected)
   - **Output Directory:** `client/dist`
   - **Install Command:** `npm install`

4. **Set Environment Variables**
   Click "Environment Variables" and add (for all environments: Preview, Production, Development):

   ```
   DATABASE_URL = postgresql://...  (from Step 1)
   JWT_SECRET = (from Step 2)
   JWT_REFRESH_SECRET = (from Step 2)
   VITE_API_URL = /api              (relative path; Vercel will proxy to /api functions)
   ```

5. **Click "Deploy"**
   - Vercel will build and deploy
   - After deploy completes, you'll get a preview URL like `https://your-project.vercel.app`

---

## Step 4: Apply Database Migrations Locally (Before First Production Use)

On your local machine, run migrations against the production PostgreSQL:

```powershell
$env:DATABASE_URL = "postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
cd "D:\React projects\subscription-dashboard-task\server"
npm install
npx prisma generate
npx prisma migrate deploy
node prisma/seed.js
```

**Important:** Do this ONCE before your first deploy hits production traffic. This ensures the DB schema is set up.

Alternatively, use the GitHub Actions workflow (see Step 6) to automate this on future deploys.

---

## Step 5: Test the Deployment

1. **Test the frontend**
   - Open `https://your-project.vercel.app`
   - You should see the login page

2. **Test the API**
   - Try registering: fill login form and submit
   - Verify no errors in browser DevTools Console

3. **Verify API endpoints** (optional, in browser console):
   ```javascript
   fetch('/api/health').then(r => r.json()).then(console.log)
   // Should return: { status: 'ok', message: 'API (serverless) is running' }

   fetch('/api/plans').then(r => r.json()).then(console.log)
   // Should return array of plans
   ```

---

## Step 6: Set Up Automatic Migrations (GitHub Actions)

To run migrations automatically on each deploy:

1. **Add GitHub Secrets**
   - Go to GitHub → Settings → Secrets and variables → Actions
   - Add these secrets:
     - `VERCEL_TOKEN` (from Vercel Settings → Account → Tokens)
     - `VERCEL_ORG_ID` (from Vercel Settings → Account)
     - `VERCEL_PROJECT_ID` (run `vercel env list` after linking project)
     - `DATABASE_URL` (same as production DATABASE_URL)

2. **Workflow is already at:** `.github/workflows/deploy.yml`

3. **On next push to `main` or `master` branch:**
   - GitHub Actions will run
   - Deploy to Vercel
   - Run migrations automatically

---

## Troubleshooting

### Issue: 404 on API endpoints
- **Cause:** API functions not deployed correctly
- **Fix:** Check Vercel deployment log for build errors; ensure `api/` folder exists at repo root

### Issue: "Module not found: @prisma/client"
- **Cause:** Prisma not installed or generated during build
- **Fix:** Vercel should run `postinstall` script (check in package.json at repo root); manual: run `npx prisma generate` locally and commit the `.prisma/client` folder

### Issue: "Connection refused" or "Can't connect to database"
- **Cause:** DATABASE_URL not set or incorrect
- **Fix:** Double-check DATABASE_URL in Vercel Environment Variables; test locally first

### Issue: 401 Unauthorized on login
- **Cause:** JWT secrets don't match between requests
- **Fix:** Ensure JWT_SECRET and JWT_REFRESH_SECRET are set consistently in Vercel env vars

### Issue: CORS errors
- **Cause:** Frontend origin not allowed by serverless functions
- **Fix:** Our API functions don't explicitly block origins; check browser console for exact error

---

## Local Development (to test before deploying)

Run both frontend and local Express server:

```powershell
# Terminal 1: Start local Express server
cd "D:\React projects\subscription-dashboard-task\server"
npm install
npm run dev
# Runs on http://localhost:5000

# Terminal 2: Start Vite dev server
cd "D:\React projects\subscription-dashboard-task\client"
npm install
npm run dev
# Runs on http://localhost:5174 (or next available port)
```

Frontend will use `VITE_API_URL` from `.env.local` or default to `http://localhost:5000/api`.

---

## Project Structure for Vercel

```
subscription-dashboard-task/
├── api/                          # Vercel serverless functions
│   ├── _prisma.js               # Cached Prisma client
│   ├── health.js                # GET /api/health
│   ├── plans.js                 # GET /api/plans
│   ├── my-subscription.js       # GET /api/my-subscription
│   ├── auth/
│   │   ├── login.js             # POST /api/auth/login
│   │   ├── register.js          # POST /api/auth/register
│   │   └── refresh.js           # POST /api/auth/refresh
│   ├── subscribe/
│   │   └── [planId].js          # POST /api/subscribe/[planId]
│   └── admin/
│       └── subscriptions.js     # GET /api/admin/subscriptions
├── client/                       # React frontend
│   ├── src/
│   ├── package.json
│   └── ...
├── server/                       # Express (for local dev; not deployed)
│   ├── prisma/
│   │   ├── schema.prisma        # PostgreSQL schema
│   │   └── migrations/          # Prisma migrations (auto-generated)
│   └── ...
├── package.json                 # Root (includes @prisma/client deps)
├── vercel.json                  # Vercel config
└── .github/
    └── workflows/
        └── deploy.yml           # Automatic migrations on deploy
```

---

## Summary

1. ✅ Create PostgreSQL database → get DATABASE_URL
2. ✅ Generate JWT secrets
3. ✅ Import repo to Vercel
4. ✅ Set environment variables in Vercel
5. ✅ Run `prisma migrate deploy` locally to init DB schema
6. ✅ Test frontend and API
7. ✅ (Optional) Set up GitHub Actions for automatic migrations

**Your app is now live on Vercel!** 🚀

---

## Need Help?

- **Prisma docs:** https://www.prisma.io/docs
- **Vercel docs:** https://vercel.com/docs
- **GitHub Actions:** https://docs.github.com/en/actions
