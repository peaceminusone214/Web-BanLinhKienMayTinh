import React, { useEffect, useState } from "react";
import "./MainStyles/styleOrderConfirm.css"; 

function OrderConfirm() {
  const [orderData, setOrderData] = useState(null);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    // Lấy orderData từ localStorage
    const storedOrder = JSON.parse(localStorage.getItem("orderData")) || null;
    setOrderData(storedOrder);

    // Lấy dữ liệu locations từ file JSON
    fetch("./assets/data/locations.json")
      .then((res) => res.json())
      .then((data) => setLocations(data))
      .catch((err) => console.error("Error fetching locations:", err));
  }, []);

  // Hàm gửi thông báo qua Telegram sử dụng chat id từ localStorage
  const sendTelegramNotification = (message) => {
    const botToken = ' 7554280635:AAH8pZ27TGvwnEYSlFBk6mtNou7AsBPz7Zs'; // Ví dụ: 7554280635:AAH8pZ27TGvwnEYSlFBk6mtNou7AsBPz7Zs
    const chatId = localStorage.getItem("userChatId") || ' 7553767686'; // Ví dụ: 7553767686
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message
      })
    })
    .then(response => response.json())
    .then(data => console.log("Telegram notification sent:", data))
    .catch(error => console.error("Error sending Telegram notification:", error));
  };

  // Gửi thông báo Telegram khi có dữ liệu đơn hàng
  useEffect(() => {
    if (orderData) {
      const message = `Đơn hàng mới:\nTên: ${orderData.fullName}\nSĐT: ${orderData.phone}\nEmail: ${orderData.email}\nĐịa chỉ: ${orderData.address}\nTổng cộng: ${orderData.total}`;
      sendTelegramNotification(message);
    }
  }, [orderData]);

  if (!orderData) {
    return (
      <div className="confirm-page">
        <h2>Không có dữ liệu đơn hàng</h2>
        <a href="/" className="btn-home">Quay về trang chủ</a>
      </div>
    );
  }

  // Destructure orderData – các giá trị province, district, ward là mã (code)
  const {
    fullName,
    phone,
    email,
    address,
    province: provCode,
    district: distCode,
    ward: wardCode,
    shippingMethod,
    paymentMethod,
    shippingFee,
    cartItems,
    total,
  } = orderData;

  // Helper functions: chuyển mã sang tên dựa trên locations.json
  const getProvinceName = (code) => {
    const prov = locations.find((p) => p.code == code);
    return prov ? prov.name : code;
  };

  const getDistrictName = (provCode, distCode) => {
    const prov = locations.find((p) => p.code == provCode);
    if (prov && prov.districts) {
      const district = prov.districts.find((d) => d.code == distCode);
      return district ? district.name : distCode;
    }
    return distCode;
  };

  const getWardName = (provCode, distCode, wardCode) => {
    const prov = locations.find((p) => p.code == provCode);
    if (prov && prov.districts) {
      const district = prov.districts.find((d) => d.code == distCode);
      if (district && district.wards) {
        const ward = district.wards.find((w) => w.code == wardCode);
        return ward ? ward.name : wardCode;
      }
    }
    return wardCode;
  };

  const displayProvince = getProvinceName(provCode);
  const displayDistrict = getDistrictName(provCode, distCode);
  const displayWard = getWardName(provCode, distCode, wardCode);

  // Tính tạm tính đơn hàng
  const tempSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const orderId = "98765"; // Demo: mã đơn hàng

  // Xử lý hiển thị phương thức thanh toán dựa trên giá trị paymentMethod
  const renderPaymentMethod = () => {
    if (paymentMethod === "cod") {
      return "Thanh toán khi nhận hàng (COD)";
    } else if (paymentMethod === "bank") {
      return "Chuyển khoản qua ngân hàng";
    } else if (paymentMethod === "vnpay") {
      return "Thanh toán qua VNPAY";
    } else {
      return paymentMethod;
    }
  };

  return (
    <div className="confirm-page">
      <div className="confirm-container">
        <div className="confirm-left">
          <div className="confirm-thankyou">
            <img
              src="/assets/icons/check-green.png"
              alt="Đã đặt hàng"
              className="confirm-check-icon"
            />
            <h1 className="confirm-title">Cảm ơn bạn đã đặt hàng</h1>
            <p className="confirm-subtitle">
              Mã đơn hàng #{orderId} - Xác nhận đã gửi tới email của bạn
            </p>
          </div>

          <div className="confirm-details">
            <div className="detail-row">
              <div className="detail-box">
                <h3>Thông tin mua hàng</h3>
                <p>{fullName}</p>
                <p>{phone}</p>
                <p>{email}</p>
              </div>
              <div className="detail-box">
                <h3>Địa chỉ nhận hàng</h3>
                <p>{address}</p>
                <p>
                  {displayWard}, {displayDistrict}, {displayProvince}
                </p>
              </div>
            </div>
            <div className="detail-row">
              <div className="detail-box">
                <h3>Phương thức thanh toán</h3>
                <p>{renderPaymentMethod()}</p>
              </div>
              <div className="detail-box">
                <h3>Phương thức vận chuyển</h3>
                <p>
                  {shippingMethod === "giaoHang"
                    ? "Giao hàng tận nơi (1đ) - Dự kiến 2-4 ngày"
                    : "Chưa chọn"}
                </p>
              </div>
            </div>
          </div>

          <div className="confirm-actions">
            <button className="btn-primary">Tiếp tục mua hàng</button>
            <button className="btn-primary">In</button>
            <button className="btn-primary">Xuất hoá đơn</button>
          </div>
        </div>

        {/* Cột phải: Tóm tắt đơn hàng */}
        <div className="confirm-right">
          <div className="order-summary-box">
            <h2>Đơn hàng #{orderId}</h2>
            {cartItems.map((item, idx) => (
              <div className="order-item" key={idx}>
                <div className="order-item-name">
                  {item.name} <span>x {item.quantity}</span>
                </div>
                <div className="order-item-price">
                  {(item.price * item.quantity).toLocaleString()} đ
                </div>
              </div>
            ))}

            <div className="order-summary-row">
              <span>Tạm tính</span>
              <strong>{tempSubtotal.toLocaleString()} đ</strong>
            </div>
            <div className="order-summary-row">
              <span>Phí vận chuyển</span>
              <strong>{(shippingFee || 0).toLocaleString()} đ</strong>
            </div>
            <div className="order-summary-total">
              <span>Tổng cộng</span>
              <strong>{(total || 0).toLocaleString()} đ</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirm;
