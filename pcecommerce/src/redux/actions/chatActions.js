import { fetchBotReply } from "../../Service/botApi";
import { sendUserMessage, sendBotReply } from "../../Service/messageAPI";

export const ADD_MESSAGE = "ADD_MESSAGE";
export const BOT_REPLY = "BOT_REPLY";
export const CHAT_SET_LOADING = "CHAT_SET_LOADING";
export const LOAD_MESSAGES = "LOAD_MESSAGES";


export const addMessage = (message) => ({
  type: ADD_MESSAGE,
  payload: message,
});

export const botReply = (message) => ({
  type: BOT_REPLY,
  payload: message,
});

export const setLoading = (loading) => ({
  type: CHAT_SET_LOADING,
  payload: loading,
});

export const loadMessages = (messages) => ({
  type: LOAD_MESSAGES,
  payload: messages,
});

// send mess to bot
export const sendMessageToBot = (userMessage, sessionId) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      //1
      await sendUserMessage({ sessionId, role: "user", content: userMessage.content });
      //2
      const botContent = await fetchBotReply([userMessage]);
      //3
      await sendBotReply({ sessionId, content: botContent });
      // save
      dispatch(botReply({ role: "assistant", content: botContent }));

    } catch (err) {
      console.error(err);
      dispatch(botReply({ role: "assistant", content: "Lỗi bot!" }));
    } finally {
      dispatch(setLoading(false));
    }
  };
};









