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
          `${API_URL}/news?isDisplayed=true`,
          { withCredentials: true }
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
          `${API_URL}/news/category/tech?isDisplayed=true`,
          { withCredentials: true }
        );
        setTechNews(techArticles);

        const { data: gameArticles } = await axios.get(
          `${API_URL}/news/category/game?isDisplayed=true`,
          { withCredentials: true }
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
