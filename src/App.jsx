import { useEffect, useState } from "react";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import MenuPage from "./components/MenuPage";
import CartDrawer from "./components/CartDrawer";
import ProductDetailModal from "./components/ProductDetailModal";
import CheckoutPage from "./components/CheckoutPage";
import OwnerLogin from "./components/OwnerLogin";
import OwnerDashboard from "./components/OwnerDashboard";
import { supabase } from "./supabaseClient";

function App() {
  const [page, setPage] = useState("home");
  const [jumpCategory, setJumpCategory] = useState(null);
  const [cart, setCart] = useState(() => {
    if (typeof window === "undefined") return {};
    try {
      return JSON.parse(localStorage.getItem("foodworld-cart") || "{}");
    } catch {
      return {};
    }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState(null);
  const [productsList, setProductsList] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [owner, setOwner] = useState(null);
  const [theme, setTheme] = useState(() => (typeof window !== "undefined" ? localStorage.getItem("theme") || "dark" : "dark"));

  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*").order("id");
    if (error) console.error("Error fetching products:", error);
    else setProductsList(data || []);
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (error) console.error("Error fetching orders:", error);
    else setOrders(data || []);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchProducts(), fetchOrders()]);
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) setOwner(data.session.user);
      setLoading(false);
    };
    load();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setOwner(session?.user || null));
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("foodworld-cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (id) => setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  const removeFromCart = (id) => setCart((prev) => { const next = { ...prev }; if (!next[id]) return prev; next[id] -= 1; if (next[id] <= 0) delete next[id]; return next; });
  const cartCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);

  const handlePlaceOrder = async (details) => {
    const { error } = await supabase.from("orders").insert([{ customer_name: details?.name || "Guest", mobile: details?.phone || "N/A", address: details?.address || "N/A", total_amount: details?.total || 0, items: cart, status: "pending" }]);
    if (error) alert(`Order place karne mein issue aaya: ${error.message}`);
    else { setCart({}); await fetchOrders(); setPage("home"); }
  };

  const goToMenu = () => { setJumpCategory(null); setPage("menu"); };
  const goToCategory = (category) => { setJumpCategory(category); setPage("menu"); };
  const signOut = async () => { await supabase.auth.signOut(); setOwner(null); setPage("home"); };

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-orange-500"><div className="h-10 w-10 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" /></div>;
  if (page === "owner" && !owner) return <OwnerLogin onLoggedIn={(user) => { setOwner(user); setPage("owner"); }} />;
  if (page === "owner" && owner) return <OwnerDashboard products={productsList} orders={orders} user={owner} onSignOut={signOut} onProductsChanged={fetchProducts} onOrdersChanged={fetchOrders} />;

  return <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-100">
    <Header page={page} setPage={setPage} cartCount={cartCount} onOpenCart={() => setCartOpen(true)} theme={theme} toggleTheme={() => setTheme((prev) => prev === "dark" ? "light" : "dark")} onOwner={() => setPage("owner")} />
    {page === "home" && <HomePage products={productsList} cart={cart} onAdd={addToCart} onRemove={removeFromCart} goToMenu={goToMenu} goToCategory={goToCategory} onOpenDetail={setDetailProduct} />}
    {page === "menu" && <MenuPage products={productsList} cart={cart} onAdd={addToCart} onRemove={removeFromCart} initialCategory={jumpCategory} onOpenDetail={setDetailProduct} />}
    {page === "checkout" && <CheckoutPage cart={cart} products={productsList} onAdd={addToCart} onRemove={removeFromCart} goToMenu={goToMenu} onPlaceOrder={handlePlaceOrder} />}
    <footer className="border-t border-zinc-200 px-6 py-8 text-center dark:border-orange-500/10"><p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Food World · Fresh & Fast</p></footer>
    <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} products={productsList} onAdd={addToCart} onRemove={removeFromCart} onCheckout={() => { setCartOpen(false); setPage("checkout"); }} />
    <ProductDetailModal product={detailProduct} qty={detailProduct ? cart[detailProduct.id] || 0 : 0} onAdd={() => addToCart(detailProduct.id)} onRemove={() => removeFromCart(detailProduct.id)} onClose={() => setDetailProduct(null)} />
  </div>;
}

export default App;
