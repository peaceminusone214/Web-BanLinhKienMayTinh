import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MainStyles/styleCheckOut.css";

function Checkout() {
  const [telegramConnected, setTelegramConnected] = useState(false);
  const [telegramConnectLink, setTelegramConnectLink] = useState("");
  const [orderSuccessId, setOrderSuccessId] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  // Trạng thái người dùng
  const [user, setUser] = useState(null);

  // Thông tin giao hàng
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  // Địa chỉ (Tỉnh/TP, Quận/Huyện, Phường/Xã)
  const [locations, setLocations] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  // Giỏ hàng
  const [cartItems, setCartItems] = useState([]);
  const [productDetails, setProductDetails] = useState([]);

  // Mã giảm giá
  const [couponCode, setCouponCode] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [shippingFee, setShippingFee] = useState(50000);
  const [VAT, setVAT] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  // Phương thức vận chuyển & thanh toán
  //const [shippingMethod, setShippingMethod] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  useEffect(() => {
    if (locations.length === 0) {
      return;
    }

    if (selectedProvince && selectedDistrict && selectedWard) {
      // Tìm tỉnh/thành phố
      const province = locations.find(
        (p) => String(p.code) === String(selectedProvince)
      );
      const provinceName = province ? province.name : "";

      // Tìm quận/huyện
      const district = province?.districts?.find(
        (d) => String(d.code) === String(selectedDistrict)
      );
      const districtName = district ? district.name : "";

      // Tìm phường/xã
      const ward = district?.wards?.find(
        (w) => String(w.code) === String(selectedWard)
      );
      const wardName = ward ? ward.name : "";

      // Lấy dữ liệu cũ từ `localStorage` để giữ lại các trường khác
      const existingOrderInfo =
        JSON.parse(localStorage.getItem("orderInfo")) || {};
      // Lưu vào localStorage
      const updatedOrderInfo = {
        ...existingOrderInfo,
        fullName,
        phone,
        email,
        address,
        selectedProvince,
        selectedProvinceName: provinceName || "(Không tìm thấy)",
        selectedDistrict,
        selectedDistrictName: districtName || "(Không tìm thấy)",
        selectedWard,
        selectedWardName: wardName || "(Không tìm thấy)",
        paymentMethod,
      };

      localStorage.setItem("orderInfo", JSON.stringify(updatedOrderInfo));
    }
  }, [
    fullName,
    phone,
    email,
    address,
    selectedProvince,
    selectedDistrict,
    selectedWard,
    paymentMethod,
    locations,
  ]);

  useEffect(() => {
    if (productDetails.length === 0) return;

    let newSubtotal = productDetails.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    let newVAT = (newSubtotal - discountAmount) * 0.1; // VAT 10%
    let newTotalAmount = newSubtotal - discountAmount + newVAT + shippingFee;

    setSubtotal(newSubtotal);
    setVAT(newVAT);
    setTotalAmount(newTotalAmount);
  }, [productDetails, discountAmount, shippingFee]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Gọi API session để lấy thông tin user ban đầu
        const sessionResponse = await fetch(`${API_URL}/auth/session`, {
          credentials: "include",
        });
        if (!sessionResponse.ok) throw new Error("Lỗi khi lấy dữ liệu session");

        const sessionData = await sessionResponse.json();
        let user = sessionData.user;

        if (user?.userId) {
          // Gọi API bổ sung thông tin user
          const userResponse = await fetch(`${API_URL}/user/get-user/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.userId }),
          });

          if (userResponse.ok) {
            const additionalUserData = await userResponse.json();
            user = { ...user, ...additionalUserData }; // Gộp dữ liệu từ cả hai API
          } else {
            console.warn(
              "Không thể lấy dữ liệu user bổ sung, giữ lại dữ liệu session"
            );
          }
        }

        setFullName(user.name);
        setPhone(user.phoneNumber);
        setEmail(user.email);
        setAddress(user.address.street);

        setUser(user);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu user:", error);
        setUser(null);
      }
    };

    fetchUserData();
  }, []);

  // Lấy thông tin sản phẩm từ API
  useEffect(() => {
    const fetchProductDetails = async () => {
      const fetchedProducts = await Promise.all(
        cartItems.map(async (item) => {
          const response = await fetch(`${API_URL}/product/${item.id}`);
          if (response.ok) {
            const product = await response.json();
            return { ...item, product }; // Kết hợp thông tin sản phẩm với item
          } else {
            return item; // Nếu không lấy được thông tin, vẫn trả về item gốc
          }
        })
      );
      setProductDetails(fetchedProducts);
    };

    if (cartItems.length > 0) {
      fetchProductDetails();
    }
  }, [cartItems, API_URL]);

  // Lấy danh sách địa chỉ từ JSON
  useEffect(() => {
    fetch("./assets/data/locations.json")
      .then((res) => res.json())
      .then((data) => setLocations(data))
      .catch((err) => console.error("Error fetching locations:", err));
  }, []);

  // Hàm lấy danh sách quận/huyện
  const getDistricts = () => {
    if (!selectedProvince) return [];
    const province = locations.find((p) => p.code == selectedProvince);
    return province ? province.districts : [];
  };

  // Hàm lấy danh sách phường/xã
  const getWards = () => {
    if (!selectedDistrict) return [];
    const district = getDistricts().find((d) => d.code == selectedDistrict);
    return district ? district.wards : [];
  };

  const isAddressSelected =
    selectedProvince && selectedDistrict && selectedWard;

  const handleApplyDiscount = async () => {
    if (!couponCode) {
      alert("Vui lòng nhập mã giảm giá!");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/discount/apply-discount`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          discount_code: couponCode,
          products: cartItems.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setDiscountAmount(result.discount_amount);

        // Lấy dữ liệu orderInfo cũ từ localStorage
        const existingOrderInfo =
          JSON.parse(localStorage.getItem("orderInfo")) || {};

        // Cập nhật chỉ mã giảm giá, giữ nguyên các key cũ
        const updatedOrderInfo = {
          ...existingOrderInfo,
          discount_code: couponCode, // Lưu mã giảm giá
        };

        // Lưu lại vào localStorage
        localStorage.setItem("orderInfo", JSON.stringify(updatedOrderInfo));
      } else {
        setDiscountAmount(0);
      }
    } catch (error) {
      console.error("Lỗi khi áp dụng mã giảm giá:", error);
      setDiscountAmount(0);
    }
  };

  const handleTelegramConnection = async () => {
    try {
      if (telegramConnectLink) {
        window.open(telegramConnectLink, "_blank");
        return;
      }

      let token = localStorage.getItem("telegramGuestToken");

      if (!token) {
        token =
          Math.random().toString(36).substring(2) + Date.now().toString(36);
        localStorage.setItem("telegramGuestToken", token);
      }

      const link = `https://t.me/Auchobot_bot?start=${token}`;
      setTelegramConnectLink(link);
      setTelegramConnected(true);
      window.open(link, "_blank");
    } catch (error) {
      console.error("❌ Lỗi kết nối Telegram:", error);
      alert("Không thể kết nối Telegram lúc này. Thử lại sau.");
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const orderInfo = JSON.parse(localStorage.getItem("orderInfo")) || {};
      const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

      if (cartItems.length === 0) {
        alert("Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi đặt hàng!");
        return;
      }

      const orderData = {
        user_id: user?._id || null,
        products: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
        fullName: orderInfo.fullName,
        phone: orderInfo.phone,
        email: orderInfo.email,
        discount_code: orderInfo.discount_code,
        shipping_fee: shippingFee,
        VAT,
        payment_method: orderInfo.paymentMethod,
        payment_status: "Unpaid",
        order_status: "Pending",
        note: orderInfo.note || "",
        deliveryDate: orderInfo.deliveryDate || "",
        deliveryTime: orderInfo.deliveryTime || "",
        shipping_address: {
          street: orderInfo.address || "",
          province: orderInfo.selectedProvinceName || "",
          city: orderInfo.selectedDistrictName || "",
          ward: orderInfo.selectedWardName || "",
        },
        note: telegramConnected
          ? `guestToken=${localStorage.getItem("telegramGuestToken")}`
          : "",
        sendTelegram: telegramConnected,
      };

      console.log("📦 Dữ liệu đơn hàng gửi đi:", orderData);

      const response = await fetch(`${API_URL}/order/add-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([orderData]),
      });

      const result = await response.json();
      console.log("📥 API result:", result);

      // 👉 Xử lý Telegram
      if (result.telegramConnectionInfo?.length > 0) {
        const link = result.telegramConnectionInfo[0].connectionLink;
        console.log("📨 Gợi ý kết nối Telegram:", link);
        setTelegramConnectLink(link);
      }

      if (response.ok) {
        alert(`🎉 Đặt hàng thành công! Mã đơn hàng: ${result.orders[0]._id}`);

        localStorage.removeItem("cart");
        localStorage.removeItem("orderInfo");
        localStorage.removeItem("mergedCart");

        navigate("/");
      } else {
        alert(`❌ Lỗi khi đặt hàng: ${result.message}`);
      }
    } catch (error) {
      console.error("❌ Lỗi khi gửi đơn hàng:", error);
      alert("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!");
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Giỏ hàng trống. Vui lòng thêm sản phẩm!");
      return;
    }

    if (paymentMethod === "VNPAY") {
      try {
        const paymentData = {
          user: user?._id || null,
          fullName,
          email,
          products: cartItems.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
          })),
          amount: totalAmount,
          language: "vn",
          bankCode: "VNPAY",
          sendTelegram: telegramConnected,
          shippingAddress: {
            street: address,
            province: selectedProvince,
            city: selectedDistrict,
            ward: selectedWard,
          },
        };

        const response = await fetch(
          `${API_URL}/payment/create_order_payment`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(paymentData),
          }
        );

        const result = await response.json();

        if (result.telegramConnectLink) {
          console.log("Telegram link từ BE:", result.telegramConnectLink);
          setTelegramConnectLink(result.telegramConnectLink);
        }
        if (result.paymentUrl) {
          window.location.href = result.paymentUrl;
        } else {
          alert("Không nhận được đường dẫn thanh toán từ server!");
        }
      } catch (error) {
        console.error("Lỗi khi tạo đơn hàng VNPay:", error);
        alert(
          "Có lỗi xảy ra khi thực hiện thanh toán bằng VNPay. Vui lòng thử lại sau!"
        );
      }
    } else {
      handlePlaceOrder();
    }
  };

  return (
    <div className="checkout-page">
      {/* Breadcrumb */}
      <div className="checkout-breadcrumb">
        <span>Giỏ hàng</span>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">Thông tin giao hàng</span>
      </div>

      <h1 className="checkout-title-top">
        PC Shop - Phụ kiện Máy Tính | Build PC
      </h1>

      <div className="checkout-container">
        {/* Cột trái: Form */}
        <div className="checkout-left">
          <h2 className="checkout-section-title">Thông tin giao hàng</h2>

          {user ? (
            <h2></h2>
          ) : (
            <div className="checkout-login-notice">
              Bạn có tài khoản? <a href="/login">Đăng nhập</a>
            </div>
          )}

          {/* Họ tên, SĐT, Email, Địa chỉ cụ thể */}
          <div className="form-group-CO">
            <label>Họ và tên</label>
            <input
              type="text"
              placeholder="VD: Nguyễn Văn A"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="form-group-CO">
            <label>Số điện thoại</label>
            <input
              type="text"
              placeholder="VD: 0123456789"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="form-group-CO">
            <label>Email</label>
            <input
              type="email"
              placeholder="VD: email@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group-CO">
            <label>Địa chỉ cụ thể</label>
            <input
              type="text"
              placeholder="Số nhà, đường..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* Location Selector */}
          <div className="location-selector">
            <div className="form-group-CO">
              <label>Tỉnh/Thành phố</label>
              <select
                value={selectedProvince}
                onChange={(e) => {
                  setSelectedProvince(e.target.value);
                  setSelectedDistrict("");
                  setSelectedWard("");
                }}
              >
                <option value="">-- Chọn tỉnh/thành phố --</option>
                {locations.map((province) => (
                  <option key={province.code} value={province.code}>
                    {province.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group-CO">
              <label>Quận/Huyện</label>
              <select
                value={selectedDistrict}
                onChange={(e) => {
                  setSelectedDistrict(e.target.value);
                  setSelectedWard("");
                }}
              >
                <option value="">-- Chọn quận/huyện --</option>
                {getDistricts().map((district) => (
                  <option key={district.code} value={district.code}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group-CO">
              <label>Phường/Xã</label>
              <select
                value={selectedWard}
                onChange={(e) => {
                  setSelectedWard(e.target.value);
                }}
              >
                <option value="">-- Chọn phường/xã --</option>
                {getWards().map((ward) => (
                  <option key={ward.code} value={ward.code}>
                    {ward.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Phương thức vận chuyển */}
          <h2 className="checkout-section-title">Phương thức vận chuyển</h2>
          {/* Nếu chưa chọn đủ địa chỉ => box trống
              Nếu đủ => hiển thị radio "Giao hàng tận nơi (1đ)" */}
          {!isAddressSelected ? (
            <div className="shipping-empty-box">
              <img
                src="/assets/icons/shipping-box.png"
                alt="shipping-box"
                className="shipping-empty-icon"
              />
              <p>
                Vui lòng chọn Tỉnh / Thành để có danh sách phương thức vận
                chuyển.
              </p>
            </div>
          ) : (
            <div className="shipping-method-box">
              <div className="shipping-item">
                <label className="shipping-label">
                  <input type="radio" name="shippingMethod" value="giaoHang" />
                  <span className="checkmark"></span>
                  Giao hàng tận nơi
                  <span className="shipping-fee">1đ</span>
                </label>
              </div>
            </div>
          )}

          {/* Phương thức thanh toán */}
          <h2 className="checkout-section-title">Phương thức thanh toán</h2>
          <div className="form-group-radio">
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
              />
              <img
                src="./assets/icons/cod-icon.svg"
                alt="COD Icon"
                className="payment-icon"
              />
              Thanh toán khi nhận hàng (COD)
            </label>
          </div>
          <div className="form-group-radio">
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="Bank Transfer"
                checked={paymentMethod === "Bank Transfer"}
                onChange={() => setPaymentMethod("Bank Transfer")}
              />
              <img
                src="./assets/icons/bank-icon.svg"
                alt="Bank Icon"
                className="payment-icon"
              />
              Chuyển khoản qua ngân hàng
            </label>
          </div>

          {/**VNPAY method */}
          <div className="form-group-radio">
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="VNPAY"
                checked={paymentMethod === "VNPAY"}
                onChange={() => setPaymentMethod("VNPAY")}
              />
              <img
                src="./assets/icons/vnpay-icon.svg"
                alt="VNPAY Icon"
                className="payment-icon"
              />
              Thanh toán qua VNPAY
            </label>
          </div>

          <button
            className={`telegram-connect-btn ${
              telegramConnected ? "connected" : ""
            }`}
            onClick={handleTelegramConnection}
          >
            {telegramConnected ? (
              <>
                <i className="fas fa-check-circle"></i>
                Đã kết nối Telegram
              </>
            ) : (
              <>
                <i className="fab fa-telegram-plane"></i>
                Kết nối Telegram để nhận thông báo
              </>
            )}
          </button>

          <button className="checkout-button" onClick={handleCheckout}>
            Hoàn tất đơn hàng
          </button>
        </div>

        {/* Cột phải: Tóm tắt đơn hàng */}
        <div className="checkout-right">
          <div className="order-summary">
            <h3>Đơn hàng của bạn</h3>
            {productDetails.map((item) => (
              <div className="order-item" key={item.id}>
                <div className="order-item-info">
                  <span>{item.product.product_name}</span>
                  <span>x {item.quantity}</span>
                </div>
                <div className="order-item-price">
                  {(item.product.price * item.quantity).toLocaleString()} đ
                </div>
              </div>
            ))}
            <div className="coupon-box">
              <input
                type="text"
                placeholder="Mã giảm giá"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button onClick={handleApplyDiscount}>Sử dụng</button>
            </div>
            <div className="price-row">
              <span>Tạm tính</span>
              <strong>{subtotal.toLocaleString()} đ</strong>
            </div>
            <div className="price-row discount-row">
              <span>Giảm giá</span>
              <strong>-{discountAmount.toLocaleString()} đ</strong>
            </div>
            <div className="price-row">
              <span>Thuế (VAT 10%)</span>
              <strong>+{VAT.toLocaleString()} đ</strong>
            </div>
            <div className="price-row">
              <span>Phí vận chuyển</span>
              <strong>+{shippingFee.toLocaleString()} đ</strong>
            </div>
            <div className="price-row total-row">
              <span>Tổng cộng</span>
              <strong>{totalAmount.toLocaleString()} đ</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
