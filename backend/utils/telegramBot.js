const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
require("dotenv").config();

const token = process.env.TELEGRAM_BOT_TOKEN;

// Initialize bot with polling disabled by default
const bot = new TelegramBot(token, { polling: false });

// Use a single instance check to prevent duplicate bot instances
let botStarted = false;

/**
 * Initialize the bot if it hasn't been started yet
 */
const startBot = () => {
  if (botStarted) {
    console.log("Bot is already running, skipping initialization");
    return;
  }

  // Start the bot with polling enabled
  bot.startPolling({ restart: true });
  botStarted = true;
  
  console.log("✅ Telegram bot started successfully");
  
  // Handle polling errors properly
  bot.on("polling_error", (error) => {
    if (error.code === "ETELEGRAM" && error.message.includes("409")) {
      console.warn("⚠️ Bot conflict detected (409): Another instance is already running");
      // Stop this instance to prevent conflicts
      bot.stopPolling();
      botStarted = false;
    } else {
      console.error("❌ Telegram bot polling error:", error.message);
    }
  });
};

// Note: Bot will be started by server.js, not here
// This prevents double initialization which causes conflicts

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

/**
 * Formats a message for Telegram, removing or escaping problematic characters
 * @param {string} message - The original message
 * @returns {string} - Formatted message that's safe for Telegram
 */
const formatTelegramMessage = (message) => {
  // Replace markdown special characters with plain text alternatives
  return message
    .replace(/\*/g, '•') // Replace asterisks with bullet points
    .replace(/_/g, '') // Remove underscores
    .replace(/\[/g, '(')
    .replace(/\]/g, ')')
    .replace(/~/g, '')
    .replace(/`/g, '')
    .replace(/>/g, '')
    .replace(/#/g, '')
    .replace(/\+/g, 'plus')
    .replace(/\|/g, '')
    .replace(/\{/g, '(')
    .replace(/\}/g, ')')
    .replace(/=/g, '-');
};

const sendMessage = async (chatId, message) => {
  try {
    // Make sure bot is started before sending messages
    if (!botStarted) {
      try {
        startBot();
      } catch (error) {
        console.warn("❌ Không thể khởi động bot trước khi gửi tin nhắn:", error.message);
      }
    }
    
    // Format message to avoid markdown issues
    const formattedMessage = formatTelegramMessage(message);

    // First try without any Markdown
    await bot.sendMessage(chatId, formattedMessage, {
      parse_mode: "", // No markdown parsing
      disable_web_page_preview: true
    });
    console.log(`✅ Đã gửi tin nhắn thành công đến chatId: ${chatId}`);
    return true;
  } catch (error) {
    console.error(`❌ Lỗi khi gửi tin nhắn đến ${chatId}:`, error.message);
    
    try {
      // Try a super-simplified message as a fallback
      const simplifiedMessage = message
        .replace(/[*_\[\]()~`>#+\-=|{}.!]/g, '') // Remove all special characters
        .replace(/\n\n/g, '\n'); // Simplify double line breaks
      
      await bot.sendMessage(chatId, simplifiedMessage, { 
        parse_mode: "", 
        disable_web_page_preview: true 
      });
      console.log(`⚠️ Đã gửi tin nhắn đơn giản hóa đến chatId: ${chatId}`);
      return true;
    } catch (retryError) {
      console.error(`❌ Vẫn lỗi khi gửi lại:`, retryError.message);
      return false;
    }
  }
};

// Export bot, startBot and sendMessage functions
module.exports = { sendMessage, bot, startBot };
