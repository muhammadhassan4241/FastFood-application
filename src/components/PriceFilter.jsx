const PRICE_MIN = 0;
const PRICE_MAX = 2000;
const STEP = 50;

function PriceFilter({ priceRange, onChangePriceHandler }) {
  const minPercent = ((priceRange.min - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
  const maxPercent = ((priceRange.max - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), priceRange.max - STEP);
    onChangePriceHandler({ ...priceRange, min: value });
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), priceRange.min + STEP);
    onChangePriceHandler({ ...priceRange, max: value });
  };

  return (
    <div>
      <p className="text-xs font-semibold text-orange-500 uppercase tracking-wide mb-1">Refine</p>
      <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Price</h3>

      <div className="flex items-baseline justify-between mb-4">
        <span className="text-orange-500 font-semibold">Rs. {priceRange.min}</span>
        <span className="text-zinc-400 text-xs">to</span>
        <span className="text-orange-500 font-semibold">
          Rs. {priceRange.max >= PRICE_MAX ? `${PRICE_MAX}+` : priceRange.max}
        </span>
      </div>

      <div className="relative h-5 flex items-center">
        <div className="absolute inset-x-0 h-[3px] rounded-full bg-zinc-200 dark:bg-zinc-700" />
        <div
          className="absolute h-[3px] rounded-full bg-orange-500"
          style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
        />

        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={STEP}
          value={priceRange.min}
          onChange={handleMinChange}
          className="range-thumb absolute inset-x-0 w-full h-5 pointer-events-none"
          style={{ zIndex: 3 }}
        />
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={STEP}
          value={priceRange.max}
          onChange={handleMaxChange}
          className="range-thumb absolute inset-x-0 w-full h-5 pointer-events-none"
          style={{ zIndex: 4 }}
        />
      </div>

      <div className="flex justify-between mt-1.5 text-[11px] text-zinc-500">
        <span>Rs. {PRICE_MIN}</span>
        <span>Rs. {PRICE_MAX}+</span>
      </div>
    </div>
  );
}

export default PriceFilter;