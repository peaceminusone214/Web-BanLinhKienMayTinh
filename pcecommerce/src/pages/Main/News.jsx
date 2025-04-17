// import React from "react";
// import { Link, Outlet } from "react-router-dom";
// import "./MainStyles/styleNews.css";

// const News = () => {
//   const featuredArticle = {
//     title: "Đồng loạt ra mắt card đồ họa mới có thể thay quạt từ XFX - RX 7900 XTX bắt đầu từ $999 và RX 7800 XT với giá $549",
//     date: "02-07-2024, 5:44 pm",
//     comments: 0,
//     views: 173,
//     image: "/assets/interface-main/imgNews/a1.png",
//   };

//   const latestArticles = [
//     {
//       title: "ASRock tinh chỉnh hệ thống làm mát GPU Arc Alchemist",
//       date: "15-07-2024, 4:34 pm",
//       image: "/assets/interface-main/imgNews/zon.png",
//       description: "ASRock đã giới thiệu dòng SE mới thuộc series Challenger với hai GPU Intel Arc...",
//     },
//     {
//       title: "Ryzen AI 7 Pro 360 lộ diện trong điểm chuẩn mới – chip Zen 5 tám lõi",
//       date: "15-07-2024, 8:38 am",
//       image: "/assets/interface-main/imgNews/amd.png",
//       description: "CPU di động Ryzen AI 9 HX 370 12 lõi vừa được phát hiện trong một bài kiểm tra...",
//     },
//     {
//       title: "Bản firmware mới của AMD mang đến các tối ưu hiệu suất cho các vi xử lý Ryzen 9000",
//       date: "14-07-2024, 10:55 am",
//       image: "/assets/interface-main/imgNews/ryzen.png",
//       description: "Gigabyte đã bắt đầu cập nhật các bo mạch chủ AM5 của mình lên firmware AGESA 1.2.0.0...",
//     },
//   ];

//   return (
//     <div className="news-container">
//       {/* Breadcrumb */}
//       <div className="breadcrumb">
//         <Link to="/">Trang chủ</Link> <span className="current">Tin tức</span>
//       </div>

//       {/* Danh mục */}
//       <nav className="news-categories">
//         <Link to="/News/tech">TIN CÔNG NGHỆ</Link>
//         <Link to="/News/san-pham">SẢN PHẨM MỚI</Link>
//         <Link to="/News/game">CHỦ ĐỀ GAME</Link>
//         <Link to="/News/tips">THỦ THUẬT</Link>
//         <Link to="/News/software">PHẦN MỀM</Link>
//       </nav>

//       <div className="news-content">
//         {/* Tin nổi bật */}
//         <div className="featured-article">
//           <img src={featuredArticle.image} alt="Featured" />
//           <div className="overlay">
//             <h2>{featuredArticle.title}</h2>
//             <p>
//               <span>{featuredArticle.date}</span> &bull; 💬 {featuredArticle.comments} &bull; 👁 {featuredArticle.views}
//             </p>
//           </div>
//         </div>

//         {/* Bài viết mới nhất */}
//         <aside className="latest-news">
//           <h3>BÀI VIẾT <span className="highlight">MỚI NHẤT</span></h3>
//           {latestArticles.map((article, index) => (
//             <div key={index} className="latest-news-item">
//               <img src={article.image} alt={article.title} />
//               <div>
//                 <h4>{article.title}</h4>
//                 <p className="datenews">{article.date}</p>
//                 <p className="description">{article.description}</p>
//               </div>
//             </div>
//           ))}
//         </aside>
//       </div>
//       <div className="news-experience">
//         <h3>TIN CÔNG NGHỆ </h3>
//         <div className="news-experience-list">
//           <div className="news-item">
//             <img src="/assets/interface-main/imgNews/openai.png" alt="ChatGPT & DALL-E" />
//             <div>
//               <h4>Biến ý tưởng thành hiện thực với ChatGPT-4 và DALL-E: Sáng tạo hình ảnh AI không giới hạn!</h4>
//               <p className="author">BY KIỀU LINH &bull; 31-01-2024, 11:11 pm</p>
//             </div>
//           </div>
//           <div className="news-item">
//             <img src="/assets/interface-main/imgNews/stable-diffusion.png" alt="Stable Diffusion" />
//             <div>
//               <h4>Hướng dẫn khởi động Stable Diffusion trên MEG Trident X2 & MPG Infinite X2</h4>
//               <p className="author">BY KIỀU LINH &bull; 30-01-2024, 3:15 pm</p>
//             </div>
//           </div>
//           <div className="news-item">
//             <img src="/assets/interface-main/imgNews/autocad.png" alt="Autocad 2023" />
//             <div>
//               <h4>Download Autodesk Autocad 2023 – Hướng dẫn cài đặt</h4>
//               <p className="author">BY LÊ ĐĂNG DUY &bull; 23-06-2023, 1:38 pm</p>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="news-game">
//         <h3>CHỦ ĐỀ <span className="highlight">GAME</span></h3>
//         <div className="news-game-list">
//           {[
//             {
//               title: "Việc cài đặt Nvidia GeForce Now trên Steam Deck dường như đơn giản hơn một chút",
//               date: "05-05-2024, 11:09 am",
//               views: 319,
//               image: "/assets/interface-main/imgNews/geforce.png",
//             },
//             {
//               title: "Đoạn Trailer GTA 6 trong đời thực thật sự là một kiệt tác hoàn hảo, không gì có thể so sánh",
//               date: "26-04-2024, 10:30 pm",
//               views: 455,
//               image: "/assets/interface-main/imgNews/gta6.png",
//             },
//             {
//               title: "GPT-4 có thể chơi Doom, nhưng không tốt - nó không ngăn ngại bắn vào con người và quỷ",
//               date: "03-04-2024, 11:16 pm",
//               views: 162,
//               image: "/assets/interface-main/imgNews/doom.png",
//             },
//             {
//               title: "Trò chơi mod trên Steam cài mã độc vào ngày Giáng Sinh – Phần mềm Epsilon Information Stealer được ẩn trong một bản mở rộng của Slay the Spire",
//               date: "26-02-2024, 4:27 pm",
//               views: 728,
//               image: "/assets/interface-main/imgNews/slay.png",
//             },
//             {
//               title: "Các trận chiến vũ trụ đặc sắc của Star Wars sẽ đến với Halo MCC vào đầu năm 2024 như một phần của gói Battlefront",
//               date: "15-01-2024, 8:40 pm",
//               views: 154,
//               image: "/assets/interface-main/imgNews/starwars.png",
//             },
//             {
//               title: "Outlet của GTA đang gợi ý về một 'bất ngờ lớn' của GTA 6 vào cuối ngày hôm nay",
//               date: "15-01-2024, 8:29 pm",
//               views: 156,
//               image: "/assets/interface-main/imgNews/gta6-surprise.png",
//             },
//           ].map((article, index) => (
//             <div key={index} className="game-item">
//               <img src={article.image} alt={article.title} />
//               <h4>{article.title}</h4>
//               <p className="datenews">📅 {article.date} &bull; 👁 {article.views}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Outlet để hiển thị nội dung trang con */}
//       <Outlet />

