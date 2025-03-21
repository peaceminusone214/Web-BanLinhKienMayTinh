import { fetchCategories } from "../api/categoriesApi";
import { fetchProducts } from "../api/productApi";

let cachedCategories = null;
let cachedProducts = null;

const getCategories = async () => {
  if (!cachedCategories) {
    cachedCategories = await fetchCategories();
  }
  return cachedCategories;
};

const getProducts = async () => {
  if (!cachedProducts) {
    cachedProducts = await fetchProducts();
  }
  return cachedProducts;
};

export const getAllProducts = async () => {
  const products = await getProducts();
  return products;
};

export const getProductById = async (id) => {
  const products = await getProducts();
  return products.find(product => product.id === id);
};

export const getProductsByCategory = async (slug) => {
  const products = await getProducts();
  const categories = await getCategories();

  const category = categories.find((cat) => cat.slug === slug);
  
  if (!category) {
    return [];
  }

  return products.filter((product) => product.category_id === category.id);
};

export const getCategoryBySlug = async (slug) => {
  const categories = await getCategories();

  return categories.find((category) => category.slug === slug);
};



