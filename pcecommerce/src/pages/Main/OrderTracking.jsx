import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MainStyles/styleOrderTracking.css";

function OrderTracking() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [orderCode, setOrderCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/order/check-order`, { orderCode });

      if (res.data.valid) {
        navigate(`/orderdetails/${orderCode}`);
      } else {
        alert("Mã đơn hàng không tồn tại!");
      }
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra. Vui lòng thử lại sau!");
    }
  };

  return (
    <div className="form-container">
      <h1>Nhập mã đơn hàng để theo dõi đơn!</h1>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Mã đơn hàng"
          value={orderCode}
          onChange={(e) => setOrderCode(e.target.value)}
        />
        <button type="submit">Tìm kiếm</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default OrderTracking;
