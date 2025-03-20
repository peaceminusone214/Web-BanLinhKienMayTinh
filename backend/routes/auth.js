const express = require("express");
const User = require("../models/User");
const LoginHistory = require("../models/LoginHistory");
const bcrypt = require("bcryptjs");
const {
  initializeCasbin,
  getRolesForUsername,
} = require("../middleware/authMiddleware");
const router = express.Router();

// Khởi tạo Casbin
initializeCasbin();

//Route kiểm tra session
router.get("/session", (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ message: "Chưa đăng nhập" });
  }
});

// Route đăng ký
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Người dùng đã tồn tại" });
    }

    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).json({ message: "Tạo tài khoản thành công" });
  } catch (err) {
    console.error("Lỗi:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
});

// Route đăng nhập
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Người dùng không tồn tại" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Sai mật khẩu" });
    }

    // Lấy vai trò người dùng từ Casbin
    const userRoles = await getRolesForUsername(username);
    const roles = userRoles.length > 0 ? userRoles : ["guest"];

    // Lưu thông tin vào session
    req.session.user = {
      userId: user._id,
      username: user.username,
      roles: roles,
    };

    // Lưu lại lịch sử đăng nhập
    const loginHistory = new LoginHistory({
      userId: user._id,
      loginIp: req.ip,
      loginPlatform: req.headers["user-agent"],
      loginTime: new Date(),
    });
    await loginHistory.save();

    res.json({ message: "Đăng nhập thành công" });
  } catch (err) {
    console.error("Lỗi:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
});

// Route đăng xuất
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi đăng xuất" });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "Đăng xuất thành công" });
  });
});

module.exports = router;
