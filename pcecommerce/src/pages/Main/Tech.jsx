import React from "react";
import { Link } from "react-router-dom";
<<<<<<< HEAD
import "./styleNews.css";
import "./styleTech.css";
=======
import "./MainStyles/styleNews.css";
import "./MainStyles/styleTech.css";
>>>>>>> main
const techArticles = [
  {
    title: "ASRock tinh chỉnh hệ thống làm mát GPU Arc Alchemist",
    date: "15-07-2024, 4:34 pm",
    views: 1477,
    image: "/assets/interface-main/imgTech/gpu-arc.png",
  },
  {
    title: "Ryzen AI 7 Pro 360 lộ diện trong điểm chuẩn mới – chip Zen 5 tám lõi",
    date: "15-07-2024, 8:38 am",
    views: 1797,
    image: "/assets/interface-main/imgTech/ryzen-ai.png",
  },
  {
    title: "Bản firmware mới của AMD mang đến tối ưu hiệu suất cho Ryzen 9000",
    date: "14-07-2024, 10:55 am",
    views: 1051,
    image: "/assets/interface-main/imgTech/firmware-amd.png",
  },
  {
    title: "Kết quả Ryzen 9 9900X được cho là đạt điểm cao nhất Geekench",
    date: "14-07-2024, 10:42 am",
    views: 2736,
    image: "/assets/interface-main/imgTech/ryzen-9900x.png",
  },
  {
    title: "AMD có thể giới thiệu dòng GPU Radeon RX 8000-series tại CES 2025",
    date: "12-07-2024, 1:52 pm",
    views: 301,
    image: "/assets/interface-main/imgTech/rx8000.png",
  },
  {
    title: "GDDR7 memory là gì? Những điều cần biết về công nghệ VRAM đột phá",
    date: "11-07-2024, 9:13 am",
    views: 1086,
    image: "/assets/interface-main/imgTech/gddr7.png",
  },
  {
    title: "Chiếc 'RTX 4090 Super' đầu tiên trên thế giới đạt điểm số cao hơn tới 16% so với phiên bản tiêu chuẩn 4090",
    date: "10-07-2024, 8:45 am",
    views: 313,
    image: "/assets/interface-main/imgTech/11zon.png",
  },
  {
    title: "Chip RISC-V sẽ hỗ trợ thay thế RAM mà không cần tắt hệ thống - tính năng hot plugging sẽ có mặt trong các phiên bản Linux mới hơn",
    date: "08-07-2024, 1:20 pm",
    views: 42,
    image: "/assets/interface-main/imgTech/risc.png",
  },
  {
    title: "Socket CPU LGA 1851 Arrow Lake của Intel được chi tiết hóa",
    date: "08-07-2024, 8:33 am",
    views: 1086,
    image: "/assets/interface-main/imgTech/socketcpu.png",
  },
  {
    title: "Bổ sung mới AMD cho tiện ích ép xung cho phép điều chỉnh hiệu suất thêm - Curve Shaper cho phép 15 điểm bù điện áp",
    date: "07-07-2024, 4:33 am",
    views: 85,
    image: "/assets/interface-main/imgTech/amadanew1.png",
  },
  {
    title: "Intel vs AMD: CPU nào tốt hơn vào năm 2024?",
    date: "07-07-2024, 10:39 am",
    views: 1765,
    image: "/assets/interface-main/imgTech/amdavsintel.png",
  },
  {
    title: "AMD công bố tài liệu phân tích chi tiết về bộ vi xử lý MI300A - APU exascale đột phá của họ được nghiên cứu kỹ lưỡng... ",
    date: "06-07-2024, 2:04 pm",
    views: 56,
    image: "/assets/interface-main/imgTech/mi300a.png",
  },
];

const Tech = () => {
  return (
    <div className="tech-container">
      <div className="breadcrumb">
        <Link to="/">Trang chủ</Link> <span className="current">Tin Công Nghệ</span>
      </div>
      <nav className="news-categories">
        <Link to="/News/tech">TIN CÔNG NGHỆ</Link>
        <Link to="/News/san-pham">SẢN PHẨM MỚI</Link>
        <Link to="/News/game">CHỦ ĐỀ GAME</Link>
        <Link to="/News/tips">THỦ THUẬT</Link>
        <Link to="/News/software">PHẦN MỀM</Link>
      </nav>
      {/* Danh sách bài viết công nghệ */}
      <div className="tech-content">
        <h2>TIN CÔNG NGHỆ MỚI NHẤT</h2>
        <div className="tech-grid">
          {techArticles.map((article, index) => (
            <div key={index} className="tech-item">
              <img src={article.image} alt={article.title} />
              <h3>{article.title}</h3>
              <p className="date">📅 {article.date} &bull; 👁 {article.views}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default Tech;
