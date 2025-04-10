import React from 'react';
import CardProduct from '../components/CardProduct';

const ProductList = ({ products}) => {
  if (!products || products.length === 0) {
    return <p style={{ padding: '20px', fontStyle: 'italic' }}>Không có sản phẩm nào để hiển thị.</p>;
  }

  return (
    <div className="homepage-collection-swiper" style={{ width: "1220px" }}>
      <div className="grid grid--6-cols" id="js-collection-product">
        {products.map(product => (
          <CardProduct
            key={product._id}
            product={product}
           
          />))}
      </div>
    </div>
  );
};

export default ProductList;
