export const categories = [
  { id: 1, title: "Burger", blurb: "Smashed, stacked, grilled to order" },
  { id: 2, title: "Shawarma", blurb: "Slow roasted, wrapped fresh" },
  { id: 3, title: "Pizza", blurb: "Stone baked, loaded generously" },
];

// get array of category title i.e, ['Burger', 'Shawarma', 'Pizza']
export const categoryTitle = categories.map((category) => category.title);
