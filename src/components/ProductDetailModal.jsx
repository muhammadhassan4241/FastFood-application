import { X } from "lucide-react";
import StarRating from "./StarRating";
import QtyStepper from "./QtyStepper";

function ProductDetailModal({ product, qty, onAdd, onRemove, onClose }) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-black/60" />
      <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
        >
          <X size={18} />
        </button>

        <img src={product.image} alt={product.title} className="w-full h-72 object-cover" />

        <div className="p-6">
          <span className="text-[11px] font-bold uppercase tracking-wide text-orange-500 border border-orange-500/30 rounded-full px-3 py-1">
            {product.category}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mt-4">{product.title}</h2>

          <div className="mt-3">
            <StarRating id={product.id} />
          </div>

          <p className="text-zinc-600 dark:text-zinc-400 mt-4 leading-relaxed">{product.description}</p>

          <div className="flex items-center justify-between mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800">
            <span className="text-2xl font-bold text-orange-500">
              Rs. {qty > 0 ? product.price * qty : product.price}
            </span>
            {qty > 0 ? (
              <QtyStepper qty={qty} onAdd={onAdd} onRemove={onRemove} />
            ) : (
              <button
                onClick={onAdd}
                className="text-sm font-bold text-white bg-orange-500 hover:bg-orange-400 rounded-full px-6 py-3 transition-colors"
              >
                Add to cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailModal;