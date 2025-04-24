import axios from "axios";

export const fetchBotReply = async (messages) => {
  const res = await axios.post("http://localhost:5000/api/chat/", { messages });
  // Kiểm tra cả hai định dạng phản hồi có thể có từ backend
  if (res.data.reply && res.data.reply.content) {
    return res.data.reply.content;
  } else if (res.data.reply) {
    console.log("Unexpected reply format:", res.data.reply);
    return "Định dạng phản hồi không đúng. Vui lòng thử lại.";
  } else {
    console.error("Invalid response from bot API:", res.data);
    return "Không thể kết nối đến chatbot. Vui lòng thử lại sau.";
  }
};
