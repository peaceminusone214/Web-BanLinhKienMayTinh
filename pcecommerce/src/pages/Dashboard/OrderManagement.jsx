import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Orderslist() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);

  const handleUpdateStatus = (orderId, newStatus) => {
    fetch(`${API_URL}/order/update-order-status/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
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

  const handleConfirmDelete = () => {
    // Make DELETE request to the server to delete the product
    fetch(`${API_URL}/order/delete-orders`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ids: [orderToDelete], // Send the product ID to delete
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          // Remove the product from the list after successful deletion
          setOrders(orders.filter((order) => order._id !== orderToDelete));
        }
        setOrderToDelete(null); // Reset the productToDelete state after confirmation
      })
      .catch((error) => {
        setError("Có lỗi xảy ra khi xóa sản phẩm.");
        setOrderToDelete(null);
      });
  };

  const handleCancelDelete = () => {
    // Reset productToDelete to null to cancel the delete operation
    setOrderToDelete(null);
  };

  const handleDeleteClick = (orderId) => {
    // Set the productToDelete to the current product ID
    setOrderToDelete(orderId);
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
    fetch(`${API_URL}/order/get-orders`)
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
                                    onClick={() => handleDeleteClick(order._id)}
                                  >
                                    {/* Delete icon */}
                                    <svg
                                      className="sherah-color2__fill"
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16.247"
                                      height="18.252"
                                      viewBox="0 0 16.247 18.252"
                                    >
                                      <g
                                        id="Icon"
                                        transform="translate(-160.007 -18.718)"
                                      >
                                        <path
                                          id="Path_484"
                                          data-name="Path 484"
                                          d="M185.344,88.136c0,1.393,0,2.786,0,4.179-.006,1.909-1.523,3.244-3.694,3.248q-3.623.007-7.246,0c-2.15,0-3.682-1.338-3.687-3.216q-.01-4.349,0-8.7a.828.828,0,0,1,.822-.926.871.871,0,0,1,1,.737c.016.162.006.326.006.489q0,4.161,0,8.321c0,1.061.711,1.689,1.912,1.69q3.58,0,7.161,0c1.2,0,1.906-.631,1.906-1.695q0-4.311,0-8.622a.841.841,0,0,1,.708-.907.871.871,0,0,1,1.113.844C185.349,85.1,185.343,86.618,185.344,88.136Z"
                                          transform="translate(-9.898 -58.597)"
                                        />
                                        <path
                                          id="Path_485"
                                          data-name="Path 485"
                                          d="M164.512,21.131c0-.517,0-.98,0-1.443.006-.675.327-.966,1.08-.967q2.537,0,5.074,0c.755,0,1.074.291,1.082.966.005.439.005.878.009,1.317a.615.615,0,0,0,.047.126h.428c1,0,2,0,3,0,.621,0,1.013.313,1.019.788s-.4.812-1.04.813q-7.083,0-14.165,0c-.635,0-1.046-.327-1.041-.811s.4-.786,1.018-.789C162.165,21.127,163.3,21.131,164.512,21.131Zm1.839-.021H169.9v-.764h-3.551Z"
                                          transform="translate(0 0)"
                                        />
                                        <path
                                          id="Path_486"
                                          data-name="Path 486"
                                          d="M225.582,107.622c0,.9,0,1.806,0,2.709a.806.806,0,0,1-.787.908.818.818,0,0,1-.814-.924q0-2.69,0-5.38a.82.82,0,0,1,.81-.927.805.805,0,0,1,.79.9C225.585,105.816,225.582,106.719,225.582,107.622Z"
                                          transform="translate(-58.483 -78.508)"
                                        />
                                        <path
                                          id="Path_487"
                                          data-name="Path 487"
                                          d="M266.724,107.63c0-.9,0-1.806,0-2.709a.806.806,0,0,1,.782-.912.818.818,0,0,1,.818.919q0,2.69,0,5.38a.822.822,0,0,1-.806.931c-.488,0-.792-.356-.794-.938C266.721,109.411,266.724,108.521,266.724,107.63Z"
                                          transform="translate(-97.561 -78.509)"
                                        />
                                      </g>
                                    </svg>
                                  </a>
                                </div>
                                {orderToDelete === order._id && (
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
                                      Bạn có chắc chắn muốn xóa đơn hàng này?
                                    </p>
                                    <button
                                      onClick={handleConfirmDelete}
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
                                      onClick={handleCancelDelete}
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

export default Orderslist;
