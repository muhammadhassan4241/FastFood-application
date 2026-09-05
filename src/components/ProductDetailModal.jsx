import { useState, useMemo } from "react";
import { X, Check, GlassWater, Plus } from "lucide-react";
import StarRating from "./StarRating";
import QtyStepper from "./QtyStepper";

function ProductDetailModal({
  product,
  products = [],
  cart = {},
  onAdd,
  onRemove,
  onClose,
}) {
  const [drinkSelection, setDrinkSelection] = useState({ productId: null, drink: null });
  const selectedDrink = drinkSelection.productId === product?.id ? drinkSelection.drink : null;
  const setSelectedDrink = (drink) => setDrinkSelection({ productId: product?.id ?? null, drink });
  const isDrinkProduct = (product?.category || "").toLowerCase() === "drinks";

  // Dynamically load active, available drinks from the products catalog
  const availableDrinks = useMemo(() => {
    if (isDrinkProduct) return [];
    return (Array.isArray(products) ? products : [])
      .filter(
        (p) =>
          p &&
          (p.category || "").toLowerCase() === "drinks" &&
          p.is_available !== false
      )
      .map((d) => ({
        id: d.id,
        name: d.name || d.title,
        price: Number(d.price || 0),
        image: d.image || "",
      }));
  }, [products, isDrinkProduct]);

  if (!product || typeof product !== "object") return null;

  // Pricing calculation
  const foodPrice = Number(product.price || 0);
  const drinkPrice = selectedDrink ? Number(selectedDrink.price || 0) : 0;
  const singleItemPrice = foodPrice + drinkPrice;

  // Cart key for the specific food + drink combination
  const cartKey = selectedDrink
    ? `${product.id}_drink_${selectedDrink.id}`
    : `${product.id}`;

  const currentItemInCart = cart[cartKey];
  const comboQty = currentItemInCart
    ? typeof currentItemInCart === "number"
      ? currentItemInCart
      : currentItemInCart.quantity || 0
    : 0;

  const displayPrice = comboQty > 0 ? singleItemPrice * comboQty : singleItemPrice;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-zinc-950/70 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Container */}
      <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/40 z-10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-zinc-950/60 hover:bg-zinc-950 text-white backdrop-blur-md transition-colors"
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        {/* Product Image Banner */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <img
            src={product.image}
            alt={product.title || product.name || "Product"}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent" />
          <span className="absolute bottom-4 left-5 text-[11px] font-black uppercase tracking-wider text-orange-400 bg-zinc-950/70 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
            {product.category}
          </span>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-zinc-900 dark:text-white">
              {product.title || product.name}
            </h2>
            <div className="shrink-0">
              <StarRating id={product.id} />
            </div>
          </div>

          <p className="text-zinc-600 dark:text-zinc-400 mt-3 text-xs sm:text-sm leading-relaxed">
            {product.description}
          </p>

          {/* CHOOSE YOUR DRINK SECTION (Only for food products) */}
          {!isDrinkProduct && availableDrinks.length > 0 && (
            <div className="mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <span className="text-base">🥤</span>
                    <span>Choose Your Drink</span>
                  </h3>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Complete your meal with a refreshing drink.
                  </p>
                </div>
                {selectedDrink && (
                  <span className="text-xs font-bold text-orange-500">
                    +{selectedDrink.name}
                  </span>
                )}
              </div>

              {/* Drink Selection Cards Grid */}
              <div className="mt-3.5 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2.5">
                {/* Option: No Drink */}
                <button
                  type="button"
                  onClick={() => setSelectedDrink(null)}
                  className={`flex items-center gap-3 p-2.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                    selectedDrink === null
                      ? "border-orange-500 bg-orange-500/10 shadow-sm ring-1 ring-orange-500/30"
                      : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/60 hover:border-orange-500/40"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      selectedDrink === null
                        ? "bg-orange-500 text-white"
                        : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500"
                    }`}
                  >
                    <GlassWater size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                      No Drink
                    </p>
                    <p className="text-[10px] text-zinc-500 font-medium">+Rs. 0</p>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      selectedDrink === null
                        ? "border-orange-500 bg-orange-500 text-white"
                        : "border-zinc-300 dark:border-zinc-700"
                    }`}
                  >
                    {selectedDrink === null && <Check size={10} strokeWidth={3} />}
                  </div>
                </button>

                {/* Drink Options */}
                {availableDrinks.map((drink) => {
                  const isSelected = selectedDrink?.id === drink.id;
                  return (
                    <button
                      key={drink.id}
                      type="button"
                      onClick={() => setSelectedDrink(drink)}
                      className={`flex items-center gap-3 p-2.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "border-orange-500 bg-orange-500/10 shadow-sm ring-1 ring-orange-500/30"
                          : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/60 hover:border-orange-500/40"
                      }`}
                    >
                      {drink.image ? (
                        <img
                          src={drink.image}
                          alt={drink.name}
                          className="w-10 h-10 rounded-xl object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold text-xs shrink-0">
                          🥤
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                          {drink.name}
                        </p>
                        <p className="text-[10px] text-orange-500 font-bold">
                          +Rs. {drink.price}
                        </p>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "border-orange-500 bg-orange-500 text-white"
                            : "border-zinc-300 dark:border-zinc-700"
                        }`}
                      >
                        {isSelected && <Check size={10} strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom Action / Price Bar */}
          <div className="flex items-center justify-between mt-7 pt-5 border-t border-zinc-100 dark:border-zinc-800">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                {selectedDrink ? "Meal Total (Food + Drink)" : "Item Price"}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-orange-500">
                  Rs. {Number(displayPrice).toLocaleString()}
                </span>
                {selectedDrink && (
                  <span className="text-xs text-zinc-400 line-through">
                    Rs. {foodPrice}
                  </span>
                )}
              </div>
            </div>

            {comboQty > 0 ? (
              <div className="flex items-center gap-2">
                <QtyStepper
                  qty={comboQty}
                  onAdd={() => onAdd(product.id, selectedDrink)}
                  onRemove={() => onRemove(cartKey)}
                />
              </div>
            ) : (
              <button
                onClick={() => onAdd(product.id, selectedDrink)}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white bg-orange-500 hover:bg-orange-400 rounded-full px-5 py-3 shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 active:scale-95"
              >
                <Plus size={16} />
                <span>Add to cart</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailModal;
