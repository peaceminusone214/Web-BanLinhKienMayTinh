const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
require('dotenv').config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Xử lý lệnh /start với deep link
// Ví dụ, lệnh /start 123456abcdef
bot.onText(/\/start(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const deepLinkParam = match[1]; // có thể là mã token hay userId đã được mã hóa

  if (deepLinkParam) {
    try {
      // Gọi API backend để cập nhật telegramChatId cho người dùng
      await axios.post(`${process.env.FRONTEND_URL}/user/connect-telegram`, {
        token: deepLinkParam, // token dùng để xác định người dùng
        telegramChatId: chatId
      });
      bot.sendMessage(chatId, 'Kết nối Telegram thành công. Tài khoản của bạn đã được liên kết!');
    } catch (error) {
      console.error('Lỗi cập nhật Telegram Chat ID:', error);
      bot.sendMessage(chatId, 'Có lỗi khi kết nối Telegram, vui lòng thử lại.');
    }
  } else {
    bot.sendMessage(chatId, 'Chào bạn, vui lòng kết nối tài khoản trên website để nhận thông báo đơn hàng.');
  }
});

const sendMessage = (chatId, message) => {
  bot.sendMessage(chatId, message);
};

module.exports = { sendMessage };
