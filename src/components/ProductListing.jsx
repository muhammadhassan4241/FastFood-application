import ProductCard from "./ProductCard";

function ProductListing({ products, cart, onAdd, onRemove, onOpenDetail }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-24 border border-dashed border-amber-400/20 rounded-lg">
        <p className="font-serif text-2xl text-stone-100 mb-2">No dishes match your selection</p>
        <p className="text-sm text-stone-400">Try widening the price range or clearing a filter.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          qty={cart[product.id] || 0}
          onAdd={() => onAdd(product.id)}
          onRemove={() => onRemove(product.id)}
          onOpenDetail={onOpenDetail}
        />
      ))}
    </div>
  );
}

export default ProductListing;
