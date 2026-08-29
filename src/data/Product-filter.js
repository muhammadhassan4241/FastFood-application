import { products } from "./Product";
import { getAverageRating } from "./Product-Rating";

export const getVisibleProducts = (
  selectedCategories = [],
  minRating = 0,
  priceRange = { min: 0, max: 2000 }
) => {
  let visibleProducts = products;

  // Category Filter
  if (selectedCategories.length > 0) {
    visibleProducts = visibleProducts.filter((product) =>
      selectedCategories.includes(product.category)
    );
  }

  // Rating Filter
  if (minRating > 0) {
    visibleProducts = visibleProducts.filter((product) => {
      const avgRating = getAverageRating(product.id);
      return avgRating >= minRating;
    });
  }

  // Price Filter
  visibleProducts = visibleProducts.filter(
    (product) => product.price >= priceRange.min && product.price <= priceRange.max
  );

  return visibleProducts;
};
