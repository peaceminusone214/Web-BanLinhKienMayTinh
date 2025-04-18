import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Warehouse() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSortedByNameAsc, setIsSortedByNameAsc] = useState(true);
  const [isSortedByCategoryAsc, setIsSortedByCategoryAsc] = useState(true);
  const [isSortedByQuantityAsc, setIsSortedByQuantityAsc] = useState(true);
  const [productToRestore, setProductToRestore] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});
  const [categories, setCategories] = useState([]);

  const handleEditClick = (product) => {
    setEditingProductId(product._id);
    setEditedProduct({ ...product }); // Sao chép dữ liệu sản phẩm vào state
  };

  const handleInputChange = (e, field) => {
    setEditedProduct({ ...editedProduct, [field]: e.target.value });
  };

  const handleSaveClick = () => {
    handleUpdateProduct(editingProductId);
    setEditingProductId(null); // Thoát chế độ chỉnh sửa
  };

  useEffect(() => {
    fetch(`${API_URL}/product/get-deleted-products`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Không thể lấy dữ liệu sản phẩm");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Gọi API để lấy danh sách danh mục
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/product/categories`);
        const data = await response.json();

        // Giả sử API trả về dữ liệu là một mảng các đối tượng chứa trường 'name'
        setCategories(data.map((category) => category.name));
      } catch (err) {
        console.error("Lỗi khi lấy danh mục:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleSortByName = () => {
    const sortedProducts = [...products];
    sortedProducts.sort((a, b) => {
      if (isSortedByNameAsc) {
        return a.product_name.localeCompare(b.product_name);
      } else {
        return b.product_name.localeCompare(a.product_name);
      }
    });
    setProducts(sortedProducts);
    setIsSortedByNameAsc(!isSortedByNameAsc); // Toggle sort direction
  };

  const handleSortByCategory = () => {
    const sortedProducts = [...products];
    sortedProducts.sort((a, b) => {
      if (isSortedByCategoryAsc) {
        return a.category_id.name.localeCompare(b.category_id.name);
      } else {
        return b.category_id.name.localeCompare(a.category_id.name);
      }
    });
    setProducts(sortedProducts);
    setIsSortedByCategoryAsc(!isSortedByCategoryAsc); // Toggle sort direction
  };

  const handleSortByQuantity = () => {
    const sortedProducts = [...products];
    sortedProducts.sort((a, b) => {
      if (isSortedByQuantityAsc) {
        return a.stock_quantity - b.stock_quantity;
      } else {
        return b.stock_quantity - a.stock_quantity;
      }
    });
    setProducts(sortedProducts);
    setIsSortedByQuantityAsc(!isSortedByQuantityAsc); // Toggle sort direction
  };

  const handleRestoreClick = (productId) => {
    // Set the productToRestore to the current product ID
    setProductToRestore(productId);
  };

  const handleConfirmRestore = () => {
    // Make Restore request to the server to restore the product
    fetch(`${API_URL}/product/restore-products`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ids: [productToRestore], // Send the product ID to restore
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          setProducts(
            products.filter((product) => product._id !== productToRestore)
          );
        }
        setProductToRestore(null); // Reset the productToRestore state after confirmation
      })
      .catch((error) => {
        setError("Có lỗi xảy ra khi xóa sản phẩm.");
        setProductToRestore(null);
      });
  };

  const handleUpdateProduct = (productId) => {
    // Kiểm tra nếu không có sản phẩm được chỉnh sửa
    if (!editedProduct || !productId) {
      console.error("Không có dữ liệu sản phẩm cần cập nhật.");
      return;
    }

    const updatedProduct = {
      _id: productId, // Lấy ID sản phẩm
      product_name: editedProduct.product_name, // Lấy tên sản phẩm đã nhập
      category_id: editedProduct.category_id, // Lấy category ID từ danh mục đã chọn
      stock_quantity: parseInt(editedProduct.stock_quantity) || 0, // Lấy số lượng đã nhập
      price: parseFloat(editedProduct.price) || 0, // Lấy giá đã nhập
    };

    console.log("Dữ liệu gửi API:", updatedProduct); // Kiểm tra dữ liệu trước khi gửi

    // Gửi yêu cầu cập nhật sản phẩm
    fetch(`${API_URL}/product/update-product`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProduct),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Phản hồi từ server:", data);
        if (data.message) {
          // Cập nhật lại danh sách sản phẩm
          setProducts(
            products.map((product) =>
              product._id === productId
                ? { ...product, ...updatedProduct }
                : product
            )
          );
        }
        setEditingProductId(null); // Thoát chế độ chỉnh sửa
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật sản phẩm:", error);
        setError("Có lỗi xảy ra khi cập nhật sản phẩm.");
      });
  };

  const handleCancelRestore = () => {
    // Reset productToRestore to null to cancel restore operation
    setProductToRestore(null);
  };

  if (loading) {
    return <div>Đang tải sản phẩm...</div>;
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
                            Danh sách sản phẩm đã xoá
                          </h2>
                          <ul className="sherah-breadcrumb__list">
                            <li>
                              <a href="#">admin</a>
                            </li>
                            <li className="active">
                              <Link to="/admin/warehouse">warehouse</Link>
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
                              ID sản phẩm
                            </th>
                            <th className="sherah-table__column-2 sherah-table__h2">
                              Tên sản phẩm
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
                            <th className="sherah-table__column-3 sherah-table__h3">
                              Danh mục
                              <button
                                onClick={handleSortByCategory}
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
                            <th className="sherah-table__column-4 sherah-table__h4">
                              Số lượng
                              <button
                                onClick={handleSortByQuantity}
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
                            <th className="sherah-table__column-5 sherah-table__h5">
                              Giá
                            </th>
                            <th className="sherah-table__column-8 sherah-table__h8">
                              Thao tác
                            </th>
                          </tr>
                        </thead>
                        <tbody className="sherah-table__body">
                          {products.map((product) => (
                            <tr key={product._id}>
                              <td className="sherah-table__column-1 sherah-table__data-1">
                                <p className="crany-table__product--number">
                                  <a href="#" className="sherah-color1">
                                    {product._id}
                                  </a>
                                </p>
                              </td>
                              <td className="sherah-table__column-2 sherah-table__data-2">
                                {editingProductId === product._id ? (
                                  <input
                                    type="text"
                                    value={editedProduct.product_name}
                                    onChange={(e) =>
                                      handleInputChange(e, "product_name")
                                    }
                                  />
                                ) : (
                                  <p className="sherah-table__product-desc">
                                    {product.product_name}
                                  </p>
                                )}
                              </td>
                              <td className="sherah-table__column-5 sherah-table__data-5">
                                {editingProductId === product._id ? (
                                  <select
                                    className="form-group__input"
                                    aria-label="Chọn danh mục"
                                    value={editedProduct.category_id.name || ""}
                                    onChange={(e) =>
                                      setEditedProduct({
                                        ...editedProduct,
                                        category_id: {
                                          ...editedProduct.category_id,
                                          name: e.target.value,
                                        },
                                      })
                                    }
                                  >
                                    <option value="">Chọn danh mục</option>
                                    {categories.length > 0 ? (
                                      categories.map((category, index) => (
                                        <option key={index} value={category}>
                                          {category}
                                        </option>
                                      ))
                                    ) : (
                                      <option disabled>
                                        Không có danh mục nào
                                      </option>
                                    )}
                                  </select>
                                ) : (
                                  <p className="sherah-table__product-desc">
                                    {product.category_id.name}
                                  </p>
                                )}
                              </td>
                              <td className="sherah-table__column-5 sherah-table__data-5">
                                {editingProductId === product._id ? (
                                  <input
                                    type="number"
                                    value={editedProduct.stock_quantity}
                                    onChange={(e) =>
                                      handleInputChange(e, "stock_quantity")
                                    }
                                  />
                                ) : (
                                  <p className="sherah-table__product-desc">
                                    {product.stock_quantity}
                                  </p>
                                )}
                              </td>
                              <td className="sherah-table__column-5 sherah-table__data-5">
                                {editingProductId === product._id ? (
                                  <input
                                    type="number"
                                    value={editedProduct.price}
                                    onChange={(e) =>
                                      handleInputChange(e, "price")
                                    }
                                  />
                                ) : (
                                  <p className="sherah-table__product-desc">
                                    {product.price.toLocaleString("vi-VN", {
                                      style: "currency",
                                      currency: "VND",
                                    })}
                                  </p>
                                )}
                              </td>
                              <td className="sherah-table__column-8 sherah-table__data-8">
                                <div className="sherah-table__status__group">
                                  {editingProductId === product._id ? (
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
                                          setEditingProductId(null)
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
                                      onClick={() => handleEditClick(product)}
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
                                    href="#"
                                    className="sherah-table__action sherah-color2 sherah-color2__bg--offset"
                                    onClick={() =>
                                      handleRestoreClick(product._id)
                                    } // Pass product ID
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
                                {productToRestore === product._id && (
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
                                      Bạn có chắc chắn muốn khôi phục sản phẩm
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

export default Warehouse;
