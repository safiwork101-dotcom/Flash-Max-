# Flash Max

Next.js and Tailwind CSS brand website with an editable generator-style checkout, review form, order tracking APIs, and an admin dashboard.

## Local setup

```txt
npm install
npm run dev
```

Open:

```txt
http://localhost:3000
http://localhost:3000/admin
```

## Important files

- `src/config/siteConfig.ts`: brand name, text, prices, payment currencies, wallet addresses, QR links, FAQs, and default reviews.
- `.env.local.example`: environment variables template.
- `render.yaml`: Render deployment setup with persistent disk storage.
- `DEPLOYMENT_STEPS.md`: full deployment checklist.

## Environment variables

```txt
REVIEWS_ADMIN_KEY=change-this-admin-key
DATA_DIR=./data
```

Never store seed phrases, private keys, wallet passwords, or login credentials in this project.
