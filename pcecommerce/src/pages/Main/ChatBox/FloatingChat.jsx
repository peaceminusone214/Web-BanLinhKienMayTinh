import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import store from "../../../redux/store";
import { addMessage, sendMessageToBot, loadMessages } from "../../../redux/actions/chatActions";
import { fetchChatHistory, sendUserMessage } from "../../../Service/messageAPI";
import { motion, AnimatePresence } from "framer-motion";
import "../ChatBox/styleFloatingChat.css";


const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const dispatch = useDispatch();
  const { messages, loading } = useSelector((state) => state.chat);
  console.log(messages)

  const toggleChat = () => setIsOpen(!isOpen);

  const [typingBot, setTypingBot] = useState(false);
  const [displayedMessage, setDisplayedMessage] = useState("");
  const [showAdminButton, setShowAdminButton] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [talkingToAdmin, setTalkingToAdmin] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState("");

  useEffect(() => {
    let storedSessionId = localStorage.getItem('sessionId');
    if (!storedSessionId) {
      storedSessionId = `sess-${Date.now()}`;
      localStorage.setItem('sessionId', storedSessionId);
    }
    setSessionId(storedSessionId);
    setSelectedSessionId(storedSessionId);
  }, []);


  useEffect(() => {
    if (talkingToAdmin) return;
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
      dispatch(addMessage({ role: "assistant", content: "Chào bạn! Tớ có thể giúp gì hôm nay? 😊" }));
    }
    // hien thi sau 1s
    setTimeout(() => {
      setShowAdminButton(true);
    }, 1000);

  }, [isOpen]);



  useEffect(() => {
    if (sessionId) {
      const loadHistory = async () => {
        try {
          const history = await fetchChatHistory(sessionId);
          history.forEach(msg => {
            dispatch(addMessage({ role: msg.role, content: msg.content }));
          });
        } catch (error) {
          console.error("Lỗi load lịch sử chat:", error);
        }
      };

      loadHistory();
    }
  }, [sessionId]);


  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    dispatch(addMessage(userMsg));

    if (talkingToAdmin) {
      try {
        await sendUserMessage({
          sessionId,
          role: "user",
          content: input
        });
      } catch (error) {
        console.error("Lỗi gửi tin nhắn user:", error);
      }
    } else {
      dispatch(sendMessageToBot(userMsg, sessionId));
    }

    setInput("");
  };

  useEffect(() => {
    if (!selectedSessionId || !talkingToAdmin) return;
  
    const interval = setInterval(async () => {
      if (!loading) { // 👉 Dùng loading trực tiếp
        try {
          const history = await fetchChatHistory(selectedSessionId);
  
          dispatch(loadMessages(history)); // Vẫn load full history (user, admin, assistant)
        } catch (error) {
          console.error("Lỗi tự động tải chat:", error);
        }
      }
    }, 5000);
  
    return () => clearInterval(interval);
  }, [selectedSessionId, talkingToAdmin, loading]);
  




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
                const isUser = msg.role === "user";
                const isAdmin = msg.role === "admin";
                const isLast = i === messages.length - 1;

                return (
                  <div key={i} className={`chat-msg ${msg.role}`}>
                    <div className="msg-wrapper">
                      {(isBot || isAdmin) && (
                        <img
                          src={isAdmin ? "/assets/icons/img-admin-fotor.jpg" : "/assets/icons/img-bot-fotor.png"}
                          alt={isAdmin ? "Admin" : "Bot"}
                          className="avatar"
                        />
                      )}

                      <div className="msg-bubble">
                        {isBot && isLast && typingBot
                          ? displayedMessage
                          : isAdmin
                            ? `[ADMIN] ${msg.content}`
                            : msg.content}
                      </div>

                      {isUser && (
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


              {loading && !talkingToAdmin && (
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

            {showAdminButton && (
              <div className="chat-suggestion-wrapper">
                <button
                  className="chat-admin-btn"
                  onClick={() => {
                    if (!talkingToAdmin) {
                      const userMsg = { role: "user", content: "Tôi muốn chat với quản trị viên!" };
                      dispatch(addMessage(userMsg));
                      dispatch(addMessage({
                        role: "assistant",
                        content: "Yêu cầu của bạn đã được gửi đến quản trị viên. Vui lòng chờ phản hồi trong vài phút tới nhé! 👨‍💼"
                      }));

                      setTalkingToAdmin(true);
                    } else {
                      const userMsg = { role: "user", content: "Tôi muốn AI tư vấn cho tôi." };
                      dispatch(addMessage(userMsg));
                      dispatch(sendMessageToBot(userMsg, sessionId)); //send mess to AI
                      setTalkingToAdmin(false);
                    }
                  }}
                >
                  {talkingToAdmin ? "💡 Lên cấu hình với AI" : "💬 Trò chuyện với admin"}
                </button>
              </div>
            )}


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
