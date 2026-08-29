# Food World POS Owner Dashboard

The project now includes a protected owner portal powered by Supabase email/password authentication. The storefront remains available at the public home and menu pages, while the `Owner Portal` button opens the owner sign-in screen.

## Included features

The dashboard includes an overview with revenue, order, stock, and pending-order metrics; product add/edit/delete workflows; product availability controls; inventory cards with low-stock alerts; order status updates; a customer summary; and basic sales reports. The owner email is restricted in the UI to `muhammadhassanattari450@gmail.com`.

## Supabase setup

Open `supabase/pos_migration.sql` in the Supabase SQL Editor and run it. The migration adds `stock_quantity`, `low_stock_threshold`, and `is_available` to `products`; adds order lifecycle and payment fields; creates `owner_profiles`; and applies owner-only policies for catalog and order management.

In Supabase Authentication, create an email/password user with the email `muhammadhassanattari450@gmail.com`. Copy that user's UUID, then insert the owner profile using the commented SQL at the bottom of the migration file:

```sql
insert into public.owner_profiles (id, email)
values ('OWNER_AUTH_USER_UUID', 'muhammadhassanattari450@gmail.com');
```

Do not place the password or Supabase service-role key in the frontend or in source control. The existing public Vite variables remain `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

## Local verification

Run `npm ci`, then `npm run dev`. The repository has been checked with `npm run lint` and `npm run build` successfully. The build emits one non-blocking Vite notice because the Supabase client is used by both static and dynamic imports.

## Deployment

Commit the changed files to the GitHub repository and redeploy the existing Vercel project. Ensure the two Vite Supabase environment variables are present in Vercel. Run the SQL migration before testing owner login, product mutations, inventory updates, and order status changes in production.
