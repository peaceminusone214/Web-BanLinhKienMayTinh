<<<<<<< HEAD
import React, { useState } from "react";
import { FaTrash, FaPlus, FaSync } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./styleBuildPC.css";

const componentsList = [
  { id: 1, name: "CPU - Bộ vi xử lý", image: "/assets/interface-main/imgBuildPC/cpu.png" },
  { id: 2, name: "MAINBOARD", image: "/assets/interface-main/imgBuildPC/mainboard.png" },
  { id: 3, name: "RAM", image: "/assets/interface-main/imgBuildPC/ram.png" },
  { id: 4, name: "CARD ĐỒ HỌA", image: "/assets/interface-main/imgBuildPC/gpu.png" },
  { id: 5, name: "Ổ CỨNG SSD", image: "/assets/interface-main/imgBuildPC/ssd.png" },
  { id: 6, name: "Ổ CỨNG HDD", image: "/assets/interface-main/imgBuildPC/hdd.png" },
  { id: 7, name: "NGUỒN (PSU)", image: "/assets/interface-main/imgBuildPC/psu.png" },
  { id: 8, name: "TẢN NHIỆT", image: "/assets/interface-main/imgBuildPC/cooler.png" },
  { id: 9, name: "VỎ CASE", image: "/assets/interface-main/imgBuildPC/case.png" },
  { id: 10, name: "MÀN HÌNH", image: "/assets/interface-main/imgBuildPC/monitor.png" },
  { id: 11, name: "CHUỘT", image: "/assets/interface-main/imgBuildPC/mouse.png" },
  { id: 12, name: "BÀN PHÍM", image: "/assets/interface-main/imgBuildPC/keyboard.png" },
  { id: 13, name: "TAI NGHE", image: "/assets/interface-main/imgBuildPC/headphone.png" },
  { id: 14, name: "LOA", image: "/assets/interface-main/imgBuildPC/speaker.png" },
  { id: 15, name: "PHỤ KIỆN", image: "/assets/interface-main/imgBuildPC/accessory.png" },
];

const categoryProducts = {
  "CPU - Bộ vi xử lý": [
    {
      id: "cpu1",
      name: "CPU AMD Ryzen 9 9900X3D",
      warranty: "36 tháng",
      price: 15999000,
      image: "/assets/interface-main/imgBuildPC/cpu.png",
    },
    {
      id: "cpu2",
      name: "CPU Intel Core i9-12900K",
      warranty: "36 tháng",
      price: 14999000,
      image: "/assets/interface-main/imgBuildPC/cpu.png",
    },
  ],
  MAINBOARD: [
    {
      id: "main1",
      name: "Mainboard MSI MAG B660 TOMAHAWK",
      warranty: "36 tháng",
      price: 4899000,
      image: "/assets/interface-main/imgBuildPC/mainboard.png",
    },
    {
      id: "main2",
      name: "Mainboard GIGABYTE B660 AORUS PRO AX",
      warranty: "36 tháng",
      price: 5199000,
      image: "/assets/interface-main/imgBuildPC/mainboard.png",
    },
  ],
  RAM: [
    {
      id: "ram1",
      name: "RAM Corsair Vengeance LPX 16GB DDR4 3200MHz",
      warranty: "36 tháng",
      price: 1499000,
      image: "/assets/interface-main/imgBuildPC/ram.png",
    },
  ],
  // ... (Các danh mục khác)
};

