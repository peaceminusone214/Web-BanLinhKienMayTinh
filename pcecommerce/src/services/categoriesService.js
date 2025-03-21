import { fetchCategories } from "../api/categoriesApi"
import { fetchProducts } from "../api/productApi";


// export const getProductsByCategory = async (slug) => {
//     const products = await getProducts();
//     const categories = await getCategories();
  
//     const category = categories.find((cat) => cat.slug === slug);
    
//     if (!category) {
//       return [];
//     }
  
//     return products.filter((product) => product.category_id === category.id);
//   };