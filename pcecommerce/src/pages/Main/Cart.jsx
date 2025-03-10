import React, { useState, useEffect } from "react";
import "./styleCart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  // Lấy dữ liệu giỏ hàng từ localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  // Nếu giỏ hàng trống, hiển thị giao diện trống như hiện tại
  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        {/* Thanh điều hướng */}
        <div className="breadcrumb-container1">
          <a href="/" className="breadcrumb-link1">Trang chủ</a>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">Thông tin giỏ hàng</span>
        </div>
        <div className="cart-container">
          <h1 className="cart-title">GIỎ HÀNG</h1>
          <div className="cart-content">
            <img
              src="../assets/interface-main/images/empty_cart.png"
              alt="Empty Cart"
              className="cart-image"
            />
            <p className="cart-message">Không có sản phẩm nào trong giỏ hàng của bạn</p>
            <button className="cart-button">TIẾP TỤC MUA HÀNG</button>
          </div>
        </div>
      </div>
    );
  }

  // Nếu có sản phẩm, hiển thị danh sách sản phẩm
  return (
    <div className="cart-page">
      {/* Thanh điều hướng */}
      <div className="breadcrumb-container1">
        <a href="/" className="breadcrumb-link1">Trang chủ</a>
        <span className="breadcrumb-separator">›</span>
        <span className="breadcrumb-current">Thông tin giỏ hàng</span>
      </div>
      <div className="cart-container">
        <h1 className="cart-title">GIỎ HÀNG</h1>
        <div className="cart-items">
          {cartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <img src={item.image} alt={item.name} className="cart-item-image" />
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p>Giá: {item.price} VND</p>
                <p>Số lượng: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="checkout-button">TIẾN HÀNH THANH TOÁN</button>
      </div>
    </div>
  );
};

export default Cart;
