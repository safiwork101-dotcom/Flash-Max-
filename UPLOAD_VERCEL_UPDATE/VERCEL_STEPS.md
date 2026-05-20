# Vercel No-Card Deployment

Use this path if Render asks for a credit card and you want to deploy without adding one right now.

## What will work

- The website will go live.
- The main pages, generator UI, payment modal, and admin page will load.
- The API routes will not crash on Vercel serverless functions.

## Important limitation

Orders and reviews use temporary serverless storage on Vercel unless you connect a real database. This means orders/reviews can reset after redeploys, cold starts, or serverless instance changes.

For permanent live storage later, connect one of these:

- Supabase
- Firebase
- Neon Postgres
- Vercel storage
- Any VPS/Node server with persistent disk

## Deploy steps

1. Open `https://vercel.com/new`.
2. Login with GitHub.
3. Import this repository:
   `safiwork101-dotcom/Flash-Max-`
4. Framework should auto-detect as `Next.js`.
5. Add this environment variable:
   `REVIEWS_ADMIN_KEY`
6. Use this value:
   `FlashMax-Admin-9Vx2Qp7L-2026`
7. Click `Deploy`.
8. After deployment, open:
   `/admin`

## Domain steps

1. Buy your domain from any provider.
2. In Vercel, open the project.
3. Go to `Settings > Domains`.
4. Add your domain.
5. Vercel will show DNS records.
6. Add those records in your domain provider dashboard.
7. Wait for DNS to verify.
