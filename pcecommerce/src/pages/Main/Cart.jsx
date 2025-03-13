import React, { useState, useEffect } from "react";
<<<<<<< HEAD
import "./styleCart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  // Lấy dữ liệu giỏ hàng từ localStorage
=======
import { FaTrash } from "react-icons/fa";
import "./MainStyles/styleCart.css";

const Cart = () => {
 
  // State giỏ hàng
  const [cartItems, setCartItems] = useState([]);
  // State tuỳ chọn thời gian giao hàng
  const [deliveryOption, setDeliveryOption] = useState("immediate");
  // State thời gian giao hàng
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [addedAt, setAddedAt] = useState(new Date());

  // Lấy dữ liệu giỏ hàng từ localStorage khi load trang
>>>>>>> main
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

<<<<<<< HEAD
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
=======
  // Lưu giỏ hàng vào localStorage
  const updateLocalStorage = (updatedCart) => {
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Tăng số lượng
  const handleIncrement = (id) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === id) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    updateLocalStorage(updatedCart);
  };

  // Giảm số lượng (nếu quantity > 1, trừ 1, nếu = 1 => Xoá)
  const handleDecrement = (id) => {
    const updatedCart = cartItems
      .map((item) => {
        if (item.id === id) {
          if (item.quantity > 1) {
            return { ...item, quantity: item.quantity - 1 };
          }
          return null;
        }
        return item;
      })
      .filter(Boolean);
    updateLocalStorage(updatedCart);
  };

  // Xoá 1 sản phẩm
  const handleRemove = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    updateLocalStorage(updatedCart);
  };

  // Tính tổng tiền giỏ hàng
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getMinDate = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1); 
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = now.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  };

  // Các khung giờ giao hàng
  const timeSlots = [
    "08:00 AM - 10:00 AM",
    "10:00 AM - 12:00 PM",
    "12:00 PM - 02:00 PM",
    "02:00 PM - 04:00 PM",
    "04:00 PM - 06:00 PM",
    "06:00 PM - 08:00 PM"
  ];

  const convertTo24Hour = (timeStr) => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);
    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    }
    if (modifier === "AM" && hours === 12) {
      hours = 0;
    }
    return hours + minutes / 60;
  };

  const todayDateString = new Date().toISOString().split("T")[0];
  const filteredTimeSlots =
    selectedDate === todayDateString
      ? timeSlots.filter((slot) => {
          const slotStartStr = slot.split(" - ")[0];
          const slotStart = convertTo24Hour(slotStartStr);
          const now = new Date();
          const currentHour = now.getHours() + now.getMinutes() / 60;
          const delay = 2; 
          return slotStart >= currentHour + delay;
        })
      : timeSlots;

  // Hàm xóa tất cả sản phẩm trong giỏ hàng
  const handleClearCart = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tất cả sản phẩm trong giỏ hàng không?")) {
      setCartItems([]);
      localStorage.removeItem("cart");
    }
  };

  // Nếu giỏ hàng trống
  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="breadcrumb-container1">
          <a href="/" className="breadcrumb-link1">
            Trang chủ
          </a>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">Thông tin giỏ hàng</span>
        </div>

>>>>>>> main
        <div className="cart-container">
          <h1 className="cart-title">GIỎ HÀNG</h1>
          <div className="cart-content">
            <img
<<<<<<< HEAD
              src="../assets/interface-main/images/empty_cart.png"
=======
              src="/assets/interface-main/images/empty_cart.png"
>>>>>>> main
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

