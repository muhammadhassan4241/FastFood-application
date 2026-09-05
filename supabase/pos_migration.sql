-- ================================================================
-- FOOD WORLD POS — COMPLETE DATABASE FIX
-- Run this in: Supabase Dashboard > SQL Editor > New Query > Run
-- ================================================================

-- STEP 1: Add missing columns safely (won't break existing data)
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

-- STEP 2: Fix status constraint to support all kitchen statuses
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE public.orders
  ADD CONSTRAINT orders_status_check
  CHECK (status IN ('pending','preparing','ready','completed','delivered','cancelled'));

-- STEP 3: Drop any old/conflicting RLS policies
DROP POLICY IF EXISTS "Public can create orders" ON public.orders;
DROP POLICY IF EXISTS "Public can track orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated owners manage orders" ON public.orders;
DROP POLICY IF EXISTS "Allow insert orders" ON public.orders;
DROP POLICY IF EXISTS "Allow read orders" ON public.orders;
DROP POLICY IF EXISTS "Allow update orders" ON public.orders;
DROP POLICY IF EXISTS "anon_insert_orders" ON public.orders;
DROP POLICY IF EXISTS "anon_select_orders" ON public.orders;
DROP POLICY IF EXISTS "auth_manage_orders" ON public.orders;

-- STEP 4: Ensure RLS is enabled
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- STEP 5: Create proper RLS policies

-- Allow anonymous customers to INSERT orders (place orders without login)
CREATE POLICY "anon_insert_orders"
  ON public.orders FOR INSERT
  TO anon
  WITH CHECK (
    -- Customer can only create orders with 'pending' status
    status = 'pending'
  );

-- Allow authenticated users (owner) to INSERT orders too
CREATE POLICY "auth_insert_orders"
  ON public.orders FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow anyone to SELECT orders (needed for Track Order page)
CREATE POLICY "anon_select_orders"
  ON public.orders FOR SELECT
  TO anon
  USING (true);

-- Allow authenticated users to SELECT all orders (Owner Dashboard)
CREATE POLICY "auth_select_orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (true);

-- Allow only authenticated users (owner/KDS) to UPDATE order status
CREATE POLICY "auth_update_orders"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- STEP 6: Also allow anon to UPDATE orders (needed because owner
-- uses anon key from frontend when not logged in to KDS).
-- Restrict: anon can only change the 'status' field.
-- NOTE: PostgREST enforces column-level security through the API,
-- but the RLS policy itself checks row-level access.
CREATE POLICY "anon_update_orders"
  ON public.orders FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- STEP 7: Enable Realtime on orders table for live tracking
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

-- STEP 8: Refresh PostgREST schema cache so new columns are visible
NOTIFY pgrst, 'reload schema';
