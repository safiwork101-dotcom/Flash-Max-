# Flash Max Deployment Steps

## Current status

- Next.js production build passes.
- Admin panel is available at `/admin`.
- Orders are saved when a visitor enters a valid address and clicks the buy button.
- Reviews are saved through the backend and can be deleted from the admin panel.

## Important backend note

The current backend saves orders and reviews into JSON files:

- `data/orders.json`
- `data/reviews.json`

This works locally and on a server with a persistent disk. It is not enough for Vercel serverless deployment because file changes are not reliable permanent storage there.

## Recommended live options

### Option 0: Vercel without card

Use this if Render asks for a card and you want the fastest no-card deployment.

Required environment variable:

```txt
REVIEWS_ADMIN_KEY=your-strong-admin-key
```

The website will deploy, but orders and reviews use temporary serverless storage until a real database is connected. See `VERCEL_STEPS.md`.

### Option A: Render, Railway, or VPS

Use this if you want the current backend to work with minimum changes.

Required environment variables:

```txt
REVIEWS_ADMIN_KEY=your-strong-admin-key
DATA_DIR=/persistent/data/path
```

Steps:

1. Upload the project to GitHub.
2. Create a new Web Service on Render/Railway or a Node app on your VPS.
3. Set the build command:
   ```txt
   npm install && npm run build
   ```
4. Set the start command:
   ```txt
   npm run start
   ```
5. Add the environment variables above.
6. Add a persistent disk and set `DATA_DIR` to that disk folder.
7. Deploy.
8. Open `/admin` and enter your admin key.

### Option B: Vercel

Use this if you want simple Next.js hosting, but connect a database first.

Required environment variables:

```txt
REVIEWS_ADMIN_KEY=your-strong-admin-key
DATABASE_URL=your-database-url
```

Steps:

1. Move orders and reviews from JSON files to a database.
2. Upload the project to GitHub.
3. Import the GitHub repo in Vercel.
4. Add environment variables in Vercel Project Settings.
5. Deploy.
6. Add your custom domain from Vercel Project Settings > Domains.

## Files to edit before live

- `src/config/siteConfig.ts`: brand text, prices, wallet addresses, QR links, socials, FAQ, reviews defaults.
- `.env.local`: local admin key.
- Hosting environment variables: live admin key and data/database settings.
- `render.yaml`: Render hosting setup for build command, start command, admin key generation, and persistent disk.

## Final local checks

Run these before deployment:

```txt
node .\node_modules\typescript\bin\tsc --noEmit --incremental false
```

For local Windows build inside restricted folders:

```txt
$env:NEXT_TELEMETRY_DISABLED='1'; $env:XDG_CONFIG_HOME=(Join-Path (Get-Location) '.next-config'); node .\node_modules\next\dist\bin\next build
```
