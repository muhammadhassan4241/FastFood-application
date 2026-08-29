import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Boxes,
  Check,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  PackagePlus,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  ShoppingBag,
  Trash2,
  TrendingUp,
  Users,
  X,
} from "lucide-react";

const EMPTY_PRODUCT = {
  name: "",
  price: "",
  image: "",
  category: "Burger",
  description: "",
  stock_quantity: 25,
  low_stock_threshold: 5,
  is_available: true,
};

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Boxes },
  { id: "orders", label: "Orders", icon: ClipboardList },
  { id: "inventory", label: "Inventory", icon: ShoppingBag },
  { id: "customers", label: "Customers", icon: Users },
  { id: "reports", label: "Reports", icon: BarChart3 },
];

function money(value) {
  return `Rs. ${Number(value || 0).toLocaleString()}`;
}

function StatCard({ label, value, change, icon: Icon, tone = "orange" }) {
  const tones = {
    orange: "bg-orange-500/10 text-orange-500",
    blue: "bg-blue-500/10 text-blue-500",
    green: "bg-emerald-500/10 text-emerald-500",
    purple: "bg-violet-500/10 text-violet-500",
  };
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tones[tone]}`}><Icon size={21} /></div>
        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-500"><ArrowUpRight size={14} />{change}</span>
      </div>
      <p className="mt-5 text-sm text-zinc-500">{label}</p>
      <p className="mt-1 text-2xl font-black tracking-tight text-zinc-900 dark:text-white">{value}</p>
    </div>
  );
}

function ProductModal({ product, onClose, onSave, saving }) {
  const [form, setForm] = useState(product || EMPTY_PRODUCT);
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  if (!product) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-6 flex items-center justify-between">
          <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">Catalog</p><h2 className="mt-1 text-2xl font-black text-zinc-900 dark:text-white">{product.id ? "Edit product" : "Add product"}</h2></div>
          <button onClick={onClose} className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"><X size={20} /></button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[["name", "Product name", "text"], ["price", "Price (Rs.)", "number"], ["image", "Image URL", "url"], ["category", "Category", "text"], ["stock_quantity", "Stock quantity", "number"], ["low_stock_threshold", "Low-stock threshold", "number"]].map(([key, label, type]) => (
            <label key={key} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {label}
              <input type={type} value={form[key] ?? ""} onChange={(event) => update(key, type === "number" ? Number(event.target.value) : event.target.value)} className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 outline-none transition focus:border-orange-500 dark:border-zinc-700 dark:bg-zinc-950" />
            </label>
          ))}
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 sm:col-span-2">Description<textarea value={form.description ?? ""} onChange={(event) => update("description", event.target.value)} rows={3} className="mt-1.5 w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 outline-none transition focus:border-orange-500 dark:border-zinc-700 dark:bg-zinc-950" /></label>
          <label className="flex items-center gap-3 text-sm font-medium text-zinc-700 dark:text-zinc-300"><input type="checkbox" checked={Boolean(form.is_available)} onChange={(event) => update("is_available", event.target.checked)} className="h-4 w-4 accent-orange-500" />Available on storefront</label>
        </div>
        <div className="mt-7 flex justify-end gap-3"><button onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800">Cancel</button><button disabled={saving} onClick={() => onSave(form)} className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-orange-400 disabled:opacity-50">{saving ? "Saving..." : "Save product"}</button></div>
      </div>
    </div>
  );
}

function OwnerDashboard({ products, orders, user, onSignOut, onProductsChanged, onOrdersChanged }) {
  const [section, setSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [modalProduct, setModalProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  const stats = useMemo(() => {
    const revenue = orders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
    const pending = orders.filter((order) => order.status === "pending").length;
    const stock = products.reduce((sum, product) => sum + Number(product.stock_quantity ?? 0), 0);
    const lowStock = products.filter((product) => Number(product.stock_quantity ?? 0) <= Number(product.low_stock_threshold ?? 5)).length;
    return { revenue, pending, stock, lowStock };
  }, [orders, products]);

  const filteredProducts = products.filter((product) => [product.name, product.category, product.description].join(" ").toLowerCase().includes(query.toLowerCase()));
  const customers = [...new Map(orders.map((order) => [order.mobile || order.customer_name, order])).values()];

  const saveProduct = async (form) => {
    setSaving(true); setNotice("");
    const { supabase } = await import("../supabaseClient");
    const payload = { name: form.name, price: Number(form.price), image: form.image, category: form.category, description: form.description, stock_quantity: Number(form.stock_quantity || 0), low_stock_threshold: Number(form.low_stock_threshold || 5), is_available: Boolean(form.is_available) };
    const response = form.id ? await supabase.from("products").update(payload).eq("id", form.id).select().single() : await supabase.from("products").insert(payload).select().single();
    if (response.error) setNotice(response.error.message); else { setNotice(form.id ? "Product updated successfully." : "Product added successfully."); setModalProduct(null); onProductsChanged(); }
    setSaving(false);
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product from the catalog?")) return;
    const { supabase } = await import("../supabaseClient");
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) setNotice(error.message); else { setNotice("Product deleted."); onProductsChanged(); }
  };

  const updateOrderStatus = async (id, status) => {
    const { supabase } = await import("../supabaseClient");
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) setNotice(error.message); else { setNotice("Order status updated."); onOrdersChanged(); }
  };

  const title = navItems.find((item) => item.id === section)?.label || "Overview";

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-zinc-200 bg-white p-5 transition-transform dark:border-zinc-800 dark:bg-zinc-900 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center gap-2 px-2 py-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-lg font-black text-white">F</div><div><p className="font-black tracking-tight">FOOD <span className="text-orange-500">WORLD</span></p><p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400">Owner POS</p></div></div>
        <div className="my-7 rounded-2xl bg-orange-500/10 p-4"><p className="text-xs font-bold uppercase tracking-widest text-orange-500">Workspace</p><p className="mt-1 text-sm font-semibold text-zinc-800 dark:text-zinc-200">Main restaurant</p><p className="mt-1 truncate text-xs text-zinc-500">{user?.email}</p></div>
        <nav className="space-y-1">{navItems.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => { setSection(id); setSidebarOpen(false); }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${section === id ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"}`}><Icon size={18} />{label}</button>)}</nav>
        <div className="absolute bottom-5 left-5 right-5"><button onClick={onSignOut} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-zinc-500 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"><LogOut size={18} />Sign out</button></div>
      </aside>
      <main className="min-h-screen lg:pl-72">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-zinc-200 bg-white/85 px-4 py-4 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/85 sm:px-8"><div className="flex items-center gap-3"><button onClick={() => setSidebarOpen(true)} className="rounded-xl p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 lg:hidden"><Menu size={20} /></button><div><p className="text-xs font-semibold text-zinc-400">Owner dashboard</p><h1 className="text-xl font-black">{title}</h1></div></div><div className="flex items-center gap-3"><button onClick={() => { onProductsChanged(); onOrdersChanged(); }} className="rounded-xl border border-zinc-200 p-2.5 text-zinc-500 hover:border-orange-500 hover:text-orange-500 dark:border-zinc-800"><RefreshCw size={17} /></button><div className="hidden text-right sm:block"><p className="text-sm font-bold">Hello, Owner</p><p className="text-xs text-zinc-500">{new Date().toLocaleDateString()}</p></div><div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-600">{(user?.email?.[0] || "O").toUpperCase()}</div></div></header>
        <div className="mx-auto max-w-[1500px] p-4 sm:p-8">
          {notice && <div className="mb-5 flex items-center justify-between rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-300"><span>{notice}</span><button onClick={() => setNotice("")}><X size={16} /></button></div>}
          {section === "overview" && <Overview stats={stats} orders={orders} products={products} setSection={setSection} />}
          {section === "products" && <ProductsSection products={filteredProducts} query={query} setQuery={setQuery} onAdd={() => setModalProduct({ ...EMPTY_PRODUCT })} onEdit={setModalProduct} onDelete={deleteProduct} />}
          {section === "inventory" && <InventorySection products={products} onEdit={setModalProduct} />}
          {section === "orders" && <OrdersSection orders={orders} onStatus={updateOrderStatus} />}
          {section === "customers" && <CustomersSection customers={customers} orders={orders} />}
          {section === "reports" && <ReportsSection orders={orders} products={products} />}
        </div>
      </main>
      <ProductModal product={modalProduct} onClose={() => setModalProduct(null)} onSave={saveProduct} saving={saving} />
    </div>
  );
}

