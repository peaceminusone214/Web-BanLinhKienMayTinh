const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
require("dotenv").config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Xử lý lệnh /start với deep link
bot.onText(/\/start(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const deepLinkParam = match[1];

  if (deepLinkParam) {
    try {
      const connectRes = await axios.post(
        `${process.env.BACKEND_URL}/user/connect-telegram`,
        {
          token: deepLinkParam,
          telegramChatId: chatId,
        }
      );

      if (connectRes.status === 200) {
        bot.sendMessage(
          chatId,
          "Kết nối Telegram thành công. Tài khoản của bạn đã được liên kết!"
        );
      } else {
        bot.sendMessage(
          chatId,
          "Có lỗi khi kết nối Telegram, vui lòng thử lại."
        );
        return;
      }

      // Gửi đơn hàng gần nhất (nếu có)
      const userId = connectRes.data.userId;
      if (userId) {
        const orderRes = await axios.get(
          `${process.env.BACKEND_URL}/user/${userId}/latest-order`
        );
        const order = orderRes.data;

        if (order) {
          const shippingAddress = order.shipping_address
            ? `${order.shipping_address.street}, ${order.shipping_address.ward}, ${order.shipping_address.city}, ${order.shipping_address.province}`
            : "Không có thông tin";

          const message =
            `*Đơn hàng mới nhất của bạn đã được xác nhận!*\n\n` +
            `Mã đơn: ${order._id}\n` +
            `Tên: ${order.fullName}\n` +
            `Tổng tiền: ${order.total_amount.toLocaleString()} đ\n` +
            `Ngày giao: ${order.deliveryDate || "Chưa xác định"}\n\n` +
            `Sản phẩm:\n` +
            order.products
              .map((p) => `- ${p.product_name} x${p.quantity}`)
              .join("\n") +
            `\n\nĐịa chỉ: ${shippingAddress}`;

          await sendMessage(chatId, message);
        }
      }
    } catch (error) {
      console.error("Lỗi cập nhật Telegram Chat ID:", error.message);

      // Nếu là lỗi do server trả 4xx, 5xx
      if (error.response && error.response.data?.message) {
        bot.sendMessage(chatId, `${error.response.data.message}`);
      } else {
        bot.sendMessage(
          chatId,
          "Có lỗi khi kết nối Telegram, vui lòng thử lại."
        );
      }
    }
  } else {
    bot.sendMessage(
      chatId,
      "Chào bạn! Vui lòng kết nối tài khoản trên website để nhận thông báo đơn hàng."
    );
  }
});

const sendMessage = (chatId, message) => {
  bot.sendMessage(chatId, message);
};

module.exports = { sendMessage };
