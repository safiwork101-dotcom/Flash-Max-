-- Flash Max customer accounts, payment accounting, and delayed notifications.
-- Run this once in the existing Supabase project's SQL editor.

create extension if not exists pgcrypto;

create table if not exists public.flashmax_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.flashmax_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.flashmax_profiles(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.flashmax_settings (
  id text primary key default 'default' check (id = 'default'),
  confirmed_title text not null default 'Payment confirmed',
  confirmed_message text not null default 'Your payment has been confirmed. Work on your order has started.',
  followup_title text not null default 'Order update',
  followup_message text not null default 'Your order is being prepared. Contact our Telegram support if you need assistance. Delivery can take up to 24 hours.',
  telegram_url text,
  updated_at timestamptz not null default now()
);

create table if not exists public.flashmax_orders (
  id uuid primary key default gen_random_uuid(),
  order_code text not null unique,
  user_id uuid not null references public.flashmax_profiles(id) on delete cascade,
  package_id text not null,
  credits_label text not null,
  price_usd numeric(12,2) not null check (price_usd > 0),
  duration_label text not null,
  target_network_id text not null,
  target_network_label text not null,
  target_address text not null,
  pay_currency text not null,
  provider_payment_id text unique,
  provider_status text not null default 'creating',
  status text not null default 'creating' check (
    status in ('creating', 'waiting', 'confirming', 'confirmed', 'sending', 'partially_paid', 'finished', 'failed', 'refunded', 'expired')
  ),
  payment_address text,
  pay_amount numeric,
  actually_paid numeric not null default 0,
  outcome_amount numeric,
  outcome_currency text,
  provider_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  finished_at timestamptz
);

create table if not exists public.flashmax_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.flashmax_profiles(id) on delete cascade,
  order_id uuid not null references public.flashmax_orders(id) on delete cascade,
  kind text not null,
  title text not null,
  message text not null,
  action_label text,
  action_url text,
  available_at timestamptz not null default now(),
  read_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (order_id, kind)
);

create table if not exists public.flashmax_payment_events (
  id uuid primary key default gen_random_uuid(),
  event_hash text not null unique,
  order_id uuid references public.flashmax_orders(id) on delete set null,
  provider_payment_id text,
  provider_status text not null,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists flashmax_sessions_lookup_idx
  on public.flashmax_sessions(token_hash, expires_at);
create index if not exists flashmax_orders_user_idx
  on public.flashmax_orders(user_id, created_at desc);
create index if not exists flashmax_orders_provider_idx
  on public.flashmax_orders(provider_payment_id);
create index if not exists flashmax_notifications_user_idx
  on public.flashmax_notifications(user_id, available_at desc);

insert into public.flashmax_settings(id)
values ('default')
on conflict (id) do nothing;

alter table public.flashmax_profiles enable row level security;
alter table public.flashmax_sessions enable row level security;
alter table public.flashmax_settings enable row level security;
alter table public.flashmax_orders enable row level security;
alter table public.flashmax_notifications enable row level security;
alter table public.flashmax_payment_events enable row level security;

create or replace function public.flashmax_apply_payment_event(
  p_event_hash text,
  p_provider_payment_id text,
  p_order_code text,
  p_provider_status text,
  p_pay_amount numeric,
  p_actually_paid numeric,
  p_outcome_amount numeric,
  p_outcome_currency text,
  p_payload jsonb
) returns setof public.flashmax_orders
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.flashmax_orders%rowtype;
  v_settings public.flashmax_settings%rowtype;
  v_status text;
  v_remaining numeric;
begin
  select * into v_order
  from public.flashmax_orders
  where (p_provider_payment_id <> '' and provider_payment_id = p_provider_payment_id)
     or (p_order_code <> '' and order_code = p_order_code)
  order by case when provider_payment_id = p_provider_payment_id then 0 else 1 end
  limit 1
  for update;

  if not found then
    return;
  end if;

  insert into public.flashmax_payment_events(
    event_hash, order_id, provider_payment_id, provider_status, payload
  ) values (
    p_event_hash, v_order.id, nullif(p_provider_payment_id, ''), p_provider_status, p_payload
  ) on conflict (event_hash) do nothing;

  if not found then
    return query select * from public.flashmax_orders where id = v_order.id;
    return;
  end if;

  v_status := case
    when v_order.status = 'finished' then 'finished'
    when p_provider_status = 'finished' then 'finished'
    when v_order.status = 'partially_paid' and p_provider_status in ('waiting', 'confirming', 'confirmed', 'sending') then 'partially_paid'
    when p_provider_status in ('waiting', 'confirming', 'confirmed', 'sending', 'partially_paid', 'finished', 'failed', 'refunded', 'expired')
      then p_provider_status
    else v_order.status
  end;

  update public.flashmax_orders
  set provider_status = coalesce(nullif(p_provider_status, ''), provider_status),
      status = v_status,
      pay_amount = coalesce(p_pay_amount, pay_amount),
      actually_paid = coalesce(p_actually_paid, actually_paid),
      outcome_amount = coalesce(p_outcome_amount, outcome_amount),
      outcome_currency = coalesce(nullif(p_outcome_currency, ''), outcome_currency),
      updated_at = now(),
      finished_at = case when v_status = 'finished' then coalesce(finished_at, now()) else finished_at end
  where id = v_order.id
  returning * into v_order;

  select * into v_settings
  from public.flashmax_settings
  where id = 'default';

  if v_status = 'partially_paid' then
    v_remaining := greatest(coalesce(v_order.pay_amount, 0) - coalesce(v_order.actually_paid, 0), 0);
    insert into public.flashmax_notifications(
      user_id, order_id, kind, title, message, available_at
    ) values (
      v_order.user_id,
      v_order.id,
      'partial_payment',
      'Payment incomplete',
      'We received a partial payment. Please send the remaining ' || trim(to_char(v_remaining, 'FM9999999990.99999999')) || ' ' || upper(v_order.pay_currency) || ' before the payment expires. Delivery starts only after full payment.',
      now()
    )
    on conflict (order_id, kind) do update set
      message = excluded.message,
      available_at = excluded.available_at,
      read_at = null,
      updated_at = now();
  end if;

  if v_status = 'finished' then
    insert into public.flashmax_notifications(
      user_id, order_id, kind, title, message, available_at
    ) values (
      v_order.user_id,
      v_order.id,
      'payment_finished',
      coalesce(v_settings.confirmed_title, 'Payment confirmed'),
      coalesce(v_settings.confirmed_message, 'Your payment has been confirmed. Work on your order has started.'),
      now()
    ) on conflict (order_id, kind) do nothing;

    insert into public.flashmax_notifications(
      user_id, order_id, kind, title, message, action_label, action_url, available_at
    ) values (
      v_order.user_id,
      v_order.id,
      'fulfillment_followup',
      coalesce(v_settings.followup_title, 'Order update'),
      coalesce(v_settings.followup_message, 'Your order is being prepared. Contact our Telegram support if you need assistance. Delivery can take up to 24 hours.'),
      case when nullif(v_settings.telegram_url, '') is null then null else 'Open Telegram support' end,
      nullif(v_settings.telegram_url, ''),
      coalesce(v_order.finished_at, now()) + interval '20 minutes'
    ) on conflict (order_id, kind) do nothing;
  end if;

  return query select * from public.flashmax_orders where id = v_order.id;
end;
$$;

revoke all on function public.flashmax_apply_payment_event(text, text, text, text, numeric, numeric, numeric, text, jsonb) from public;
grant execute on function public.flashmax_apply_payment_event(text, text, text, text, numeric, numeric, numeric, text, jsonb) to service_role;
