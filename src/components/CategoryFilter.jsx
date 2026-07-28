import { categoryTitle } from "../data/Categroy";
import Checkbox from "./Checkbox";

function CategoryFilter({ selected, onChange }) {
  return (
    <div>
      <p className="text-xs font-semibold text-orange-500 uppercase tracking-wide mb-1">Refine</p>
      <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-3">Category</h3>
      <div className="flex flex-col">
        {categoryTitle.map((category) => (
          <Checkbox
            key={category}
            label={category}
            checked={selected.includes(category)}
            onChange={(e) => onChange(category, e.target.checked)}
          />
        ))}
      </div>
    </div>
  );
}

export default CategoryFilter;