import { useState, useEffect } from "react";
import { products } from "./data/Product";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import MenuPage from "./components/MenuPage";
import CartDrawer from "./components/CartDrawer";
import ProductDetailModal from "./components/ProductDetailModal";
import CheckoutPage from "./components/CheckoutPage"

function App() {
  const [page, setPage] = useState("home");
  const [jumpCategory, setJumpCategory] = useState(null);
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState(null);


const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "dark";
    }
    return "dark";
  });
useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };
  // ===== Cart Logic =====
  const addToCart = (id) => setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  const removeFromCart = (id) =>
    setCart((prev) => {
      const next = { ...prev };
      if (!next[id]) return prev;
      next[id] -= 1;
      if (next[id] <= 0) delete next[id];
      return next;
    });

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const handlePlaceOrder = () => {
    setCart({});
    setPage("home");
  };

  const goToMenu = () => {
    setJumpCategory(null);
    setPage("menu");
  };
  const goToCategory = (cat) => {
    setJumpCategory(cat);
    setPage("menu");
  };

  return (
    <div className="font-sans min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      <Header
        page={page}
        setPage={setPage}
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {page === "home" && (
        <HomePage
          cart={cart}
          onAdd={addToCart}
          onRemove={removeFromCart}
          goToMenu={goToMenu}
          goToCategory={goToCategory}
          onOpenDetail={setDetailProduct}
        />
      )}

      {page === "menu" && (
        <MenuPage
          cart={cart}
          onAdd={addToCart}
          onRemove={removeFromCart}
          initialCategory={jumpCategory}
          onOpenDetail={setDetailProduct}
        />
      )}

      {page === "checkout" && (
        <CheckoutPage
          cart={cart}
          products={products}
          onAdd={addToCart}
          onRemove={removeFromCart}
          goToMenu={goToMenu}
          onPlaceOrder={handlePlaceOrder}
        />
      )}

      <footer className="px-6 md:px-10 py-8 border-t border-zinc-200 dark:border-orange-500/10 text-center">
        <p className="text-[11px] tracking-[0.2em] uppercase text-zinc-500">
          Food World · Fresh & Fast
        </p>
      </footer>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        products={products}
        onAdd={addToCart}
        onRemove={removeFromCart}
        onCheckout={() => setPage("checkout")}
      />

      <ProductDetailModal
        product={detailProduct}
        qty={detailProduct ? cart[detailProduct.id] || 0 : 0}
        onAdd={() => addToCart(detailProduct.id)}
        onRemove={() => removeFromCart(detailProduct.id)}
        onClose={() => setDetailProduct(null)}
      />
    </div>
  );
}

export default App;