import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";

const AdminCommentDetail = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const { id } = useParams();
  const navigate = useNavigate();

  const [comment, setComment] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [adminReply, setAdminReply] = useState("");
  const [notification, setNotification] = useState("");

  // State để quản lý chế độ chỉnh sửa cho từng reply
  // replyEdits: { [replyId]: { isEditing: boolean, content: string } }
  const [replyEdits, setReplyEdits] = useState({});

  // Lấy chi tiết bình luận (bao gồm cả replies)
  const fetchCommentDetail = async () => {
    try {
      const res = await axios.get(`${API_URL}/comment/${id}`, { withCredentials: true });
      setComment(res.data);
      console.log("Chi tiết comment: ", res.data);
      setEditContent(res.data.content);
      // Khởi tạo trạng thái chỉnh sửa cho replies
      setReplyEdits(
        res.data.replies.reduce((acc, reply) => {
          acc[reply._id] = { isEditing: false, content: reply.content };
          return acc;
        }, {})
      );
    } catch (err) {
      console.error("Error fetching comment detail:", err);
    }
  };

  useEffect(() => {
    fetchCommentDetail();
  }, [id]);

  // Cập nhật nội dung comment cha
  const handleEdit = async () => {
    try {
      const res = await axios.put(`${API_URL}/comment/${id}`, {
        content: editContent,
      });
      setComment(res.data);
      alert("Bình luận đã được cập nhật.");
    } catch (err) {
      console.error("Error editing comment:", err);
    }
  };

  // Gửi reply mới từ admin
  const handleReply = async () => {
    if (!adminReply.trim()) return;
    try {
      await axios.post(`${API_URL}/comment/reply/${id}`, {
        username: "Admin",
        content: adminReply,
        role: "admin",
      });
      fetchCommentDetail();
      setAdminReply("");
    } catch (err) {
      console.error("Error replying to comment:", err);
    }
  };

  // Xóa toàn bộ comment cha
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/comment/${id}`);
      alert("Bình luận đã được xóa.");
      navigate("/admin/admin-comments");
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  // Gửi thông báo cho người dùng
  const handleNotify = async () => {
    if (!notification.trim()) return;
    try {
      await axios.put(`${API_URL}/comment/notify/${id}`, {
        message: notification,
      });
      alert("Thông báo đã được gửi.");
      setNotification("");
    } catch (err) {
      console.error("Error sending notification:", err);
    }
  };

  // Các hàm xử lý cho từng reply:
  const startEditingReply = (replyId, currentContent) => {
    setReplyEdits((prev) => ({
      ...prev,
      [replyId]: { isEditing: true, content: currentContent },
    }));
  };

  const cancelEditingReply = (replyId) => {
    setReplyEdits((prev) => ({
      ...prev,
      [replyId]: { isEditing: false, content: prev[replyId].content },
    }));
  };

  const handleReplyEditChange = (replyId, newContent) => {
    setReplyEdits((prev) => ({
      ...prev,
      [replyId]: { ...prev[replyId], content: newContent },
    }));
  };

  // Lưu thay đổi khi chỉnh sửa reply
  const saveReplyEdit = async (replyId) => {
    try {
      await axios.put(`${API_URL}/comment/reply/${replyId}`, {
        content: replyEdits[replyId].content,
      });
      fetchCommentDetail();
      alert("Reply đã được cập nhật.");
    } catch (err) {
      console.error("Error updating reply:", err);
    }
  };

  // Xóa từng reply
  const deleteReply = async (replyId) => {
    try {
      await axios.delete(`${API_URL}/comment/reply/${replyId}`);
      fetchCommentDetail();
      alert("Reply đã được xóa.");
    } catch (err) {
      console.error("Error deleting reply:", err);
    }
  };

  if (!comment) return <div>Loading comment details...</div>;

  return (
    <div className="admin-comment-detail sherah-body-area">
      <section className="sherah-adashboard sherah-show">
        <div className="container">
          <div className="row">
            <div className="col-12 sherah-main__column">
              <div className="sherah-card mg-top-30">
                {/* Header */}
                <header className="sherah-card__header">
                  <h2 className="sherah-heading__title">Chi Tiết Bình Luận</h2>
                  <Link
                    to="/admin/admin-comments"
                    className="sherah-btn sherah-btn--back"
                  >
                    ← Quay lại danh sách bình luận
                  </Link>
                </header>

                {/* Body */}
                <div className="sherah-card__body">
                  <div className="sherah-detail__info">
                    <p>
                      <strong>Username:</strong> {comment.username}
                    </p>
                    <p>
                      <strong>Email:</strong> {comment.email}
                    </p>
                    <p>
                      <strong>Ngày giờ đăng:</strong>{" "}
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                    <p>
                      <strong>Nội dung:</strong>
                    </p>
                    <textarea
                      className="sherah-wc__form-input"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    />
                    <button
                      onClick={handleEdit}
                      className="sherah-btn mg-top-10"
                    >
                      Cập nhật bình luận
                    </button>
                    <p className="mg-top-10">
                      <strong>Rating:</strong> {comment.rating}
                    </p>
                    {comment.reports && comment.reports.length > 0 && (
                      <div className="mg-top-10">
                        <h4 className="sherah-heading__sub">
                          Báo cáo từ người dùng:
                        </h4>
                        <ul>
                          {comment.reports.map((report, index) => (
                            <li key={index}>
                              <strong>{report.reporter}</strong>:{" "}
                              {report.reason}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {comment.image && (
                      <div className="sherah-img__container mg-top-10">
                        <img
                          src={`${API_URL}/${comment.image}`}
                          alt="Comment"
                          className="sherah-img--detail"
                        />
                      </div>
                    )}
                  </div>

                  <hr className="sherah-divider" />

                  {/* Phần Reply */}
                  <div className="sherah-review-section">
                    <h3 className="sherah-review-comment__title">Replies</h3>
                    {comment.replies && comment.replies.length > 0 ? (
                      comment.replies.map((reply) => (
                        <div
                          key={reply._id}
                          className="sherah-user-reviews__single sherah-user-reviews__single--reply"
                        >
                          <p>
                            <strong>{reply.username}</strong> ({reply.role})
                          </p>
                          {replyEdits[reply._id] &&
                          replyEdits[reply._id].isEditing ? (
                            <>
                              <textarea
                                className="sherah-wc__form-input"
                                value={replyEdits[reply._id].content}
                                onChange={(e) =>
                                  handleReplyEditChange(
                                    reply._id,
                                    e.target.value
                                  )
                                }
                              />
                              <div className="mg-top-5">
                                <button
                                  onClick={() => saveReplyEdit(reply._id)}
                                  className="sherah-btn"
                                >
                                  Lưu
                                </button>
                                <button
                                  onClick={() => cancelEditingReply(reply._id)}
                                  className="sherah-btn mg-top-5"
                                  style={{
                                    marginLeft: "10px",
                                    backgroundColor: "#6c757d",
                                  }}
                                >
                                  Hủy
                                </button>
                              </div>
                            </>
                          ) : (
                            <>
                              <p>{reply.content}</p>
                              <p>
                                <small>
                                  {new Date(reply.createdAt).toLocaleString()}
                                </small>
                              </p>
                              {/* Hiển thị thông tin báo cáo của reply nếu có */}
                              {reply.reports && reply.reports.length > 0 && (
                                <div className="sherah-report-info">
                                  <h5>Báo cáo từ người dùng:</h5>
                                  <ul>
                                    {reply.reports.map((report, index) => (
                                      <li key={index}>
                                        <strong>{report.reporter}</strong>:{" "}
                                        {report.reason}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              <div className="mg-top-5">
                                <button
                                  onClick={() =>
                                    startEditingReply(reply._id, reply.content)
                                  }
                                  className="sherah-btn"
                                >
                                  Chỉnh sửa
                                </button>
                                <button
                                  onClick={() => deleteReply(reply._id)}
                                  className="sherah-btn sherah-btn--delete"
                                  style={{ marginLeft: "10px" }}
                                >
                                  Xóa
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="sherah-no-reply">Không có reply.</p>
                    )}
                    <textarea
                      className="sherah-wc__form-input sherah-wc__form-input--big mg-top-10"
                      placeholder="Trả lời bình luận"
                      value={adminReply}
                      onChange={(e) => setAdminReply(e.target.value)}
                    />
                    <button
                      onClick={handleReply}
                      className="sherah-btn mg-top-5"
                    >
                      Gửi Reply
                    </button>
                  </div>
                  <hr className="sherah-divider" />
                </div>
                {/* Footer */}
                <footer className="sherah-card__footer">
                  <button
                    onClick={handleDelete}
                    className="sherah-btn sherah-btn--delete"
                  >
                    Xóa Bình Luận
                  </button>
                </footer>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminCommentDetail;
