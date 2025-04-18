export const addToCompare = (product) => ({
  type: "ADD_TO_COMPARE",
  payload: product,
});

export const removeFromCompare = (productId) => ({
  type: "REMOVE_FROM_COMPARE",
  payload: productId,
});
