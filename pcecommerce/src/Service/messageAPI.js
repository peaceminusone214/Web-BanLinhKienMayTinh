import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;
const API_BASE = "http://localhost:5000/api/message";

//user send
export const sendUserMessage = async ({ sessionId, role, content }) => {
    await axios.post(`${API_URL}/message/send`, {
        sessionId,
        role,
        content
    });
};

// bot reply
export const sendBotReply = async ({ sessionId, content }) => {
    await axios.post(`${API_URL}/message/bot-reply`, {
        sessionId,
        content,
        modelUsed: "test"
    });
};

// get message
export const fetchChatHistory = async (sessionId) => {
    const res = await axios.get(`${API_URL}/message/history`, {
      params: { sessionId }
    });
    return res.data;
  };
