const initialState = {
  products: [],
  categories: [],
  productsByCategory: {},
  productsByCategorySlug: {},
  loading: true,
};

const productReducer = (state = initialState, action) => {
  console.log("Reducer action: ", action);
  switch (action.type) {
    case "SET_PRODUCTS":
      return { ...state, products: action.payload };
    case "SET_CATEGORIES":
      return { ...state, categories: action.payload };
    case "SET_PRODUCTS_BY_CATEGORY":
      return {
        ...state,
        productsByCategory: {
          ...state.productsByCategory,
          [action.payload.categoryId]: action.payload.products,
        },
      };
    case "SET_PRODUCTS_BY_CATEGORY_SLUG":
      return {
        ...state,
        productsByCategorySlug: {
          ...state.productsByCategorySlug,
          [action.payload.slug]: action.payload.products,
        },
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export default productReducer;
