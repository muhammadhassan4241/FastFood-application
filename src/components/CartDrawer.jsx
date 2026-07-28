import { ShoppingBasket, X } from "lucide-react";
import QtyStepper from "./QtyStepper";

function CartDrawer({ open, onClose, cart, products, onAdd, onRemove, onCheckout }) {
  const items = Object.entries(cart).filter(([, q]) => q > 0);
  const total = items.reduce((sum, [id, q]) => {
    const p = products.find((pr) => pr.id === Number(id));
    return sum + (p ? p.price * q : 0);
  }, 0);

  return (
    <div className={`fixed inset-0 z-40 ${open ? "" : "pointer-events-none"}`}>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 dark:bg-black/60 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
      />
      <div
        className={`absolute right-0 top-0 h-full w-full max-w-sm bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Your cart</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20">
              <ShoppingBasket size={36} className="text-zinc-300 dark:text-zinc-600 mb-3" />
              <p className="text-zinc-500 text-sm">Your cart is empty</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map(([id, q]) => {
                const p = products.find((pr) => pr.id === Number(id));
                if (!p) return null;
                return (
                  <div key={id} className="flex gap-3 items-center">
                    <img src={p.image} alt={p.title} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">{p.title}</p>
                      <p className="text-xs text-orange-500 mt-0.5 font-semibold">Rs. {p.price * q}</p>
                    </div>
                    <QtyStepper qty={q} onAdd={() => onAdd(p.id)} onRemove={() => onRemove(p.id)} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-zinc-500">Subtotal</span>
              <span className="text-xl font-bold text-orange-500">Rs. {total}</span>
            </div>
            <button
              onClick={() => {
                onCheckout();
                onClose();
              }}
              className="w-full bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-full py-3.5 transition-colors"
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartDrawer;