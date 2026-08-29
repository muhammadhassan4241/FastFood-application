-- Food World POS foundation
-- Run this in Supabase SQL Editor before using the owner dashboard.

alter table public.products
  add column if not exists stock_quantity integer not null default 25,
  add column if not exists low_stock_threshold integer not null default 5,
  add column if not exists is_available boolean not null default true;

alter table public.orders
  add column if not exists status text not null default 'pending',
  add column if not exists payment_method text default 'cod';

alter table public.orders
  drop constraint if exists orders_status_check;
alter table public.orders
  add constraint orders_status_check check (status in ('pending', 'preparing', 'delivered', 'cancelled'));

create table if not exists public.owner_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  display_name text default 'Food World Owner',
  created_at timestamptz not null default now()
);

create or replace function public.is_food_world_owner()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.owner_profiles
    where id = auth.uid()
      and lower(email) = 'muhammadhassanattari450@gmail.com'
  );
$$;

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.owner_profiles enable row level security;

-- The storefront can read available products and create orders.
drop policy if exists "Public can read available products" on public.products;
create policy "Public can read available products" on public.products for select using (is_available = true or public.is_food_world_owner());

drop policy if exists "Public can create orders" on public.orders;
create policy "Public can create orders" on public.orders for insert with check (true);

-- Only the owner profile can manage catalog and order records.
drop policy if exists "Authenticated owners manage products" on public.products;
create policy "Authenticated owners manage products" on public.products for all to authenticated using (public.is_food_world_owner()) with check (public.is_food_world_owner());

drop policy if exists "Authenticated owners manage orders" on public.orders;
create policy "Authenticated owners manage orders" on public.orders for select to authenticated using (public.is_food_world_owner());
drop policy if exists "Authenticated owners update orders" on public.orders;
create policy "Authenticated owners update orders" on public.orders for update to authenticated using (public.is_food_world_owner()) with check (public.is_food_world_owner());

drop policy if exists "Owner can read own profile" on public.owner_profiles;
create policy "Owner can read own profile" on public.owner_profiles for select to authenticated using (id = auth.uid());

-- Insert the owner profile after creating the user in Supabase Authentication.
-- Replace the UUID and email with the created auth.users values.
-- insert into public.owner_profiles (id, email) values ('OWNER_AUTH_USER_UUID', 'muhammadhassanattari450@gmail.com');
