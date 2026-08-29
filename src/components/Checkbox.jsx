import { Check } from "lucide-react";

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 py-1.5 cursor-pointer group select-none">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <span
        className={`flex items-center justify-center w-4.5 h-4.5 rounded border transition-colors ${
          checked
            ? "bg-orange-500 border-orange-500"
            : "border-zinc-300 dark:border-zinc-600 group-hover:border-orange-500/70"
        }`}
      >
        {checked && <Check size={12} strokeWidth={3} className="text-white" />}
      </span>
      <span
        className={`text-sm transition-colors ${
          checked ? "text-zinc-900 dark:text-white font-medium" : "text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white"
        }`}
      >
        {label}
      </span>
    </label>
  );
}

export default Checkbox;