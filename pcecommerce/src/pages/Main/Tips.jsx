import React from "react";
import { Link } from "react-router-dom";
import "./MainStyles/styleNews.css";
import "./MainStyles/styleTips.css";

const ThuThuat = [
  {
    title:
      "Biến ý tưởng thành hiện thực với ChatGPT-4 và DALL-E: Sáng tạo hình ảnh AI không giới hạn!",
    date: "31-01-2024, 11:11 pm",
    views: 1146,
    image: "/assets/interface-main/imgTips/chatgpt-dalle.jpg",
  },
  {
    title:
      "Hướng dẫn khởi động Stable Diffusion trên MEG Trident X2 và MPG Infinite X2",
    date: "30-01-2024, 3:15 pm",
    views: 191,
    image: "/assets/interface-main/imgTips/stable-diffusion-pc.jpg",
  },
  {
    title: "Download Autodesk Autocad 2023 – Hướng dẫn cài đặt",
    date: "23-06-2023, 1:38 pm",
    views: 2775,
    image: "/assets/interface-main/imgTips/autocad-2023.jpg",
  },
  {
    title: "Build PC: Chia sẻ kinh nghiệm và những điều cần lưu ý",
    date: "06-05-2023, 11:05 pm",
    views: 2277,
    image: "/assets/interface-main/imgTips/build-pc-tips.jpg",
  },
  {
    title:
      "Build PC cơ bản – Hướng dẫn chi tiết xây dựng PC tự lắp ráp cho người mới",
    date: "05-05-2023, 9:33 am",
    views: 7706,
    image: "/assets/interface-main/imgTips/build-pc-beginner.jpg",
  },
  {
    title: "Card đồ họa được xếp hạng như thế nào?",
    date: "13-07-2022, 9:10 am",
    views: 6267,
    image: "/assets/interface-main/imgTips/gpu-ranking.jpg",
  },
  {
    title: "Hướng dẫn đổi hình nền trên Windows 11",
    date: "11-07-2022, 7:39 pm",
    views: 5063,
    image: "/assets/interface-main/imgTips/doihinhnen.jpg",
  },
  {
    title: "12 Phần mềm mà bạn nên cài đặt ngay sau khi cài mới lại Windows",
    date: "01-09-2021, 1:54 am",
    views: 11130,
    image: "/assets/interface-main/imgTips/12PM.jpg",
  },
  {
    title: "Máy tính bị rò rỉ điện phải làm sao? Cách xử lý như thế nào?",
    date: "21-08-2021, 11:02 pm",
    views: 28150,
    image: "/assets/interface-main/imgTips/ro-ri-dien.jpg",
  },
  {
    title: "Hướng dẫn up BIOS các dòng VGA",
    date: "23-07-2021, 2:57 pm",
    views: 35603,
    image: "/assets/interface-main/imgTips/BIOS-VGA.jpg",
  },
  {
    title: "Hướng dẫn tính công suất tiêu thụ điện của máy tính bàn (PC)",
    date: "23-07-2022, 2:57 pm",
    views: 55418,
    image: "/assets/interface-main/imgTips/w-v.jpg",
  },
  {
    title: "Tắt Window Defender (Windows Security) trên Windows 10",
    date: "23-07-2021, 2:49 pm",
    views: 34379,
    image: "/assets/interface-main/imgTips/windows-security.jpg",
  },
];

const Tips = () => {
  return (
    <div className="tech-container">
      <div className="breadcrumb">
        <Link to="/">Trang chủ</Link>
        <span className="separator"></span>
        <Link to="/News">Tin tức</Link>
        <span className="separator"></span>
        <span className="current">Thủ thuật</span>
      </div>
      <nav className="news-categories">
        <Link to="/News/tech">TIN CÔNG NGHỆ</Link>
        <Link to="/News/san-pham">SẢN PHẨM MỚI</Link>
        <Link to="/News/game">CHỦ ĐỀ GAME</Link>
        <Link to="/News/tips">THỦ THUẬT</Link>
        <Link to="/News/software">PHẦN MỀM</Link>
      </nav>
      <div className="tips-container">
        {ThuThuat.map((tip, index) => (
          <div key={index} className="tip-card">
            <img src={tip.image} alt={tip.title} />
            <h2>{tip.title}</h2>
            <div className="tip-meta">
              <span>📅 {tip.date}</span>
              <span>👁️ {tip.views}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tips;