const BuildPC = () => {
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Mở popup chọn sản phẩm
=======
import React, { useState, useEffect } from "react";
import { FaTrash, FaPlus, FaSync } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./MainStyles/styleBuildPC.css";

const BuildPC = () => {
  const [categories, setCategories] = useState([]); // Danh sách danh mục
  const [products, setProducts] = useState([]); // Sản phẩm theo danh mục
  const [selectedComponents, setSelectedComponents] = useState([]); // Sản phẩm đã chọn
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // ✅ Lấy danh sách danh mục từ API bằng fetch
  useEffect(() => {
    fetch("http://localhost:5000/api/product/categories")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Lỗi khi lấy danh mục:", error));
  }, []);

  // ✅ Lấy sản phẩm theo danh mục từ API bằng fetch
  useEffect(() => {
    if (selectedCategory) {
      fetch(
        `http://localhost:5000/api/product/get-products?category_id=${selectedCategory._id}`
      )
        .then((response) => response.json())
        .then((data) => setProducts(data))
        .catch((error) => console.error("Lỗi khi lấy sản phẩm:", error));
    }
  }, [selectedCategory]);

  // Mở popup chọn sản phẩm theo danh mục
>>>>>>> main
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
<<<<<<< HEAD
    const newItem = { ...prod, quantity: 1, category: selectedCategory };
    const existing = selectedComponents.find((item) => item.id === newItem.id);
    if (existing) {
      setSelectedComponents(
        selectedComponents.map((item) =>
          item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
=======
    const newItem = { ...prod, quantity: 1, category: selectedCategory.name };
    const existing = selectedComponents.find((item) => item._id === newItem._id);
  
    if (existing) {
      setSelectedComponents(
        selectedComponents.map((item) =>
          item._id === newItem._id ? { ...item, quantity: item.quantity + 1 } : item
>>>>>>> main
        )
      );
    } else {
      setSelectedComponents([...selectedComponents, newItem]);
    }
<<<<<<< HEAD
  };

  // Xoá sản phẩm khỏi cấu hình
  const removeComponent = (id) => {
    setSelectedComponents(selectedComponents.filter((item) => item.id !== id));
=======
  
    // Tắt popup sau khi chọn sản phẩm
    closePopup();
  };  

  // Xoá sản phẩm khỏi cấu hình
  const removeComponent = (id) => {
    setSelectedComponents(selectedComponents.filter((item) => item._id !== id));
>>>>>>> main
  };

  // Cập nhật số lượng sản phẩm
  const updateQuantity = (id, quantity) => {
    setSelectedComponents(
      selectedComponents.map((item) =>
<<<<<<< HEAD
        item.id === id ? { ...item, quantity } : item
=======
        item._id === id ? { ...item, quantity } : item
>>>>>>> main
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

  return (
    <div className="news-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Trang chủ</Link>
        <span className="current">Xây dựng cấu hình máy tính</span>
      </div>

      <div className="buildpc-layout">
<<<<<<< HEAD
        {/* Cột bên trái: Danh sách linh kiện */}
        <div className="components">
          <h2>Tự Build Cấu Hình</h2>
          <div className="component-table">
            {componentsList.map((component, index) => {
              const selectedItem = selectedComponents.find(
                (item) => item.category === component.name
              );
              return (
                <div className="component-row" key={component.id}>
                  <div className="component-left">
                    <span className="component-index">{index + 1}.</span>
                    <span className="component-title">{component.name}</span>
=======
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
>>>>>>> main
                  </div>
                  {selectedItem ? (
                    <div className="selected-product-row">
                      <img
<<<<<<< HEAD
                        src={selectedItem.image}
                        alt={selectedItem.name}
                        className="selected-product-image"
                      />
                      <div className="selected-product-info">
                        <strong className="product-name">{selectedItem.name}</strong>
                        <p>Bảo hành: {selectedItem.warranty}</p>
                        <p className="in-stock">
                          Kho hàng: <span>còn hàng</span>
                        </p>
=======
                        src={selectedItem.image_url}
                        alt={selectedItem.product_name}
                        className="selected-product-image"
                      />
                      <div className="selected-product-info">
                        <strong className="product-name">
                          {selectedItem.product_name}
                        </strong>
                        <p>Bảo hành: {selectedItem.warranty}</p>
>>>>>>> main
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
<<<<<<< HEAD
                            updateQuantity(selectedItem.id, parseInt(e.target.value, 10))
=======
                            updateQuantity(
                              selectedItem._id,
                              parseInt(e.target.value, 10)
                            )
>>>>>>> main
                          }
                        />
                      </div>
                      <button
                        className="delete-button"
<<<<<<< HEAD
                        onClick={() => removeComponent(selectedItem.id)}
=======
                        onClick={() => removeComponent(selectedItem._id)}
>>>>>>> main
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ) : (
                    <button
                      className="select-button vip-button"
<<<<<<< HEAD
                      onClick={() => openPopup(component.name)}
                    >
                      <FaPlus /> Chọn {component.name}
=======
                      onClick={() => openPopup(category)}
                    >
                      <FaPlus /> Chọn {category.name}
>>>>>>> main
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

<<<<<<< HEAD
        {/* Cột bên phải: Panel tóm tắt cấu hình */}
        <div className="summary-panel">
          <div className="summary-header">
            <h2>Tóm tắt cấu hình</h2>
            <button className="btn-refresh" onClick={clearAll} title="Làm mới cấu hình">
              <FaSync />
            </button>
          </div>
          <div className="selected-summary-list">
            {selectedComponents.length > 0 ? (
              selectedComponents.map((item) => (
                <div key={item.id} className="selected-summary-item">
                  <img src={item.image} alt={item.name} />
                  <div className="selected-summary-info">
                    <span className="selected-summary-name">{item.name}</span>
                    <span className="selected-summary-quantity">SL: {item.quantity}</span>
=======
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
>>>>>>> main
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
            <button className="btn-cart">Thêm tất cả vào giỏ</button>
            <button className="btn-print">In báo giá</button>
          </div>
        </div>
      </div>

      {/* Popup chọn sản phẩm */}
      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-content vip-popup-content">
            <div className="popup-header">
<<<<<<< HEAD
              <h2>Chọn {selectedCategory}</h2>
=======
              <h2>Chọn {selectedCategory?.name}</h2>
>>>>>>> main
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
                <select className="sort-select">
                  <option value="default">Sắp xếp</option>
                  <option value="price-asc">Giá thấp đến cao</option>
                  <option value="price-desc">Giá cao đến thấp</option>
                  <option value="newest">Mới nhất</option>
                </select>
              </div>
              <div className="filter-options vip-filter-options">
                <div className="filter-group">
                  <h4>Hãng sản xuất</h4>
                  <label>
                    <input type="checkbox" /> AMD
                  </label>
                  <label>
                    <input type="checkbox" /> Intel
                  </label>
                  <label>
                    <input type="checkbox" /> Asus
                  </label>
                  <label>
                    <input type="checkbox" /> MSI
                  </label>
                </div>
                <div className="filter-group">
                  <h4>Khoảng giá</h4>
                  <label>
                    <input type="checkbox" /> Dưới 1 triệu
                  </label>
                  <label>
                    <input type="checkbox" /> 1 - 5 triệu
                  </label>
                  <label>
                    <input type="checkbox" /> 5 - 10 triệu
                  </label>
                  <label>
                    <input type="checkbox" /> Trên 10 triệu
                  </label>
                </div>
              </div>
              <div className="product-list">
<<<<<<< HEAD
                {(categoryProducts[selectedCategory] || []).map((prod) => (
                  <div className="product-item vip-product-item" key={prod.id}>
                    <img src={prod.image} alt={prod.name} />
                    <div>
                      <h3>{prod.name}</h3>
                      <p>Bảo hành: {prod.warranty}</p>
=======
                {Array.isArray(products) && products.length > 0 ? (
                  products.map((prod) => (
                    <div
                      className="product-item vip-product-item"
                      key={prod._id}
                    >
                      <img src={prod.image_url} alt={prod.product_name} />
                      <h3>{prod.product_name}</h3>
>>>>>>> main
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
<<<<<<< HEAD
                  </div>
                ))}
                {(categoryProducts[selectedCategory] || []).length === 0 && (
                  <p>Chưa có sản phẩm cho danh mục này.</p>
=======
                  ))
                ) : (
                  <p className="no-products">
                    Không có sản phẩm nào trong danh mục này.
                  </p>
>>>>>>> main
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
<<<<<<< HEAD







// import React, { useState } from "react";
// import { FaTrash, FaPlus } from "react-icons/fa";
// import { Link } from "react-router-dom";
// import "./styleBuildPC.css";

// // Sample product data for each component type
// const productData = {
//   CPU: [
//     { id: "cpu1", name: "Intel Core i5-12400F", price: 3500000 },
//     { id: "cpu2", name: "AMD Ryzen 5 5600X", price: 4200000 },
//   ],
//   MAINBOARD: [
//     { id: "mb1", name: "ASUS ROG Strix B550-F", price: 4500000 },
//     { id: "mb2", name: "MSI B660M-A PRO", price: 3200000 },
//   ],
//   RAM: [
//     { id: "ram1", name: "Corsair Vengeance 16GB DDR4", price: 1500000 },
//     { id: "ram2", name: "G.Skill Ripjaws 32GB DDR4", price: 2800000 },
//   ],
//   // Add more components as needed, ensuring all names match componentsList
//   "CARD ĐỒ HỌA": [
//     { id: "gpu1", name: "NVIDIA RTX 3060", price: 8500000 },
//   ],
//   "Ổ CỨNG SSD": [
//     { id: "ssd1", name: "Samsung 970 EVO 1TB", price: 3200000 },
//   ],
//   "Ổ CỨNG HDD": [
//     { id: "hdd1", name: "WD Blue 2TB", price: 1400000 },
//   ],
//   "NGUỒN (PSU)": [
//     { id: "psu1", name: "Corsair CX650M", price: 1800000 },
//   ],
//   "TẢN NHIỆT": [
//     { id: "cool1", name: "Noctua NH-U12S", price: 1500000 },
//   ],
//   "VỎ CASE": [
//     { id: "case1", name: "NZXT H510", price: 1800000 },
//   ],
//   "MÀN HÌNH": [
//     { id: "mon1", name: "Dell UltraSharp 27", price: 6500000 },
//   ],
//   "CHUỘT": [
//     { id: "mouse1", name: "Logitech G502", price: 1200000 },
//   ],
//   "BÀN PHÍM": [
//     { id: "kb1", name: "Keychron K8", price: 2200000 },
//   ],
//   "TAI NGHE": [
//     { id: "hp1", name: "Sony WH-1000XM4", price: 6500000 },
//   ],
//   LOA: [
//     { id: "sp1", name: "Edifier R1280T", price: 2300000 },
//   ],
// };

// const componentsList = [
//   { id: 1, name: "CPU", image: "/assets/interface-main/imgBuildPC/cpu.png" },
//   { id: 2, name: "MAINBOARD", image: "/assets/interface-main/imgBuildPC/mainboard.png" },
//   { id: 3, name: "RAM", image: "/assets/interface-main/imgBuildPC/ram.png" },
//   { id: 4, name: "CARD ĐỒ HỌA", image: "/assets/interface-main/imgBuildPC/gpu.png" },
//   { id: 5, name: "Ổ CỨNG SSD", image: "/assets/interface-main/imgBuildPC/ssd.png" },
//   { id: 6, name: "Ổ CỨNG HDD", image: "/assets/interface-main/imgBuildPC/hdd.png" },
//   { id: 7, name: "NGUỒN (PSU)", image: "/assets/interface-main/imgBuildPC/psu.png" },
//   { id: 8, name: "TẢN NHIỆT", image: "/assets/interface-main/imgBuildPC/cooler.png" },
//   { id: 9, name: "VỎ CASE", image: "/assets/interface-main/imgBuildPC/case.png" },
//   { id: 10, name: "MÀN HÌNH", image: "/assets/interface-main/imgBuildPC/monitor.png" },
//   { id: 11, name: "CHUỘT", image: "/assets/interface-main/imgBuildPC/mouse.png" },
//   { id: 12, name: "BÀN PHÍM", image: "/assets/interface-main/imgBuildPC/keyboard.png" },
//   { id: 13, name: "TAI NGHE", image: "/assets/interface-main/imgBuildPC/headphone.png" },
//   { id: 14, name: "LOA", image: "/assets/interface-main/imgBuildPC/speaker.png" },
// ];

// const BuildPC = () => {
//   const [selectedComponents, setSelectedComponents] = useState([]);
//   const [showProductTable, setShowProductTable] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");

//   const addComponent = (product) => {
//     const existing = selectedComponents.find((item) => item.id === product.id);
//     if (existing) {
//       setSelectedComponents(
//         selectedComponents.map((item) =>
//           item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
//         )
//       );
//     } else {
//       setSelectedComponents([...selectedComponents, { ...product, quantity: 1 }]);
//     }
//     setShowProductTable(null);
//   };

//   const removeComponent = (id) => {
//     setSelectedComponents(selectedComponents.filter((item) => item.id !== id));
//   };

//   const updateQuantity = (id, quantity) => {
//     setSelectedComponents(
//       selectedComponents.map((item) =>
//         item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
//       )
//     );
//   };

//   const calculateTotal = () => {
//     return selectedComponents.reduce((total, item) => total + item.price * item.quantity, 0);
//   };

//   const filterProducts = (products) => {
//     if (!products || !Array.isArray(products)) return [];
//     return products.filter((product) =>
//       product.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   };

//   return (
//     <div className="news-container">
//       <div className="breadcrumb">
//         <Link to="/">Trang chủ</Link> <span className="current">Xây dựng cấu hình máy tính</span>
//       </div>
//       <div className="buildpc-container">
//         <div className="sidebar">
//           <h2>Cấu Hình Đã Chọn</h2>
//           {selectedComponents.length === 0 ? (
//             <p>Chưa có linh kiện nào.</p>
//           ) : (
//             <ul>
//               {selectedComponents.map((item) => (
//                 <li key={item.id} className="selected-item">
//                   <div className="selected-info">
//                     <span>{item.name}</span>
//                     <span>{item.price.toLocaleString()}đ</span>
//                   </div>
//                   <div className="quantity-control">
//                     <button 
//                       onClick={() => updateQuantity(item.id, item.quantity - 1)} 
//                       disabled={item.quantity <= 1}
//                     >
//                       −
//                     </button>
//                     <input
//                       type="number"
//                       min="1"
//                       value={item.quantity}
//                       onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10) || 1)}
//                     />
//                     <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
//                       +
//                     </button>
//                   </div>
//                   <button className="delete-button" onClick={() => removeComponent(item.id)}>
//                     <FaTrash />
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           )}
//           <div className="total">
//             <strong>Tổng:</strong> {calculateTotal().toLocaleString()}đ
//           </div>
//           <div className="summary-buttons">
//             <button className="clear-button" onClick={() => setSelectedComponents([])}>Xóa tất cả</button>
//             <button className="cart-button">Thêm tất cả vào giỏ</button>
//             <button className="print-button">In báo giá</button>
//           </div>
//         </div>

//         <div className="components">
//           <h2>Tự Build Cấu Hình</h2>
//           {componentsList.map((component) => (
//             <div key={component.id} className="component-card">
//               <img src={component.image} alt={component.name} />
//               <h3>{component.name}</h3>
//               <button 
//                 className="select-button" 
//                 onClick={() => setShowProductTable(component.name)}
//               >
//                 Chọn {component.name}
//               </button>

//               {showProductTable === component.name && (
//                 <div className="product-table-overlay" onClick={() => setShowProductTable(null)}>
//                   <div className="product-table" onClick={(e) => e.stopPropagation()}>
//                     <button 
//                       className="close-popup-button" 
//                       onClick={() => {
//                         setShowProductTable(null);
//                         setSearchTerm("");
//                       }}
//                     >
//                       ×
//                     </button>
//                     <h3>Danh sách {component.name}</h3>
//                     <div className="search-bar">
//                       <input
//                         type="text"
//                         placeholder="Bạn cần tìm linh kiện gì?"
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                       />
//                     </div>
//                     <div className="product-list">
//                       {filterProducts(productData[component.name]).length > 0 ? (
//                         filterProducts(productData[component.name]).map((product) => (
//                           <div key={product.id} className="product-item">
//                             <div className="product-info">
//                               <img src={`/assets/products/${product.id}.png`} alt={product.name} />
//                               <div className="product-details">
//                                 <strong>{product.name}</strong>
//                                 <span>Mã SP: {product.id}</span><br />
//                                 <span>Bảo hành: 36 tháng</span><br />
//                                 <span>Khóa hàng: Còn hàng</span>
//                               </div>
//                             </div>
//                             <div className="price">{product.price.toLocaleString()}đ</div>
//                             <button className="add-button" onClick={() => addComponent(product)}>
//                               Thêm vào cấu hình
//                             </button>
//                           </div>
//                         ))
//                       ) : (
//                         <p>Không có sản phẩm nào phù hợp.</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BuildPC;
=======
>>>>>>> main
