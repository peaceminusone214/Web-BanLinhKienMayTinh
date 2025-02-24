import React from "react";
import { Link } from "react-router-dom"; 
import "./styleNews.css";


const News = () => {
  const featuredArticle = {
    title: "Đồng loạt ra mắt card đồ họa mới có thể thay quạt từ XFX - RX 7900 XTX bắt đầu từ $999 và RX 7800 XT với giá $549",
    date: "02-07-2024, 5:44 pm",
    comments: 0,
    views: 173,
    image: "/assets/interface-main/imgNews/a1.png",
  };

  const latestArticles = [
    {
      title: "ASRock tinh chỉnh hệ thống làm mát GPU Arc Alchemist",
      date: "15-07-2024, 4:34 pm",
      image: "/assets/interface-main/imgNews/zon.png",
      description: "ASRock đã giới thiệu dòng SE mới thuộc series Challenger với hai GPU Intel Arc...",
    },
    {
      title: "Ryzen AI 7 Pro 360 lộ diện trong điểm chuẩn mới – chip Zen 5 tám lõi",
      date: "15-07-2024, 8:38 am",
      image: "/assets/interface-main/imgNews/amd.png",
      description: "CPU di động Ryzen AI 9 HX 370 12 lõi vừa được phát hiện trong một bài kiểm tra...",
    },
    {
      title: "Bản firmware mới của AMD mang đến các tối ưu hiệu suất cho các vi xử lý Ryzen 9000",
      date: "14-07-2024, 10:55 am",
      image: "/assets/interface-main/imgNews/ryzen.png",
      description: "Gigabyte đã bắt đầu cập nhật các bo mạch chủ AM5 của mình lên firmware AGESA 1.2.0.0...",
    },
  ];

  return (
    <div className="news-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Trang chủ</Link> <span className="current">Tin tức</span>
      </div>

      {/* Danh mục */}
      <nav className="news-categories">
        <Link to="/tech">TIN CÔNG NGHỆ</Link>
        <Link to="/san-pham">SẢN PHẨM MỚI</Link>
        <Link to="/game">CHỦ ĐỀ GAME</Link>
        <Link to="/tips">THỦ THUẬT</Link>
        <Link to="/software">PHẦN MỀM CRACK</Link>
      </nav>

      <div className="news-content">
        {/* Tin nổi bật */}
        <div className="featured-article">
          <img src={featuredArticle.image} alt="Featured" />
          <div className="overlay">
            <h2>{featuredArticle.title}</h2>
            <p>
              <span>{featuredArticle.date}</span> &bull; 💬 {featuredArticle.comments} &bull; 👁 {featuredArticle.views}
            </p>
          </div>
        </div>

        {/* Bài viết mới nhất */}
        <aside className="latest-news">
          <h3>BÀI VIẾT <span className="highlight">MỚI NHẤT</span></h3>
          {latestArticles.map((article, index) => (
            <div key={index} className="latest-news-item">
              <img src={article.image} alt={article.title} />
              <div>
                <h4>{article.title}</h4>
                <p className="date">{article.date}</p>
                <p className="description">{article.description}</p>
              </div>
            </div>
          ))}
        </aside>
      </div>
      <div className="news-experience">
        <h3>TIN CÔNG NGHỆ </h3>
        <div className="news-experience-list">
          <div className="news-item">
            <img src="/assets/interface-main/imgNews/openai.png" alt="ChatGPT & DALL-E" />
            <div>
              <h4>Biến ý tưởng thành hiện thực với ChatGPT-4 và DALL-E: Sáng tạo hình ảnh AI không giới hạn!</h4>
              <p className="author">BY KIỀU LINH &bull; 31-01-2024, 11:11 pm</p>
            </div>
          </div>
          <div className="news-item">
            <img src="/assets/interface-main/imgNews/stable-diffusion.png" alt="Stable Diffusion" />
            <div>
              <h4>Hướng dẫn khởi động Stable Diffusion trên MEG Trident X2 & MPG Infinite X2</h4>
              <p className="author">BY KIỀU LINH &bull; 30-01-2024, 3:15 pm</p>
            </div>
          </div>
          <div className="news-item">
            <img src="/assets/interface-main/imgNews/autocad.png" alt="Autocad 2023" />
            <div>
              <h4>Download Autodesk Autocad 2023 – Hướng dẫn cài đặt</h4>
              <p className="author">BY LÊ ĐĂNG DUY &bull; 23-06-2023, 1:38 pm</p>
            </div>
          </div>
        </div>
      </div>
      <div className="news-game">
        <h3>CHỦ ĐỀ <span className="highlight">GAME</span></h3>
        <div className="news-game-list">
          {[
            {
              title: "Việc cài đặt Nvidia GeForce Now trên Steam Deck dường như đơn giản hơn một chút",
              date: "05-05-2024, 11:09 am",
              views: 319,
              image: "/assets/interface-main/imgNews/geforce.png",
            },
            {
              title: "Đoạn Trailer GTA 6 trong đời thực thật sự là một kiệt tác hoàn hảo, không gì có thể so sánh",
              date: "26-04-2024, 10:30 pm",
              views: 455,
              image: "/assets/interface-main/imgNews/gta6.png",
            },
            {
              title: "GPT-4 có thể chơi Doom, nhưng không tốt - nó không ngăn ngại bắn vào con người và quỷ",
              date: "03-04-2024, 11:16 pm",
              views: 162,
              image: "/assets/interface-main/imgNews/doom.png",
            },
            {
              title: "Trò chơi mod trên Steam cài mã độc vào ngày Giáng Sinh – Phần mềm Epsilon Information Stealer được ẩn trong một bản mở rộng của Slay the Spire",
              date: "26-02-2024, 4:27 pm",
              views: 728,
              image: "/assets/interface-main/imgNews/slay.png",
            },
            {
              title: "Các trận chiến vũ trụ đặc sắc của Star Wars sẽ đến với Halo MCC vào đầu năm 2024 như một phần của gói Battlefront",
              date: "15-01-2024, 8:40 pm",
              views: 154,
              image: "/assets/interface-main/imgNews/starwars.png",
            },
            {
              title: "Outlet của GTA đang gợi ý về một 'bất ngờ lớn' của GTA 6 vào cuối ngày hôm nay",
              date: "15-01-2024, 8:29 pm",
              views: 156,
              image: "/assets/interface-main/imgNews/gta6-surprise.png",
            },
          ].map((article, index) => (
            <div key={index} className="game-item">
              <img src={article.image} alt={article.title} />
              <h4>{article.title}</h4>
              <p className="date">📅 {article.date} &bull; 👁 {article.views}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default News;
