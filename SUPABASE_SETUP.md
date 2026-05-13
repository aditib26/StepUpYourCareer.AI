# Supabase Auth Setup — One-Time Steps

The code is built. You just need to set up the Supabase project once.

## 1. Create a Supabase Project

1. Go to https://supabase.com → Sign up with GitHub
2. Click **New Project**
3. Name: `stepupyourcareer`
4. Database password: anything strong (save it somewhere)
5. Region: pick closest to you (e.g., `us-east-1`)
6. Plan: **Free**
7. Click **Create new project** — takes ~2 minutes

## 2. Get Your Keys

Once project is ready:
- **Settings → API**
- Copy:
  - **Project URL** (looks like `https://xxxxxxxxx.supabase.co`)
  - **anon / public key** (long JWT starting with `eyJ...`)

## 3. Add Env Vars to Vercel

1. Vercel → your project → **Settings → Environment Variables**
2. Add two new variables (for all environments — Production, Preview, Development):

```
NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGc...your-anon-key
```

3. Redeploy from **Deployments → latest → ⋯ → Redeploy**

## 4. Configure Auth Redirect URLs

In Supabase:
- **Authentication → URL Configuration**
- **Site URL**: `https://step-up-your-career-ai-ce1t.vercel.app`
- **Redirect URLs** (add both):
  - `https://step-up-your-career-ai-ce1t.vercel.app/auth/callback`
  - `http://localhost:3000/auth/callback`

## 5. Enable Email Auth (already on by default)

- **Authentication → Providers → Email** — should be enabled
- Optional: turn OFF "Confirm email" while testing so you don't need to click confirmation links during dev (turn back ON for production)

## 6. Enable Google OAuth (Optional but Recommended)

1. **Authentication → Providers → Google** → toggle ON
2. You'll need a Google OAuth client:
   - Go to [console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)
   - **Create Credentials → OAuth client ID → Web application**
   - **Authorized redirect URI**: paste the URL Supabase shows you (looks like `https://xxxxxxxxx.supabase.co/auth/v1/callback`)
   - Copy the **Client ID** and **Client Secret** back to Supabase
   - Save

## 7. Test Locally

```bash
cd frontend
cp .env.local.example .env.local
# Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local
npm install
npm run dev
```

Visit http://localhost:3000/auth/signup → create an account → you should see the UserMenu appear.

## Done!

After Vercel redeploys with the new env vars, your site has:
- Sign up + login via email/password
- Sign up + login via Google
- Protected `/dashboard` route (redirects to login)
- Auto-refreshing user sessions
- Logout dropdown
