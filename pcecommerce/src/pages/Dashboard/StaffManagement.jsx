import React, { useEffect, useState } from "react";
import axios from "axios";

function StaffManagement() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [staffList, setStaffList] = useState([]);
  const [error, setError] = useState(null);
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [editingStaffId, setEditingStaffId] = useState(null);
  const [editedStaff, setEditedStaff] = useState({});

  const roles = [
    { value: "admin", label: "Quản trị viên" },
    { value: "cashier", label: "Thu ngân" },
    { value: "productManagement", label: "Quản lý kho" },
    { value: "guest", label: "Khách" },
  ];

  const getRoleLabel = (role) => {
    switch (role) {
      case "admin":
        return "Quản trị viên";
      case "cashier":
        return "Thu ngân";
      case "productManagement":
        return "Quản lý kho";
      case "guest":
        return "Khách";
      default:
        return role;
    }
  };

  useEffect(() => {
    axios
      .get(`${API_URL}/user/get-staff`)
      .then((res) => {
        setStaffList(res.data);
      })
      .catch((err) => {
        console.error("Lỗi khi fetch nhân viên:", err);
      });
  }, []);

  const handleConfirmDelete = () => {
    fetch(`${API_URL}/user/delete/${staffToDelete}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data._id) {
          setStaffList(
            staffList.filter((staff) => staff._id !== staffToDelete)
          );
        } else {
          setError("Không tìm thấy người dùng.");
        }
        setStaffToDelete(null);
      })
      .catch((error) => {
        setError("Có lỗi xảy ra khi xóa người dùng.");
        setStaffToDelete(null);
      });
  };

  const handleCancelDelete = () => {
    // Reset productToDelete to null to cancel the delete operation
    setStaffToDelete(null);
  };

  const handleDeleteClick = (staffId) => {
    // Set the productToDelete to the current product ID
    setStaffToDelete(staffId);
  };

  const handleEditClick = (staff) => {
    setEditingStaffId(staff._id);
    setEditedStaff({ ...staff }); // Copy thông tin staff hiện tại
  };

  const handleInputChange = (e, field) => {
    setEditedStaff({ ...editedStaff, [field]: e.target.value });
  };

  const handleSaveClick = () => {
    if (!editingStaffId || !editedStaff) return;

    fetch(`${API_URL}/user/edit-user`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        userId: editingStaffId,
        name: editedStaff.name,
        email: editedStaff.email,
        phoneNumber: editedStaff.phoneNumber,
        image_url: editedStaff.image_url,
        dateOfBirth: editedStaff.dateOfBirth,
        role: editedStaff.role,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          // Cập nhật lại staffList
          setStaffList(
            staffList.map((staff) =>
              staff._id === editingStaffId ? { ...staff, ...data.user } : staff
            )
          );
          setEditingStaffId(null); // Thoát khỏi chế độ chỉnh sửa
        } else {
          setError("Không thể cập nhật nhân viên");
        }
      })
      .catch((err) => {
        console.error("Lỗi khi cập nhật:", err);
        setError("Có lỗi xảy ra khi cập nhật nhân viên");
      });
  };

  return (
    <div>
      <>
        <div className="sherah-body-area">
          {/* sherah Dashboard */}
          <section className="sherah-adashboard sherah-show">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="sherah-body">
                    {/* Dashboard Inner */}
                    <div className="sherah-dsinner">
                      <div className="row">
                        <div className="col-12">
                          <div className="sherah-breadcrumb mg-top-30">
                            <h2 className="sherah-breadcrumb__title">
                              Danh sách nhân viên
                            </h2>
                            <ul className="sherah-breadcrumb__list">
                              <li>
                                <a href="#">admin</a>
                              </li>
                              <li className="active">
                                <a href="/admin/staffmanagement">
                                  staffmanagement
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="sherah-page-inner sherah-default-bg sherah-border mg-top-25">
                        <div className="sherah-table p-0">
                          <table
                            id="sherah-table__vendor"
                            className="sherah-table__main sherah-table__main-v3"
                          >
                            {/* sherah Table Head */}
                            <thead className="sherah-table__head">
                              <tr>
                                <th className="sherah-table__column-1 sherah-table__h1">
                                  Hình
                                </th>
                                <th className="sherah-table__column-2 sherah-table__h2">
                                  Tên
                                </th>
                                <th className="sherah-table__column-3 sherah-table__h3">
                                  Email
                                </th>
                                <th className="sherah-table__column-4 sherah-table__h4">
                                  Ngày tham gia
                                </th>
                                <th className="sherah-table__column-5 sherah-table__h5">
                                  Quyền
                                </th>
                                <th className="sherah-table__column-6 sherah-table__h6">
                                  Thao tác
                                </th>
                              </tr>
                            </thead>
                            <tbody className="sherah-table__body">
                              {staffList.map((staff, index) => (
                                <tr key={index}>
                                  <td className="sherah-table__column-1 sherah-table__data-1">
                                    <div className="sherah-table__product">
                                      <div className="sherah-table__vendor-img">
                                        <img
                                          src={staff.image_url}
                                          alt="avatar"
                                        />
                                      </div>
                                    </div>
                                  </td>
                                  <td className="sherah-table__column-2 sherah-table__data-2">
                                    <div className="sherah-table__vendor">
                                      <h4 className="sherah-table__vendor--title">
                                        {editingStaffId === staff._id ? (
                                          <input
                                            type="text"
                                            value={editedStaff.name}
                                            onChange={(e) =>
                                              handleInputChange(e, "name")
                                            }
                                          />
                                        ) : (
                                          staff.name
                                        )}
                                      </h4>
                                    </div>
                                  </td>
                                  <td className="sherah-table__column-3 sherah-table__data-3">
                                    <div className="sherah-table__product-content">
                                      <p className="sherah-table__product-desc">
                                        {editingStaffId === staff._id ? (
                                          <input
                                            type="text"
                                            value={editedStaff.email}
                                            onChange={(e) =>
                                              handleInputChange(e, "email")
                                            }
                                          />
                                        ) : (
                                          staff.email
                                        )}
                                      </p>
                                    </div>
                                  </td>
                                  <td className="sherah-table__column-7 sherah-table__data-7">
                                    <div className="sherah-table__product-content">
                                      <p className="sherah-table__product-desc">
                                        {new Date(
                                          staff.created_at
                                        ).toLocaleDateString("vi-VN")}
                                      </p>
                                    </div>
                                  </td>
                                  <td className="sherah-table__column-7 sherah-table__data-7">
                                    <div className="sherah-table__product-content">
                                      <p className="sherah-table__product-desc">
                                        {editingStaffId === staff._id ? (
                                          <select
                                            value={editedStaff.role}
                                            onChange={(e) =>
                                              handleInputChange(e, "role")
                                            }
                                            style={{
                                              padding: "4px",
                                              borderRadius: "6px",
                                            }}
                                          >
                                            {roles.map((r) => (
                                              <option
                                                key={r.value}
                                                value={r.value}
                                              >
                                                {r.label}
                                              </option>
                                            ))}
                                          </select>
                                        ) : (
                                          getRoleLabel(staff.role)
                                        )}
                                      </p>
                                    </div>
                                  </td>
                                  <td className="sherah-table__column-8 sherah-table__data-8">
                                    <div className="sherah-table__status__group">
                                      {editingStaffId === staff._id ? (
                                        <>
                                          <button
                                            onClick={handleSaveClick}
                                            className="sherah-color3"
                                            style={{
                                              borderRadius: "8px",
                                              padding: "8px 16px",
                                              border: "none",
                                              cursor: "pointer",
                                            }}
                                          >
                                            Lưu
                                          </button>
                                          <button
                                            onClick={() =>
                                              setEditingStaffId(null)
                                            }
                                            className="sherah-color2"
                                            style={{
                                              borderRadius: "8px",
                                              padding: "8px 16px",
                                              border: "none",
                                              cursor: "pointer",
                                            }}
                                          >
                                            Hủy
                                          </button>
                                        </>
                                      ) : (
                                        <a
                                          href="#"
                                          className="sherah-table__action sherah-color2 sherah-color3__bg--opactity"
                                          onClick={() => handleEditClick(staff)}
                                        >
                                          {/* Edit icon */}
                                          <svg
                                            className="sherah-color3__fill"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="18.29"
                                            height="18.252"
                                            viewBox="0 0 18.29 18.252"
                                          >
                                            <g
                                              id="Group_132"
                                              data-name="Group 132"
                                              transform="translate(-234.958 -37.876)"
                                            >
                                              <path
                                                id="Path_481"
                                                data-name="Path 481"
                                                d="M242.545,95.779h-5.319a2.219,2.219,0,0,1-2.262-2.252c-.009-1.809,0-3.617,0-5.426q0-2.552,0-5.1a2.3,2.3,0,0,1,2.419-2.419q2.909,0,5.818,0c.531,0,.87.274.9.715a.741.741,0,0,1-.693.8c-.3.026-.594.014-.892.014q-2.534,0-5.069,0c-.7,0-.964.266-.964.976q0,5.122,0,10.245c0,.687.266.955.946.955q5.158,0,10.316,0c.665,0,.926-.265.926-.934q0-2.909,0-5.818a.765.765,0,0,1,.791-.853.744.744,0,0,1,.724.808c.007,1.023,0,2.047,0,3.07s.012,2.023-.006,3.034A2.235,2.235,0,0,1,248.5,95.73a1.83,1.83,0,0,1-.458.048Q245.293,95.782,242.545,95.779Z"
                                                transform="translate(0 -39.652)"
                                                fill="#09ad95"
                                              />
                                              <path
                                                id="Path_482"
                                                data-name="Path 482"
                                                d="M332.715,72.644l2.678,2.677c-.05.054-.119.133-.194.207q-2.814,2.815-5.634,5.625a1.113,1.113,0,0,1-.512.284c-.788.177-1.582.331-2.376.48-.5.093-.664-.092-.564-.589.157-.781.306-1.563.473-2.341a.911.911,0,0,1,.209-.437q2.918-2.938,5.853-5.86A.334.334,0,0,1,332.715,72.644Z"
                                                transform="translate(-84.622 -32.286)"
                                                fill="#09ad95"
                                              />
                                              <path
                                                id="Path_483"
                                                data-name="Path 483"
                                                d="M433.709,42.165l-2.716-2.715a15.815,15.815,0,0,1,1.356-1.248,1.886,1.886,0,0,1,2.579,2.662A17.589,17.589,0,0,1,433.709,42.165Z"
                                                transform="translate(-182.038)"
                                                fill="#09ad95"
                                              />
                                            </g>
                                          </svg>
                                        </a>
                                      )}
                                      <a
                                        className="sherah-table__action sherah-color2 sherah-color2__bg--offset"
                                        onClick={() =>
                                          handleDeleteClick(staff._id)
                                        }
                                      >
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
                                    {staffToDelete === staff._id && (
                                      <div
                                        style={{
                                          background: "#fff",
                                          padding: "20px",
                                          borderRadius: "12px",
                                          boxShadow:
                                            "0 4px 12px rgba(0,0,0,0.15)",
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
                                          Bạn có chắc chắn muốn xóa nhân viên
                                          này?
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
                                            (e.target.style.background =
                                              "#c0392b")
                                          }
                                          onMouseOut={(e) =>
                                            (e.target.style.background =
                                              "#e74c3c")
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
                                            (e.target.style.background =
                                              "#95a5a6")
                                          }
                                          onMouseOut={(e) =>
                                            (e.target.style.background =
                                              "#bdc3c7")
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

export default StaffManagement;
