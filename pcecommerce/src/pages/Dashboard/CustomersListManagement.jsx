import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  setUsers,
  updateUser,
  deleteUser,
  setSelectedUser,
  setUserData,
  setEditMode,
} from "../../redux/actions/userActions";

import {
  fetchUsers,
  updateUser as updateUserAPI,
  deleteUser as deleteUserAPI,
} from "../../Service/userApi";

function CustomersListManagement() {
  const dispatch = useDispatch();
  const { users, selectedUser, userData } = useSelector((state) => state.user);

  // Lấy dữ liệu user
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        dispatch(setUsers(data));
      } catch (err) {
        toast.error("Lỗi khi tải danh sách người dùng");
      }
    };
    loadUsers();
  }, [dispatch]);

  const handleEditSubmit = async () => {
    try {
      const updated = await updateUserAPI(selectedUser._id, userData);
      dispatch(updateUser(updated));
      toast.success("Cập nhật người dùng thành công!");
    } catch {
      toast.error("Cập nhật thất bại!");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUserAPI(userId);
      dispatch(deleteUser(userId));
      toast.success("Đã xóa người dùng.");
    } catch {
      toast.error("Lỗi khi xóa người dùng.");
    }
  };

  const handleSelectUser = (user) => {
    dispatch(setSelectedUser(user));
    dispatch(setUserData({
      name: user.name || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      address: user.address || "",
      about: user.about || "",
      image_url: user.image_url || "",
      dateOfBirth: user.dateOfBirth?.slice(0, 10) || "",
    }));
    dispatch(setEditMode(true));
  };

  return (
    <div className="sherah-body-area">
      <ToastContainer />
      <section className="sherah-adashboard sherah-show">
        <div className="container">
          <div className="sherah-breadcrumb mg-top-30">
            <h2 className="sherah-breadcrumb__title">DANH SÁCH KHÁCH HÀNG</h2>
            <ul className="sherah-breadcrumb__list">
              <li><a href="#">Home</a></li>
              <li className="active"><a href="#">Customer List</a></li>
            </ul>
          </div>

          <div className="sherah-table sherah-border mg-top-25">
            <table className="table table-bordered">
              <thead style={{ fontSize: "14px" }}>
                <tr>
                  <th>Họ và tên</th>
                  <th>Email</th>
                  <th>Đơn hàng</th>
                  <th>Địa chỉ</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: "16px" }}>
                {users.filter(u => !u.deleted).map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={user.image_url || "/assets/interface-dashboard/img/vendor-1.png"}
                          alt="#"
                          style={{ width: "36px", height: "36px", borderRadius: "50%" }}
                        />
                        <Link to={`/admin/customer/${user._id}`} className="sherah-color1">
                          {user.name}
                        </Link>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>120</td>
                    <td>
                      {user.address
                        ? [user.address.street, user.address.ward, user.address.city, user.address.province]
                          .filter(Boolean)
                          .join(", ")
                        : "N/A"}
                    </td>

                    <td><span className="badge bg-success">Hoạt động</span></td>
                    <td>{new Date(user.created_at).toLocaleDateString("vi-VN")}</td>
                    <td>
                      <button onClick={() => handleSelectUser(user)} className="btn btn-warning btn-sm me-2">Sửa</button>
                      <button onClick={() => handleDeleteUser(user._id)} className="btn btn-danger btn-sm">Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* FORM CHỈNH SỬA */}
          {selectedUser && (
            <div className="edit-form mt-5 p-4 border rounded bg-white shadow-sm">
              <h4 className="mb-4">🛠️ Chỉnh sửa thông tin người dùng</h4>
              <div className="row">
                <div className="col-md-6">
                  {["name", "email", "phoneNumber", "address"].map((field) => (
                    <div className="mb-3" key={field}>
                      <label className="form-label">
                        {{
                          name: "Họ và tên",
                          email: "Email",
                          phoneNumber: "Số điện thoại",
                          address: "Địa chỉ"
                        }[field]}
                      </label>
                      <input
                        type={field === "email" ? "email" : "text"}
                        className="form-control"
                        value={userData[field]}
                        onChange={(e) => dispatch(setUserData({ ...userData, [field]: e.target.value }))}
                      />
                    </div>
                  ))}
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Giới thiệu</label>
                    <textarea
                      className="form-control"
                      value={userData.about}
                      onChange={(e) => dispatch(setUserData({ ...userData, about: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Ảnh đại diện (URL)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={userData.image_url}
                      onChange={(e) => dispatch(setUserData({ ...userData, image_url: e.target.value }))}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Ngày sinh</label>
                    <input
                      type="date"
                      className="form-control"
                      value={userData.dateOfBirth}
                      onChange={(e) => dispatch(setUserData({ ...userData, dateOfBirth: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
              <div className="text-end">
                <button className="btn btn-primary" onClick={handleEditSubmit}>💾 Lưu chỉnh sửa</button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default CustomersListManagement;
