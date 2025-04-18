import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// Hàm xác định class cho nhãn hiển thị loại tin (sử dụng custom-badge để tránh trùng với Bootstrap)
const getCategoryBadgeClass = (category) => {
  if (!category) return "custom-badge custom-badge-light";
  switch (category.toLowerCase()) {
    case "news":
      return "custom-badge custom-badge-primary";
    case "product":
      return "custom-badge custom-badge-success";
    case "game":
      return "custom-badge custom-badge-warning";
    case "tips":
      return "custom-badge custom-badge-info";
    case "tech":
      return "custom-badge custom-badge-secondary";
    default:
      return "custom-badge custom-badge-light";
  }
};

const AddNews = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Lấy danh sách tin tức
  const fetchNews = async () => {
    try {
      const res = await axios.get(`${API_URL}/news`);
      setNewsList(res.data);
    } catch (err) {
      console.error("Error fetching news:", err);
      setError("Lỗi khi lấy tin tức");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [API_URL]);

  // Cập nhật isDisplayed
  const handleToggleDisplay = async (newsItem, fieldName) => {
    try {
      const updatedValue = !newsItem[fieldName];
      const updatedNews = { ...newsItem, [fieldName]: updatedValue };

      const res = await axios.put(
        `${API_URL}/news/${newsItem._id}`,
        updatedNews
      );
      setNewsList(
        newsList.map((item) => (item._id === newsItem._id ? res.data : item))
      );
    } catch (error) {
      console.error("Error updating news:", error);
    }
  };

  // Hàm cập nhật displaySection dựa theo lựa chọn của admin
  const handleSectionChange = async (newsItem, event) => {
    const newSection = event.target.value;
    try {
      const updatedNews = { ...newsItem, displaySection: newSection };
      const res = await axios.put(
        `${API_URL}/news/${newsItem._id}`,
        updatedNews
      );
      setNewsList(
        newsList.map((item) => (item._id === newsItem._id ? res.data : item))
      );
    } catch (error) {
      console.error("Error updating display section:", error);
    }
  };

  // Hàm xóa bài viết
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/news/${id}`);
      setNewsList(newsList.filter((news) => news._id !== id));
    } catch (err) {
      console.error("Error deleting news:", err);
    }
  };

  // Tính số lượng bài viết theo danh mục (displaySection)
  const totalCount = newsList.length;
  const featuredCount = newsList.filter(
    (item) => item.displaySection === "featured"
  ).length;
  const latestCount = newsList.filter(
    (item) => item.displaySection === "latest"
  ).length;
  const techCount = newsList.filter(
    (item) => item.category?.toLowerCase() === "tech"
  ).length;
  const gameCount = newsList.filter(
    (item) => item.category?.toLowerCase() === "game"
  ).length;

  return (
    <div className="sherah-body-area">
      <section className="sherah-adashboard sherah-show">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="sherah-body">
                <div className="sherah-dsinner">
                  <div className="row mg-top-30">
                    <div className="col-12 sherah-flex-between">
                      <h2 className="sherah-breadcrumb__title">
                        Cài đặt giao diện - Chọn tin hiển thị
                      </h2>
                      <Link
                        to="/admin/news-management"
                        className="sherah-btn sherah-gbcolor"
                      >
                        Quay về trang quản lý tin tức
                      </Link>
                    </div>
                  </div>
                  {/* Phần summary hiển thị số bài viết */}
                  <div className="news-summary" style={{ margin: "20px 0" }}>
                    <p>
                      Tổng số bài viết: <strong>{totalCount}</strong>
                    </p>
                    <p>
                      Bài viết Featured: <strong>{featuredCount}</strong>
                    </p>
                    <p>
                      Bài viết Latest: <strong>{latestCount}</strong>
                    </p>
                    <p>
                      Tin công nghệ: <strong>{techCount}</strong>
                    </p>
                    <p>
                      Tin game: <strong>{gameCount}</strong>
                    </p>
                  </div>

                  {loading ? (
                    <p>Đang tải...</p>
                  ) : error ? (
                    <p>{error}</p>
                  ) : (
                    <div className="sherah-table sherah-page-inner sherah-border sherah-default-bg mg-top-25">
                      <table
                        id="sherah-table__news"
                        className="sherah-table__main sherah-table__main-v3"
                      >
                        <thead className="sherah-table__head">
                          <tr>
                            <th className="sherah-table__column-1">ID</th>
                            <th className="sherah-table__column-2">Tiêu đề</th>
                            {/* Thêm cột Loại tin */}
                            <th className="sherah-table__column-9">Loại tin</th>
                            <th className="sherah-table__column-3">
                              Hiển thị?
                            </th>
                            <th className="sherah-table__column-5">Danh mục</th>
                            <th className="sherah-table__column-8">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody className="sherah-table__body">
                          {newsList.map((newsItem) => (
                            <tr key={newsItem._id}>
                              <td className="sherah-table__column-1">
                                {newsItem._id}
                              </td>
                              <td className="sherah-table__column-2">
                                {newsItem.title}
                              </td>
                              <td
                                className="sherah-table__column-9"
                                style={{
                                  display: "table-cell",
                                  padding: "12px",
                                  minWidth: "100px",
                                  borderBottom: "1px solid #eee",
                                }}
                              >
                                <span
                                  className={getCategoryBadgeClass(
                                    newsItem.category
                                  )}
                                >
                                  {newsItem.category}
                                </span>
                              </td>
                              <td className="sherah-table__column-3">
                                <input
                                  type="checkbox"
                                  checked={!!newsItem.isDisplayed}
                                  onChange={() =>
                                    handleToggleDisplay(newsItem, "isDisplayed")
                                  }
                                />
                              </td>
                              <td className="sherah-table__column-5">
                                <select
                                  value={newsItem.displaySection || ""}
                                  onChange={(e) =>
                                    handleSectionChange(newsItem, e)
                                  }
                                >
                                  <option value="">--Chọn--</option>
                                  <option value="featured">Featured</option>
                                  <option value="latest">Latest</option>
                                  <option value="tech">Tech</option>
                                  <option value="game">Game</option>
                                </select>
                              </td>
                              <td className="sherah-table__column-8">
                                <button
                                  onClick={() => handleDelete(newsItem._id)}
                                  className="sherah-btn"
                                >
                                  Xóa
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AddNews;