function Overview({ stats, orders, products, setSection }) {
  const recent = orders.slice(0, 6);
  const max = Math.max(...orders.map((order) => Number(order.total_amount || 0)), 1);
  return <div className="space-y-7"><div><p className="text-sm text-zinc-500">Here is what is happening at your restaurant today.</p><div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Total revenue" value={money(stats.revenue)} change="12.5%" icon={TrendingUp} /><StatCard label="Total orders" value={orders.length} change="8.2%" icon={ClipboardList} tone="blue" /><StatCard label="Items in stock" value={stats.stock} change="Healthy" icon={Boxes} tone="green" /><StatCard label="Pending orders" value={stats.pending} change={stats.lowStock ? `${stats.lowStock} low stock` : "All good"} icon={PackagePlus} tone="purple" /></div></div><div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]"><div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"><div className="flex items-center justify-between"><div><h2 className="font-black">Revenue snapshot</h2><p className="mt-1 text-xs text-zinc-500">Latest orders by value</p></div><button onClick={() => setSection("reports")} className="text-xs font-bold text-orange-500">View reports</button></div><div className="mt-8 flex h-56 items-end gap-3">{recent.length ? recent.map((order) => <div key={order.id} className="flex flex-1 flex-col items-center gap-2"><div className="w-full rounded-t-lg bg-orange-400/80 transition hover:bg-orange-500" style={{ height: `${Math.max((Number(order.total_amount || 0) / max) * 100, 8)}%` }} /><span className="text-[10px] text-zinc-400">#{order.id}</span></div>) : <p className="self-center text-sm text-zinc-500">No orders yet.</p>}</div></div><div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"><div className="flex items-center justify-between"><div><h2 className="font-black">Inventory alerts</h2><p className="mt-1 text-xs text-zinc-500">Products that need attention</p></div><AlertTriangle className="text-orange-500" size={20} /></div><div className="mt-5 space-y-3">{products.filter((p) => Number(p.stock_quantity ?? 0) <= Number(p.low_stock_threshold ?? 5)).slice(0, 5).map((product) => <div key={product.id} className="flex items-center justify-between rounded-xl bg-orange-50 px-3 py-3 dark:bg-orange-500/10"><div className="flex min-w-0 items-center gap-3"><img src={product.image} alt="" className="h-10 w-10 rounded-lg object-cover" /><p className="truncate text-sm font-semibold">{product.name}</p></div><span className="ml-2 whitespace-nowrap text-xs font-bold text-orange-600">{product.stock_quantity ?? 0} left</span></div>)}{!stats.lowStock && <p className="text-sm text-zinc-500">No low-stock alerts.</p>}</div></div></div><div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"><div className="mb-5 flex items-center justify-between"><div><h2 className="font-black">Recent orders</h2><p className="mt-1 text-xs text-zinc-500">Keep an eye on your latest activity</p></div><button onClick={() => setSection("orders")} className="text-xs font-bold text-orange-500">View all orders</button></div><OrdersTable orders={recent} compact /> </div></div>;
}

