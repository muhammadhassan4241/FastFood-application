import { ArrowRight, Flame, Star, Clock, Truck } from "lucide-react";
import { products } from "../data/Product";
import { categories } from "../data/Categroy";
import { getAverageRating } from "../data/Product-Rating";
import ProductCard from "./ProductCard";

function HomePage({ cart, onAdd, onRemove, goToMenu, goToCategory, onOpenDetail }) {
  const featured = [...products]
    .sort((a, b) => getAverageRating(b.id) - getAverageRating(a.id))
    .slice(0, 3);

  return (
    <div>
      {/* HERO */}
      <section className="relative px-5 md:px-10 pt-14 pb-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-[420px] h-[420px] bg-orange-500/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 text-orange-600 dark:text-orange-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            <Flame size={14} />
            Hot & Fresh • Delivered Fast
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-zinc-900 dark:text-white leading-[1.1] max-w-2xl">
            Craving something <span className="text-orange-500">delicious</span>?
          </h1>

          <p className="text-zinc-600 dark:text-zinc-400 text-lg mt-4 max-w-lg">
            Burgers, Shawarma & Pizza — freshly made and delivered to your door.
          </p>

          <div className="flex flex-wrap gap-3 mt-8">
            <button
              onClick={goToMenu}
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-full px-7 py-3.5 transition-all hover:scale-[1.03]"
            >
              Order Now <ArrowRight size={18} />
            </button>
            <button
              onClick={goToMenu}
              className="inline-flex items-center gap-2 border border-zinc-300 dark:border-zinc-700 hover:border-orange-500 text-zinc-700 dark:text-zinc-300 font-medium rounded-full px-6 py-3.5 transition-all"
            >
              View Full Menu
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/15 flex items-center justify-center">
                <Clock size={18} className="text-orange-500" />
              </div>
              <div>
                <p className="font-bold text-zinc-900 dark:text-white">25-35 min</p>
                <p className="text-sm text-zinc-500">Avg Delivery</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/15 flex items-center justify-center">
                <Star size={18} className="text-orange-500" />
              </div>
              <div>
                <p className="font-bold text-zinc-900 dark:text-white">4.8 Rating</p>
                <p className="text-sm text-zinc-500">From 2k+ orders</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/15 flex items-center justify-center">
                <Truck size={18} className="text-orange-500" />
              </div>
              <div>
                <p className="font-bold text-zinc-900 dark:text-white">Free Delivery</p>
                <p className="text-sm text-zinc-500">On orders Rs. 999+</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="px-5 md:px-10 pb-14">
        <div className="max-w-7xl mx-auto">
          <p className="text-orange-500 text-sm font-semibold uppercase tracking-wide mb-1">Categories</p>
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-7">What are you craving?</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => goToCategory(c.title)}
                className="group text-left bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-orange-500/50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
              >
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{c.title}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">{c.blurb}</p>
                <span className="inline-flex items-center gap-1.5 text-orange-500 text-sm font-semibold mt-5">
                  Explore <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="px-5 md:px-10 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Flame size={18} className="text-orange-500" />
            <p className="text-orange-500 text-sm font-semibold uppercase tracking-wide">Most Loved</p>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-8">Tonight’s bestsellers</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {featured.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                qty={cart[p.id] || 0}
                onAdd={() => onAdd(p.id)}
                onRemove={() => onRemove(p.id)}
                onOpenDetail={onOpenDetail}
              />
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={goToMenu}
              className="inline-flex items-center gap-2 border border-zinc-300 dark:border-zinc-700 hover:border-orange-500 text-zinc-700 dark:text-zinc-300 font-medium rounded-full px-8 py-3.5 transition-all"
            >
              See Full Menu <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;