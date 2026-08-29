import { Star } from "lucide-react";
import { ratings } from "../data/Product-Rating";

function StarRow({ rating, label, selected, onSelect }) {
  return (
    <label className="flex items-center gap-3 py-1.5 cursor-pointer group select-none">
      <input type="radio" name="rating" checked={selected} onChange={onSelect} className="sr-only" />
      <span className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={14}
            className={i < rating ? "fill-orange-500 text-orange-500" : "text-zinc-300 dark:text-zinc-600"}
          />
        ))}
      </span>
      <span
        className={`text-sm transition-colors ${
          selected
            ? "text-zinc-900 dark:text-white font-medium"
            : "text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white"
        }`}
      >
        {label}
      </span>
    </label>
  );
}

function RatingFilter({ selectedRating, onChangeRatingHandler }) {
  return (
    <div>
      <p className="text-xs font-semibold text-orange-500 uppercase tracking-wide mb-1">Refine</p>
      <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-3">Rating</h3>

      <div className="flex flex-col">
        <StarRow
          rating={0}
          label="All ratings"
          selected={selectedRating === 0}
          onSelect={() => onChangeRatingHandler(0)}
        />
        {ratings.map((rating) => (
          <StarRow
            key={rating}
            rating={rating}
            label={`${rating} & up`}
            selected={selectedRating === rating}
            onSelect={() => onChangeRatingHandler(rating)}
          />
        ))}
      </div>
    </div>
  );
}

export default RatingFilter;