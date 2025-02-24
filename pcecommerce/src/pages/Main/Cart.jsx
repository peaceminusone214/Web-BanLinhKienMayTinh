import React, { useState } from 'react';
import './styleCart.css'; 
function Cart() {
  // Giả lập dữ liệu sản phẩm để thêm vào giỏ hàng
  const products = [
    { id: 1, name: 'Laptop', price: 1000 },
    { id: 2, name: 'Computer', price: 500 },
    { id: 3, name: 'Smartphone', price: 700 },
  ];

  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const calculateTotal = () => {
    return cart.reduce((total, product) => total + product.price, 0);
  };

  return (
    <div className="cart-container">
      <h1 className="cart-title">Giỏ hàng</h1>

      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="product-item">
            <span>{product.name} - ${product.price}</span>
            <button onClick={() => addToCart(product)} className="add-to-cart-btn">Thêm vào giỏ hàng</button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3>Tổng tiền</h3>
        {cart.length === 0 ? (
          <p>Giỏ hàng của bạn đang trống!</p>
        ) : (
          <div>
            <ul>
              {cart.map((product, index) => (
                <li key={index}>{product.name} - ${product.price}</li>
              ))}
            </ul>
            <p>Total: ${calculateTotal()}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
