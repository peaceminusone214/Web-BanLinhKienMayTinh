import React, { useEffect, useState } from 'react';
import CardProduct from '../components/CardProduct';
import { fetchProducts, fetchProductsByCategory} from '../api/productApi';


const ProductList = ({categoryId}) => {
  const [products, setProducts] = useState([]);

  // useEffect(() => {
  //   const loadProducts = async () => {
  //     const data = await fetchProducts();
  //     setProducts(data);
  //   };

  //   loadProducts();
  // }, []);


  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProductsByCategory(categoryId);
      setProducts(data); // Lọc chỉ lấy sản phẩm của category tương ứng
    };

    loadProducts();
  }, [categoryId]);


  return (
    <div className="homepage-collection-swiper" style={{ width: "1220px" }}>
      <div className="grid grid--6-cols" id="js-collection-product" >
        {products.map(product => (
          
          <CardProduct key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
