import { Plus, Sparkles } from "lucide-react";
import StarRating from "./StarRating";
import QtyStepper from "./QtyStepper";

function ProductCard({ product, qty, onAdd, onRemove, onOpenDetail }) {
  const title = product.title || product.name;
  const isAvailable = product.is_available !== false;
  return (
    <article onClick={() => onOpenDetail(product)} className="group relative overflow-hidden rounded-[1.6rem] border border-zinc-200/80 bg-white shadow-sm transition duration-500 hover:-translate-y-2 hover:border-orange-400/50 hover:shadow-2xl hover:shadow-orange-500/10 dark:border-white/10 dark:bg-zinc-900">
      <div className="relative aspect-[1.25/1] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <img src={product.image} alt={title} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/75 via-transparent to-transparent opacity-80" />
        <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-zinc-950/60 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-orange-300 backdrop-blur-md">{product.category}</span>
        {isAvailable ? <span className="absolute bottom-4 left-4 flex items-center gap-1.5 text-xs font-bold text-white"><Sparkles size={13} className="text-orange-300" />Fresh today</span> : <span className="absolute bottom-4 left-4 rounded-full bg-zinc-950/75 px-3 py-1.5 text-xs font-bold text-zinc-300">Currently unavailable</span>}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3"><div><h3 className="line-clamp-1 text-lg font-black text-zinc-900 dark:text-white">{title}</h3><p className="mt-1.5 line-clamp-2 min-h-10 text-sm leading-5 text-zinc-500 dark:text-zinc-400">{product.description}</p></div><span className="whitespace-nowrap text-lg font-black text-orange-500">Rs. {Number(product.price).toLocaleString()}</span></div>
        <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800"><StarRating id={product.id} />{qty > 0 ? <div onClick={(event) => event.stopPropagation()}><QtyStepper qty={qty} onAdd={onAdd} onRemove={onRemove} /></div> : <button disabled={!isAvailable} onClick={(event) => { event.stopPropagation(); onAdd(); }} className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 px-4 py-2 text-xs font-black text-white transition hover:scale-105 hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-zinc-900 dark:hover:bg-orange-500 dark:hover:text-white"><Plus size={14} />Add</button>}</div>
      </div>
    </article>
  );
}

export default ProductCard;
