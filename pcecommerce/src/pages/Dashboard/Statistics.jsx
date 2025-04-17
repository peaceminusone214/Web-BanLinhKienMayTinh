import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log(
          "API URL:",
          `${process.env.REACT_APP_API_URL}/stats/dashboard`
        );

        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/stats/dashboard`
        );
        setStats(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error("API Error:", err);
        setError(err.message || "Failed to fetch statistics");
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Prepare chart data
  const prepareSalesData = () => {
    if (!stats || !stats.salesByMonth) return null;

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const labels = stats.salesByMonth.map((item) => months[item._id.month - 1]);
    const salesData = stats.salesByMonth.map((item) => item.totalSales);
    const orderCountData = stats.salesByMonth.map((item) => item.count);

    return {
      labels,
      datasets: [
        {
          label: "Doanh thu theo tháng (VND)",
          data: salesData,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.1,
        },
        {
          label: "Số lượng đơn hàng",
          data: orderCountData,
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          tension: 0.1,
        },
      ],
    };
  };

  const prepareOrderStatusData = () => {
    if (!stats || !stats.ordersByStatus) return null;

    const labels = stats.ordersByStatus.map((item) => item._id);
    const data = stats.ordersByStatus.map((item) => item.count);
    const backgroundColor = [
      "rgba(75, 192, 192, 0.6)",
      "rgba(255, 99, 132, 0.6)",
      "rgba(255, 206, 86, 0.6)",
      "rgba(54, 162, 235, 0.6)",
      "rgba(153, 102, 255, 0.6)",
      "rgba(255, 159, 64, 0.6)",
    ];

    return {
      labels,
      datasets: [
        {
          label: "Đơn hàng theo trạng thái",
          data,
          backgroundColor,
        },
      ],
    };
  };

  const prepareTopProductsData = () => {
    if (!stats || !stats.topSellingProducts) return null;

    const labels = stats.topSellingProducts.map((item) => item.name);
    const data = stats.topSellingProducts.map((item) => item.totalSold);
    const backgroundColor = [
      "rgba(255, 99, 132, 0.6)",
      "rgba(54, 162, 235, 0.6)",
      "rgba(255, 206, 86, 0.6)",
      "rgba(75, 192, 192, 0.6)",
      "rgba(153, 102, 255, 0.6)",
    ];

    return {
      labels,
      datasets: [
        {
          label: "Top sản phẩm bán chạy",
          data,
          backgroundColor,
        },
      ],
    };
  };

  if (loading) {
    return (
      <div className="sherah-body-area">
        <section className="sherah-adashboard sherah-show">
          <div className="container">
            <div className="row">
              <div className="col-12 sherah-main__column">
                <div className="sherah-body">
                  <div className="sherah-dsinner">
                    <div className="sherah-page-inner sherah-border sherah-basic-page sherah-default-bg mg-top-25">
                      <div className="sherah-page-inner-header">
                        <h3 className="sherah-page-inner-title">Thống kê</h3>
                      </div>
                      <div className="sherah-page-inner-content">
                        <div className="sherah-box sherah-border sherah-default-bg">
                          <div className="text-center p-5">
                            <div className="spinner-border" role="status">
                              <span className="visually-hidden">
                                Đang tải...
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sherah-body-area">
        <section className="sherah-adashboard sherah-show">
          <div className="container">
            <div className="row">
              <div className="col-12 sherah-main__column">
                <div className="sherah-body">
                  <div className="sherah-dsinner">
                    <div className="sherah-page-inner sherah-border sherah-basic-page sherah-default-bg mg-top-25">
                      <div className="sherah-page-inner-header">
                        <h3 className="sherah-page-inner-title">Thống kê</h3>
                      </div>
                      <div className="sherah-page-inner-content">
                        <div className="sherah-box sherah-border sherah-default-bg">
                          <div className="alert alert-danger" role="alert">
                            {error}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const salesData = prepareSalesData();
  const orderStatusData = prepareOrderStatusData();
  const topProductsData = prepareTopProductsData();

  return (
    <div className="sherah-body-area">
      <section className="sherah-adashboard sherah-show">
        <div className="container">
          <div className="row">
            <div className="col-12 sherah-main__column">
              <div className="sherah-body">
                <div className="sherah-dsinner">
                  {/* Page Title */}
                  <div className="sherah-page-inner sherah-border sherah-basic-page sherah-default-bg mg-top-25">
                    <div className="sherah-page-inner-header">
                      <h3 className="sherah-page-inner-title">Thống kê</h3>
                    </div>
                    <div className="sherah-page-inner-content">
                      {/* Summary Cards */}
                      <div className="row">
                        <div className="col-lg-3 col-md-6 col-12">
                          <div className="sherah-progress-card sherah-border sherah-default-bg mg-top-30">
                            <div className="sherah-progress-card__icon sherah-default-bg sherah-border sherah-color3__fill">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="30.359"
                                height="30.366"
                                viewBox="0 0 30.359 30.366"
                              >
                                <g transform="translate(-242.991 -23.995)">
                                  <path
                                    d="M249.517,188.942c.854.139,1.633.271,2.413.391.448.069.945.14.856.737s-.609.506-1.042.441c-.721-.107-1.44-.232-2.227-.36,0,.35,0,.662,0,.974a.622.622,0,0,1-.693.7q-2.579,0-5.158,0c-.464,0-.674-.266-.674-.718q0-5.217,0-10.434c0-.494.264-.711.745-.709,1.166,0,2.332-.013,3.5.008a2.439,2.439,0,0,1,2.017,1.223c.265-.168.508-.33.758-.479a4.631,4.631,0,0,1,5.791.613,1.642,1.642,0,0,0,1.167.425c1.581-.027,3.162-.011,4.743-.01,2.125,0,3.145,1.373,2.527,3.394a.879.879,0,0,0,.027.213c.215-.144.406-.249.572-.386,1.524-1.258,3.038-2.527,4.565-3.781a2.38,2.38,0,1,1,3.021,3.675c-2.271,1.779-4.522,3.583-6.826,5.317a8.274,8.274,0,0,1-6.68,1.494c-.408-.072-.817-.143-1.227-.2s-.834-.176-.778-.693c.062-.571.521-.554.957-.488.547.082,1.092.172,1.638.255a7.061,7.061,0,0,0,5.569-1.452c2.177-1.674,4.331-3.378,6.491-5.074a1.2,1.2,0,1,0-1.5-1.842c-1.6,1.319-3.188,2.656-4.8,3.96a1.569,1.569,0,0,1-.9.338c-2.391.027-4.782.021-7.173.006a1.128,1.128,0,0,1-.691-.225.59.59,0,0,1-.085-.577,1.007,1.007,0,0,1,.663-.361c1.462-.032,2.924-.016,4.387-.016.2,0,.4.007.593,0a1.191,1.191,0,0,0,1.208-1.2,1.178,1.178,0,0,0-1.239-1.165c-1.877-.012-3.755.014-5.632-.022a2.192,2.192,0,0,1-.992-.381c-.387-.231-.71-.567-1.094-.8-1.629-1.006-3.114-.64-4.628.712a.708.708,0,0,0-.162.356,1.561,1.561,0,0,0-.007.354C249.517,185.066,249.517,186.98,249.517,188.942Zm-1.189,1.668c0-2.792.005-5.514,0-8.236a1.1,1.1,0,0,0-.946-1.183c-1.053-.058-2.111-.016-3.154-.016v9.435Z"
                                    transform="translate(0 -137.466)"
                                  />
                                  <path
                                    d="M336.414,31.727A7.71,7.71,0,1,1,328.756,24,7.725,7.725,0,0,1,336.414,31.727Zm-8.331,4.064a2.433,2.433,0,0,1-1.723-1.929c-.08-.415-.053-.847.453-.942s.656.256.724.71a1.161,1.161,0,0,0,1.579.955,1.183,1.183,0,0,0,.762-1.268,1.212,1.212,0,0,0-1.2-1.019,2.371,2.371,0,0,1-2.274-1.821c-.3-1.19.281-2.2,1.677-2.886V25.243a6.486,6.486,0,0,0,0,12.919Zm1.24,2.387a6.524,6.524,0,0,0,5.892-6.927c-.2-3.155-3.04-6.041-5.886-5.971v2.34a2.421,2.421,0,0,1,1.741,2.139.593.593,0,0,1-.507.741c-.4.056-.619-.185-.672-.578a1.991,1.991,0,0,0-.062-.348,1.187,1.187,0,0,0-1.286-.822,1.185,1.185,0,0,0-.071,2.335,3.567,3.567,0,0,0,.413.031,2.368,2.368,0,0,1,.836,4.5c-.136.067-.276.126-.4.181Z"
                                    transform="translate(-68.751 0)"
                                  />
                                  <path
                                    d="M338.739,264.607c-.144-.236-.43-.5-.392-.7a.836.836,0,0,1,.6-.519c.156-.017.494.352.5.552,0,.225-.281.452-.44.679Z"
                                    transform="translate(-84.043 -210.998)"
                                  />
                                </g>
                              </svg>
                            </div>
                            <div className="sherah-progress-card__content">
                              <div className="sherah-progress-card__heading">
                                <span className="sherah-pcolor">
                                  Tổng doanh thu
                                </span>
                                <h4 className="sherah-progress-card__title">
                                  <b className="count-animate">
                                    {stats?.totalRevenue?.toLocaleString()} VND
                                  </b>
                                </h4>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-12">
                          <div className="sherah-progress-card sherah-border sherah-default-bg mg-top-30">
                            <div className="sherah-progress-card__icon sherah-default-bg sherah-border sherah-color2__fill">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="26.672"
                                height="30.636"
                                viewBox="0 0 26.672 30.636"
                              >
                                <g transform="translate(-272.518 -5.918)">
                                  <path d="M285.855,36.554q-5.443,0-10.885,0a2.152,2.152,0,0,1-2.447-2.412q-.01-9.39.014-18.78a3.035,3.035,0,0,1,.383-1.406c1.292-2.312,2.644-4.59,3.947-6.9a2.07,2.07,0,0,1,1.993-1.141q7,.028,13.995,0a2.075,2.075,0,0,1,1.991,1.147c1.327,2.338,2.7,4.652,4.022,6.991a2.4,2.4,0,0,1,.306,1.124q.028,9.48.011,18.959a2.152,2.152,0,0,1-2.445,2.414Q291.3,36.556,285.855,36.554ZM297.39,15.348H274.351c-.012.211-.03.387-.031.562q0,9.057-.011,18.113c0,.577.186.746.758.744q10.73-.025,21.461-.011c.858,0,.86,0,.86-.861q0-8.937,0-17.874ZM284.969,7.724c-2.077,0-4.089-.01-6.1.017a.778.778,0,0,0-.516.374c-.971,1.646-1.92,3.305-2.871,4.963a2.945,2.945,0,0,0-.152.376h9.64Zm11.423,5.748a1.4,1.4,0,0,0-.08-.258c-1-1.741-2-3.485-3.029-5.212a.773.773,0,0,0-.576-.267c-1.832-.02-3.664-.013-5.5-.009a2.737,2.737,0,0,0-.373.048v5.7Z" />
                                  <path
                                    d="M351.281,143.152l3.6-3.605c.141-.141.275-.288.426-.418a.889.889,0,1,1,1.262,1.253c-.4.439-.837.851-1.259,1.273q-1.582,1.583-3.166,3.164c-.63.627-1.05.632-1.669.02-.636-.629-1.274-1.258-1.9-1.9a.886.886,0,0,1-.063-1.365.906.906,0,0,1,1.328.1C350.317,142.133,350.762,142.615,351.281,143.152Z"
                                    transform="translate(-66.652 -117.042)"
                                  />
                                </g>
                              </svg>
                            </div>
                            <div className="sherah-progress-card__content">
                              <div className="sherah-progress-card__heading">
                                <span className="sherah-pcolor">
                                  Tổng đơn hàng
                                </span>
                                <h4 className="sherah-progress-card__title">
                                  <b className="count-animate">
                                    {stats?.totalOrders}
                                  </b>
                                </h4>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-12">
                          <div className="sherah-progress-card sherah-border sherah-default-bg mg-top-30">
                            <div className="sherah-progress-card__icon sherah-default-bg sherah-border sherah-color1__fill">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="25"
                                height="25"
                                viewBox="0 0 25 25"
                              >
                                <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"></path>
                              </svg>
                            </div>
                            <div className="sherah-progress-card__content">
                              <div className="sherah-progress-card__heading">
                                <span className="sherah-pcolor">
                                  Tổng sản phẩm
                                </span>
                                <h4 className="sherah-progress-card__title">
                                  <b className="count-animate">
                                    {stats?.totalProducts}
                                  </b>
                                </h4>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-12">
                          <div className="sherah-progress-card sherah-border sherah-default-bg mg-top-30">
                            <div className="sherah-progress-card__icon sherah-default-bg sherah-border">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="25"
                                height="25"
                                viewBox="0 0 25 25"
                              >
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                              </svg>
                            </div>
                            <div className="sherah-progress-card__content">
                              <div className="sherah-progress-card__heading">
                                <span className="sherah-pcolor">
                                  Tổng người dùng
                                </span>
                                <h4 className="sherah-progress-card__title">
                                  <b className="count-animate">
                                    {stats?.totalUsers}
                                  </b>
                                </h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Charts */}
                      <div className="row mg-top-30">
                        <div className="col-12">
                          <div className="sherah-box sherah-border sherah-default-bg">
                            <div className="sherah-box__header">
                              <h5 className="sherah-box__title">
                                Doanh thu theo tháng
                              </h5>
                            </div>
                            <div className="sherah-box__body">
                              {salesData && (
                                <div style={{ height: "400px" }}>
                                  <Line
                                    data={salesData}
                                    options={{
                                      responsive: true,
                                      maintainAspectRatio: false,
                                      plugins: {
                                        legend: {
                                          position: "top",
                                        },
                                        title: {
                                          display: true,
                                          text: "Doanh thu và đơn hàng 6 tháng gần nhất",
                                        },
                                      },
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row mg-top-30">
                        <div className="col-lg-6">
                          <div className="sherah-box sherah-border sherah-default-bg">
                            <div className="sherah-box__header">
                              <h5 className="sherah-box__title">
                                Đơn hàng theo trạng thái
                              </h5>
                            </div>
                            <div className="sherah-box__body">
                              {orderStatusData && (
                                <div style={{ height: "300px" }}>
                                  <Pie
                                    data={orderStatusData}
                                    options={{
                                      responsive: true,
                                      maintainAspectRatio: false,
                                      plugins: {
                                        legend: {
                                          position: "top",
                                        },
                                      },
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="sherah-box sherah-border sherah-default-bg">
                            <div className="sherah-box__header">
                              <h5 className="sherah-box__title">
                                Top sản phẩm bán chạy
                              </h5>
                            </div>
                            <div className="sherah-box__body">
                              {topProductsData && (
                                <div style={{ height: "300px" }}>
                                  <Bar
                                    data={topProductsData}
                                    options={{
                                      responsive: true,
                                      maintainAspectRatio: false,
                                      plugins: {
                                        legend: {
                                          position: "top",
                                        },
                                      },
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Recent Orders */}
                      <div className="row mg-top-30">
                        <div className="col-lg-6">
                          <div className="sherah-box sherah-border sherah-default-bg">
                            <div className="sherah-box__header">
                              <h5 className="sherah-box__title">
                                Đơn hàng gần đây
                              </h5>
                            </div>
                            <div className="sherah-box__body">
                              <div className="sherah-table">
                                <table className="table">
                                  <thead>
                                    <tr>
                                      <th>ID</th>
                                      <th>Người dùng</th>
                                      <th>Tổng tiền</th>
                                      <th>Trạng thái</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {stats?.recentOrders?.map((order) => (
                                      <tr key={order._id}>
                                        <td>#{order._id.slice(-6)}</td>
                                        <td>{order.user?.username || "N/A"}</td>
                                        <td>
                                          {order.totalPrice?.toLocaleString()}{" "}
                                          VND
                                        </td>
                                        <td>
                                          <span
                                            className={`badge ${
                                              order.status === "Completed"
                                                ? "bg-success"
                                                : order.status === "Pending"
                                                ? "bg-warning"
                                                : order.status === "Processing"
                                                ? "bg-info"
                                                : order.status === "Cancelled"
                                                ? "bg-danger"
                                                : "bg-secondary"
                                            }`}
                                          >
                                            {order.status}
                                          </span>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="sherah-box sherah-border sherah-default-bg">
                            <div className="sherah-box__header">
                              <h5 className="sherah-box__title">
                                Người dùng mới
                              </h5>
                            </div>
                            <div className="sherah-box__body">
                              <div className="sherah-table">
                                <table className="table">
                                  <thead>
                                    <tr>
                                      <th>Tên người dùng</th>
                                      <th>Email</th>
                                      <th>Ngày đăng ký</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {stats?.recentUsers?.map((user) => (
                                      <tr key={user._id}>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>
                                          {new Date(
                                            user.createdAt
                                          ).toLocaleDateString()}
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Statistics;
