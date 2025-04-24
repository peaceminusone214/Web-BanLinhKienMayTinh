import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function DeletedOrderslist() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderToRestore, setOrderToRestore] = useState(null);

  const handleUpdateStatus = (orderId, newStatus) => {
    fetch(`${API_URL}/order/update-order-status/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ order_status: newStatus }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.order) {
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order._id === orderId
                ? { ...order, order_status: newStatus }
                : order
            )
          );
        }
      })
      .catch((error) => console.error("Lỗi khi cập nhật trạng thái:", error));
  };

  const statusMap = {
    Pending: "Chờ xác nhận",
    Confirmed: "Đã xác nhận",
    Processing: "Đang xử lý",
    Shipped: "Đã giao hàng",
    OutForDelivery: "Đang giao hàng",
    Delivered: "Đã nhận hàng",
    Cancelled: "Đã hủy",
    Returned: "Đã trả hàng",
    Refunded: "Đã hoàn tiền",
    Failed: "Thất bại",
  };

  const paymentMap = {
    Unpaid: "Chưa thanh toán",
    Paid: "Đã thanh toán",
    Refund: "Hoàn tiền",
  };

  const handleConfirmRestore = () => {
    fetch(`${API_URL}/order/restore-orders`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        ids: [orderToRestore],
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          setOrders(orders.filter((order) => order._id !== orderToRestore));
        }
        setOrderToRestore(null);
      })
      .catch((error) => {
        setError("Có lỗi xảy ra khi xóa sản phẩm.");
        setOrderToRestore(null);
      });
  };

  const handleCancelRestore = () => {
    // Reset productToRestore to null to cancel the restore operation
    setOrderToRestore(null);
  };

  const handleRestoreClick = (orderId) => {
    // Set the productToRestore to the current order ID
    setOrderToRestore(orderId);
  };

  const statusColors = {
    Pending: "1", // Xanh dương
    Confirmed: "4", // Vàng
    Processing: "4", // Vàng
    Shipped: "5", // Cam
    OutForDelivery: "5", // Cam
    Delivered: "3", // Xanh ngọc
    Cancelled: "2", // Đỏ
    Returned: "8", // Tím
    Refunded: "8", // Tím
    Failed: "9", // Đỏ đậm
  };

  const paymentStatusColors = {
    Paid: "3", // Xanh ngọc
    Unpaid: "2", // Đỏ
    Refund: "8", // Tím
  };

  const getStatusClass = (status) => {
    const colorNumber = statusColors[status] || "6"; // Mặc định xám nếu không có trạng thái
    return `sherah-table__status sherah-color${colorNumber} sherah-color${colorNumber}__bg--opactity`;
  };

  const getPaymentStatusClass = (status) => {
    const colorNumber = paymentStatusColors[status] || "6"; // Mặc định xám nếu không có trạng thái
    return `sherah-table__status sherah-color${colorNumber} sherah-color${colorNumber}__bg--opactity`;
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date
      .toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // Định dạng 24h
      })
      .replace(/\/\d{4}/, ""); // Xóa năm khỏi chuỗi
  };

  useEffect(() => {
    fetch(`${API_URL}/order/get-deleted-orders`, { credentials: "include" })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Không thể lấy dữ liệu đơn hàng");
        }
        return response.json();
      })
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Đang tải danh sách đơn hàng...</div>;
  }

  if (error) {
    return <div>Lỗi: {error}</div>;
  }

  return (
    <div>
      <div className="sherah-body-area">
        <section className="sherah-adashboard sherah-show">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="sherah-body">
                  <div className="sherah-dsinner">
                    <div className="row mg-top-30">
                      <div className="col-12 sherah-flex-between">
                        <div className="sherah-breadcrumb">
                          <h2 className="sherah-breadcrumb__title">
                            Danh sách đơn hàng
                          </h2>
                          <ul className="sherah-breadcrumb__list">
                            <li>
                              <a href="#">admin</a>
                            </li>
                            <li className="active">
                              <Link to="/admin/orderslist">orderslist</Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="sherah-table sherah-page-inner sherah-border sherah-default-bg mg-top-25">
                      <table
                        id="sherah-table__vendor"
                        className="sherah-table__main sherah-table__main-v3"
                      >
                        {/* sherah Table Head */}
                        <thead className="sherah-table__head">
                          <tr>
                            <th className="sherah-table__column-1 sherah-table__h1">
                              ID Đơn hàng
                            </th>
                            <th className="sherah-table__column-2 sherah-table__h2">
                              Tên khách hàng
                            </th>
                            <th className="sherah-table__column-3 sherah-table__h3">
                              Thời gian
                            </th>
                            <th className="sherah-table__column-4 sherah-table__h4">
                              Trạng thái thanh toán
                            </th>
                            <th className="sherah-table__column-5 sherah-table__h5">
                              Tổng cộng
                            </th>
                            <th className="sherah-table__column-10 sherah-table__h6">
                              Trạng thái đơn hàng
                            </th>
                            <th className="sherah-table__column-7 sherah-table__h7">
                              Thao tác
                            </th>
                          </tr>
                        </thead>
                        <tbody className="sherah-table__body">
                          {orders.map((order) => (
                            <tr key={order._id}>
                              <td className="sherah-table__column-1 sherah-table__data-1">
                                <p className="crany-table__order--number">
                                  <a
                                    href="#"
                                    className="sherah-color1"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      const target = e.target;
                                      target.textContent =
                                        target.textContent === order._id
                                          ? order._id.slice(0, 3) + "..."
                                          : order._id;
                                    }}
                                  >
                                    {order._id.slice(0, 3) + "..."}
                                  </a>
                                </p>
                              </td>
                              <td className="sherah-table__column-2 sherah-table__data-2">
                                <div className="sherah-table__order-content">
                                  <p className="sherah-table__order-desc">
                                    {order.fullName}
                                  </p>
                                </div>
                              </td>
                              <td className="sherah-table__column-5 sherah-table__data-5">
                                <p className="sherah-table__order-desc">
                                  {formatDateTime(order.created_at)}
                                </p>
                              </td>

                              <td className="sherah-table__column-5 sherah-table__data-5">
                                <div
                                  className={getPaymentStatusClass(
                                    order.payment_status
                                  )}
                                >
                                  {paymentMap[order.payment_status] ||
                                    order.payment_status}
                                </div>
                              </td>
                              <td className="sherah-table__column-5 sherah-table__data-5">
                                <p className="sherah-table__order-desc">
                                  {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(order.total_amount)}
                                </p>
                              </td>
                              <td className="sherah-table__column-10 sherah-table__data-10">
                                <div
                                  className={getStatusClass(order.order_status)}
                                >
                                  {/* {statusMap[order.order_status] ||
                                    order.order_status} */}
                                  <select
                                    value={order.order_status}
                                    onChange={(e) =>
                                      handleUpdateStatus(
                                        order._id,
                                        e.target.value
                                      )
                                    }
                                    style={{
                                      padding: "8px 12px",
                                      borderRadius: "6px",
                                      backgroundColor: "transparent",
                                      fontSize: "14px",
                                      cursor: "pointer",
                                      outline: "none",
                                      transition: "0.2s",
                                      backgroundRepeat: "no-repeat",
                                      backgroundPosition: "right 10px center",
                                      backgroundSize: "12px",
                                    }}
                                  >
                                    {Object.entries(statusMap).map(
                                      ([english, vietnamese]) => (
                                        <option key={english} value={english}>
                                          {vietnamese}
                                        </option>
                                      )
                                    )}
                                  </select>
                                </div>
                              </td>
                              <td className="sherah-table__column-8 sherah-table__data-8">
                                <div className="sherah-table__status__group">
                                  <a
                                    href="#"
                                    className="sherah-table__action sherah-color2 sherah-color2__bg--offset"
                                    onClick={() =>
                                      handleRestoreClick(order._id)
                                    }
                                  >
                                    {/* Restore icon */}
                                    <svg
                                      className="sherah-color7__fill"
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="18.29"
                                      height="18.252"
                                      xmlnsXlink="http://www.w3.org/1999/xlink"
                                      viewBox="0 0 331.708 331.708"
                                    >
                                      <g>
                                        <path
                                          d="M222.685,284.287H47.419V109.02h102.502l47.421-47.419H5c-2.761,0-5,2.239-5,5v260.105c0,2.761,2.239,5,5,5h260.104
		c2.761,0,5-2.239,5-5v-192.34l-47.419,47.418V284.287z"
                                        />
                                        <path
                                          d="M330.244,1.467c-1.149-1.149-2.783-1.671-4.387-1.391L194.44,22.786c-1.84,0.318-3.35,1.635-3.915,3.415
		c-0.564,1.78-0.09,3.727,1.23,5.047l30.971,30.971l-79.517,79.516c-1.953,1.953-1.953,5.119,0,7.071l39.688,39.689
		c0.938,0.938,2.21,1.464,3.536,1.464c1.326,0,2.598-0.527,3.536-1.464l79.517-79.516l30.97,30.971
		c1.32,1.32,3.268,1.794,5.047,1.23c1.78-0.564,3.097-2.074,3.414-3.915L331.634,5.854C331.912,4.253,331.393,2.617,330.244,1.467z"
                                        />
                                      </g>
                                    </svg>
                                  </a>
                                </div>
                                {orderToRestore === order._id && (
                                  <div
                                    style={{
                                      background: "#fff",
                                      padding: "20px",
                                      borderRadius: "12px",
                                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                      textAlign: "center",
                                      width: "300px",
                                      margin: "0 auto",
                                    }}
                                  >
                                    <p
                                      style={{
                                        fontSize: "16px",
                                        marginBottom: "15px",
                                        color: "#333",
                                      }}
                                    >
                                      Bạn có chắc chắn muốn khôi phục đơn hàng
                                      này?
                                    </p>
                                    <button
                                      onClick={handleConfirmRestore}
                                      style={{
                                        background: "#e74c3c",
                                        color: "white",
                                        border: "none",
                                        padding: "10px 16px",
                                        marginRight: "10px",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                        transition: "0.2s",
                                      }}
                                      onMouseOver={(e) =>
                                        (e.target.style.background = "#c0392b")
                                      }
                                      onMouseOut={(e) =>
                                        (e.target.style.background = "#e74c3c")
                                      }
                                    >
                                      Tôi chắc chắn
                                    </button>
                                    <button
                                      onClick={handleCancelRestore}
                                      style={{
                                        background: "#bdc3c7",
                                        color: "white",
                                        border: "none",
                                        padding: "10px 16px",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                        transition: "0.2s",
                                      }}
                                      onMouseOver={(e) =>
                                        (e.target.style.background = "#95a5a6")
                                      }
                                      onMouseOut={(e) =>
                                        (e.target.style.background = "#bdc3c7")
                                      }
                                    >
                                      Không
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default DeletedOrderslist;
