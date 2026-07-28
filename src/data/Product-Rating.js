// Rating filter options (used by Rating filter UI)
export const ratings = [5, 4, 3, 2, 1];

export const reviews = [
  { productid: 1, rating: 4.5 },
  { productid: 1, rating: 2.0 },
  { productid: 2, rating: 4.5 },
  { productid: 2, rating: 2.0 },
  { productid: 3, rating: 4.5 },
  { productid: 4, rating: 4.9 },
  { productid: 5, rating: 4.9 },
  { productid: 6, rating: 4.8 },
  { productid: 7, rating: 4.9 },
  { productid: 8, rating: 4.7 },
  { productid: 9, rating: 4.5 },
  { productid: 9, rating: 4.5 },
];

export const countReviews = (productID) => {
  let sum = 0;
  reviews.forEach((review) => {
    if (review.productid === productID) sum++;
  });
  return sum;
};

// Average rating for a single product, based on its reviews
export const getAverageRating = (productID) => {
  const productReviews = reviews.filter((review) => review.productid === productID);

  if (productReviews.length === 0) return 0;

  const total = productReviews.reduce((sum, r) => sum + r.rating, 0);
  return total / productReviews.length;
};
