import React, { useState, useEffect } from "react";
import "./MainStyles/styleCheckOut.css";

function Checkout() {
  // Thông tin người mua
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  // Location
  const [locations, setLocations] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState(""); 

  useEffect(() => {
    fetch("./assets/data/locations.json")
      .then((res) => res.json())
      .then((data) => setLocations(data))
      .catch((err) => console.error("Error fetching locations:", err));
  }, []);

  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
    setSelectedDistrict("");
    setSelectedWard("");
    setShippingMethod("");
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
    setSelectedWard("");
    setShippingMethod("");
  };

  const getDistricts = () => {
    if (!selectedProvince) return [];
    const province = locations.find((p) => p.code == selectedProvince);
    return province ? province.districts : [];
  };

  const getWards = () => {
    if (!selectedDistrict) return [];
    const district = getDistricts().find((d) => d.code == selectedDistrict);
    return district ? district.wards : [];
  };

  // Giỏ hàng
  const [cartItems, setCartItems] = useState([]);
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Mã giảm giá
  const [couponCode, setCouponCode] = useState("");
  const [discountValue, setDiscountValue] = useState(0);

  const handleApplyCoupon = () => {
    if (couponCode.trim().toLowerCase() === "giam10") {
      const discountAmount = calculateSubtotal() * 0.1;
      setDiscountValue(discountAmount);
      alert("Áp dụng mã giảm 10% thành công!");
    } else {
      setDiscountValue(0);
      alert("Mã giảm giá không hợp lệ!");
    }
  };

  // Phương thức vận chuyển
  // Xác định đã chọn đủ địa chỉ chưa
  const isAddressSelected = selectedProvince && selectedDistrict && selectedWard;
  // shippingMethod = "giaoHang" => phí = 1đ
  const [shippingMethod, setShippingMethod] = useState("");
  const shippingFee = shippingMethod === "giaoHang" ? 1 : 0;

  // Phương thức thanh toán
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // Tính tổng
  const totalOrder = calculateSubtotal() - discountValue + shippingFee;

  // Xử lý đặt hàng (demo)
  const handlePlaceOrder = () => {
    const orderData = {
      fullName,
      phone,
      email,
      address,
      province: selectedProvince,
      district: selectedDistrict,
      ward: selectedWard,
      shippingMethod,
      shippingFee,
      paymentMethod,
      cartItems,
      total: totalOrder,
    };
    console.log("Order Data:", orderData);
    alert("Đặt hàng thành công! (Demo)");
  };

  // Nếu giỏ hàng trống
  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-breadcrumb">
          <span>Giỏ hàng</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Thông tin giao hàng</span>
        </div>
        <h2 className="checkout-empty-title">Không có sản phẩm để thanh toán</h2>
        <a href="/cart" className="btn-back-to-cart">Quay lại giỏ hàng</a>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      {/* Breadcrumb */}
      <div className="checkout-breadcrumb">
        <span>Giỏ hàng</span>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">Thông tin giao hàng</span>
      </div>

      <h1 className="checkout-title-top">PC Shop - Phụ kiện Máy Tính | Build PC</h1>

      <div className="checkout-container">
        {/* Cột trái: Form */}
        <div className="checkout-left">
          <h2 className="checkout-section-title">Thông tin giao hàng</h2>
          <div className="checkout-login-notice">
            Bạn có tài khoản? <a href="/login">Đăng nhập</a>
          </div>

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
                  setShippingMethod("");
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
                  setShippingMethod("");
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
                  setShippingMethod("");
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
              <p>Vui lòng chọn Tỉnh / Thành để có danh sách phương thức vận chuyển.</p>
            </div>
          ) : (
            <div className="shipping-method-box">
              <div className="shipping-item">
                <label className="shipping-label">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="giaoHang"
                    checked={shippingMethod === "giaoHang"}
                    onChange={() => setShippingMethod("giaoHang")}
                  />
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
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={() => setPaymentMethod("cod")}
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
                value="bank"
                checked={paymentMethod === "bank"}
                onChange={() => setPaymentMethod("bank")}
              />
              <img 
                src="./assets/icons/bank-icon.svg" 
                alt="Bank Icon" 
                className="payment-icon" 
              />
              Chuyển khoản qua ngân hàng
            </label>
          </div>


          <button className="checkout-button" onClick={handlePlaceOrder}>
            Hoàn tất đơn hàng
          </button>
        </div>

        {/* Cột phải: Tóm tắt đơn hàng */}
        <div className="checkout-right">
          <div className="order-summary">
            <h3>Đơn hàng của bạn</h3>
            {cartItems.map((item) => (
              <div className="order-item" key={item.id}>
                <div className="order-item-info">
                  <span>{item.name}</span>
                  <span>x {item.quantity}</span>
                </div>
                <div className="order-item-price">
                  {(item.price * item.quantity).toLocaleString()} đ
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
              <button onClick={handleApplyCoupon}>Sử dụng</button>
            </div>
            <div className="price-row">
              <span>Tạm tính</span>
              <strong>{calculateSubtotal().toLocaleString()} đ</strong>
            </div>
            {discountValue > 0 && (
              <div className="price-row discount-row">
                <span>Giảm giá</span>
                <strong>- {discountValue.toLocaleString()} đ</strong>
              </div>
            )}
            <div className="price-row">
              <span>Phí vận chuyển</span>
              {/* shippingFee = 1 nếu shippingMethod === 'giaoHang', ngược lại 0 */}
              <strong>{shippingFee.toLocaleString()} đ</strong>
            </div>
            <div className="price-row total-row">
              <span>Tổng cộng</span>
              <strong>{totalOrder.toLocaleString()} đ</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
