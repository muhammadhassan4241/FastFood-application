import { Star } from "lucide-react";
import { getAverageRating, countReviews } from "../data/Product-Rating";

function StarRating({ id }) {
  const avg = getAverageRating(id);
  const count = countReviews(id);

  return (
    <div className="flex items-center gap-1.5">
      <Star size={13} className="fill-amber-400 text-amber-400" />
      <span className="text-sm text-stone-100 font-medium">{avg > 0 ? avg.toFixed(1) : "New"}</span>
      {count > 0 && <span className="text-xs text-stone-500">({count})</span>}
    </div>
  );
}

export default StarRating;
