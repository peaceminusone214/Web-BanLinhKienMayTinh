import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addMessage,
  sendMessageToBot,
} from "../../../redux/actions/chatActions";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import "../ChatBox/styleFloatingChat.css";

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const dispatch = useDispatch();
  const { messages, loading } = useSelector((state) => state.chat);
  // Get compare list from Redux store
  const compareList = useSelector((state) => state.compare.compareList);
  
  // State for showing comparison in chat
  const [showComparison, setShowComparison] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const [typingBot, setTypingBot] = useState(false);
  const [displayedMessage, setDisplayedMessage] = useState("");

  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.role === "assistant") {
      setTypingBot(true);
      setDisplayedMessage("");

      let index = 0;
      const typingSpeed = lastMsg.content.length > 300 ? 5 : 20;

      const interval = setInterval(() => {
        setDisplayedMessage((prev) => prev + lastMsg.content.charAt(index));
        index++;
        if (index === lastMsg.content.length) {
          clearInterval(interval);
          setTypingBot(false);
        }
      }, typingSpeed);
    }
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showComparison]);

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 10000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      dispatch(
        addMessage({
          role: "assistant",
          content: "Chào bạn! 😊 Mình có thể giúp gì cho bạn hôm nay? \n\nNếu bạn đang tìm hiểu về sản phẩm, đừng ngại hỏi mình nhé! Hoặc gõ 'so sánh' để nhanh chóng so sánh các sản phẩm với nhau. Mình luôn sẵn sàng hỗ trợ bạn!",
        })
      );
    }
  }, [isOpen]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Detect command to show product comparison
    if (input.toLowerCase().includes("so sánh") && compareList.length > 0) {
      dispatch(addMessage({ role: "user", content: input }));
      setShowComparison(true);
      dispatch(
        addMessage({
          role: "assistant",
          content: "Đây là bảng so sánh các sản phẩm bạn đã chọn:",
        })
      );
      setInput("");
      return;
    }
    
    // Hide comparison if any other message is sent
    if (showComparison) {
      setShowComparison(false);
    }
    
    const userMsg = { role: "user", content: input };
    dispatch(addMessage(userMsg));
    dispatch(sendMessageToBot([...messages, userMsg]));
    setInput("");
  };

  // Render a comparison row
  const renderComparisonRow = (label, getValue) => (
    <tr>
      <th className="bg-light text-start px-2 py-1" style={{ fontSize: "12px" }}>{label}</th>
      {compareList.map((product, index) => (
        <td key={index} className="px-2 py-1" style={{ fontSize: "12px" }}>{getValue(product)}</td>
      ))}
    </tr>
  );

  // Product comparison component to be displayed in chat
  const ProductComparisonTable = () => {
    if (compareList.length === 0) {
      return <p>Chưa có sản phẩm nào để so sánh.</p>;
    }

    return (
      <div className="comparison-table-container my-2">
        <div className="table-responsive">
          <table className="table table-bordered table-sm" style={{ fontSize: "12px" }}>
            <thead className="bg-primary text-white">
              <tr>
                <th style={{ minWidth: "80px" }}>Tiêu chí</th>
                {compareList.map((product, index) => (
                  <th key={index} className="text-center" style={{ minWidth: "100px" }}>
                    {product.product_name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {renderComparisonRow("Ảnh", (p) => (
                <img
                  src={p.image_url}
                  alt={p.product_name}
                  style={{ height: "60px", width: "60px", objectFit: "contain" }}
                  className="mx-auto d-block my-1"
                />
              ))}
              {renderComparisonRow("Giá", (p) => (
                <span className="text-danger fw-bold">{p.price.toLocaleString()} VNĐ</span>
              ))}
              {renderComparisonRow("Thương hiệu", (p) => p.brand)}
              {renderComparisonRow("Trạng thái", (p) => (
                <span className={`badge ${p.status === "In Stock" ? "bg-success" : "bg-danger"}`}>
                  {p.status}
                </span>
              ))}
              {renderComparisonRow("Thông số", (p) =>
                p.specifications ? (
                  <ul className="text-start mb-0 ps-3" style={{ fontSize: "11px" }}>
                    {Object.entries(p.specifications)
                      .slice(0, 3) // Show only first 3 specs to save space
                      .map(([key, val], idx) => (
                        <li key={idx}>
                          <strong>{key}:</strong> {val}
                        </li>
                      ))}
                    {Object.keys(p.specifications).length > 3 && (
                      <li>
                        <small>và {Object.keys(p.specifications).length - 3} thông số khác...</small>
                      </li>
                    )}
                  </ul>
                ) : (
                  "Không có"
                )
              )}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-end">
          <button 
            className="btn btn-sm btn-outline-primary"
            onClick={() => window.location.href = "/compare-results"}
          >
            Xem chi tiết
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="floating-chat-container">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chat-box"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
          >
            <div className="chat-header">
              <span>💬 Hỏi đê gì cũng biết</span>
              <button onClick={toggleChat}>✖</button>
            </div>
            <div className="chat-body">
              {messages.map((msg, i) => {
                const isBot = msg.role === "assistant";
                const isLast = i === messages.length - 1;

                return (
                  <div key={i} className={`chat-msg ${msg.role}`}>
                    <div className="msg-wrapper">
                      {isBot && (
                        <img
                          src="/assets/icons/img-bot-fotor.png"
                          alt="Bot"
                          className="avatar"
                        />
                      )}

                      <div className="msg-bubble">
                        {isBot && isLast && typingBot ? (
                          <ReactMarkdown>{displayedMessage}</ReactMarkdown>
                        ) : (
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        )}
                        
                        {/* Show comparison table after the last bot message if showComparison is true */}
                        {isBot && isLast && !typingBot && showComparison && (
                          <ProductComparisonTable />
                        )}
                      </div>

                      {msg.role === "user" && (
                        <img
                          src="/assets/icons/img-user-fotor.png"
                          alt="User"
                          className="avatar"
                        />
                      )}
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div className="chat-msg assistant">
                  <div className="msg-wrapper">
                    <img
                      src="/assets/icons/img-bot-fotor.png"
                      alt="bot-avatar"
                      className="avatar"
                    />
                    <div className="msg-bubble typing">
                      <span className="dot" />
                      <span className="dot" />
                      <span className="dot" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <form className="chat-footer" onSubmit={sendMessage}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Nhập tin nhắn..."
              />
              <button type="submit">Gửi</button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.div className="chat-tooltip-wrapper">
          <motion.button
            className="chat-toggle-btn"
            onClick={toggleChat}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            💬
          </motion.button>
          <span className="chat-tooltip">Bạn cần giúp đỡ?</span>
        </motion.div>
      )}
    </div>
  );
};

export default FloatingChat;
