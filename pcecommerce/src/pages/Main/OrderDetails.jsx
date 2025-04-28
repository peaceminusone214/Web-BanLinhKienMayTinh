import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Ordersdetails() {
  const { id } = useParams();
  const API_URL = process.env.REACT_APP_API_URL;
  const [order, setOrder] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const getStatusClass = (status) => {
    const colorNumber = statusColors[status] || "6"; // Mặc định xám nếu không có trạng thái
    return `sherah-table__status sherah-color${colorNumber} sherah-color${colorNumber}__bg--opactity`;
  };

  const getPaymentStatusClass = (status) => {
    const colorNumber = paymentStatusColors[status] || "6"; // Mặc định xám nếu không có trạng thái
    return `sherah-table__status sherah-color${colorNumber} sherah-color${colorNumber}__bg--opactity`;
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString("vi-VN") + " VNĐ";
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`${API_URL}/order/get-orderinfos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ id }),
        });

        if (!response.ok) {
          throw new Error("Không thể lấy dữ liệu đơn hàng");
        }

        const data = await response.json();
        setOrder(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!order || !order.user_id) {
          console.warn("Không tìm thấy order hoặc user_id trong đơn hàng");
          return;
        }

        // Gọi API để lấy thông tin user từ order.user_id
        const userResponse = await fetch(`${API_URL}/user/get-user/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ userId: order.user_id }),
        });

        if (!userResponse.ok) {
          throw new Error("Lỗi khi lấy dữ liệu user từ order.user_id");
        }

        const userData = await userResponse.json();
        setUser(userData);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu user:", error);
        setUser(null);
      }
    };

    fetchUserData();
  }, [order?.user_id]);

  if (loading) {
    return <div>Đang tải danh sách đơn hàng...</div>;
  }

  if (error) {
    return <div>Lỗi: {error}</div>;
  }

  return (
    <div>
      <>
        <div className="sherah-body-area" style={{ marginLeft: "-3%", marginRight: "15%" }}>
          {/* sherah Dashboard */}
          <section className="sherah-adashboard sherah-show">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="sherah-body">
                    {/* Dashboard Inner */}
                    <div className="sherah-dsinner">
                      <div className="row mg-top-30">
                        <div className="col-12 sherah-flex-between">
                          {/* Sherah Breadcrumb */}
                          <div className="sherah-breadcrumb">
                            <h2 className="sherah-breadcrumb__title">
                              Chi tiết đơn hàng
                            </h2>
                            <ul className="sherah-breadcrumb__list">
                            </ul>
                          </div>
                          {/* End Sherah Breadcrumb */}
                        </div>
                      </div>
                      <div className="sherah-table sherah-page-inner sherah-border sherah-default-bg mg-top-25">
                        <div className="sherah-table__head sherah-table__main">
                          <h4 className="sherah-order-title">
                            Chi tiết đơn hàng: {order._id}
                          </h4>
                          <div className="sherah-order-right">
                            <p className="sherah-order-text">
                              {formatDate(order.created_at)} /{" "}
                              {order.products.length} sản phẩm / Tổng cộng{" "}
                              {formatCurrency(order.total_amount)}
                            </p>
                            <div className="sherah-table-status">
                              <p
                                className={getPaymentStatusClass(
                                  order.payment_status
                                )}
                              >
                                {paymentMap[order.payment_status] ||
                                  order.payment_status}
                              </p>
                              <div
                                className={getStatusClass(order.order_status)}
                              >
                                {statusMap[order.order_status] ||
                                  order.order_status}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="sherah-table sherah-page-inner sherah-border sherah-default-bg mg-top-25">
                            <div className="sherah-table-order">
                              <table
                                id="sherah-table__orderv1"
                                className="sherah-table__main sherah-table__main--orderv1"
                              >
                                <thead className="sherah-table__head">
                                  <tr>
                                    <th className="sherah-table__column-1 sherah-table__h1">
                                      Hình ảnh
                                    </th>
                                    <th className="sherah-table__column-2 sherah-table__h2">
                                      Tên sản phẩm
                                    </th>
                                    <th className="sherah-table__column-3 sherah-table__h3">
                                      Đơn giá
                                    </th>
                                    <th className="sherah-table__column-4 sherah-table__h4">
                                      Tổng cộng
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="sherah-table__body">
                                  {order.products.map((product) => (
                                    <tr key={product._id}>
                                      <td className="sherah-table__column-1 sherah-table__data-1">
                                        <div className="sherah-table__product--thumb">
                                          <img
                                            src={product.image_url}
                                            alt={product.product_name}
                                          />
                                        </div>
                                      </td>
                                      <td className="sherah-table__column-2 sherah-table__data-2">
                                        <div className="sherah-table__product-name">
                                          <h4 className="sherah-table__product-name--title">
                                            {product.product_name}
                                          </h4>
                                        </div>
                                      </td>
                                      <td className="sherah-table__column-3 sherah-table__data-3">
                                        <div className="sherah-table__product-content">
                                          <p className="sherah-table__product-desc">
                                            {formatCurrency(
                                              product.price_per_unit
                                            )}{" "}
                                            x {product.quantity}
                                          </p>
                                        </div>
                                      </td>
                                      <td className="sherah-table__column-4 sherah-table__data-4">
                                        <div className="sherah-table__product-content">
                                          <p className="sherah-table__product-desc">
                                            {formatCurrency(
                                              product.total_price
                                            )}
                                          </p>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                              <div className="order-totals">
                                <ul className="order-totals__list">
                                  <li className="order-totals__list--sub">
                                    <span>Tạm tính</span>{" "}
                                    <span className="order-totals__amount">
                                      {formatCurrency(order.subtotal)}
                                    </span>
                                  </li>
                                  <li>
                                    <span>Giảm giá</span>{" "}
                                    <span className="order-totals__amount">
                                      {formatCurrency(order.discount_amount)}
                                    </span>
                                  </li>
                                  <li>
                                    <span>Phí vận chuyển</span>{" "}
                                    <span className="order-totals__amount">
                                      {formatCurrency(order.shipping_fee)}
                                    </span>
                                  </li>
                                  <li>
                                    <span>VAT</span>{" "}
                                    <span className="order-totals__amount">
                                      {formatCurrency(order.VAT)}
                                    </span>
                                  </li>
                                  <li className="order-totals__bottom">
                                    <span>Tổng cộng</span>{" "}
                                    <span className="order-totals__amount">
                                      {formatCurrency(order.total_amount)}
                                    </span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-4 col-md-4 col-12">
                          <div className="sherah-contact-card sherah-default-bg sherah-border mg-top-30">
                            <h4 className="sherah-contact-card__title">
                              Liên hệ khách hàng
                            </h4>
                            <div className="sherah-vcard__body">
                              <div className="sherah-vcard__img">
                                {user && user.image_url ? (
                                  <img src={user.image_url} alt="User Avatar" />
                                ) : (
                                  <img alt="Default Avatar" />
                                )}
                              </div>
                              <div className="sherah-vcard__content">
                                <h4 className="sherah-vcard__title">
                                  {order.fullName}
                                </h4>
                                <ul className="sherah-vcard__contact">
                                  <li>
                                    <a href="tel:+91 564-258-4781">
                                      <svg
                                        className="sherah-color1__fill"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="13.983"
                                        height="13.981"
                                        viewBox="0 0 13.983 13.981"
                                      >
                                        <path
                                          id="Path_468"
                                          data-name="Path 468"
                                          d="M243.018,85.567c0,.4,0,.8,0,1.2a1.111,1.111,0,0,1-1.184,1.18,12.682,12.682,0,0,1-11.3-6.853,12.1,12.1,0,0,1-1.5-5.83,1.144,1.144,0,0,1,1.262-1.3q1.16,0,2.32,0a1.129,1.129,0,0,1,1.227,1.2,8.25,8.25,0,0,0,.362,2.282,1.287,1.287,0,0,1-.255,1.32c-.358.423-.668.886-1.009,1.323a.281.281,0,0,0-.028.36,8.757,8.757,0,0,0,3.635,3.627.263.263,0,0,0,.337-.029c.474-.368.958-.724,1.432-1.091a1.118,1.118,0,0,1,1.052-.211,9.653,9.653,0,0,0,2.55.406,1.1,1.1,0,0,1,1.094,1.131C243.026,84.712,243.018,85.139,243.018,85.567Z"
                                          transform="translate(-229.038 -73.968)"
                                        />
                                      </svg>
                                      {order.phone}
                                    </a>
                                  </li>
                                  <li>
                                    <a href="#">
                                      <svg
                                        className="sherah-color1__fill"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="12.331"
                                        height="12.344"
                                        viewBox="0 0 12.331 12.344"
                                      >
                                        <g
                                          id="Group_1029"
                                          data-name="Group 1029"
                                          transform="translate(-98.603 32.441)"
                                        >
                                          <path
                                            id="Path_1020"
                                            data-name="Path 1020"
                                            d="M110.725-26.052a5.251,5.251,0,0,0,.181,2.19,3.4,3.4,0,0,1-4.726,3.489,1.11,1.11,0,0,0-.546-.084,5.839,5.839,0,0,1-6.605-4.866,11.567,11.567,0,0,1-.012-1.8,1.106,1.106,0,0,0-.068-.455,3.356,3.356,0,0,1,.64-3.868,3.47,3.47,0,0,1,3.984-.632.97.97,0,0,0,.533.094A5.924,5.924,0,0,1,110.725-26.052Zm-5.945,3.905a5.029,5.029,0,0,0,2.583-.792,2.125,2.125,0,0,0-.312-3.67,11.6,11.6,0,0,0-1.478-.5c-.6-.185-1.216-.335-1.815-.532a.607.607,0,0,1-.456-.58.69.69,0,0,1,.443-.6,1.842,1.842,0,0,1,2.479.673c.041.069.08.139.125.206a.858.858,0,0,0,1.083.323.825.825,0,0,0,.442-1.009,1.92,1.92,0,0,0-1.182-1.286,4.754,4.754,0,0,0-3.891.019,1.915,1.915,0,0,0-1.256,1.824,1.866,1.866,0,0,0,1.228,1.8,12.352,12.352,0,0,0,1.483.484,14.973,14.973,0,0,1,1.639.483.768.768,0,0,1,.082,1.423,2.353,2.353,0,0,1-.84.3,1.681,1.681,0,0,1-2.018-1.025c-.054-.108-.106-.217-.169-.319a.851.851,0,0,0-1.045-.369.725.725,0,0,0-.51.849,2.14,2.14,0,0,0,.233.736,2.365,2.365,0,0,0,1.4,1.168C103.6-22.36,104.2-22.273,104.78-22.147Z"
                                            transform="translate(0 0)"
                                          />
                                        </g>
                                      </svg>
                                      {order.fullName} (Skype){" "}
                                    </a>
                                  </li>
                                  <li>
                                    <a href="mailto:margaretraw@gmail.com">
                                      <svg
                                        className="sherah-color1__fill"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="13.98"
                                        height="14.033"
                                        viewBox="0 0 13.98 14.033"
                                      >
                                        <g
                                          id="Group_131"
                                          data-name="Group 131"
                                          transform="translate(-219.859 -62.544)"
                                        >
                                          <path
                                            id="Path_472"
                                            data-name="Path 472"
                                            d="M271.363,95.475h3.71c.626,0,.7.079.7.716,0,1.447,0,2.894,0,4.342a.459.459,0,0,1-.2.413c-.844.645-1.677,1.3-2.522,1.948a.71.71,0,0,1-.393.137q-1.291.018-2.583,0a.664.664,0,0,1-.371-.122q-1.289-.983-2.558-1.991a.523.523,0,0,1-.172-.359c-.012-1.493-.008-2.986-.007-4.479,0-.486.116-.6.594-.605Zm.637,5.474a3.893,3.893,0,0,0,.7.341,1.257,1.257,0,0,0,1.345-.694,2.636,2.636,0,0,0,.269-1.913,3.02,3.02,0,1,0-3.112,3.8c.349.016.57-.177.522-.467-.044-.264-.23-.339-.476-.359a2.2,2.2,0,0,1-1.7-3.381,2.155,2.155,0,0,1,2.948-.685.478.478,0,0,0-.623.271,1.437,1.437,0,0,0-1.921.8A2.33,2.33,0,0,0,269.8,99.7,1.44,1.44,0,0,0,272,100.949Z"
                                            transform="translate(-44.527 -31.12)"
                                          />
                                          <path
                                            id="Path_473"
                                            data-name="Path 473"
                                            d="M243.053,251.784H230.261c.094-.08.151-.133.213-.181q2.254-1.754,4.512-3.5a.749.749,0,0,1,.418-.145c.86-.013,1.721-.01,2.582,0a.571.571,0,0,1,.325.1q2.348,1.812,4.686,3.636a.367.367,0,0,0,.1.038Z"
                                            transform="translate(-9.83 -175.207)"
                                          />
                                          <path
                                            id="Path_474"
                                            data-name="Path 474"
                                            d="M219.859,174.433l4.671,3.633-4.671,3.633Z"
                                            transform="translate(0 -105.737)"
                                          />
                                          <path
                                            id="Path_475"
                                            data-name="Path 475"
                                            d="M389.225,178.113l4.667-3.63v7.26Z"
                                            transform="translate(-160.053 -105.784)"
                                          />
                                          <path
                                            id="Path_476"
                                            data-name="Path 476"
                                            d="M325.243,63.516h-2.686c.416-.344.766-.661,1.148-.931a.487.487,0,0,1,.446.032C324.512,62.877,324.843,63.18,325.243,63.516Z"
                                            transform="translate(-97.051 0)"
                                          />
                                          <path
                                            id="Path_477"
                                            data-name="Path 477"
                                            d="M442.145,142.025v-2.23l1.378,1.157Z"
                                            transform="translate(-210.063 -73.003)"
                                          />
                                          <path
                                            id="Path_478"
                                            data-name="Path 478"
                                            d="M228.2,139.874v2.218l-1.369-1.064Z"
                                            transform="translate(-6.59 -73.078)"
                                          />
                                          <path
                                            id="Path_479"
                                            data-name="Path 479"
                                            d="M334.105,152.656a3.655,3.655,0,0,1-.262.637.469.469,0,0,1-.756.075,1.118,1.118,0,0,1-.1-1.389.55.55,0,0,1,.984.143A4.005,4.005,0,0,1,334.105,152.656Z"
                                            transform="translate(-106.725 -84.286)"
                                          />
                                          <path
                                            id="Path_480"
                                            data-name="Path 480"
                                            d="M370.08,135.548a1.9,1.9,0,0,1,.681,2.51.7.7,0,0,1-.225.232c-.245.152-.407.061-.408-.227,0-.649.006-1.3,0-1.947C370.128,135.922,370.1,135.727,370.08,135.548Z"
                                            transform="translate(-141.961 -68.99)"
                                          />
                                        </g>
                                      </svg>
                                      {order.email}
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-12">
                          <div className="sherah-contact-card sherah-default-bg  sherah-border mg-top-30">
                            <h4 className="sherah-contact-card__title">
                              Thông tin giao hàng
                            </h4>
                            <div className="sherah-vcard__body">
                              <div className="sherah-vcard__content">
                                <ul className="sherah-vcard__contact">
                                  <li>
                                    <a href="tel:+91 564-258-4781">
                                      <svg
                                        className="sherah-color1__fill"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="13.983"
                                        height="13.981"
                                        viewBox="0 0 13.983 13.981"
                                      >
                                        <path
                                          id="Path_468"
                                          data-name="Path 468"
                                          d="M243.018,85.567c0,.4,0,.8,0,1.2a1.111,1.111,0,0,1-1.184,1.18,12.682,12.682,0,0,1-11.3-6.853,12.1,12.1,0,0,1-1.5-5.83,1.144,1.144,0,0,1,1.262-1.3q1.16,0,2.32,0a1.129,1.129,0,0,1,1.227,1.2,8.25,8.25,0,0,0,.362,2.282,1.287,1.287,0,0,1-.255,1.32c-.358.423-.668.886-1.009,1.323a.281.281,0,0,0-.028.36,8.757,8.757,0,0,0,3.635,3.627.263.263,0,0,0,.337-.029c.474-.368.958-.724,1.432-1.091a1.118,1.118,0,0,1,1.052-.211,9.653,9.653,0,0,0,2.55.406,1.1,1.1,0,0,1,1.094,1.131C243.026,84.712,243.018,85.139,243.018,85.567Z"
                                          transform="translate(-229.038 -73.968)"
                                        />
                                      </svg>
                                      {order.phone}
                                    </a>
                                  </li>
                                  <li>
                                    <a href="mailto:margaretraw@gmail.com">
                                      <svg
                                        className="sherah-color1__fill"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="13.98"
                                        height="14.033"
                                        viewBox="0 0 13.98 14.033"
                                      >
                                        <g
                                          id="Group_131"
                                          data-name="Group 131"
                                          transform="translate(-219.859 -62.544)"
                                        >
                                          <path
                                            id="Path_472"
                                            data-name="Path 472"
                                            d="M271.363,95.475h3.71c.626,0,.7.079.7.716,0,1.447,0,2.894,0,4.342a.459.459,0,0,1-.2.413c-.844.645-1.677,1.3-2.522,1.948a.71.71,0,0,1-.393.137q-1.291.018-2.583,0a.664.664,0,0,1-.371-.122q-1.289-.983-2.558-1.991a.523.523,0,0,1-.172-.359c-.012-1.493-.008-2.986-.007-4.479,0-.486.116-.6.594-.605Zm.637,5.474a3.893,3.893,0,0,0,.7.341,1.257,1.257,0,0,0,1.345-.694,2.636,2.636,0,0,0,.269-1.913,3.02,3.02,0,1,0-3.112,3.8c.349.016.57-.177.522-.467-.044-.264-.23-.339-.476-.359a2.2,2.2,0,0,1-1.7-3.381,2.155,2.155,0,0,1,2.948-.685.478.478,0,0,0-.623.271,1.437,1.437,0,0,0-1.921.8A2.33,2.33,0,0,0,269.8,99.7,1.44,1.44,0,0,0,272,100.949Z"
                                            transform="translate(-44.527 -31.12)"
                                          />
                                          <path
                                            id="Path_473"
                                            data-name="Path 473"
                                            d="M243.053,251.784H230.261c.094-.08.151-.133.213-.181q2.254-1.754,4.512-3.5a.749.749,0,0,1,.418-.145c.86-.013,1.721-.01,2.582,0a.571.571,0,0,1,.325.1q2.348,1.812,4.686,3.636a.367.367,0,0,0,.1.038Z"
                                            transform="translate(-9.83 -175.207)"
                                          />
                                          <path
                                            id="Path_474"
                                            data-name="Path 474"
                                            d="M219.859,174.433l4.671,3.633-4.671,3.633Z"
                                            transform="translate(0 -105.737)"
                                          />
                                          <path
                                            id="Path_475"
                                            data-name="Path 475"
                                            d="M389.225,178.113l4.667-3.63v7.26Z"
                                            transform="translate(-160.053 -105.784)"
                                          />
                                          <path
                                            id="Path_476"
                                            data-name="Path 476"
                                            d="M325.243,63.516h-2.686c.416-.344.766-.661,1.148-.931a.487.487,0,0,1,.446.032C324.512,62.877,324.843,63.18,325.243,63.516Z"
                                            transform="translate(-97.051 0)"
                                          />
                                          <path
                                            id="Path_477"
                                            data-name="Path 477"
                                            d="M442.145,142.025v-2.23l1.378,1.157Z"
                                            transform="translate(-210.063 -73.003)"
                                          />
                                          <path
                                            id="Path_478"
                                            data-name="Path 478"
                                            d="M228.2,139.874v2.218l-1.369-1.064Z"
                                            transform="translate(-6.59 -73.078)"
                                          />
                                          <path
                                            id="Path_479"
                                            data-name="Path 479"
                                            d="M334.105,152.656a3.655,3.655,0,0,1-.262.637.469.469,0,0,1-.756.075,1.118,1.118,0,0,1-.1-1.389.55.55,0,0,1,.984.143A4.005,4.005,0,0,1,334.105,152.656Z"
                                            transform="translate(-106.725 -84.286)"
                                          />
                                          <path
                                            id="Path_480"
                                            data-name="Path 480"
                                            d="M370.08,135.548a1.9,1.9,0,0,1,.681,2.51.7.7,0,0,1-.225.232c-.245.152-.407.061-.408-.227,0-.649.006-1.3,0-1.947C370.128,135.922,370.1,135.727,370.08,135.548Z"
                                            transform="translate(-141.961 -68.99)"
                                          />
                                        </g>
                                      </svg>
                                      {order.email}
                                    </a>
                                  </li>
                                  <li>
                                    <a href="#">
                                      <svg
                                        className="sherah-color1__fill"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="10.757"
                                        height="14.39"
                                        viewBox="0 0 10.757 14.39"
                                      >
                                        <path
                                          id="Path_1021"
                                          data-name="Path 1021"
                                          d="M-348.264,473.154a5.264,5.264,0,0,1,5.147,6.731,14.587,14.587,0,0,1-2.221,4.257c-.77,1.062-1.616,2.073-2.443,3.1-.334.413-.615.4-.968,0a26.151,26.151,0,0,1-4.067-5.839,7.8,7.8,0,0,1-.8-2.588,5.171,5.171,0,0,1,3.35-5.249,6.189,6.189,0,0,1,.942-.271C-348.977,473.221-348.619,473.2-348.264,473.154Zm0,7.83a2.662,2.662,0,0,0,2.714-2.618,2.678,2.678,0,0,0-2.7-2.605,2.677,2.677,0,0,0-2.713,2.625A2.662,2.662,0,0,0-348.268,480.984Z"
                                          transform="translate(353.642 -473.154)"
                                        />
                                      </svg>
                                      {order.shipping_address.street},{" "}
                                      {order.shipping_address.ward},{" "}
                                      {order.shipping_address.city},{" "}
                                      {order.shipping_address.province}
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* End Dashboard Inner */}
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* End sherah Dashboard */}
        </div>
        {/* sherah Scripts */}
      </>
    </div>
  );
}

export default Ordersdetails;
