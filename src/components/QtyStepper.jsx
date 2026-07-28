import { Plus, Minus } from "lucide-react";

function QtyStepper({ qty, onAdd, onRemove }) {
  return (
    <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 rounded-full px-1 py-1">
      <button
        onClick={onRemove}
        className="w-7 h-7 flex items-center justify-center rounded-full text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
      >
        <Minus size={13} />
      </button>
      <span className="text-sm font-semibold text-zinc-900 dark:text-white w-5 text-center">{qty}</span>
      <button
        onClick={onAdd}
        className="w-7 h-7 flex items-center justify-center rounded-full bg-orange-500 text-white hover:bg-orange-400 transition-colors"
      >
        <Plus size={13} />
      </button>
    </div>
  );
}

export default QtyStepper;