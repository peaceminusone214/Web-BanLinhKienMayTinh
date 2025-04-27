import axios from "axios";

const API_BASE = "http://localhost:5000/api";


export const fetchBotReply = async (messages = []) => {
  const res = await axios.post(`${API_BASE}/chat/`, {
    model: "meta-llama/llama-3-8b-instruct",
    messages
  });
  return res.data.reply.content;
};