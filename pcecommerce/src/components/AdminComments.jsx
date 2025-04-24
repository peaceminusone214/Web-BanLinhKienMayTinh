import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./css/styleComments.css";

const AdminComments = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const [comments, setComments] = useState([]);
  const [filters, setFilters] = useState({
    reportStatus: "",
    approvalStatus: "",
    sortBy: "newest",
    username: "",
  });

  const fetchComments = async () => {
    try {
      const params = {};
      if (filters.reportStatus) params.reportStatus = filters.reportStatus;
      if (filters.approvalStatus)
        params.approvalStatus = filters.approvalStatus;
      if (filters.sortBy) params.sortBy = filters.sortBy;
      if (filters.username) params.username = filters.username;

      const res =
        Object.keys(params).length > 0
          ? await axios.get(`${API_URL}/comment/reported`, {
              params,
              withCredentials: true,
            })
          : await axios.get(`${API_URL}/comment`, { withCredentials: true });
      setComments(res.data);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch comments data
        const commentsRes = await axios.get(`${API_URL}/comment`, {
          withCredentials: true,
        });
        setComments(commentsRes.data);

        // Fetch replies data
        fetchReplies();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleReplyFilterChange = (e) => {
    setReplyFilters({ ...replyFilters, [e.target.name]: e.target.value });
  };

  const handleReplySearch = () => {
    fetchReplies();
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    fetchComments();
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/comment/${id}`);
      setComments(comments.filter((comment) => comment._id !== id));
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  const handleDeleteReply = async (id) => {
    try {
      await axios.delete(`${API_URL}/comment/reply/${id}`);
      setReplies(replies.filter((reply) => reply._id !== id));
    } catch (err) {
      console.error("Error deleting reply:", err);
    }
  };

  const handleBan = async (id) => {
    try {
      const res = await axios.put(`${API_URL}/comment/ban/${id}`);
      setComments(
        comments.map((comment) => (comment._id === id ? res.data : comment))
      );
    } catch (err) {
      console.error("Error toggling ban on comment:", err);
    }
  };

  //ẩn bớt id
  const [expandedIds, setExpandedIds] = useState({});
  const toggleIdDisplay = (id) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const [replies, setReplies] = useState([]);
  const [replyFilters, setReplyFilters] = useState({
    sortBy: "newest",
    username: "",
  });

  const fetchReplies = async () => {
    try {
      const params = {};
      if (replyFilters.sortBy) params.sortBy = replyFilters.sortBy;
      if (replyFilters.username) params.username = replyFilters.username;

      const res = await axios.get(`${API_URL}/comment/replies`, {
        params,
        withCredentials: true,
      });
      setReplies(res.data);
    } catch (err) {
      console.error("Error fetching replies:", err);
    }
  };

  return (
    <div className="sherah-body-area">
      <section className="sherah-adashboard sherah-show">
        <div className="container">
          <div className="row">
            <div className="col-12 sherah-main__column">
              <div className="sherah-body"></div>

              <div className="admin-comments-page">
                <div className="row">
                  <div className="col-12">
                    <div className="mg-top-30">
                      {/* Khối chứa tiêu đề + bộ lọc */}
                      <div className="sherah-product-table sherah-table p-0">
                        {/* Tiêu đề */}
                        <div className="sherah-table__heading">
                          <h3 className="sherah-heading__title mb-0">
                            Quản lý Bình Luận
                          </h3>
                        </div>

                        {/* Bộ lọc và tìm kiếm */}
                        <div className="sherah-filter__container">
                          <div className="sherah-filter__row">
                            <select
                              name="reportStatus"
                              value={filters.reportStatus}
                              onChange={handleFilterChange}
                              className="sherah-filter__select"
                            >
                              <option value="">Tất cả báo cáo</option>
                              <option value="reported">Bị báo cáo</option>
                              <option value="not_reported">
                                Không báo cáo
                              </option>
                            </select>

                            <select
                              name="approvalStatus"
                              value={filters.approvalStatus}
                              onChange={handleFilterChange}
                              className="sherah-filter__select"
                            >
                              <option value="">Tất cả trạng thái</option>
                              <option value="active">Đã duyệt</option>
                              <option value="banned">Chưa duyệt</option>
                            </select>

                            <select
                              name="sortBy"
                              value={filters.sortBy}
                              onChange={handleFilterChange}
                              className="sherah-filter__select"
                            >
                              <option value="newest">Bình luận mới nhất</option>
                              <option value="oldest">Bình luận cũ nhất</option>
                            </select>

                            <input
                              type="text"
                              name="username"
                              placeholder="Tìm theo username"
                              value={filters.username}
                              onChange={handleFilterChange}
                              className="sherah-filter__input"
                            />

                            <button
                              onClick={handleSearch}
                              className="sherah-filter__btn-search"
                            >
                              Tìm kiếm
                            </button>
                          </div>
                        </div>
                      </div>
                      {/* Kết thúc khối tiêu đề + bộ lọc */}

                      {/* Bảng danh sách bình luận */}
                      <div className="sherah-product-table sherah-table p-0">
                        <table
                          id="sherah-table__main"
                          className="sherah-table__main sherah-table__main-v1"
                        >
                          <thead className="sherah-table__head">
                            <tr>
                              {/* Sửa cột STT thành hiển thị ID của comment */}
                              <th className="sherah-table__column-1 sherah-table__h1">
                                ID
                              </th>
                              <th className="sherah-table__column-2 sherah-table__h2">
                                Username
                              </th>
                              <th className="sherah-table__column-3 sherah-table__h3">
                                Nội dung
                              </th>
                              <th className="sherah-table__column-4 sherah-table__h4">
                                Rating
                              </th>
                              {/* <th className="sherah-table__column-5 sherah-table__h5">Ảnh</th> */}
                              <th className="sherah-table__column-6 sherah-table__h6">
                                Trạng thái
                              </th>
                              {/* Cột mới hiển thị báo cáo */}
                              <th className="sherah-table__column-8 sherah-table__h8">
                                Báo cáo
                              </th>
                              <th className="sherah-table__column-7 sherah-table__h7">
                                Hành động
                              </th>
                            </tr>
                          </thead>
                          <tbody className="sherah-table__body">
                            {comments.length > 0 ? (
                              comments.map((comment) => (
                                <tr key={comment._id}>
                                  <td className="sherah-table__column-1 sherah-table__data-1">
                                    <div className="sherah-table__product--id">
                                      <p
                                        className="crany-table__product--number"
                                        title={comment._id}
                                        style={{
                                          cursor: "pointer",
                                          color: "#007bff",
                                        }}
                                        onClick={() =>
                                          toggleIdDisplay(comment._id)
                                        }
                                      >
                                        {expandedIds[comment._id]
                                          ? comment._id
                                          : `${comment._id.substring(0, 4)}...`}
                                      </p>
                                    </div>
                                  </td>
                                  <td className="sherah-table__column-2 sherah-table__data-2">
                                    <div className="sherah-table__product-content">
                                      <p className="sherah-table__product-desc">
                                        {comment.username}
                                      </p>
                                    </div>
                                  </td>
                                  <td className="sherah-table__column-3 sherah-table__data-3">
                                    <div className="sherah-table__product-content">
                                      <Link
                                        to={`/admin/admin-comments-detail/${comment._id}`}
                                        className="sherah-table__product-desc"
                                      >
                                        {comment.content}
                                      </Link>
                                    </div>
                                  </td>
                                  <td className="sherah-table__column-4 sherah-table__data-4">
                                    <div className="sherah-table__product-content">
                                      <p className="sherah-table__product-desc">
                                        {comment.rating}
                                      </p>
                                    </div>
                                  </td>
                                  {/* <td className="sherah-table__column-5 sherah-table__data-5">
                                    {comment.image ? (
                                      <img
                                        src={`${API_URL}/${comment.image}`}
                                        alt="Comment"
                                        style={{ width: "100px" }}
                                      />
                                    ) : (
                                      "No Image"
                                    )}
                                  </td> */}
                                  <td className="sherah-table__column-6 sherah-table__data-6">
                                    <div
                                      className={`sherah-table__status ${
                                        comment.status === "active"
                                          ? "sherah-color2 sherah-color2__bg--opactity"
                                          : "sherah-color3 sherah-color3__bg--opactity"
                                      }`}
                                    >
                                      {comment.status}
                                    </div>
                                  </td>
                                  {/* Cột báo cáo */}
                                  <td className="sherah-table__column-8">
                                    {comment.reports &&
                                    comment.reports.length > 0
                                      ? "Bị báo cáo"
                                      : "Không"}
                                  </td>
                                  <td className="sherah-table__column-7 sherah-table__data-7">
                                    <div className="sherah-table__product-content">
                                      <button
                                        onClick={() => handleBan(comment._id)}
                                        style={{
                                          marginRight: "10px",
                                          backgroundColor: "#f9c74f",
                                          border: "none",
                                          padding: "8px",
                                          borderRadius: "4px",
                                          cursor: "pointer",
                                        }}
                                      >
                                        <svg
                                          className="sherah-color2__fill"
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="16.247"
                                          height="16.247"
                                          viewBox="0 0 24 24"
                                        >
                                          <circle
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                          />
                                          <line
                                            x1="4.93"
                                            y1="4.93"
                                            x2="19.07"
                                            y2="19.07"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                          />
                                        </svg>
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleDelete(comment._id)
                                        }
                                        style={{
                                          backgroundColor: "#bab9c5",
                                          border: "none",
                                          padding: "8px",
                                          borderRadius: "4px",
                                          cursor: "pointer",
                                        }}
                                      >
                                        <svg
                                          className="sherah-color2__fill"
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="16.247"
                                          height="18.252"
                                          viewBox="0 0 16.247 18.252"
                                        >
                                          <g
                                            id="Icon"
                                            transform="translate(-160.007 -18.718)"
                                          >
                                            <path
                                              id="Path_484"
                                              data-name="Path 484"
                                              d="M185.344,88.136c0,1.393,0,2.786,0,4.179-.006,1.909-1.523,3.244-3.694,3.248q-3.623.007-7.246,0c-2.15,0-3.682-1.338-3.687-3.216q-.01-4.349,0-8.7a.828.828,0,0,1,.822-.926.871.871,0,0,1,1,.737c.016.162.006.326.006.489q0,4.161,0,8.321c0,1.061.711,1.689,1.912,1.69q3.58,0,7.161,0c1.2,0,1.906-.631,1.906-1.695q0-4.311,0-8.622a.841.841,0,0,1,.708-.907.871.871,0,0,1,1.113.844C185.349,85.1,185.343,86.618,185.344,88.136Z"
                                              transform="translate(-9.898 -58.597)"
                                            />
                                            <path
                                              id="Path_485"
                                              data-name="Path 485"
                                              d="M164.512,21.131c0-.517,0-.98,0-1.443.006-.675.327-.966,1.08-.967q2.537,0,5.074,0c.755,0,1.074.291,1.082.966.005.439.005.878.009,1.317a.615.615,0,0,0,.047.126h.428c1,0,2,0,3,0,.621,0,1.013.313,1.019.788s-.4.812-1.04.813q-7.083,0-14.165,0c-.635,0-1.046-.327-1.041-.811s.4-.786,1.018-.789C162.165,21.127,163.3,21.131,164.512,21.131Zm1.839-.021H169.9v-.764h-3.551Z"
                                              transform="translate(0 0)"
                                            />
                                          </g>
                                        </svg>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td
                                  colSpan="8"
                                  className="sherah-table__product-desc"
                                >
                                  No comments found.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                      {/* Kết thúc bảng bình luận */}

                      {/* Bộ lọc cho replies */}
                      <div className="admin-replies-filter__container">
                        <h4 className="admin-replies-heading">
                          Quản lý Phản Hồi Bình Luận
                        </h4>
                        <div className="admin-replies-filter__row">
                          <select
                            name="sortBy"
                            value={replyFilters.sortBy}
                            onChange={handleReplyFilterChange}
                            className="admin-replies-filter__select"
                          >
                            <option value="newest">Mới nhất</option>
                            <option value="oldest">Cũ nhất</option>
                          </select>

                          <input
                            type="text"
                            name="username"
                            placeholder="Tìm theo username"
                            value={replyFilters.username}
                            onChange={handleReplyFilterChange}
                            className="admin-replies-filter__input"
                          />

                          <button
                            onClick={handleReplySearch}
                            className="admin-replies-filter__btn-search"
                          >
                            Tìm kiếm
                          </button>
                        </div>
                      </div>

                      {/* Bảng hiển thị replies */}
                      <div className="admin-replies-table-wrapper">
                        <table className="admin-replies-table">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Username</th>
                              <th>Nội dung</th>
                              <th>Bị báo cáo</th>
                              <th>Thao tác</th>
                            </tr>
                          </thead>
                          <tbody>
                            {replies.length > 0 ? (
                              replies.map((reply) => (
                                <tr key={reply._id}>
                                  <td
                                    title={reply._id}
                                    style={{
                                      cursor: "pointer",
                                      color: "#007bff",
                                    }}
                                    onClick={() =>
                                      setExpandedIds((prev) => ({
                                        ...prev,
                                        [reply._id]: !prev[reply._id],
                                      }))
                                    }
                                  >
                                    {expandedIds[reply._id]
                                      ? reply._id
                                      : `${reply._id.substring(0, 4)}...`}
                                  </td>
                                  <td>{reply.username}</td>
                                  <td>{reply.content}</td>
                                  <td>
                                    {reply.reports && reply.reports.length > 0
                                      ? "Bị báo cáo"
                                      : "Không"}
                                  </td>
                                  <td>
                                    <button
                                      onClick={() =>
                                        handleDeleteReply(reply._id)
                                      }
                                      style={{
                                        backgroundColor: "#bab9c5",
                                        border: "none",
                                        padding: "6px",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                      }}
                                    >
                                      🗑️
                                    </button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="5">Không có phản hồi nào.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminComments;
