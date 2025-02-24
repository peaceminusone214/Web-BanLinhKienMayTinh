import React from "react";
import { Link } from "react-router-dom";
import "./styleNews.css";
import "./styleTech.css";
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
];

const Tech = () => {
  return (
    <div className="tech-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Trang chủ</Link> <span className="current">Tin Công Nghệ</span>
      </div>

      {/* Danh mục */}
      <nav className="news-categories">
        <Link to="/tech">TIN CÔNG NGHỆ</Link>
        <Link to="/san-pham">SẢN PHẨM MỚI</Link>
        <Link to="/game">CHỦ ĐỀ GAME</Link>
        <Link to="/tips">THỦ THUẬT</Link>
        <Link to="/software">PHẦN MỀM CRACK</Link>
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
