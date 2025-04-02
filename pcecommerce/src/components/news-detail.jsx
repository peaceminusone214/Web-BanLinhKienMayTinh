import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "./css/NewsDetail.css"; 

const NewsDetail = () => {
  const { id } = useParams(); // Lấy id bài viết từ URL
  const API_URL = process.env.REACT_APP_API_URL;
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const res = await axios.get(`${API_URL}/news/${id}`);
        setNews(res.data);
      } catch (err) {
        console.error("Error fetching news detail:", err);
        setError("Lỗi khi lấy chi tiết tin tức");
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [API_URL, id]);

  return (
    <div className="news-detail-container">
      {/* Breadcrumb và Menu như trang News.jsx */}
      <div className="breadcrumb">
        <Link to="/">Trang chủ</Link> <span className="current">Tin tức</span>
      </div>

      <nav className="news-categories">
        <Link to="/News/tech">TIN CÔNG NGHỆ</Link>
        <Link to="/News/san-pham">SẢN PHẨM MỚI</Link>
        <Link to="/News/game">CHỦ ĐỀ GAME</Link>
        <Link to="/News/tips">THỦ THUẬT</Link>
        <Link to="/News/software">PHẦN MỀM</Link>
      </nav>
      <div className="detail-menu">
            <Link to="/News" className="back-to-news">
              &larr; Quay lại tin tức
            </Link>
          </div>
      {loading ? (
        <p className="loading">Đang tải tin tức...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : !news ? (
        <p className="no-news">Không tìm thấy bài viết.</p>
      ) : (
        <div className="news-detail-content">
          <h1 className="news-detail-title">{news.title}</h1>
          <p className="news-detail-date">
            {new Date(news.createdAt).toLocaleDateString()}
          </p>
          <img
            src={news.image}
            alt={news.title}
            className="news-detail-image"
          />
          {/* Nếu nội dung trong DB chỉ là text thuần (với newline) */}
          <div className="news-detail-text">
            {news.content.split("\n").map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsDetail;
