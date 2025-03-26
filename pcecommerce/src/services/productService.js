import { fetchProducts } from "../api/productApi";


export const getAllProducts = async () =>{
    const products = await fetchProducts();
    return products;
}

export const getProductById= async (id) =>{
    const products = await fetchProducts();
    return products.find(product => product.id === id);
}