function ProductsSection({ products, query, setQuery, onAdd, onEdit, onDelete }) { return <div className="space-y-5"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h2 className="text-2xl font-black">Products</h2><p className="mt-1 text-sm text-zinc-500">Manage the menu shown on your storefront.</p></div><button onClick={onAdd} className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white hover:bg-orange-400"><Plus size={17} />Add product</button></div><div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-900"><Search size={17} className="text-zinc-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products..." className="w-full bg-transparent py-3 text-sm outline-none" /></div><div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"><tr><th className="px-5 py-4">Product</th><th className="px-5 py-4">Category</th><th className="px-5 py-4">Price</th><th className="px-5 py-4">Stock</th><th className="px-5 py-4">Status</th><th className="px-5 py-4 text-right">Actions</th></tr></thead><tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">{products.map((product) => <tr key={product.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-950"><td className="px-5 py-4"><div className="flex items-center gap-3"><img src={product.image} alt="" className="h-11 w-11 rounded-xl object-cover" /><div><p className="font-bold">{product.name}</p><p className="max-w-xs truncate text-xs text-zinc-500">{product.description}</p></div></div></td><td className="px-5 py-4 text-zinc-500">{product.category}</td><td className="px-5 py-4 font-bold">{money(product.price)}</td><td className="px-5 py-4"><span className={Number(product.stock_quantity ?? 0) <= Number(product.low_stock_threshold ?? 5) ? "font-bold text-orange-500" : "text-zinc-600 dark:text-zinc-300"}>{product.stock_quantity ?? "—"}</span></td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${product.is_available === false ? "bg-zinc-100 text-zinc-500 dark:bg-zinc-800" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"}`}>{product.is_available === false ? "Hidden" : "Live"}</span></td><td className="px-5 py-4"><div className="flex justify-end gap-2"><button onClick={() => onEdit(product)} className="rounded-lg p-2 text-zinc-500 hover:bg-orange-50 hover:text-orange-500 dark:hover:bg-orange-500/10"><Pencil size={16} /></button><button onClick={() => onDelete(product.id)} className="rounded-lg p-2 text-zinc-500 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"><Trash2 size={16} /></button></div></td></tr>)}</tbody></table></div>{!products.length && <div className="p-10 text-center text-sm text-zinc-500">No products found.</div>}</div></div>; }

function InventorySection({ products, onEdit }) { return <div className="space-y-5"><div><h2 className="text-2xl font-black">Inventory</h2><p className="mt-1 text-sm text-zinc-500">Monitor stock levels and keep popular items available.</p></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{products.map((product) => { const stock = Number(product.stock_quantity ?? 0); const threshold = Number(product.low_stock_threshold ?? 5); const low = stock <= threshold; return <div key={product.id} className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"><div className="flex items-center gap-3"><img src={product.image} alt="" className="h-14 w-14 rounded-xl object-cover" /><div className="min-w-0"><p className="truncate font-bold">{product.name}</p><p className="text-xs text-zinc-500">{product.category}</p></div></div><div className="mt-5 flex items-end justify-between"><div><p className="text-xs text-zinc-500">Current stock</p><p className={`text-2xl font-black ${low ? "text-orange-500" : "text-zinc-900 dark:text-white"}`}>{product.stock_quantity ?? "—"}</p></div><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${low ? "bg-orange-100 text-orange-700" : "bg-emerald-100 text-emerald-700"}`}>{low ? "Low stock" : "Healthy"}</span></div><button onClick={() => onEdit(product)} className="mt-5 w-full rounded-xl border border-zinc-200 py-2.5 text-sm font-bold hover:border-orange-500 hover:text-orange-500 dark:border-zinc-700">Update stock</button></div>; })}</div></div>; }

