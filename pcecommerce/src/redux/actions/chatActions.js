import { fetchBotReply } from "../../../src/Service/botApi";

export const ADD_MESSAGE = "ADD_MESSAGE";
export const BOT_REPLY = "BOT_REPLY";
export const CHAT_SET_LOADING = "CHAT_SET_LOADING";

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

// gửi mess lên bot
export const sendMessageToBot = (newMessages) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const reply = await fetchBotReply(newMessages);
      dispatch(botReply({ role: "assistant", content: reply }));
    } catch (err) {
      dispatch(botReply({ role: "assistant", content: "Lỗi bot!" }));
    } finally {
      dispatch(setLoading(false));
    }
  };
};
