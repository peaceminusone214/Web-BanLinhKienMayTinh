import React from "react";
import { Link } from "react-router-dom";
import "./MainStyles/styleNews.css";
import "./MainStyles/styleSoftware.css";

const softwarePosts = [
  {
    title: "Top 10 phần mềm thiết kế đồ họa miễn phí tốt nhất năm 2025",
    date: "02-07-2025, 10:30 am",
    views: 5000,
    image: "/assets/interface-main/imgSoft/software-design.jpg",
  },
  {
    title: "Hướng dẫn cài đặt Windows 11 mới nhất năm 2025",
    date: "01-05-2025, 9:00 am",
    views: 4200,
    image: "/assets/interface-main/imgSoft/windows-11.jpg",
  },
  {
    title: "5 Phần mềm chỉnh sửa video miễn phí mà bạn nên thử",
    date: "15-03-2025, 4:20 pm",
    views: 3200,
    image: "/assets/interface-main/imgSoft/video-editing.jpg",
  },
  {
    title: "Download Microsoft Office 2025 Full Crack - Hướng dẫn chi tiết",
    date: "12-02-2025, 2:15 pm",
    views: 7500,
    image: "/assets/interface-main/imgSoft/office-2025.jpg",
  },
  {
    title: "Phần mềm diệt virus tốt nhất để bảo vệ máy tính năm 2025",
    date: "06-01-2025, 1:45 pm",
    views: 6100,
    image: "/assets/interface-main/imgSoft/antivirus.jpg",
  },
];

const trendingPosts = [
  "10 Lỗi Windows phổ biến và cách khắc phục",
  "Cách tối ưu hiệu suất máy tính với phần mềm miễn phí",
  "Hướng dẫn update driver card đồ họa",
  "Download Photoshop 2025 bản quyền miễn phí",
];

const promotions = [
  {
    title: "Khuyến mãi phần mềm diệt virus 2025",
    date: "27-02-2025, 4:37 pm",
    image: "/assets/interface-main/imgSoft/promo-antivirus.jpg",
  },
  {
    title: "Sale lớn Adobe - Giảm giá tới 50%",
    date: "04-12-2024, 12:58 pm",
    image: "/assets/interface-main/imgSoft/promo-adobe.jpg",
  },
];

const Software = () => {
  return (
    <div className="tech-container">
      <div className="breadcrumb">
        <Link to="/">Trang chủ</Link> <span className="current">Phần mềm</span>
      </div>
      <nav className="news-categories">
        <Link to="/News/tech">TIN CÔNG NGHỆ</Link>
        <Link to="/News/san-pham">SẢN PHẨM MỚI</Link>
        <Link to="/News/game">CHỦ ĐỀ GAME</Link>
        <Link to="/News/tips">THỦ THUẬT</Link>
        <Link to="/News/software">PHẦN MỀM</Link>
      </nav>
      <div className="content">
      <div className="software-list">
        {softwarePosts.map((post, index) => (
          <div key={index} className="software-card">
            <img src={post.image} alt={post.title} />
            <h2>{post.title}</h2>
            <div className="post-meta">
              <span>📅 {post.date}</span>
              <span>👁️ {post.views}</span>
            </div>
          </div>
        ))}
      </div>
       {/* Sidebar */}
       <div className="sidebar">
        <div className="popular">
          <h3>Xem nhiều</h3>
          <ul>
            {trendingPosts.map((post, index) => (
              <li key={index}>{post}</li>
            ))}
          </ul>
        </div>

        <div className="promotions">
          <h3>Tin tức khuyến mãi</h3>
          {promotions.map((promo, index) => (
            <div key={index} className="promo-card">
              <img src={promo.image} alt={promo.title} />
              <p>{promo.title}</p>
              <span>{promo.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};

export default Software;