function OrdersTable({ orders, compact = false, onStatus }) { return <div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><thead className="border-b border-zinc-200 text-xs uppercase tracking-wider text-zinc-500 dark:border-zinc-800"><tr><th className="px-3 py-3">Order</th><th className="px-3 py-3">Customer</th><th className="px-3 py-3">Amount</th><th className="px-3 py-3">Status</th>{!compact && <th className="px-3 py-3 text-right">Update</th>}</tr></thead><tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">{orders.map((order) => <tr key={order.id}><td className="px-3 py-4 font-bold">#{order.id}</td><td className="px-3 py-4"><p className="font-semibold">{order.customer_name}</p><p className="text-xs text-zinc-500">{order.mobile}</p></td><td className="px-3 py-4 font-bold">{money(order.total_amount)}</td><td className="px-3 py-4"><span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-bold capitalize text-orange-700 dark:bg-orange-500/10 dark:text-orange-300">{order.status || "pending"}</span></td>{!compact && <td className="px-3 py-4 text-right"><select value={order.status || "pending"} onChange={(event) => onStatus(order.id, event.target.value)} className="rounded-lg border border-zinc-200 bg-transparent px-2 py-1.5 text-xs dark:border-zinc-700"><option value="pending">Pending</option><option value="preparing">Preparing</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option></select></td>}</tr>)}</tbody></table>{!orders.length && <p className="p-8 text-center text-sm text-zinc-500">No orders yet.</p>}</div>; }
function OrdersSection({ orders, onStatus }) { return <div className="space-y-5"><div><h2 className="text-2xl font-black">Orders</h2><p className="mt-1 text-sm text-zinc-500">Track and update every customer order.</p></div><div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"><OrdersTable orders={orders} onStatus={onStatus} /></div></div>; }
function CustomersSection({ customers, orders }) { return <div className="space-y-5"><div><h2 className="text-2xl font-black">Customers</h2><p className="mt-1 text-sm text-zinc-500">A quick view of your recent customer base.</p></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{customers.map((customer) => { const count = orders.filter((order) => (order.mobile || order.customer_name) === (customer.mobile || customer.customer_name)).length; return <div key={customer.id} className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-100 font-black text-orange-600">{(customer.customer_name || "G")[0]}</div><div><p className="font-bold">{customer.customer_name}</p><p className="text-xs text-zinc-500">{customer.mobile}</p></div></div><div className="mt-5 flex justify-between border-t border-zinc-100 pt-4 text-sm dark:border-zinc-800"><span className="text-zinc-500">Orders</span><span className="font-bold">{count}</span></div></div>; })}</div></div>; }
function ReportsSection({ orders, products }) { const delivered = orders.filter((order) => order.status === "delivered"); const revenue = delivered.reduce((sum, order) => sum + Number(order.total_amount || 0), 0); return <div className="space-y-5"><div><h2 className="text-2xl font-black">Reports</h2><p className="mt-1 text-sm text-zinc-500">Understand sales performance and operational health.</p></div><div className="grid gap-4 sm:grid-cols-3"><StatCard label="All-time order value" value={money(orders.reduce((s, o) => s + Number(o.total_amount || 0), 0))} change="All orders" icon={TrendingUp} /><StatCard label="Delivered revenue" value={money(revenue)} change={`${delivered.length} orders`} icon={Check} tone="green" /><StatCard label="Catalog size" value={products.length} change="Products" icon={Boxes} tone="blue" /></div><div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"><h3 className="font-black">Order performance</h3><div className="mt-5 space-y-3">{["pending", "preparing", "delivered", "cancelled"].map((status) => { const count = orders.filter((o) => o.status === status).length; const percentage = orders.length ? Math.round((count / orders.length) * 100) : 0; return <div key={status}><div className="mb-1 flex justify-between text-xs"><span className="capitalize text-zinc-500">{status}</span><span className="font-bold">{count} ({percentage}%)</span></div><div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800"><div className="h-2 rounded-full bg-orange-500" style={{ width: `${percentage}%` }} /></div></div>; })}</div></div></div>; }

export default OwnerDashboard;
