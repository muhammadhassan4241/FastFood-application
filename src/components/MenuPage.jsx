import { useState, useMemo } from "react";
import { getVisibleProducts } from "../data/Product-filter";
import CategoryFilter from "./CategoryFilter";
import RatingFilter from "./RatingFilter";
import PriceFilter from "./PriceFilter";
import ProductListing from "./ProductListing";

function MenuPage({ cart, onAdd, onRemove, initialCategory, onOpenDetail }) {
  const [selectedCategories, setSelectedCategories] = useState(initialCategory ? [initialCategory] : []);
  const [selectedRating, setSelectedRating] = useState(0);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 });

  const onChangeCategoryHandler = (category, isChecked) => {
    setSelectedCategories((prev) =>
      isChecked ? [...prev, category] : prev.filter((c) => c !== category)
    );
  };

  const products = useMemo(
    () => getVisibleProducts(selectedCategories, selectedRating, priceRange),
    [selectedCategories, selectedRating, priceRange]
  );

  return (
    <div>
      <section className="px-5 md:px-10 pt-10 pb-8">
        <p className="text-orange-500 text-sm font-semibold uppercase tracking-wide mb-2">Full menu</p>
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white">
          Pick tonight's dishes
        </h1>
      </section>

      <div className="px-5 md:px-10 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-3">
          <div className="lg:sticky lg:top-24 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col gap-6">
            <CategoryFilter selected={selectedCategories} onChange={onChangeCategoryHandler} />
            <div className="h-px bg-zinc-200 dark:bg-zinc-800" />
            <RatingFilter selectedRating={selectedRating} onChangeRatingHandler={setSelectedRating} />
            <div className="h-px bg-zinc-200 dark:bg-zinc-800" />
            <PriceFilter priceRange={priceRange} onChangePriceHandler={setPriceRange} />
          </div>
        </aside>

        <main className="lg:col-span-9">
          <ProductListing
            products={products}
            cart={cart}
            onAdd={onAdd}
            onRemove={onRemove}
            onOpenDetail={onOpenDetail}
          />
        </main>
      </div>
    </div>
  );
}

export default MenuPage;