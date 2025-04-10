// actions
export const setProduct = (products) => ({
    type: 'SET_PRODUCTS',
    payload: products,
  });
  
  export const setCategories = (categories) => ({
    type: 'SET_CATEGORIES',
    payload: categories,
  });
  
  export const setProductsByCategory = (categoryId, products) => ({
    type: 'SET_PRODUCTS_BY_CATEGORY',
    payload: { categoryId, products },
  });

  export const setProductsByCategorySlug = (slug, products) => ({
    type: 'SET_PRODUCTS_BY_CATEGORY_SLUG',
    payload: { slug, products },
});
  
  export const setLoading = (loading) => ({
    type: 'SET_LOADING',
    payload: loading,
  });
  