//     </div>
//   );
// };

// export default News;

import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import axios from "axios";
import "./MainStyles/styleNews.css";

const News = () => {
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [latestArticles, setLatestArticles] = useState([]);
  const [techNews, setTechNews] = useState([]);
  const [gameNews, setGameNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        if (!API_URL) throw new Error("API_URL không hợp lệ!");

        // Lấy tất cả tin có isDisplayed = true
        const { data: articles } = await axios.get(
          `${API_URL}/news?isDisplayed=true`
        );

        // Lọc bài viết dựa vào displaySection
        const featured = articles.find(
          (article) => article.displaySection === "featured"
        );
        const latest = articles.filter(
          (article) => article.displaySection === "latest"
        );

        // Nếu không có bài nào được gán displaySection theo cách trên,
        // có thể dùng fallback là bài đầu tiên và phần còn lại cho latest
        setFeaturedArticle(featured || articles[0]);
        setLatestArticles(latest.length > 0 ? latest : articles.slice(1, 4));

        const { data: techArticles } = await axios.get(
          `${API_URL}/news/category/tech?isDisplayed=true`
        );
        setTechNews(techArticles);

        const { data: gameArticles } = await axios.get(
          `${API_URL}/news/category/game?isDisplayed=true`
        );
        setGameNews(gameArticles);
      } catch (error) {
        console.error("Lỗi khi lấy tin tức:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [API_URL]);

  return (
    <div className="news-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Trang chủ</Link> <span className="current">Tin tức</span>
      </div>

      {/* Danh mục */}
      <nav className="news-categories">
        <Link to="/News/tech">TIN CÔNG NGHỆ</Link>
        <Link to="/News/san-pham">SẢN PHẨM MỚI</Link>
        <Link to="/News/game">CHỦ ĐỀ GAME</Link>
        <Link to="/News/tips">THỦ THUẬT</Link>
        <Link to="/News/software">PHẦN MỀM</Link>
      </nav>

      {loading ? (
        <p>Đang tải tin tức...</p>
      ) : (
        <>
          <div className="news-content">
            {/* Tin nổi bật */}
            {featuredArticle && (
              <Link
                to={`/NewsDetail/${featuredArticle._id}`}
                className="featured-article-link"
              >
                <div className="featured-article">
                  <img src={featuredArticle.image} alt="Featured" />
                  <div className="overlay">
                    <h2>{featuredArticle.title}</h2>
                    <p>
                      <span>
                        {new Date(
                          featuredArticle.createdAt
                        ).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                </div>
              </Link>
            )}

            {/* Bài viết mới nhất */}
            <aside className="latest-news">
              <h3>
                BÀI VIẾT <span className="highlight">MỚI NHẤT</span>
              </h3>
              {latestArticles.map((article) => (
                <Link
                  to={`/NewsDetail/${article._id}`}
                  key={article._id}
                  className="latest-news-link"
                >
                  <div className="latest-news-item">
                    <img src={article.image} alt={article.title} />
                    <div>
                      <h4>{article.title}</h4>
                      <p className="datenews">
                        {new Date(article.createdAt).toLocaleDateString()}
                      </p>
                      <p className="description">
                        {article.content.substring(0, 100)}...
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </aside>
          </div>

          {/* Tin công nghệ */}
          <section className="news-experience">
            <h3>TIN CÔNG NGHỆ</h3>
            <div className="news-experience-list">
              {techNews.slice(0, 6).map((news) => (
                <Link
                  to={`/NewsDetail/${news._id}`}
                  key={news._id}
                  className="tech-news-link"
                >
                  <div className="news-item">
                    <img src={news.image} alt={news.title} />
                    <div>
                      <h4>{news.title}</h4>
                      <p className="author">Tác giả: {news.author}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Chủ đề game */}
          <section className="news-game">
            <h3>CHỦ ĐỀ GAME</h3>
            <div className="news-game-list">
              {gameNews.slice(0, 9).map((news) => (
                <Link
                  to={`/NewsDetail/${news._id}`}
                  key={news._id}
                  className="game-news-link"
                >
                  <div className="game-item">
                    <img src={news.image} alt={news.title} />
                    <h4>{news.title}</h4>
                    <p className="datenews">
                      {new Date(news.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}

      <Outlet />
    </div>
  );
};

export default News;
