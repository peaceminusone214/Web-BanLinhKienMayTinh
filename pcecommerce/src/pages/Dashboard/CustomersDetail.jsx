import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../../redux/actions/userActions";
import { getUserById } from "../../Service/userApi";

function CustomersDetail() {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) =>
    state.user.users.find((u) => u._id === userId)
  );

  useEffect(() => {
    const fetchUserDetail = async () => {
      if (!user) {
        try {
          const fetchedUser = await getUserById(userId);
          dispatch(setSelectedUser(fetchedUser));
        } catch (err) {
          console.error("Lỗi khi lấy thông tin người dùng:", err);
        }
      }
    };
    fetchUserDetail();
  }, [userId, dispatch, user]);

  if (!user)
    return <p className="text-center mt-5">Đang tải thông tin người dùng...</p>;

  const { address = {} } = user;

  return (
    <div className="sherah-body-area">
      <section className="sherah-adashboard sherah-show">
        <div className="container py-4">
          <div className="row mb-4">
            <div className="col">
              <h2 className="fw-bold">Chi tiết khách hàng</h2>
              <nav>
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="/">Trang chủ</a>
                  </li>
                  <li className="breadcrumb-item active">Customer Detail</li>
                </ol>
              </nav>
            </div>
          </div>
          <div className="row g-4">
            {/* Left: Avatar + Thông tin cơ bản */}
            <div className="col-lg-4">
              <div className="card shadow-sm text-center">
                <div className="card-body">
                  <img
                    src={
                      user.image_url ||
                      "/assets/interface-dashboard/img/customer-profile.png"
                    }
                    alt="Avatar"
                    className="rounded-circle mb-3"
                    style={{ width: 120, height: 120, objectFit: "cover" }}
                  />
                  <h4 className="fw-bold">{user.name || "Chưa có tên"}</h4>
                  <p className="mb-1 text-muted">
                    {user.phoneNumber || "Chưa có số điện thoại"}
                  </p>
                  <p>
                    <a
                      href={`mailto:${user.email}`}
                      className="text-decoration-none"
                    >
                      {user.email || "Chưa có email"}
                    </a>
                  </p>
                  <div className="bg-light p-2 rounded mt-3">
                    <strong>Số dư tài khoản:</strong>{" "}
                    <span className="text-success">$1200</span>
                  </div>
                  <ul className="list-unstyled mt-3 text-start">
                    <li>
                      <strong>Ngày tạo:</strong>{" "}
                      {new Date(user.created_at).toLocaleDateString()}
                    </li>
                    <li>
                      <strong>Trạng thái:</strong>{" "}
                      <span
                        className={`badge ${
                          user.deleted ? "bg-danger" : "bg-success"
                        }`}
                      >
                        {user.deleted ? "Đã xóa" : "Hoạt động"}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right: Thông tin chi tiết */}
            <div className="col-lg-8">
              <div className="row g-4">
                {/* Thông tin cá nhân */}
                <div className="col-md-6">
                  <div className="card h-100 shadow-sm">
                    <div className="card-header bg-primary text-white">
                      <strong>Thông tin cá nhân</strong>
                    </div>
                    <div className="card-body">
                      <ul className="list-unstyled">
                        <li>
                          <strong>Tên:</strong> {user.name}
                        </li>
                        <li>
                          <strong>Email:</strong> {user.email}
                        </li>
                        <li>
                          <strong>Ngày sinh:</strong>{" "}
                          {user.dateOfBirth
                            ? new Date(user.dateOfBirth).toLocaleDateString()
                            : "Chưa cập nhật"}
                        </li>
                        <li>
                          <strong>SĐT:</strong>{" "}
                          {user.phoneNumber || "Chưa cập nhật"}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Thông tin bổ sung */}
                <div className="col-md-6">
                  <div className="card h-100 shadow-sm">
                    <div className="card-header bg-secondary text-white">
                      <strong>Thông tin bổ sung</strong>
                    </div>
                    <div className="card-body">
                      <ul className="list-unstyled">
                        <li>
                          <strong>Giới thiệu:</strong>{" "}
                          {user.about || "Chưa cập nhật"}
                        </li>
                        <li>
                          <strong>Ảnh đại diện:</strong>{" "}
                          {user.image_url ? "Đã cập nhật" : "Chưa có"}
                        </li>
                        <li>
                          <strong>Địa chỉ:</strong>{" "}
                          {[
                            address.street,
                            address.ward,
                            address.city,
                            address.province,
                          ]
                            .filter(Boolean)
                            .join(", ") || "Chưa cập nhật"}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>{" "}
          {/* end row */}
        </div>
      </section>
    </div>
  );
}

export default CustomersDetail;
