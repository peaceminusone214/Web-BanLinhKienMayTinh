import axios from 'axios';

//base json
const BASE_URL = 'http://localhost:3000/assets/data';


export const fetchProducts = async () =>{
    try {
        // lay url base
        const response = await axios.get(`${BASE_URL}/products.json`);
        return response.data;
    } catch (error) {
        console.error("Không lấy được sản phẩm:", error);
        throw error;
    }
}

// get productsBycategory category
export const fetchProductsByCategory = async (categoryId) => {
    try {
      const response = await axios.get(`${BASE_URL}/products.json`);
      const allProducts = response.data;
  
      console.log("All products:", allProducts);
  
      return allProducts.filter(products => products.category_id === categoryId);

    } catch (error) {
      console.error("Không lấy được sản phẩm:", error);
      throw error;
    }
  };
  




 

