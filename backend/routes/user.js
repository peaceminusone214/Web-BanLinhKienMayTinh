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

//
router.post("/connect-telegram", async (req, res) => {
  try {
    const { token, telegramChatId } = req.body;
    if (!token || !telegramChatId) {
      return res
        .status(400)
        .json({ message: "Thiếu token hoặc telegramChatId" });
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
      return res
        .status(200)
        .json({ message: "Kết nối Telegram thành công", userId: newUser._id });
    }

    // Nếu đã có chatId thì không cần làm gì nữa
    if (user.telegramChatId && user.telegramChatId === telegramChatId) {
      return res
        .status(200)
        .json({ message: "Đã kết nối Telegram trước đó", userId: user._id });
    }

    // Nếu lần đầu kết nối
    user.telegramChatId = telegramChatId;
    await user.save();

    return res
      .status(200)
      .json({ message: "Kết nối Telegram thành công", userId: user._id });
  } catch (error) {
    console.error("Lỗi khi connect Telegram:", error.message);
    return res
      .status(500)
      .json({ message: "Lỗi kết nối Telegram", error: error.message });
  }
});

module.exports = router;
