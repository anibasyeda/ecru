# Deploying ÉCRU (MongoDB Atlas + Render + Vercel)

Your repo is a monorepo:

```
ecru/
├── ecru-server/   (Express API  → deploys to Render)
└── frontend/      (React app     → deploys to Vercel)
```

The order matters because each stage produces a value the next one needs.

---

## Stage 1 — Database: MongoDB Atlas

Your local MongoDB can't be reached from the cloud, so the DB moves to Atlas.

1. Sign up at mongodb.com/atlas and create a **free M0 cluster**.
2. **Database Access** → add a user (save the username + password).
3. **Network Access** → Add IP → **Allow from anywhere** (`0.0.0.0/0`).
   (Render's IPs are dynamic, so this is the standard demo setting.)
4. **Connect → Drivers** → copy the connection string and finish it:
   `mongodb+srv://USER:PASSWORD@cluster0.xxxx.mongodb.net/ecru`
   (put your real password in, and add `/ecru` as the DB name)

Keep this string — it becomes `MONGO_URI` on Render.

---

## Stage 2 — Push to GitHub

Render and Vercel deploy *from* GitHub. From the `ecru/` root:

```bash
git init
git add .
git commit -m "ÉCRU: full-stack MERN skincare store"
```

Create an empty repo on github.com, then:

```bash
git remote add origin https://github.com/YOU/ecru.git
git branch -M main
git push -u origin main
```

Before pushing, confirm `git status` does NOT list `ecru-server/.env`
(it's gitignored, so it won't — but verify your secrets aren't staged).

---

## Stage 3 — Backend: Render

1. render.com → New → **Web Service** → connect your GitHub repo.
2. Settings:
   - **Root Directory:** `ecru-server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Health Check Path:** `/api/health` (optional but nice)
3. **Environment variables** (Render → Environment):
   - `MONGO_URI` = your Atlas string from Stage 1
   - `JWT_SECRET` = a long random string
     (generate: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`)
   - `JWT_EXPIRES_IN` = `7d`
   - `NODE_ENV` = `production`
   - `CLIENT_ORIGIN` = leave blank for now; you'll set it in Stage 5
4. Deploy. When it's live you get a URL like `https://ecru-api.onrender.com`.
   Test it: open `https://ecru-api.onrender.com/api/health` → `{"status":"ok"}`.

Note: the free tier **sleeps after ~15 min idle**, so the first request after
a nap takes ~30–60s to wake. That's normal for free hosting.

---

## Stage 4 — Frontend: Vercel

1. vercel.com → New Project → import the same GitHub repo.
2. Settings:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite (auto-detected)
   - Build/output are auto: `npm run build` → `dist`
3. **Environment variable:**
   - `VITE_API_URL` = your Render backend URL, e.g. `https://ecru-api.onrender.com`
   - IMPORTANT: **no trailing `/api`.** The frontend adds `/api` itself
     (`api.js` does `${VITE_API_URL}/api/...`). If you include `/api` you'll
     get `/api/api/...` and everything 404s.
4. Deploy. You get a URL like `https://ecru.vercel.app`.

---

## Stage 5 — Wire the two halves together (the step people miss)

Now the frontend and backend know about each other:

1. **Render → Environment → set `CLIENT_ORIGIN`** = your Vercel URL
   (e.g. `https://ecru.vercel.app`). This is the CORS allow-list, so the
   backend accepts requests from your live frontend. Save → Render redeploys.
2. Confirm **Vercel's `VITE_API_URL`** points at the Render URL (Stage 4).
   If you set it after the first build, trigger a redeploy on Vercel so the
   built files pick it up (env vars are baked in at build time for Vite).

Open your Vercel URL → DevTools → Network → refresh. You should see
`/api/products` return 200 from your Render backend.

---

## Stage 6 — Get data into the live database

A fresh Atlas DB is empty. Two options:

- **Seed it once** — from `ecru-server`, point at Atlas for one command:
  ```powershell
  $env:MONGO_URI="<your Atlas string>"
  npm run seed
  ```
- **Or** add products through the admin UI on the live site (once you're admin).

Then make yourself admin against the live DB:
```powershell
# register on the live site first, then:
$env:MONGO_URI="<your Atlas string>"
npm run make-admin your@email.com
```

---

## Common gotchas

- **Blank product grid on the live site** → `VITE_API_URL` is wrong/missing, or
  has a trailing `/api`, or `CLIENT_ORIGIN` doesn't match the Vercel URL (CORS).
- **CORS error in console** → `CLIENT_ORIGIN` on Render must equal the Vercel
  origin exactly (scheme + host, no trailing slash).
- **First load is slow** → Render free tier cold start; expected.
- **Login works locally but not live** → make sure both env URLs are set and the
  frontend was rebuilt after setting `VITE_API_URL`.
- **`og:image`** → after deploy, swap it in `index.html` for a screenshot of your
  live site (absolute URL) so the LinkedIn preview shows your work.
