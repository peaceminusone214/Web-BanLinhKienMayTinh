import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./MainStyles/styleCart.css";

const Cart = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [deliveryOption, setDeliveryOption] = useState("immediate");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [products, setProducts] = useState([]);
  const [note, setNote] = useState("");

  const syncCartWithServer = async (userId, cartItems) => {
    try {
      const payload = {
        user_id: userId,
        cartItems: cartItems.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        note: note,
        deliveryDate: deliveryOption === "schedule" ? selectedDate : null,
        deliveryTime: deliveryOption === "schedule" ? selectedTime : null,
      };

      const response = await fetch(`${API_URL}/cart/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Lỗi đồng bộ giỏ hàng");
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  const fetchUserFromSession = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/session`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Không lấy được thông tin user từ session");
      }

      const data = await response.json();
      setUser(data.user); // Lưu user vào state
    } catch (error) {
      console.error("Lỗi lấy user từ session: ", error);
    }
  };

  useEffect(() => {
    fetchUserFromSession();
  }, []);

  // Khi user đăng nhập, đồng bộ giỏ hàng
  useEffect(() => {
    if (user && cartItems.length > 0) {
      // user đã được định nghĩa
      const cartItemsWithPrice = cartItems.map((item) => {
        const product = products.find((p) => p._id === item.id);
        return product ? { ...item, price: product.price } : item;
      });

      syncCartWithServer(user.userId, cartItemsWithPrice);
    }
  }, [user, cartItems, products, note]);

  // Lấy giỏ hàng từ localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];

    // Đảm bảo mỗi sản phẩm có quantity mặc định là 1
    const cartWithQuantity = storedCart.map((item) => ({
      id: item.id,
      quantity: item.quantity ?? 1, // Nếu chưa có quantity, đặt mặc định là 1
    }));

    setCartItems(cartWithQuantity);
    localStorage.setItem("cart", JSON.stringify(cartWithQuantity));
    // Lấy thông tin sản phẩm từ backend
    const fetchProductDetails = async () => {
      const ids = cartWithQuantity.map((item) => item.id);
      const productDetails = [];

      for (let id of ids) {
        try {
          const response = await fetch(`${API_URL}/product/${id}`);
          if (response.ok) {
            const product = await response.json();
            productDetails.push(product);
          } else {
            console.error(`Product with id ${id} not found`);
          }
        } catch (error) {
          console.error(`Error fetching product with id ${id}:`, error);
        }
      }

      setProducts(productDetails);
    };

    fetchProductDetails();
  }, []);

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

  // Lưu giỏ hàng vào localStorage
  const updateLocalStorage = (updatedCart) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Lưu cả id và quantity
    setCartItems(updatedCart);
  };

  // Tăng, giảm số lượng
  const handleIncreaseQuantity = (productId) => {
    setCartItems((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      );
      updateLocalStorage(updatedCart);
      return updatedCart;
    });
  };

  const handleDecreaseQuantity = (productId) => {
    setCartItems((prevCart) => {
      const updatedCart = prevCart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.max(1, item.quantity - 1) }
            : item
        )
        .filter((item) => item.quantity > 0);

      updateLocalStorage(updatedCart);
      return updatedCart;
    });
  };

  // Xoá 1 sản phẩm
  const handleRemove = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    updateLocalStorage(updatedCart);

    setProducts((prevProducts) => prevProducts.filter((p) => p._id !== id));
  };

  useEffect(() => {
    if (user) {
      const localCart = JSON.parse(localStorage.getItem("cart")) || [];

      // Đảm bảo mỗi sản phẩm có quantity mặc định là 1
      const normalizedLocalCart = localCart.map((item) => ({
        id: item.id,
        quantity: item.quantity ?? 1,
      }));

      const fetchUserCart = async () => {
        try {
          const response = await fetch(`${API_URL}/cart/get/${user.userId}`);
          if (!response.ok) throw new Error("Không thể lấy giỏ hàng từ server");

          const serverCart = await response.json();
          const serverCartItems = serverCart.items.map((item) => ({
            id: item.product_id, // Chuyển đổi `product_id` từ server về `id`
            quantity: item.quantity,
          }));

          // Cập nhật note vào state
          if (serverCart.note) {
            setNote(serverCart.note);
          }

          // Kiểm tra nếu localStorage đã được merge trước đó
          const storedMergedCart = JSON.parse(
            localStorage.getItem("mergedCart")
          );
          if (
            storedMergedCart &&
            JSON.stringify(storedMergedCart) === JSON.stringify(serverCartItems)
          ) {
            setCartItems(storedMergedCart);
            return;
          }

          // Merge giỏ hàng: Cộng dồn số lượng nếu bị trùng id
          const mergedCartMap = new Map();

          // Thêm sản phẩm từ serverCart vào Map
          serverCartItems.forEach((item) => {
            mergedCartMap.set(item.id, item.quantity);
          });

          // Thêm sản phẩm từ localStorage vào Map, cộng dồn số lượng nếu trùng id
          normalizedLocalCart.forEach((localItem) => {
            if (mergedCartMap.has(localItem.id)) {
              mergedCartMap.set(
                localItem.id,
                mergedCartMap.get(localItem.id) + localItem.quantity
              );
            } else {
              mergedCartMap.set(localItem.id, localItem.quantity);
            }
          });

          // Chuyển Map thành array
          const mergedCart = Array.from(mergedCartMap, ([id, quantity]) => ({
            id,
            quantity,
          }));

          // Lưu trạng thái merge để tránh merge lại khi refresh
          localStorage.setItem("mergedCart", JSON.stringify(mergedCart));
          localStorage.setItem("cart", JSON.stringify(mergedCart));
          setCartItems(mergedCart);

          // Gửi giỏ hàng đã merge lên server
          await fetch(`${API_URL}/cart/sync`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: user.userId,
              cartItems: mergedCart.map((item) => ({
                product_id: item.id,
                quantity: item.quantity,
              })),
              note: serverCart.note || "",
            }),
          });
        } catch (error) {
          console.error("Lỗi khi đồng bộ giỏ hàng:", error);
        }
      };

      fetchUserCart();
    }
  }, [user]);

  // Tính tổng tiền giỏ hàng
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const product = products.find(
        (p) => p._id === item.id || p._id === item.product_id
      );
      return product ? total + product.price * item.quantity : total;
    }, 0);
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
    "06:00 PM - 08:00 PM",
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
    if (
      window.confirm(
        "Bạn có chắc chắn muốn xóa tất cả sản phẩm trong giỏ hàng không?"
      )
    ) {
      setCartItems([]);
      localStorage.removeItem("cart");
    }
  };

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
