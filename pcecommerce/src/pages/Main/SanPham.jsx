import React from "react";
import { Link } from "react-router-dom";
import "./MainStyles/styleNews.css";
import "./MainStyles/styleSanPham.css";

const newProducts = [
  {
    title: "Laptop Gaming HP Victus 16-R1173TX/CORE I7",
    date: "30.10.2024",
    description:
      "Laptop gaming HP Victus 16-R1173TX là sự kết hợp hoàn hảo giữa thiết kế hiện đại, cấu hình mạnh mẽ và nhiều tính năng...",
    image: "/assets/interface-main/imgSanPham/laptop-hp-victus.png",
  },
  {
    title: "Laptop Lenovo Thinkpad T14 Gen 5",
    date: "29.10.2024",
    description:
      "Laptop Lenovo Thinkpad T14 Gen 5 là một trong những mẫu laptop gaming nổi bật dành cho game thủ và những người làm việc cường độ cao...",
    image: "/assets/interface-main/imgSanPham/laptop-lenovo-t14.png",
  },
  {
    title: "ASUS Vivobook S 14/16 OLED",
    date: "14.06.2024",
    description: "Laptop hoàn hảo cho mọi nhu cầu, thiết kế mỏng nhẹ, hiệu năng mạnh mẽ...",
    image: "/assets/interface-main/imgSanPham/laptop-asus-vivobook.png",
  },
  {
    title: "Màn hình Samsung M8 UHD M80B - tinh hoa hội tụ, đẳng cấp thời thượng",
    date: "22.06.2023",
    description: "Màn hình Samsung UHD M80B mang đến chất lượng hình ảnh sắc nét, phù hợp cho công việc và giải trí...",
    image: "/assets/interface-main/imgSanPham/samsung-m8.png",
  },
];

const discussions = [
  "Phân Biệt Ổ Cứng SSD 2.5, mSATA, M2 SATA, M2 PCIe",
  "Hướng dẫn kết nối máy in HP Neverstop Laser 1000W",
  "Hướng dẫn tra cứu tìm kiếm mã mực in hp chính hãng",
  "Phân Biệt Ổ Cứng SSD 2.5, mSATA, M2 SATA, M2 PCIe",
];

const internalNews = [
  { title: "RTX 5060 Ti sắp ra mắt với những thông số đáng kỳ vọng", date: "24.02.2025", image: "/assets/interface-main/imgSanPham/dangkyvong.png" },
  { title: "Ryzen 9800X3D 'cháy hàng' giúp AMD đạt doanh số CPU kỷ lục", date: "22.02.2025", image: "/assets/interface-main/imgSanPham/ryzen_9800.png" },
  { title: "Lenovo ThinkBook Plus Gen 5 Hybrid: laptop 2 in 1 chạy cả Windows và Android", date: "22.02.2025", image: "/assets/interface-main/imgSanPham/superlaptop.png" },
  { title: "Toplist những vô lăng chơi game điện thoại PC nên mua nhất 2024-2025", date: "22.02.2025", image: "/assets/interface-main/imgSanPham/volang.png" },
];

const SanPham = () => {
  return (
    <div className="tech-container">
      <div className="breadcrumb">
        <Link to="/">Trang chủ</Link> <span className="current">Sản phẩm mới</span>
      </div>
      <nav className="news-categories">
        <Link to="/News/tech">TIN CÔNG NGHỆ</Link>
        <Link to="/News/san-pham">SẢN PHẨM MỚI</Link>
        <Link to="/News/game">CHỦ ĐỀ GAME</Link>
        <Link to="/News/tips">THỦ THUẬT</Link>
        <Link to="/News/software">PHẦN MỀM</Link>
      </nav>
      <div className="product-container">
      {/* Danh sách sản phẩm */}
      <div className="main-content">
        {newProducts.map((product, index) => (
          <div key={index} className="product-item">
            <img src={product.image} alt={product.title} />
            <div className="product-info">
              <h2>{product.title}</h2>
              <p className="dateSanPham">📅 {product.date}</p>
              <p>{product.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Cột bên phải */}
      <div className="sidebar">
        {/* Thảo luận mới nhất */}
        <div className="discussion">
          <h3>THẢO LUẬN MỚI NHẤT</h3>
          <ul>
            {discussions.map((discussion, index) => (
              <li key={index}>{discussion}</li>
            ))}
          </ul>
        </div>

        {/* Tin nội bộ */}
        <div className="internal-news">
          <h3>TIN SẢN PHẨM</h3>
          {internalNews.map((news, index) => (
            <div key={index} className="news-item">
              <img src={news.image} alt={news.title} />
              <div>
                <p>{news.title}</p>
                <span>📅 {news.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};

export default SanPham;
