create table if not exists public.promo_code_usage (
  promo_code text primary key,
  use_count integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.promo_code_redemptions (
  id bigint generated always as identity primary key,
  promo_code text not null,
  order_status text not null,
  amount_cents integer not null default 0,
  subtotal_cents integer not null default 0,
  shipping_cents integer not null default 0,
  customer_email text,
  item_count integer not null default 0,
  primary_product_id text,
  created_at timestamptz not null default now()
);

alter table public.promo_code_usage enable row level security;
alter table public.promo_code_redemptions enable row level security;

drop function if exists public.record_promo_redemption(text, text, integer, integer, integer, text, integer, text);

create or replace function public.record_promo_redemption(
  p_promo_code text,
  p_order_status text,
  p_amount_cents integer default 0,
  p_subtotal_cents integer default 0,
  p_shipping_cents integer default 0,
  p_customer_email text default null,
  p_item_count integer default 0,
  p_primary_product_id text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if coalesce(trim(p_promo_code), '') = '' then
    return;
  end if;

  insert into public.promo_code_redemptions (
    promo_code,
    order_status,
    amount_cents,
    subtotal_cents,
    shipping_cents,
    customer_email,
    item_count,
    primary_product_id
  )
  values (
    upper(trim(p_promo_code)),
    coalesce(nullif(trim(p_order_status), ''), 'pending'),
    greatest(coalesce(p_amount_cents, 0), 0),
    greatest(coalesce(p_subtotal_cents, 0), 0),
    greatest(coalesce(p_shipping_cents, 0), 0),
    nullif(trim(coalesce(p_customer_email, '')), ''),
    greatest(coalesce(p_item_count, 0), 0),
    nullif(trim(coalesce(p_primary_product_id, '')), '')
  );

  insert into public.promo_code_usage (promo_code, use_count, updated_at)
  values (upper(trim(p_promo_code)), 1, now())
  on conflict (promo_code)
  do update set
    use_count = public.promo_code_usage.use_count + 1,
    updated_at = now();
end;
$$;

revoke all on function public.record_promo_redemption(text, text, integer, integer, integer, text, integer, text) from public;
grant execute on function public.record_promo_redemption(text, text, integer, integer, integer, text, integer, text) to anon, authenticated;

drop policy if exists "promo_usage_read" on public.promo_code_usage;
create policy "promo_usage_read"
on public.promo_code_usage
for select
to authenticated
using (true);

drop policy if exists "promo_redemptions_read" on public.promo_code_redemptions;
create policy "promo_redemptions_read"
on public.promo_code_redemptions
for select
to authenticated
using (true);