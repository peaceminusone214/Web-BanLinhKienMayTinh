import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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
  useEffect(() => {
    console.log("State changed:", newsList);
  }, [newsList]);
  

  // Thay đổi trạng thái isDisplayed hoặc featured
  const handleToggleDisplay = async (newsItem, fieldName) => {
    try {
      // Đảo ngược giá trị fieldName (có thể là 'isDisplayed' hoặc 'featured')
      const updatedValue = !newsItem[fieldName];
      const updatedNews = { ...newsItem, [fieldName]: updatedValue };

      // Gọi API update
      const res = await axios.put(`${API_URL}/news/${newsItem._id}`, updatedNews);

      // Cập nhật lại state newsList
      setNewsList(newsList.map(item => (item._id === newsItem._id ? res.data : item)));
    } catch (error) {
      console.error("Error updating news:", error);
    }
  };

  // Hàm xóa (nếu cần)
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/news/${id}`);
      setNewsList(newsList.filter((news) => news._id !== id));
    } catch (err) {
      console.error("Error deleting news:", err);
    }
  };

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
                      <Link to="/admin/news-management" className="sherah-btn sherah-gbcolor">
                        Quay về trang quản lý tin tức
                      </Link>
                    </div>
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
                            <th className="sherah-table__column-3">Hiển thị?</th>
                            <th className="sherah-table__column-4">Nổi bật?</th>
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
                              <td className="sherah-table__column-3">
                                <input
                                  type="checkbox"
                                  checked={!!newsItem.isDisplayed}
                                  onChange={() =>
                                    handleToggleDisplay(newsItem, "isDisplayed")
                                  }
                                />
                              </td>
                              <td className="sherah-table__column-4">
                                <input
                                  type="checkbox"
                                  checked={!!newsItem.featured}
                                  onChange={() =>
                                    handleToggleDisplay(newsItem, "featured")
                                  }
                                />
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
                                }  

export default AddNews;
