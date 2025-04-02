const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Comment = require("../models/Comment");

// Cấu hình Multer để upload ảnh
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); 
  },
  filename: function (req, file, cb) {
    // Đặt tên file bằng thời gian hiện tại cộng với extension của file
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Lấy tất cả bình luận (cho Admin)
router.get("/", async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Gửi bình luận mới (cho người dùng)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { productId, username, content, rating } = req.body;
    let image = "";
    if (req.file) {
      image = req.file.path; 
    }
    const comment = new Comment({ productId, username, content, rating, image });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Xóa bình luận (cho Admin)
router.delete("/:id", async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ban bình luận (cho Admin) - cập nhật trạng thái bình luận thành "banned"
router.put("/ban/:id", async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { status: "banned" },
      { new: true }
    );
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
