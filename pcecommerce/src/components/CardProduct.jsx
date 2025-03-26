import React from 'react';
import "./css/styleCardProduct.css"


const CardProduct = ({ product }) => (
  <div className="swiper-slide min-width-0">
    <div className="product p-item" data-id={product.id} data-type="product" >
      <a href={`/product/${product.id}`} className="p-img">
        <img src={product.img} alt={product.name} />
        <div className="p-sale-off ms-2">
          <p className="font-weight-500 text-uppercase">
            Tiết kiệm
            <span className="d-block text-12 font-weight-bold color-white">{product.discount}</span>
          </p>
        </div>
      </a>
      <div className="p-content">
        <a href={`/product/${product.id}`}>
          <h3 className="p-name line-clamp-2">{product.name}</h3>
        </a>
        <p className="p-price color-secondary font-weight-bold text-20">
          {product.price}
        </p>
        <span className="p-market-price">{product.oldPrice}</span>
        <span className="p-market-sale color-secondary" style={{ marginLeft: "4px", fontSize: "13px", color: "blue" }}>
          {product.discount}
        </span>
        <div className="p-box d-flex align-items-center justify-content-between">
          <div className="wrapper">
            <p className="color-green">{product.status}</p>
            <a href="javascript:;" className="p-compare color-primary" data-id={product.id}>
              <span>+</span> So sánh
            </a>
          </div>
          <a href="javascript:;" className="btn-cart-sp d-flex align-items-center justify-content-center" >
            <i className="static-icon static-icon-cart"></i>
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default CardProduct;
