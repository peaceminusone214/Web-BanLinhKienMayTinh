import axios from "axios";

const API_BASE = "http://localhost:5000/api/message";

//user send
export const sendUserMessage = async ({ sessionId, role, content }) => {
    await axios.post(`${API_BASE}/send`, {
        sessionId,
        role,
        content
    });
};

// bot reply
export const sendBotReply = async ({ sessionId, content }) => {
    await axios.post(`${API_BASE}/bot-reply`, {
        sessionId,
        content,
        modelUsed: "test"
    });
};

// get message
export const fetchChatHistory = async (sessionId) => {
    const res = await axios.get(`${API_BASE}/history`, {
      params: { sessionId }
    });
    return res.data;
  };
