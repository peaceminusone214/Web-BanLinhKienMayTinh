import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function formatVietnamTime(dateString) {
  const date = new Date(dateString); // parse thôi
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function Chatmessages() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const fetchSessions = async () => {
    try {
      const res = await axios.get(`${API_URL}/message/sessions`);
      setSessions(res.data);
    } catch (error) {
      console.error("Lỗi lấy sessions:", error);
    }
  };

  const fetchMessages = async (sessionId) => {
    try {
      const res = await axios.get(`${API_URL}/message/history`, {
        params: { sessionId: selectedSessionId, limit: 1000 },
      });
      setMessages(res.data);
    } catch (error) {
      console.error("Lỗi lấy lịch sử chat:", error);
    }
  };

  const sendAdminMessage = async () => {
    if (!inputMessage.trim()) {
      toast.warn("Bạn chưa nhập nội dung tin nhắn!", { position: "top-right" });
      return;
    }
    try {
      await axios.post(`${API_URL}/message/send`, {
        sessionId: selectedSessionId,
        role: "admin",
        content: inputMessage,
      });
      setInputMessage("");
      fetchMessages(selectedSessionId);
      toast.success("Gửi tin nhắn thành công!", { position: "top-right" });
    } catch (error) {
      console.error("Lỗi gửi tin nhắn admin:", error);
      toast.error("Gửi tin nhắn thất bại!", { position: "top-right" });
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    if (selectedSessionId) {
      fetchMessages(selectedSessionId);
    }
  }, [selectedSessionId]);

  useEffect(() => {
    let interval;
    if (selectedSessionId) {
      interval = setInterval(() => {
        fetchMessages(selectedSessionId);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [selectedSessionId]);

  return (
    <div className="sherah-body-area">
      <section className="sherah-adashboard sherah-show">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="sherah-body">
                <div className="sherah-dsinner">
                  <div className="sherah-breadcrumb mg-top-30">
                    <h2 className="sherah-breadcrumb__title">
                      Quản lý Tin nhắn
                    </h2>
                  </div>

                  <div className="sherah-chatbox__main">
                    <div className="row">
                      {/* Sidebar - Sessions */}
                      <div className="col-lg-3 col-md-3 col-12 sherah-chatbox__one mg-top-30">
                        <div
                          className="sherah-chatbox__sidebar sherah-default-bg sherah-border"
                          style={{
                            borderRadius: "12px",
                            padding: "15px",
                            minHeight: "600px",
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <h3
                            style={{
                              fontSize: "20px",
                              fontWeight: "600",
                              marginBottom: "15px",
                              textAlign: "center",
                            }}
                          >
                            Danh sách cuộc trò chuyện
                          </h3>

                          {sessions.length === 0 ? (
                            <div
                              style={{
                                flex: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#999",
                                fontSize: "16px",
                                textAlign: "center",
                                padding: "20px",
                              }}
                            >
                              <p>Chưa có cuộc trò chuyện nào.</p>
                            </div>
                          ) : (
                            <ul
                              className="sherah-chatbox__list"
                              style={{
                                maxHeight: "100%",
                                overflowY: "auto",
                                paddingRight: "5px",
                              }}
                            >
                              {sessions.map((session, index) => (
                                <li
                                  key={index}
                                  onClick={() =>
                                    setSelectedSessionId(session.sessionId)
                                  }
                                  style={{
                                    cursor: "pointer",
                                    marginBottom: "12px",
                                  }}
                                >
                                  <div
                                    className={`sherah-chatbox__inner ${
                                      selectedSessionId === session.sessionId
                                        ? "active"
                                        : ""
                                    }`}
                                    style={{
                                      backgroundColor:
                                        selectedSessionId === session.sessionId
                                          ? "#e6f0ff"
                                          : "#f9f9f9",
                                      border:
                                        selectedSessionId === session.sessionId
                                          ? "2px solid #4f8cff"
                                          : "1px solid #ccc",
                                      borderRadius: "10px",
                                      padding: "12px",
                                      transition: "all 0.3s ease",
                                      boxShadow:
                                        selectedSessionId === session.sessionId
                                          ? "0px 4px 10px rgba(0,0,0,0.15)"
                                          : "0 1px 3px rgba(0,0,0,0.1)",
                                    }}
                                  >
                                    <div className="sherah-chatbox__author-content">
                                      <h5
                                        style={{
                                          marginBottom: "6px",
                                          fontSize: "16px",
                                          color: "#333",
                                        }}
                                      >
                                        {session.userName ||
                                          "Người dùng ẩn danh"}
                                      </h5>

                                      <p
                                        className="sherah-chatbox__author-title"
                                        style={{
                                          fontSize: "13px",
                                          color: "#666",
                                          marginBottom: "4px",
                                        }}
                                      >
                                        ID: {session.sessionId}
                                      </p>

                                      <p
                                        className="sherah-chatbox__author-desc"
                                        style={{
                                          fontSize: "13px",
                                          color: "#999",
                                        }}
                                      >
                                        {session.count} tin nhắn
                                      </p>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>

                      {/* Main Chat */}
                      <div className="col-lg-8 col-md-8 col-12 sherah-chatbox__two mg-top-30">
                        <div
                          className="sherah-chatbox__explore sherah-default-bg sherah-border"
                          style={{
                            borderRadius: "10px",
                            padding: "15px",
                            height: "600px",
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <div
                            className="sherah-chatbox__explore-body"
                            style={{
                              flex: 1,
                              overflowY: "auto",
                              marginBottom: "15px",
                            }}
                          >
                            {messages.map((msg, idx) => (
                              <div
                                key={idx}
                                style={{
                                  marginBottom: "10px",
                                  textAlign:
                                    msg.role === "admin" ? "right" : "left",
                                }}
                              >
                                <div
                                  style={{
                                    display: "inline-block",
                                    background:
                                      msg.role === "admin"
                                        ? "#d6e4ff"
                                        : "#f0f0f0",
                                    padding: "10px 15px",
                                    borderRadius: "20px",
                                    maxWidth: "70%",
                                    wordBreak: "break-word",
                                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  }}
                                >
                                  <p
                                    style={{
                                      marginBottom: "5px",
                                      fontWeight: "bold",
                                      fontSize: "13px",
                                      color: "#666",
                                    }}
                                  >
                                    [{msg.role}]
                                  </p>
                                  <p style={{ margin: 0 }}>{msg.content}</p>

                                  <p
                                    style={{
                                      marginTop: "5px",
                                      fontSize: "12px",
                                      color: "#999",
                                    }}
                                  >
                                    {formatVietnamTime(msg.createdAt)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {selectedSessionId && (
                            <form
                              className="sherah-chatbox__new-message"
                              onSubmit={(e) => {
                                e.preventDefault();
                                sendAdminMessage();
                              }}
                              style={{ display: "flex", gap: "10px" }}
                            >
                              <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) =>
                                  setInputMessage(e.target.value)
                                }
                                placeholder="Nhập tin nhắn..."
                                className="sherah-chatbox__form-inner"
                                style={{
                                  flex: 1,
                                  borderRadius: "20px",
                                  padding: "12px 20px",
                                  border: "1px solid #ccc",
                                  backgroundColor: "#f9f9f9",
                                  outline: "none",
                                  transition: "all 0.3s",
                                }}
                                onFocus={(e) =>
                                  (e.target.style.backgroundColor = "#fff")
                                }
                                onBlur={(e) =>
                                  (e.target.style.backgroundColor = "#f9f9f9")
                                }
                              />
                              <button
                                type="submit"
                                className="sherah-chatbox__submit-btn"
                                style={{
                                  borderRadius: "20px",
                                  padding: "12px 20px",
                                  background: "#4f8cff",
                                  color: "#fff",
                                  border: "none",
                                  transition: "background 0.3s",
                                  fontWeight: "bold",
                                }}
                              >
                                Gửi
                              </button>
                            </form>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </section>
    </div>
  );
}

export default Chatmessages;
