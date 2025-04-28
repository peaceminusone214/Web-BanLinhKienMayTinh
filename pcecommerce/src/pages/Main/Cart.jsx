import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./MainStyles/styleCart.css";

const Cart = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [note, setNote] = useState("");
  const [deliveryOption, setDeliveryOption] = useState("immediate");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isCartMerged, setIsCartMerged] = useState(false);

  const fetchUserFromSession = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/session`, { method: "GET", credentials: "include" });
      if (!response.ok) throw new Error("Không lấy được thông tin user từ session");
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error("Lỗi lấy user từ session:", error);
    }
  };

  const fetchProductDetails = async (cartList) => {
    const ids = cartList.map((item) => item.id);
    const productDetails = [];

    for (let id of ids) {
      try {
        const response = await fetch(`${API_URL}/product/${id}`, { credentials: "include" });
        if (response.ok) {
          const product = await response.json();
          productDetails.push(product);
        }
      } catch (error) {
        console.error(`Lỗi fetch sản phẩm ${id}:`, error);
      }
    }

    setProducts(productDetails);
  };

  useEffect(() => {
    fetchUserFromSession();
  }, []);

  useEffect(() => {
    if (!user) {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      const cartWithQuantity = storedCart.map((item) => ({
        id: item.id,
        quantity: item.quantity ?? 1,
      }));

      setCartItems(cartWithQuantity);
      localStorage.setItem("cart", JSON.stringify(cartWithQuantity));
      fetchProductDetails(cartWithQuantity);
    }
  }, [user]);

  useEffect(() => {
    if (user && !isCartMerged) {
      fetchUserCart();
    }
  }, [user, isCartMerged]);

  useEffect(() => {
    const key = "cart";
    const storedCart = JSON.parse(localStorage.getItem(key)) || [];
  
    const cartWithQuantity = storedCart.map((item) => ({
      id: item.id,
      quantity: item.quantity ?? 1,
    }));
  
    setCartItems(cartWithQuantity);
    fetchProductDetails(cartWithQuantity);
  }, []);  

  const fetchUserCart = async () => {
    try {
      let localCart = [];
      const alreadyMerged = localStorage.getItem("alreadyMerged");
  
      if (alreadyMerged !== "true") {
        localCart = JSON.parse(localStorage.getItem("cart")) || [];
      }
  
      const normalizedLocalCart = localCart.map((item) => ({
        id: item.id,
        quantity: item.quantity ?? 1,
      }));
  
      const response = await fetch(`${API_URL}/cart/get/${user.userId}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Không thể lấy giỏ hàng từ server");
  
      const serverCart = await response.json();
      const serverCartItems = serverCart.items.map((item) => ({
        id: item.product_id,
        quantity: item.quantity,
      }));
  
      if (serverCart.note) {
        setNote(serverCart.note);
      }
  
      let mergedCart = serverCartItems;
  
      if (alreadyMerged !== "true" && normalizedLocalCart.length > 0) {
        const mergedCartMap = new Map();
        serverCartItems.forEach((item) => mergedCartMap.set(item.id, item.quantity));
        normalizedLocalCart.forEach((localItem) => {
          if (mergedCartMap.has(localItem.id)) {
            mergedCartMap.set(localItem.id, mergedCartMap.get(localItem.id) + localItem.quantity);
          } else {
            mergedCartMap.set(localItem.id, localItem.quantity);
          }
        });
        mergedCart = Array.from(mergedCartMap, ([id, quantity]) => ({ id, quantity }));
      
        // 👉 fetch sản phẩm trước khi sync
        await fetchProductDetails(mergedCart);
      
        // 🔥 Bây giờ mới đồng bộ
        await fetch(`${API_URL}/cart/sync`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            user_id: user.userId,
            cartItems: mergedCart.map((item) => ({
              id: item.id,
              quantity: item.quantity,
              price: products.find((p) => p._id === item.id)?.price || 0,
            })),
            note: serverCart.note || "",
          }),
        });
      
        console.log("Đã đồng bộ giỏ hàng server sau merge.");
      
        // Ghi dấu đã merge
        localStorage.removeItem("cart");
        localStorage.setItem("alreadyMerged", "true");
      }      
  
      setCartItems(mergedCart);
      setIsCartMerged(true);
  
      fetchProductDetails(mergedCart);
    } catch (error) {
      console.error("Lỗi khi đồng bộ giỏ hàng:", error);
    }
  };  

  const syncCartWithServer = async (userId, updatedCart) => {
    try {
      const payload = {
        user_id: userId,
        cartItems: updatedCart.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          price: products.find((p) => p._id === item.id)?.price || 0,
        })),
        note,
        deliveryDate: deliveryOption === "schedule" ? selectedDate : null,
        deliveryTime: deliveryOption === "schedule" ? selectedTime : null,
      };

      await fetch(`${API_URL}/cart/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      console.log("Đã đồng bộ giỏ hàng server.");
    } catch (error) {
      console.error("Lỗi khi đồng bộ giỏ hàng:", error);
    }
  };

  const updateLocalStorage = (updatedCart) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
  };

  const handleIncreaseQuantity = (productId) => {
    const updatedCart = cartItems.map((item) =>
      item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
    );

    updateLocalStorage(updatedCart);

    if (user?.userId) {
      syncCartWithServer(user.userId, updatedCart);
    }
  };

  const handleDecreaseQuantity = (productId) => {
    const updatedCart = cartItems
      .map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
      .filter((item) => item.quantity > 0);

    updateLocalStorage(updatedCart);

    if (user?.userId) {
      if (updatedCart.length > 0) {
        syncCartWithServer(user.userId, updatedCart);
      } else {
        clearCartOnServer(user.userId);
      }
    }
  };

  const clearCartOnServer = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/cart/clear-cart/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        console.log("Đã xóa toàn bộ giỏ hàng server.");
      }
    } catch (error) {
      console.error("Lỗi khi xóa giỏ hàng server:", error);
    }
  };

  const handleRemove = async (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    const updatedProducts = products.filter((p) => p._id !== id);
  
    updateLocalStorage(updatedCart);
    setProducts(updatedProducts);
  
    if (user?.userId) {
      try {
        await fetch(`${API_URL}/cart/remove-item`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            user_id: user.userId,
            product_id: id,
          }),
        });
        console.log("Đã xoá sản phẩm khỏi cart trên server:", id);
      } catch (error) {
        console.error("Lỗi khi xoá sản phẩm khỏi server:", error);
      }
    }
  };  

  const handleClearCart = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tất cả sản phẩm trong giỏ hàng không?")) {
      try {
        setCartItems([]);
        localStorage.removeItem("cart");

        if (user?.userId) {
          await clearCartOnServer(user.userId);
        }
      } catch (error) {
        console.error("Lỗi khi xóa giỏ hàng server:", error);
      }
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const product = products.find((p) => p._id === item.id);
      return product ? total + product.price * item.quantity : total;
    }, 0);
  };

  //
  useEffect(() => {
    if (deliveryOption === "schedule" && selectedDate && selectedTime) {
      setCartItems((prevCart) =>
        prevCart.map((item) => ({
          ...item,
          deliveryDate: selectedDate,
          deliveryTime: selectedTime,
        }))
      );
    } else {
      setCartItems((prevCart) =>
        prevCart.map((item) => {
          const { deliveryDate, deliveryTime, ...rest } = item;
          return rest;
        })
      );
    }
  }, [deliveryOption, selectedDate, selectedTime]);

  //
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
    "06:00 PM - 08:00 PM",
  ];

  //
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

  //
  const todayDateString = new Date().toISOString().split("T")[0];

  //
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

  useEffect(() => {
    const orderInfo = {
      note: note,
      deliveryDate: deliveryOption === "schedule" ? selectedDate : null,
      deliveryTime: deliveryOption === "schedule" ? selectedTime : null,
    };

    localStorage.setItem("orderInfo", JSON.stringify(orderInfo));
  }, [note, deliveryOption, selectedDate, selectedTime]);

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

        <div className="cart-container">
          <h1 className="cart-title">GIỎ HÀNG</h1>
          <div className="cart-content">
            <img
              src="/assets/interface-main/images/empty_cart.png"
              alt="Empty Cart"
              className="cart-image"
            />
            <p className="cart-message">
              Không có sản phẩm nào trong giỏ hàng của bạn
            </p>
            <button className="cart-button">TIẾP TỤC MUA HÀNG</button>
          </div>
        </div>
      </div>
    );
  }

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
            Bạn đang có <strong>{cartItems.length}</strong> sản phẩm trong giỏ
            hàng
          </p>

          {cartItems.map((item) => {
            const product = products.find((p) => p._id === item.id);
            return product ? (
              <div className="cart-item-row" key={item.id}>
                <div className="cart-item-image-box">
                  <img
                    src={product.image_url}
                    alt={product.product_name}
                    className="cart-item-image"
                  />
                </div>
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{product.product_name}</h3>
                  <p className="cart-item-price">
                    {(product.price * item.quantity).toLocaleString()} đ
                  </p>
                  <div className="quantity-control">
                    <button onClick={() => handleDecreaseQuantity(item.id)}>
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleIncreaseQuantity(item.id)}>
                      +
                    </button>
                  </div>
                  <button
                    className="cart-remove-button"
                    onClick={() => handleRemove(item.id)}
                  >
                    Xoá khỏi giỏ hàng
                  </button>
                </div>
              </div>
            ) : null;
          })}

          {/* Ghi chú đơn hàng */}
          <div className="cart-note">
            <label>Ghi chú đơn hàng</label>
            <textarea
              placeholder="Ví dụ: Giao hàng giờ hành chính..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
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
                    <label htmlFor="deliveryTime">
                      Chọn khung giờ giao hàng
                    </label>
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
                    {selectedDate === todayDateString &&
                      filteredTimeSlots.length === 0 && (
                        <p style={{ color: "red" }}>
                          Không còn khung giờ khả dụng cho hôm nay. Vui lòng
                          chọn ngày khác.
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

            <button
              className="cart-checkout-button"
              onClick={() => navigate("/checkout")}
            >
              THANH TOÁN
            </button>
            <div className="cart-policy">
              <p>
                <strong>Chính sách mua hàng</strong>
              </p>
              <p>
                Hiện chúng tôi có hỗ trợ giao hàng tận nơi với phí chỉ
                50.000đ/đơn (tùy khu vực)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
