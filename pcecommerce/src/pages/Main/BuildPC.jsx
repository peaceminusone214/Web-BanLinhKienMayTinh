import React, { useState, useEffect } from "react";
import { FaTrash, FaPlus, FaSync } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./MainStyles/styleBuildPC.css";

const BuildPC = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [sortOption, setSortOption] = useState("default");
  const [selectedCPU, setSelectedCPU] = useState(null);
  const [selectedMainboard, setSelectedMainboard] = useState(null);

  const handlePrint = () => {
    const html = `
      <html>
        <head>
          <title>WatchTheCAT</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            h2 { text-align: center; }
          </style>
        </head>
        <body>
          <h2>PHIẾU BÁO GIÁ</h2>
          <p>Ngày: ${new Date().toLocaleDateString('vi-VN')}</p>
          <table>
            <thead>
              <tr>
                <th>Linh kiện</th>
                <th>Tên sản phẩm</th>
                <th>SL</th>
                <th>Đơn giá</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              ${selectedComponents.map(item => `
                <tr>
                  <td>${item.category}</td>
                  <td>${item.product_name}</td>
                  <td>${item.quantity}</td>
                  <td>${item.price.toLocaleString()} đ</td>
                  <td>${(item.price * item.quantity).toLocaleString()} đ</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <h3 style="margin-top: 20px;">Tổng cộng: ${estimatedCost.toLocaleString()} đ</h3>
        </body>
      </html>
    `;
  
    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
  };  

  useEffect(() => {
    const cpu = selectedComponents.find((item) => item.category === "CPU");
    setSelectedCPU(cpu || null);
  }, [selectedComponents]);

  useEffect(() => {
    const mb = selectedComponents.find((item) => item.category === "Mainboard");
    setSelectedMainboard(mb || null);
  }, [selectedComponents]);

  const handleClickViewBuild = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/session`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          handleOpenBuild();
        }
      } else if (response.status === 401) {
        alert("Bạn cần đăng nhập để xem cấu hình đã lưu");
      } else {
        alert("Đã xảy ra lỗi, vui lòng thử lại sau.");
      }
    } catch (error) {
      alert("Không thể kết nối đến máy chủ.");
    }
  };

  const handleOpenBuild = () => {
    navigate("/buildslist");
  };

  // Lưu vào localStorage khi selectedComponents thay đổi
  useEffect(() => {
    if (selectedComponents.length > 0) {
      localStorage.setItem(
        "selectedComponents",
        JSON.stringify(selectedComponents)
      );
    }
  }, [selectedComponents]);

  // Tải lại selectedComponents từ localStorage khi trang được tải lại
  useEffect(() => {
    const storedComponents = localStorage.getItem("selectedComponents");
    if (storedComponents) {
      setSelectedComponents(JSON.parse(storedComponents));
    }
  }, []);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const filteredProducts = products.filter((prod) => {
    const price = prod.price;

    const matchesBrand =
      selectedBrands.length === 0 || selectedBrands.includes(prod.brand);

    const matchesPrice =
      selectedPriceRanges.length === 0 ||
      selectedPriceRanges.some((range) => {
        if (range === "under1") return price < 1000000;
        if (range === "1to5") return price >= 1000000 && price <= 5000000;
        if (range === "5to10") return price > 5000000 && price <= 10000000;
        if (range === "above10") return price > 10000000;
        return false;
      });

    return matchesBrand && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "price-asc") return a.price - b.price;
    if (sortOption === "price-desc") return b.price - a.price;
    if (sortOption === "newest")
      return new Date(b.updated_at) - new Date(a.updated_at);
    return 0;
  });

  const handlePriceFilterChange = (range) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]
    );
  };

  const handleBrandChange = (brand) => {
    setSelectedBrands((prevBrands) =>
      prevBrands.includes(brand)
        ? prevBrands.filter((b) => b !== brand)
        : [...prevBrands, brand]
    );
  };

  // Lấy danh sách hãng sản xuất từ API
  useEffect(() => {
    if (selectedCategory) {
      fetch(
        `${API_URL}/product/get-brands-category?category_id=${selectedCategory._id}`,
        { credentials: "include" }
      )
        .then((response) => response.json())
        .then((data) => setBrands(data))
        .catch((error) => console.error("Lỗi khi lấy hãng sản xuất:", error));
    }
  }, [selectedCategory]);

  // Lấy danh sách danh mục từ API bằng fetch
  useEffect(() => {
    fetch(`${API_URL}/product/categories`, { credentials: "include" })
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Lỗi khi lấy danh mục:", error));
  }, []);

  // Lấy sản phẩm theo danh mục từ API bằng fetch
  useEffect(() => {
    if (selectedCategory) {
      // Reset filters
      setSelectedBrands([]);
      setSelectedPriceRanges([]);

      // Lấy hãng sản xuất
      fetch(
        `${API_URL}/product/get-brands-category?category_id=${selectedCategory._id}`,
        { credentials: "include" }
      )
        .then((response) => response.json())
        .then((data) => setBrands(data))
        .catch((error) => console.error("Lỗi khi lấy hãng sản xuất:", error));

      // Lấy sản phẩm
      fetch(
        `${API_URL}/product/get-products?category_id=${selectedCategory._id}`,
        { credentials: "include" }
      )
        .then((response) => response.json())
        .then((data) => setProducts(data))
        .catch((error) => console.error("Lỗi khi lấy sản phẩm:", error));
    }
  }, [selectedCategory]);

  // Mở popup chọn sản phẩm theo danh mục
  const openPopup = (category) => {
    setSelectedCategory(category);
    setIsPopupOpen(true);
  };

  // Đóng popup
  const closePopup = () => {
    setIsPopupOpen(false);
  };

  // Thêm sản phẩm từ popup
  const handleAddPopupProduct = (prod) => {
    const newItem = { ...prod, quantity: 1, category: selectedCategory.name };
    const existing = selectedComponents.find(
      (item) => item._id === newItem._id
    );

    const updatedComponents = existing
      ? selectedComponents.map((item) =>
          item._id === newItem._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      : [...selectedComponents, newItem];

    setSelectedComponents(updatedComponents);

    // Tắt popup sau khi chọn sản phẩm
    closePopup();
  };

  // Xoá sản phẩm khỏi cấu hình
  const removeComponent = (id) => {
    // Lọc ra các sản phẩm không bị xóa
    const updatedComponents = selectedComponents.filter(
      (item) => item._id !== id
    );

    // Cập nhật lại state
    setSelectedComponents(updatedComponents);

    // Cập nhật lại localStorage
    localStorage.setItem(
      "selectedComponents",
      JSON.stringify(updatedComponents)
    );
  };

  // Cập nhật số lượng sản phẩm
  const updateQuantity = (id, quantity) => {
    setSelectedComponents(
      selectedComponents.map((item) =>
        item._id === id ? { ...item, quantity } : item
      )
    );
  };

  // Làm mới cấu hình
  const clearAll = () => {
    setSelectedComponents([]);
  };

  // Tính tổng chi phí dự tính
  const estimatedCost = selectedComponents.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Hàm lưu cấu hình
  const handleSaveBuild = async () => {
    const buildData = {
      name: "Cấu hình máy tính",
      description: "Mô tả cấu hình",
      components: selectedComponents,
      total_price: estimatedCost,
    };

    try {
      const response = await fetch(`${API_URL}/build/add-build`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(buildData),
      });

      const data = await response.json();

      if (response.status === 201) {
        alert("Cấu hình đã được lưu thành công!");
      } else {
        alert(data.error || "Không thể lưu cấu hình.");
      }
    } catch (error) {
      console.error("Lỗi khi lưu cấu hình:", error);
      alert("Có lỗi xảy ra khi lưu cấu hình.");
    }
  };

  //
  const compatibilityFilteredProducts = sortedProducts.filter((prod) => {
    // Nếu đang chọn Mainboard, lọc theo CPU socket_type và mem_type
    if (selectedCategory?.name === "Mainboard" && selectedCPU) {
      return (
        prod.compatibility?.socket_type ===
          selectedCPU.compatibility?.socket_type &&
        prod.compatibility?.mem_type === selectedCPU.compatibility?.mem_type
      );
    }

    // Nếu đang chọn RAM, lọc theo Mainboard mem_type
    if (selectedCategory?.name === "RAM" && selectedMainboard) {
      return (
        prod.compatibility?.mem_type ===
        selectedMainboard.compatibility?.mem_type
      );
    }

    // Mặc định không lọc gì thêm
    return true;
  });

  return (
    <div className="news-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Trang chủ</Link>
        <span className="current">Xây dựng cấu hình máy tính</span>
      </div>

      <div className="buildpc-layout">
        {/* Cột bên trái: Danh sách danh mục linh kiện */}
        <div className="components">
          <h2>Tự Build Cấu Hình</h2>
          <div className="component-table">
            {categories.map((category, index) => {
              const selectedItem = selectedComponents.find(
                (item) => item.category === category.name
              );
              return (
                <div className="component-row" key={category._id}>
                  <div className="component-left">
                    <span className="component-index">{index + 1}.</span>
                    <span className="component-title">{category.name}</span>
                  </div>
                  {selectedItem ? (
                    <div className="selected-product-row">
                      <img
                        src={selectedItem.image_url}
                        alt={selectedItem.product_name}
                        className="selected-product-image"
                      />
                      <div className="selected-product-info">
                        <strong className="product-name">
                          {selectedItem.product_name}
                        </strong>
                        <p>
                          Bảo hành:{" "}
                          {selectedItem.warranty
                            .replace(" years", " năm")
                            .replace(" year", " năm")}
                        </p>{" "}
                      </div>
                      <div className="selected-product-price">
                        {selectedItem.price.toLocaleString()} đ
                      </div>
                      <div className="quantity-control">
                        <input
                          type="number"
                          min="1"
                          value={selectedItem.quantity}
                          onChange={(e) =>
                            updateQuantity(
                              selectedItem._id,
                              parseInt(e.target.value, 10)
                            )
                          }
                        />
                      </div>
                      <button
                        className="delete-button"
                        onClick={() => removeComponent(selectedItem._id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ) : (
                    <button
                      className="select-button vip-button"
                      onClick={() => openPopup(category)}
                    >
                      <FaPlus /> Chọn {category.name}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Cột bên phải: Tóm tắt cấu hình */}
        <div className="summary-panel">
          <h2>Tóm tắt cấu hình</h2>
          <button className="btn-refresh" onClick={clearAll}>
            <FaSync />
          </button>
          <div className="selected-summary-list">
            {selectedComponents.length > 0 ? (
              selectedComponents.map((item) => (
                <div key={item._id} className="selected-summary-item">
                  <img src={item.image_url} alt={item.product_name} />
                  <div className="selected-summary-info">
                    <span className="selected-summary-name">
                      {item.product_name}
                    </span>
                    <span className="selected-summary-quantity">
                      SL: {item.quantity}
                    </span>
                    <span className="selected-summary-price">
                      {(item.price * item.quantity).toLocaleString()} đ
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-selection">Chưa có linh kiện nào được chọn.</p>
            )}
          </div>
          <div className="estimated-card">
            <span className="estimated-title">Chi phí dự tính</span>
            <span className="estimated-value">
              {estimatedCost.toLocaleString()} đ
            </span>
          </div>
          <div className="summary-actions">
            <button className="btn-cart" onClick={handleSaveBuild}>
              Lưu cấu hình
            </button>
            <button className="btn-print" onClick={handlePrint}>
              In báo giá
            </button>
          </div>
          <div className="summary-actions">
            <button onClick={handleClickViewBuild} className="btn-cart2">
              Xem cấu hình đã lưu
            </button>
          </div>
        </div>
      </div>

      {/* Popup chọn sản phẩm */}
      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-content vip-popup-content">
            <div className="popup-header">
              <h2>Chọn {selectedCategory?.name}</h2>
              <button className="close-button" onClick={closePopup}>
                ✖
              </button>
            </div>
            <div className="popup-body">
              <div className="search-bar-container">
                <input
                  type="text"
                  placeholder="Bạn cần tìm linh kiện gì?"
                  className="search-bar1"
                />
                <select className="sort-select" onChange={handleSortChange}>
                  <option value="default">Sắp xếp</option>
                  <option value="price-asc">Giá thấp đến cao</option>
                  <option value="price-desc">Giá cao đến thấp</option>
                  <option value="newest">Mới nhất</option>
                </select>
              </div>
              <div className="filter-options vip-filter-options">
                <div className="filter-group">
                  <h4>Hãng sản xuất</h4>
                  {brands.map((brand) => (
                    <label key={brand}>
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandChange(brand)}
                      />{" "}
                      {brand}
                    </label>
                  ))}
                </div>
                <div className="filter-group">
                  <h4>Khoảng giá</h4>
                  <label>
                    <input
                      type="checkbox"
                      onChange={() => handlePriceFilterChange("under1")}
                    />{" "}
                    Dưới 1 triệu
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      onChange={() => handlePriceFilterChange("1to5")}
                    />{" "}
                    1 - 5 triệu
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      onChange={() => handlePriceFilterChange("5to10")}
                    />{" "}
                    5 - 10 triệu
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      onChange={() => handlePriceFilterChange("above10")}
                    />{" "}
                    Trên 10 triệu
                  </label>
                </div>
              </div>
              <div className="product-list">
                {compatibilityFilteredProducts.length > 0 ? (
                  compatibilityFilteredProducts.map((prod) => (
                    <div
                      className="product-item vip-product-item"
                      key={prod._id}
                    >
                      <img src={prod.image_url} alt={prod.product_name} />
                      <h3>{prod.product_name}</h3>
                      <p>
                        Giá: <strong>{prod.price.toLocaleString()}đ</strong>
                      </p>
                      <button
                        className="add-button vip-button"
                        onClick={() => handleAddPopupProduct(prod)}
                      >
                        Thêm vào cấu hình
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="no-products">Không có sản phẩm nào phù hợp.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuildPC;
