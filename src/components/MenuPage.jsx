import { useMemo, useState } from "react";
import { Filter, Search, SlidersHorizontal, X, Sparkles } from "lucide-react";
import { getAverageRating } from "../data/Product-Rating";
import ProductCard from "./ProductCard";

const MENU_CATEGORIES = [
  { id: "All", label: "All", sidebarLabel: "All", emoji: "" },
  { id: "Burger", label: "Burgers", sidebarLabel: "Burger", emoji: "🍔" },
  { id: "Pizza", label: "Pizza", sidebarLabel: "Pizza", emoji: "🍕" },
  { id: "Shawarma", label: "Shawarma", sidebarLabel: "Shawarma", emoji: "🌯" },
  { id: "Drinks", label: "Drinks", sidebarLabel: "Drinks", emoji: "🥤" },
];

function MenuPage({
  products = [],
  cart,
  onAdd,
  onRemove,
  initialCategory,
  onOpenDetail,
}) {
  const [category, setCategory] = useState(initialCategory || "All");
  const [rating, setRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [query, setQuery] = useState("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const visible = useMemo(() => {
    return products.filter((product) => {
      const title = product.title || product.name || "";
      const prodCat = (product.category || "").toLowerCase();

      // Category filter: "All" includes everything (food & drinks)
      let matchesCategory = true;
      if (category !== "All") {
        if (category === "Burger" || category === "Burgers") {
          matchesCategory = prodCat.includes("burger");
        } else {
          matchesCategory = prodCat === category.toLowerCase();
        }
      }

      // Price filter
      const matchesPrice = Number(product.price || 0) <= maxPrice;

      // Rating filter
      const matchesRating = !rating || getAverageRating(product.id) >= rating;

      // Search query filter: search by title, name, description, or category
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        title.toLowerCase().includes(q) ||
        (product.description || "").toLowerCase().includes(q) ||
        prodCat.includes(q);

      return matchesCategory && matchesPrice && matchesRating && matchesQuery;
    });
  }, [products, category, maxPrice, rating, query]);

  const handleResetFilters = () => {
    setCategory("All");
    setRating(0);
    setMaxPrice(2000);
    setQuery("");
  };

  const hasActiveFilters =
    category !== "All" || rating > 0 || maxPrice < 2000 || query.length > 0;

  return (
    <div className="min-h-[75vh] px-4 pb-20 pt-6 sm:px-8 md:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="animate-fade-up flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/25 bg-orange-500/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-orange-600 dark:text-orange-400">
              <Sparkles size={13} />
              <span>Full Store Menu</span>
            </div>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-950 dark:text-white sm:text-4xl md:text-5xl">
              Fresh Food & Chilled Drinks.
            </h1>
            <p className="mt-2 max-w-xl text-xs sm:text-sm leading-relaxed text-zinc-500">
              From flame-grilled smash burgers and stone-baked pizza to authentic shawarma and ice-cold drinks.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs font-bold shadow-sm dark:border-zinc-800 dark:bg-zinc-900 lg:hidden"
            >
              <SlidersHorizontal size={15} className="text-orange-500" />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 text-xs sm:text-sm">
              <Filter size={15} className="text-orange-500" />
              <span className="font-bold text-zinc-900 dark:text-white">
                {visible.length} items
              </span>
            </div>
          </div>
        </div>

        {/* Top Horizontal Category Scroll Bar (Mobile & Tablet Friendly) */}
        <div className="mt-6 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {MENU_CATEGORIES.map((item) => {
              const active = category.toLowerCase() === item.id.toLowerCase();
              return (
                <button
                  key={item.id}
                  onClick={() => setCategory(item.id)}
                  className={`rounded-2xl px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                    active
                      ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25 scale-[1.02]"
                      : "border border-zinc-200/90 bg-white text-zinc-600 hover:border-orange-500/40 hover:text-orange-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                  }`}
                >
                  {item.emoji ? `${item.emoji} ${item.label}` : item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Grid: Filters Sidebar + Products Display */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr]">
          {/* Filters Sidebar */}
          <aside
            className={`rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 lg:sticky lg:top-24 h-fit ${
              mobileFilterOpen ? "block" : "hidden lg:block"
            }`}
          >
            <div className="mb-5 flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
              <p className="flex items-center gap-2 text-sm font-black text-zinc-900 dark:text-white">
                <SlidersHorizontal size={16} className="text-orange-500" />
                <span>Filters</span>
              </p>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-bold text-orange-500 hover:underline"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Search Input */}
            <label className="relative block">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search food or drinks..."
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 py-2.5 pl-9 pr-3 text-xs font-medium outline-none transition focus:border-orange-500 dark:border-zinc-700 dark:bg-zinc-950"
              />
            </label>

            {/* Categories */}
            <div className="mt-6">
              <p className="mb-2 text-[10px] font-black uppercase tracking-wider text-zinc-400">
                Category
              </p>
              <div className="flex flex-col gap-1">
                {MENU_CATEGORIES.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCategory(item.id)}
                    className={`rounded-xl px-3 py-2 text-left text-xs font-bold transition ${
                      category.toLowerCase() === item.id.toLowerCase()
                        ? "bg-orange-500 text-white font-bold"
                        : "text-zinc-600 hover:bg-orange-500/10 hover:text-orange-500 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {item.sidebarLabel || item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Price Slider */}
            <div className="mt-6 border-t border-zinc-100 pt-5 dark:border-zinc-800">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                  Max Price
                </p>
                <span className="text-xs font-black text-orange-500">Rs. {maxPrice}</span>
              </div>
              <input
                type="range"
                min="50"
                max="2000"
                step="50"
                value={maxPrice}
                onChange={(event) => setMaxPrice(Number(event.target.value))}
                className="w-full accent-orange-500"
              />
            </div>

            {/* Rating Filter */}
            <div className="mt-6 border-t border-zinc-100 pt-5 dark:border-zinc-800">
              <p className="mb-2.5 text-[10px] font-black uppercase tracking-wider text-zinc-400">
                Minimum Rating
              </p>
              <div className="flex gap-2">
                {[0, 4, 4.5].map((value) => (
                  <button
                    key={value}
                    onClick={() => setRating(value)}
                    className={`flex-1 rounded-xl py-2 text-xs font-bold transition ${
                      rating === value
                        ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                        : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
                    }`}
                  >
                    {value ? `${value}+ ★` : "All"}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="min-w-0">
            {/* Status Bar */}
            <div className="mb-4 flex items-center justify-between text-xs text-zinc-500">
              <p>
                Showing{" "}
                <span className="font-bold text-zinc-900 dark:text-white">
                  {visible.length}
                </span>{" "}
                delicious {category === "All" ? "items" : category.toLowerCase()}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1 font-bold text-orange-500 hover:underline"
                >
                  Clear filters <X size={13} />
                </button>
              )}
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${Math.min(index, 6) * 40}ms` }}
                >
                  <ProductCard
                    product={product}
                    qty={typeof cart[product.id] === "number" ? cart[product.id] : cart[product.id]?.quantity || 0}
                    onAdd={() => onAdd(product.id)}
                    onRemove={() => onRemove(product.id)}
                    onOpenDetail={onOpenDetail}
                  />
                </div>
              ))}
            </div>

            {/* Empty State */}
            {!visible.length && (
              <div className="rounded-3xl border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
                <p className="text-base font-black text-zinc-800 dark:text-zinc-200">
                  No products or drinks match this filter.
                </p>
                <p className="mt-1.5 text-xs text-zinc-500">
                  Try clearing your search or switching to another category.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-4 rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-orange-400"
                >
                  View All Menu Items
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default MenuPage;
