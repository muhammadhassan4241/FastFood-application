-- ================================================================
-- FOOD WORLD POS — SEED DRINKS INTO PRODUCTS TABLE
-- Optional: Run in Supabase SQL Editor if you want to store drinks
-- permanently in your remote Supabase database.
-- ================================================================

-- Check if products table exists and insert standard Drinks
INSERT INTO public.products (name, price, category, description, image, stock_quantity, low_stock_threshold, is_available)
VALUES
  (
    'Coca Cola',
    150,
    'Drinks',
    'Chilled classic Coca-Cola can (350ml). Refreshingly fizzy and served ice-cold.',
    'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80',
    100,
    15,
    true
  ),
  (
    'Pepsi',
    150,
    'Drinks',
    'Bold and refreshing Pepsi cola (350ml). Served cold with crisp flavor.',
    'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&q=80',
    85,
    15,
    true
  ),
  (
    'Sprite',
    150,
    'Drinks',
    'Crisp, clean lemon-lime sparkling soda (350ml). Caffeine-free and chilled.',
    'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=800&q=80',
    70,
    15,
    true
  ),
  (
    '7UP',
    150,
    'Drinks',
    'Refreshing lemon-lime carbonated soda (350ml). Perfect pairing with burgers and pizza.',
    'https://images.unsplash.com/photo-1624517452488-04869289c4ca?w=800&q=80',
    65,
    12,
    true
  ),
  (
    'Fanta Orange',
    150,
    'Drinks',
    'Bright, bubbly orange flavored soda (350ml). Chilled and sweet.',
    'https://images.unsplash.com/photo-1624517452488-04869289c4ca?w=800&q=80',
    50,
    10,
    true
  ),
  (
    'Mineral Water',
    90,
    'Drinks',
    'Pure bottled mineral drinking water (500ml). Chilled and refreshing.',
    'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=800&q=80',
    120,
    20,
    true
  ),
  (
    'Fresh Mango Juice',
    350,
    'Drinks',
    '100% freshly pressed tropical mango juice with zero artificial flavors.',
    'https://images.unsplash.com/photo-1546173159-315724a31696?w=800&q=80',
    30,
    8,
    true
  ),
  (
    'Chocolate Milkshake',
    450,
    'Drinks',
    'Rich, creamy chocolate milkshake topped with whipped cream and cocoa drizzle.',
    'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&q=80',
    25,
    6,
    true
  )
ON CONFLICT DO NOTHING;
