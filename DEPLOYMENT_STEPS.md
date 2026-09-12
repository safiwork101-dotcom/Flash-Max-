# Deployment

Flash Max is deployed from this repository to the Vercel project connected to `flashmax.club`.

1. Complete every step in `FLASHMAX_LIVE_SETUP.md`.
2. Add all variables from `.env.local.example` to the Vercel project.
3. Push the verified branch to the configured GitHub repository.
4. Confirm the deployment and test customer signup before enabling a live payment.

Do not deploy live checkout until the Supabase schema, dedicated NOWPayments API key, IPN secret, callback URL, payout address, admin messages, and Telegram URL are configured.