<<<<<<< HEAD
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
=======
  // Nếu có sản phẩm trong giỏ
  return (
    <div className="cart-page">
      <div className="breadcrumb-container1">
        <a href="/" className="breadcrumb-link1">
          Trang chủ
        </a>
        <span className="breadcrumb-separator">›</span>
        <span className="breadcrumb-current">Thông tin giỏ hàng</span>
      </div>

      <div className="cart-main-container">
        {/* Cột trái: Danh sách sản phẩm */}
        <div className="cart-left">
          <div className="cart-header">
            <h2 className="cart-left-title">Giỏ hàng của bạn</h2>
            <button
              className="clear-cart-button"
              onClick={handleClearCart}
              title="Xóa giỏ hàng"
            >
              <FaTrash size={20} />
            </button>
          </div>
          <p className="cart-left-subtitle">
            Bạn đang có <strong>{cartItems.length}</strong> sản phẩm trong giỏ hàng
          </p>

          {cartItems.map((item) => (
            <div className="cart-item-row" key={item.id}>
              <div className="cart-item-image-box">
                <img src={item.image} alt={item.name} className="cart-item-image" />
              </div>
              <div className="cart-item-details">
                <h3 className="cart-item-name">{item.name}</h3>
                <p className="cart-item-desc">
                  Ram {item.ram} | SSD {item.ssd} | {item.otherSpec}
                </p>
                <p className="cart-item-price">
                  {item.price.toLocaleString()} đ
                </p>
                <div className="quantity-control">
                  <button onClick={() => handleDecrement(item.id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleIncrement(item.id)}>+</button>
                </div>
                <button
                  className="cart-remove-button"
                  onClick={() => handleRemove(item.id)}
                >
                  Xoá khỏi giỏ hàng
                </button>
              </div>
            </div>
          ))}

          {/* Ghi chú đơn hàng */}
          <div className="cart-note">
            <label>Ghi chú đơn hàng</label>
            <textarea placeholder="Ví dụ: Giao hàng giờ hành chính..." />
          </div>
        </div>

        {/* Cột phải: Tóm tắt đơn hàng + Thời gian giao hàng */}
        <div className="cart-right">
          <h3 className="cart-right-title">Thông tin đơn hàng</h3>
          <div className="cart-summary">
            <div className="delivery-title">THỜI GIAO HÀNG</div>
            <div className="delivery-options">
              <label className="delivery-radio">
                <input
                  type="radio"
                  name="deliveryTime"
                  value="immediate"
                  checked={deliveryOption === "immediate"}
                  onChange={() => setDeliveryOption("immediate")}
                />
                <span className="checkmark"></span>
                Giao khi có hàng
              </label>
              <label className="delivery-radio">
                <input
                  type="radio"
                  name="deliveryTime"
                  value="schedule"
                  checked={deliveryOption === "schedule"}
                  onChange={() => setDeliveryOption("schedule")}
                />
                <span className="checkmark"></span>
                Chọn thời gian
              </label>
            </div>

            {deliveryOption === "schedule" && (
              <div className="delivery-time-form">
                <div className="delivery-title">Chọn thời gian giao hàng</div>
                <div className="delivery-date">
                  <label htmlFor="deliveryDate">Chọn ngày giao hàng</label>
                  <input
                    type="date"
                    id="deliveryDate"
                    min={getMinDate()}
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedTime("");
                    }}
                  />
                </div>

                {selectedDate && (
                  <div className="delivery-time">
                    <label htmlFor="deliveryTime">Chọn khung giờ giao hàng</label>
                    <select
                      id="deliveryTime"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                    >
                      <option value="">Chọn thời gian</option>
                      {filteredTimeSlots.map((time, index) => (
                        <option key={index} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    {selectedDate === todayDateString && filteredTimeSlots.length === 0 && (
                      <p style={{ color: "red" }}>
                        Không còn khung giờ khả dụng cho hôm nay. Vui lòng chọn ngày khác.
                      </p>
                    )}
                  </div>
                )}

                {selectedDate && selectedTime && (
                  <div className="selected-delivery-info">
                    <p>
                      <strong>Ngày giao hàng:</strong> {selectedDate}
                    </p>
                    <p>
                      <strong>Khung giờ giao hàng:</strong> {selectedTime}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="cart-summary-row total-row">
              <span>Tổng tiền hàng</span>
              <strong>{calculateTotal().toLocaleString()} đ</strong>
            </div>

            <button className="cart-checkout-button" >THANH TOÁN</button>
            <div className="cart-policy">
              <p>
                <strong>Chính sách mua hàng</strong>
              </p>
              <p>
                Hiện chúng tôi có hỗ trợ giao hàng tận nơi với phí chỉ 40.000đ/đơn (tùy khu vực)
              </p>
            </div>
          </div>
        </div>
>>>>>>> main
      </div>
    </div>
  );
};

export default Cart;
