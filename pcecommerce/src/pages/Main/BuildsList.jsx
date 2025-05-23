import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Buildslist() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [builds, setBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSortedByNameAsc, setIsSortedByNameAsc] = useState(true);
  const [buildToDelete, setBuildToDelete] = useState(null);
  const [editingBuildId, setEditingBuildId] = useState(null);
  const [editedBuild, setEditedBuild] = useState({});

  useEffect(() => {
    fetch(`${API_URL}/build/my-builds`, { credentials: "include" })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Bạn chưa lưu cấu hình nào hết. Vui lòng thêm cấu hình ở trang xây dựng cấu hình");
        }
        return response.json();
      })
      .then(async (data) => {
        // Lấy tên sản phẩm cho từng component
        const buildsWithNames = await Promise.all(
          data.map(async (build) => {
            const componentsWithNames = await Promise.all(
              build.components.map(async (component) => {
                const productName = await fetchProductName(component._id);
                return { ...component, product_name: productName };
              })
            );
            return { ...build, components: componentsWithNames };
          })
        );
        setBuilds(buildsWithNames);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);  

  const handleSortByName = () => {
    const sortedBuilds = [...builds];
    sortedBuilds.sort((a, b) => {
      if (isSortedByNameAsc) {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
    setBuilds(sortedBuilds);
    setIsSortedByNameAsc(!isSortedByNameAsc); // Toggle sort direction
  };

  const handleInputChange = (e, field) => {
    setEditedBuild({ ...editedBuild, [field]: e.target.value });
  };

  const handleDeleteClick = (buildId) => {
    // Set the buildToDelete to the current build ID
    setBuildToDelete(buildId);
  };

  const handleSaveClick = () => {
    handleUpdateBuild(editingBuildId);
    setEditingBuildId(null); // Thoát chế độ chỉnh sửa
  };

  const handleConfirmDelete = () => {
    fetch(`${API_URL}/build/delete-builds`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        ids: [buildToDelete],
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          setBuilds(
            builds.filter((build) => build._id !== buildToDelete)
          );
        }
        setBuildToDelete(null);
      })
      .catch((error) => {
        setError("Có lỗi xảy ra khi xóa cấu hình.");
        setBuildToDelete(null);
      });
  };

  const handleEditClick = (build) => {
    setEditingBuildId(build._id);
    setEditedBuild({ ...build });
  };

  const handleCancelDelete = () => {
    // Reset buildToDelete to null to cancel the delete operation
    setBuildToDelete(null);
  };

  const handleUpdateBuild = (buildId) => {
    // Kiểm tra nếu không có cấu hình được chỉnh sửa
    if (!editedBuild || !buildId) {
      console.error("Không có dữ liệu cấu hình cần cập nhật.");
      return;
    }

    const updatedBuild = {
      _id: buildId,
      name: editedBuild.name,
    };

    console.log("Dữ liệu gửi API:", updatedBuild); // Kiểm tra dữ liệu trước khi gửi

    // Gửi yêu cầu cập nhật cấu hình
    fetch(`${API_URL}/build/update-build`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(updatedBuild),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Phản hồi từ server:", data);
        if (data.message) {
          // Cập nhật lại danh sách cấu hình
          setBuilds(
            builds.map((build) =>
              build._id === buildId
                ? { ...build, ...updatedBuild }
                : build
            )
          );
        }
        setEditingBuildId(null); // Thoát chế độ chỉnh sửa
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật cấu hình:", error);
        setError("Có lỗi xảy ra khi cập nhật cấu hình.");
      });
  };

  const fetchProductName = async (componentId) => {
    try {
      const response = await fetch(`${API_URL}/product/${componentId}`);
      const data = await response.json();
      return data.product_name || componentId;
    } catch (error) {
      console.error("Lỗi khi lấy product name:", error);
      return componentId; // fallback nếu lỗi
    }
  };
  
  if (loading) {
    return <div>Đang tải cấu hình...</div>;
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
                            Danh sách cấu hình
                          </h2>
                          <ul className="sherah-breadcrumb__list">
                            <li>
                              <a>Trang chủ</a>
                            </li>
                            <li className="active">
                              <Link to="/buildslist">buildslist</Link>
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
                        <thead className="sherah-table__head">
                          <tr>
                            <th className="sherah-table__column-1 sherah-table__h1">
                              ID cấu hình
                            </th>
                            <th className="sherah-table__column-2 sherah-table__h2">
                              Tên cấu hình
                              <button
                                onClick={handleSortByName}
                                style={{
                                  padding: "4px 8px",
                                  fontSize: "14px",
                                  background: "transparent",
                                  border: "none",
                                  cursor: "pointer",
                                }}
                              >
                                {isSortedByNameAsc ? (
                                  <i
                                    className="fa-duotone fa-solid fa-sort-up"
                                    style={{ fontSize: "16px" }}
                                  ></i>
                                ) : (
                                  <i
                                    className="fa-duotone fa-solid fa-sort-down"
                                    style={{ fontSize: "16px" }}
                                  ></i>
                                )}
                              </button>
                            </th>
                            <th className="sherah-table__column-10 sherah-table__h3">
                              Danh sách phần cứng
                            </th>
                            <th className="sherah-table__column-8 sherah-table__h8">
                              Thao tác
                            </th>
                          </tr>
                        </thead>
                        <tbody className="sherah-table__body">
                          {builds.map((build) => (
                            <tr key={build._id}>
                              <td className="sherah-table__column-1 sherah-table__data-1">
                                <p className="crany-table__product--number">
                                <a
                                    className="sherah-color1"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      const target = e.target;
                                      target.textContent =
                                        target.textContent === build._id
                                          ? build._id.slice(0, 3) + "..."
                                          : build._id;
                                    }}
                                  >
                                    {build._id.slice(0, 3) + "..."}
                                  </a>
                                </p>
                              </td>
                              <td className="sherah-table__column-2 sherah-table__data-2">
                                {editingBuildId === build._id ? (
                                  <input
                                    type="text"
                                    value={editedBuild.name}
                                    onChange={(e) =>
                                      handleInputChange(e, "name")
                                    }
                                  />
                                ) : (
                                  <p className="sherah-table__product-desc">
                                    {build.name}
                                  </p>
                                )}
                              </td>
                              <td className="sherah-table__column-3 sherah-table__data-3">
                                {build.components.map((component, index) => (
                                  <div key={component._id} style={{ marginBottom: "4px" }}>
                                    {index + 1}. {component.product_name} - SL: {component.quantity}
                                  </div>
                                ))}
                              </td>
                              <td className="sherah-table__column-8 sherah-table__data-8">
                                <div className="sherah-table__status__group">
                                  {editingBuildId === build._id ? (
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
                                          setEditingBuildId(null)
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
                                      className="sherah-table__action sherah-color2 sherah-color3__bg--opactity"
                                      onClick={() => handleEditClick(build)}
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
                                      handleDeleteClick(build._id)
                                    } // Pass build ID
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
                                {buildToDelete === build._id && (
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
                                      Bạn có chắc chắn muốn xóa cấu hình này?
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

export default Buildslist;
