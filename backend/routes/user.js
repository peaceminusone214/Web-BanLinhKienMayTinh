const express = require("express");
const User = require("../models/User");
const LoginHistory = require("../models/LoginHistory");
const bcrypt = require("bcryptjs");
const router = express.Router();
const Order = require("../models/Order");

// Route lấy thông tin người dùng theo _id
router.post("/get-user", async (req, res) => {
  try {
    // Lấy _id từ body của yêu cầu
    const { userId } = req.body;

    // Kiểm tra nếu không có _id trong body
    if (!userId) {
      return res
        .status(400)
        .json({ message: "Cần cung cấp _id của người dùng" });
    }

    // Tìm người dùng theo _id
    const user = await User.findById(userId).select("-password"); // .select("-password") để loại bỏ mật khẩu

    // Kiểm tra nếu không tìm thấy người dùng
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Trả về thông tin người dùng
    res.status(200).json(user);
  } catch (err) {
    console.error("Lỗi:", err);
    res
      .status(500)
      .json({ message: "Lỗi máy chủ khi lấy thông tin người dùng" });
  }
});

// Route chỉnh sửa thông tin người dùng
router.put("/edit-user", async (req, res) => {
  try {
    // Lấy _id và các thông tin muốn chỉnh sửa từ body
    const {
      userId,
      name,
      email,
      phoneNumber,
      address,
      about,
      image_url,
      dateOfBirth,
    } = req.body;

    // Kiểm tra nếu không có _id trong body
    if (!userId) {
      return res
        .status(400)
        .json({ message: "Cần cung cấp _id của người dùng" });
    }

    // Tìm người dùng theo _id
    const user = await User.findById(userId);

    // Kiểm tra nếu không tìm thấy người dùng
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Cập nhật các thông tin người dùng nếu có
    if (name) user.name = name;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (address) user.address = address;
    if (about) user.about = about;
    if (image_url) user.image_url = image_url;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;

    // Lưu lại thông tin sau khi chỉnh sửa
    await user.save();

    // Trả về thông tin người dùng sau khi chỉnh sửa
    res.status(200).json({
      message: "Thông tin người dùng đã được cập nhật thành công",
      user,
    });
  } catch (err) {
    console.error("Lỗi:", err);
    res
      .status(500)
      .json({ message: "Lỗi máy chủ khi cập nhật thông tin người dùng" });
  }
});

// Route lấy thông tin lịch sử đăng nhập của người dùng
router.post("/get-login-history", async (req, res) => {
  try {
    // Lấy _id của người dùng từ body
    const { userId } = req.body;

    // Kiểm tra nếu không có _id trong body
    if (!userId) {
      return res
        .status(400)
        .json({ message: "Cần cung cấp _id của người dùng" });
    }

    // Tìm lịch sử đăng nhập của người dùng theo _id
    const loginHistory = await LoginHistory.find({ userId: userId }).sort({
      loginTime: -1,
    }); // Sắp xếp theo thời gian đăng nhập (mới nhất lên đầu)

    // Kiểm tra nếu không tìm thấy lịch sử đăng nhập
    if (loginHistory.length === 0) {
      return res
        .status(404)
        .json({ message: "Không có lịch sử đăng nhập cho người dùng này" });
    }

    // Trả về thông tin lịch sử đăng nhập
    res.status(200).json(loginHistory);
  } catch (err) {
    console.error("Lỗi:", err);
    res.status(500).json({
      message: "Lỗi máy chủ khi lấy lịch sử đăng nhập của người dùng",
    });
  }
});

// Route đổi mật khẩu
router.post("/change-password", async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  try {
    // Tìm người dùng theo userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    // Kiểm tra mật khẩu cũ
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu cũ không chính xác" });
    }

    // Gán mật khẩu mới (model sẽ tự động mã hóa)
    user.password = newPassword;

    // Lưu vào database
    await user.save();

    res.status(200).json({ message: "Đổi mật khẩu thành công" });
  } catch (err) {
    console.error("Lỗi:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
});

// Route đổi mật khẩu (không yêu cầu mật khẩu cũ)
router.post("/reset-password", async (req, res) => {
  const { userId, newPassword } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    user.password = newPassword;

    await user.save();

    res.status(200).json({ message: "Mật khẩu đã được đặt lại thành công" });
  } catch (err) {
    console.error("Lỗi:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
});

// Get all users
router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Create user
router.post("/", async (req, res) => {
  const newUser = new User(req.body);
  await newUser.save();
  res.json(newUser);
});

// soft del
router.put("/delete/:id", async (req, res) => {
  const userId = req.params.id;
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { deleted: true },
    { new: true }
  );
  if (!updatedUser) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(updatedUser);
});

// Update user
router.put("/:id", async (req, res) => {
  const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
});

