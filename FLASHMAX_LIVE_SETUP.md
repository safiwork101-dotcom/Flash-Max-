# Flash Max live setup checklist

## 1. Supabase

1. Open the existing Supabase project.
2. Run `SUPABASE_SCHEMA.sql` in SQL Editor.
3. Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to the Flash Max Vercel project only.
4. Do not expose the service-role key as a `NEXT_PUBLIC_*` variable.

## 2. NOWPayments

1. In the existing NOWPayments account, create a dedicated API key named `Flash Max`.
2. Copy the API key to Vercel as `FLASHMAX_NOWPAYMENTS_API_KEY`.
3. Copy the NOWPayments IPN secret to Vercel as `FLASHMAX_NOWPAYMENTS_IPN_SECRET`.
4. Set `FLASHMAX_NOWPAYMENTS_IPN_CALLBACK_URL` to `https://flashmax.club/api/webhooks/nowpayments/flashmax`.
5. Keep Custody disabled.

The server sends the configured payout address and `usdtbsc` payout currency on every Flash Max payment. This keeps the Flash Max receiving wallet explicit even though the NOWPayments account is shared with other projects.

## 3. Trust Wallet

1. In Trust Wallet, open USDT on BNB Smart Chain.
2. Verify the network is BEP20 / BNB Smart Chain.
3. Copy only the public receive address into `FLASHMAX_PAYOUT_ADDRESS` in Vercel.
4. Never provide a seed phrase, private key, recovery phrase, or wallet password.

## 4. Admin messages

1. Set a strong `FLASHMAX_ADMIN_KEY` in Vercel.
2. Open `https://flashmax.club/admin`.
3. Enter the immediate English message.
4. Enter the 20-minute follow-up English message and `https://t.me/...` link.

## 5. Launch test

1. Create a new customer account.
2. Create the smallest supported payment and verify that the displayed address differs from the removed static addresses.
3. Confirm that the order appears under the correct customer and in `/admin`.
4. Send the exact amount only for an authorized live test.
5. Confirm the status sequence, final Trust Wallet settlement, immediate notification, and 20-minute follow-up.
6. Test a separate low-value partial payment only if NOWPayments permits it; verify that no delivery notification is created before `finished`.
