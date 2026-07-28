import StarRating from "./StarRating";
import QtyStepper from "./QtyStepper";

function ProductCard({ product, qty, onAdd, onRemove, onOpenDetail }) {
  return (
    <div
      onClick={() => onOpenDetail(product)}
      className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:border-orange-500/40 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/5"
    >
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 text-[11px] font-bold uppercase tracking-wide bg-black/70 text-orange-400 border border-orange-500/30 rounded-full px-3 py-1 backdrop-blur-sm">
          {product.category}
        </span>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white line-clamp-1">{product.title}</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 line-clamp-2">{product.description}</p>

        <div className="mt-3">
          <StarRating id={product.id} />
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <span className="text-xl font-bold text-orange-500">
            Rs. {qty > 0 ? product.price * qty : product.price}
          </span>

          {qty > 0 ? (
            <div onClick={(e) => e.stopPropagation()}>
              <QtyStepper qty={qty} onAdd={onAdd} onRemove={onRemove} />
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAdd();
              }}
              className="text-sm font-bold text-white bg-orange-500 hover:bg-orange-400 rounded-full px-5 py-2 transition-colors"
            >
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;