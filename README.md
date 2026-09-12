# Flash Max

Flash Max is a Next.js storefront for clearly disclosed FlashMax Credits, customer accounts, NOWPayments checkout, private order notifications, and payment accounting.

FlashMax Credits are demo service credits. They are not USDT, a stablecoin, legal tender, or guaranteed to have monetary value.

## Local setup

```bash
npm install
copy .env.local.example .env.local
npm run dev
```

Run `SUPABASE_SCHEMA.sql` once in the existing Supabase project's SQL editor, then fill the server-only environment variables from `.env.local.example`.

## Live payment flow

1. A customer creates an account and selects a package, target address, and payment currency.
2. The server creates a NOWPayments direct payment and returns its unique pay-in address and exact crypto amount.
3. The signed IPN webhook updates the order. Partial payments remain blocked and display the remaining amount.
4. `finished` means NOWPayments reports that settlement reached the configured payout address. The immediate customer notification becomes visible then.
5. A second notification and configured Telegram link become visible 20 minutes later.

Customer payment records use only `flashmax_*` tables, keeping their accounting separate from other projects in the same Supabase database.

## Required configuration

- Create a dedicated NOWPayments API key named `Flash Max`.
- Set its IPN secret and callback URL to `https://flashmax.club/api/webhooks/nowpayments/flashmax`.
- Set `FLASHMAX_PAYOUT_ADDRESS` to the public USDT-BSC receiving address from Trust Wallet.
- Keep NOWPayments Custody disabled for direct wallet settlement.
- Configure the two English messages and Telegram URL in `/admin` after the database is connected.

Never commit API keys, service-role keys, wallet passwords, seed phrases, private keys, or Telegram bot credentials.

## Verification

```bash
npx tsc --noEmit
npm run build
```