//
router.get("/:id/latest-order", async (req, res) => {
  try {
    const userId = req.params.id;
    const order = await Order.findOne({ user_id: userId })
      .sort({ createdAt: -1 })
      .lean();

    // if (!order) {
    //   return res.status(404).json({ message: "Không tìm thấy đơn hàng." });
    // }

    res.status(200).json(order);
  } catch (error) {
    console.error("Lỗi lấy đơn hàng mới nhất:", error);
    res.status(500).json({ message: "Lỗi server khi lấy đơn hàng mới nhất." });
  }
});

router.post('/connect-telegram', async (req, res) => {
  try {
    const { token, telegramChatId } = req.body;
    if (!token || !telegramChatId) {
      return res.status(400).json({ message: 'Thiếu token hoặc telegramChatId' });
    }

    let user = await User.findOne({ telegramConnectToken: token });

    if (!user) {
      // Tạo tài khoản guest
      const newUser = new User({
        username: `guest_${Date.now()}`,
        password: Math.random().toString(36).slice(-8),
        email: "",
        telegramChatId,
        telegramConnectToken: token,
      });

      await newUser.save();
      console.log(`✅ Đã tạo tài khoản guest và kết nối Telegram cho user ${newUser._id}`);
      return res.status(200).json({ message: 'Kết nối Telegram thành công', userId: newUser._id });
    }

    // Nếu đã có chatId thì không cần làm gì nữa
    if (user.telegramChatId && user.telegramChatId === telegramChatId) {
      console.log(`ℹ️ User ${user._id} đã kết nối Telegram trước đó (chatId: ${telegramChatId})`);
      return res.status(200).json({ message: 'Đã kết nối Telegram trước đó', userId: user._id });
    }

    // Nếu lần đầu kết nối
    console.log(`✅ Đang kết nối Telegram cho user ${user._id} với chatId ${telegramChatId}`);
    user.telegramChatId = telegramChatId;
    await user.save();

    // Gửi thông báo kết nối thành công
    const { sendMessage } = require('../utils/telegramBot');
    const welcomeMessage = `✅ *Kết nối Telegram thành công!*\n\nBạn sẽ nhận được thông báo về đơn hàng qua Telegram.`;
    await sendMessage(telegramChatId, welcomeMessage);
    
    // Kiểm tra xem có đơn hàng gần đây chưa được thông báo không
    const Order = require('../models/Order');
    const recentOrders = await Order.find({ 
      user_id: user._id,
      created_at: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Đơn hàng trong 24h qua
    }).sort({ created_at: -1 }).limit(1);
    
    if (recentOrders.length > 0) {
      const order = recentOrders[0];
      const shippingAddress = order.shipping_address
        ? `${order.shipping_address.street}, ${order.shipping_address.ward}, ${order.shipping_address.city}, ${order.shipping_address.province}`
        : "Không có thông tin";
        
      const message =
        `📦 *Đơn hàng gần đây của bạn:*\n\n` +
        `🧾 Mã đơn: ${order._id}\n` +
        `👤 Tên: ${order.fullName}\n` +
        `💵 Tổng tiền: ${order.total_amount.toLocaleString()} đ\n` +
        `📅 Ngày giao: ${order.deliveryDate || "Chưa xác định"}\n\n` +
        `🛍️ Sản phẩm:\n` +
        order.products
          .map((p) => `- ${p.product_name} x${p.quantity}`)
          .join("\n") +
        `\n\n🚚 Địa chỉ: ${shippingAddress}`;

      await sendMessage(telegramChatId, message);
      console.log(`✅ Đã gửi thông tin đơn hàng gần đây cho user ${user._id}`);
    }

    return res.status(200).json({ message: 'Kết nối Telegram thành công', userId: user._id });
  } catch (error) {
    console.error('❌ Lỗi khi connect Telegram:', error.message);
    return res.status(500).json({ message: 'Lỗi kết nối Telegram', error: error.message });
  }
});

router.post('/check-telegram-connection', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: 'Thiếu token', connected: false });
    }

    const user = await User.findOne({ telegramConnectToken: token });
    
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy token', connected: false });
    }

    // Kiểm tra nếu user đã kết nối Telegram (có chatId)
    const isConnected = !!user.telegramChatId;
    
    return res.status(200).json({ 
      connected: isConnected,
      userId: user._id,
      message: isConnected ? 'Đã kết nối Telegram' : 'Chưa kết nối Telegram'
    });
  } catch (error) {
    console.error('❌ Lỗi khi kiểm tra kết nối Telegram:', error.message);
    return res.status(500).json({ 
      message: 'Lỗi kiểm tra kết nối Telegram', 
      error: error.message,
      connected: false 
    });
  }
});

module.exports = router;
