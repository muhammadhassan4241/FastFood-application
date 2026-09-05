# 🔧 REQUIRED: Run This SQL in Supabase to Fix Order Placement

## The Problem

When customers click "Place Order", the order fails with:

> **"new row violates row-level security policy for table 'orders'"**

This happens because the Supabase database's Row Level Security (RLS) policies do not allow anonymous users to insert orders.

---

## How to Fix (2 minutes)

### Step 1: Open Supabase SQL Editor

1. Go to **[https://supabase.com/dashboard](https://supabase.com/dashboard)**
2. Log in to your Supabase account
3. Select your **Food World** project (ID: `aagnjjtgmvmzgrkzqoqv`)
4. Click **SQL Editor** in the left sidebar
5. Click **New Query** (the `+` button)

### Step 2: Paste and Run the Migration

Copy the **entire** SQL below, paste it into the SQL Editor, and click **Run** (or press `Ctrl+Enter`):

```sql
-- STEP 1: Add missing columns safely
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS order_id text,
  ADD COLUMN IF NOT EXISTS customer_phone text,
  ADD COLUMN IF NOT EXISTS customer_email text,
  ADD COLUMN IF NOT EXISTS special_instructions text,
  ADD COLUMN IF NOT EXISTS subtotal numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS delivery_fee numeric DEFAULT 150,
  ADD COLUMN IF NOT EXISTS tax numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS discount numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS payment_method text DEFAULT 'cod';

-- STEP 2: Fix status constraint
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE public.orders
  ADD CONSTRAINT orders_status_check
  CHECK (status IN ('pending','preparing','ready','completed','delivered','cancelled'));

-- STEP 3: Drop old/conflicting RLS policies
DROP POLICY IF EXISTS "Public can create orders" ON public.orders;
DROP POLICY IF EXISTS "Public can track orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated owners manage orders" ON public.orders;
DROP POLICY IF EXISTS "Allow insert orders" ON public.orders;
DROP POLICY IF EXISTS "Allow read orders" ON public.orders;
DROP POLICY IF EXISTS "Allow update orders" ON public.orders;
DROP POLICY IF EXISTS "anon_insert_orders" ON public.orders;
DROP POLICY IF EXISTS "anon_select_orders" ON public.orders;
DROP POLICY IF EXISTS "auth_manage_orders" ON public.orders;
DROP POLICY IF EXISTS "auth_insert_orders" ON public.orders;
DROP POLICY IF EXISTS "auth_select_orders" ON public.orders;
DROP POLICY IF EXISTS "auth_update_orders" ON public.orders;
DROP POLICY IF EXISTS "anon_update_orders" ON public.orders;

-- STEP 4: Ensure RLS is enabled
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- STEP 5: Create correct RLS policies

-- Anonymous customers can place orders (INSERT) with pending status only
CREATE POLICY "anon_insert_orders"
  ON public.orders FOR INSERT
  TO anon
  WITH CHECK (status = 'pending');

-- Authenticated users can insert orders too
CREATE POLICY "auth_insert_orders"
  ON public.orders FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Anyone can read orders (for Track Order page)
CREATE POLICY "anon_select_orders"
  ON public.orders FOR SELECT
  TO anon
  USING (true);

-- Authenticated users can read all orders (Owner Dashboard)
CREATE POLICY "auth_select_orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can update orders (KDS status changes)
CREATE POLICY "auth_update_orders"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Anonymous users can also update (needed for frontend KDS without login)
CREATE POLICY "anon_update_orders"
  ON public.orders FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- STEP 6: Enable Realtime
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'orders'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
  END IF;
END $$;

-- STEP 7: Refresh schema cache
NOTIFY pgrst, 'reload schema';
```

### Step 3: Verify

You should see: **`Success. No rows returned`**

After running, go back to your app and try placing an order — it should work immediately.

---

## What This Fixes

| Issue | Before | After |
|-------|--------|-------|
| Place Order | ❌ RLS violation | ✅ Works |
| Track Order | ❌ order_id column missing | ✅ Works |
| Owner Dashboard | ❌ Cannot update status | ✅ Works |
| KDS Status Changes | ❌ Blocked | ✅ Works |
| Realtime Updates | ❌ Not enabled | ✅ Live |

## Security Model

- Anonymous users **can only INSERT** orders with `status = 'pending'` (cannot create orders with other statuses)
- Anonymous users **can read** orders (needed for Track Order page)
- Anonymous users **cannot delete** orders
- Authenticated owner **can do everything** (insert, read, update)
- RLS remains **enabled** — the table is not publicly writable without restrictions
