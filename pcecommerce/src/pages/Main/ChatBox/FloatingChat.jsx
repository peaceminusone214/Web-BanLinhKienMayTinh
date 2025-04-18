import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addMessage,
  sendMessageToBot,
} from "../../../redux/actions/chatActions";
import { motion, AnimatePresence } from "framer-motion";
import "../ChatBox/styleFloatingChat.css";

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const dispatch = useDispatch();
  const { messages, loading } = useSelector((state) => state.chat);

  const toggleChat = () => setIsOpen(!isOpen);

  const [typingBot, setTypingBot] = useState(false);
  const [displayedMessage, setDisplayedMessage] = useState("");

  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.role === "assistant") {
      setTypingBot(true);
      setDisplayedMessage("");

      let index = 0;
      const interval = setInterval(() => {
        setDisplayedMessage((prev) => prev + lastMsg.content.charAt(index));
        index++;
        if (index === lastMsg.content.length) {
          clearInterval(interval);
          setTypingBot(false);
        }
      }, 20); // tốc độ gõ
    }
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  //hello nha
  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 10000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      dispatch(
        addMessage({
          role: "assistant",
          content: "Chào bạn! Tớ có thể giúp gì hôm nay? 😊",
        })
      );
    }
  }, [isOpen]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    dispatch(addMessage(userMsg));
    dispatch(sendMessageToBot([...messages, userMsg]));
    setInput("");
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
                        {isBot && isLast && typingBot
                          ? displayedMessage
                          : msg.content}
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
