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
    const { productId } = req.query; // Lấy productId từ query parameter
    const filter = productId ? { productId } : {}; // Nếu có productId thì filter theo đó
    const comments = await Comment.find(filter);
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Gửi bình luận mới (cho người dùng)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    console.log("Received body:", req.body);
    console.log("Received file:", req.file);
    const { productId, username, email, content, rating } = req.body;
    let image = "";
    if (req.file) {
      image = req.file.path;
    }
    const comment = new Comment({
      productId,
      username,
      email,
      content,
      rating,
      image,
    });
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

// Cập nhật nội dung bình luận theo id
router.put("/:id", async (req, res) => {
  try {
    const { content } = req.body;
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    comment.content = content;
    await comment.save();
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ban bình luận (cho Admin) - cập nhật trạng thái bình luận thành "banned"
router.put("/ban/:id", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    // Nếu comment hiện đang banned thì chuyển về active, ngược lại chuyển sang banned
    comment.status = comment.status === "banned" ? "active" : "banned";
    await comment.save();
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Thêm reply cho một bình luận
router.post("/reply/:id", async (req, res) => {
  try {
    const { username, content, role } = req.body; // role có thể là "user" hoặc "admin"
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    comment.replies.push({ username, content, role });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Báo cáo bình luận
router.post("/report/:id", async (req, res) => {
  try {
    const { reporter, reason } = req.body;
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    comment.reports.push({ reporter, reason });
    await comment.save();
    res.status(200).json({ message: "Comment reported", comment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Lấy danh sách bình luận với các tiêu chí lọc
router.get("/reported", async (req, res) => {
  try {
    const { reportStatus, approvalStatus, sortBy, username } = req.query;
    const filter = {};

    // Lọc theo trạng thái báo cáo: nếu reportStatus === 'reported' thì chỉ lấy những comment có báo cáo
    if (reportStatus === "reported") {
      filter.reports = { $exists: true, $ne: [] };
    } else if (reportStatus === "not_reported") {
      filter.reports = { $size: 0 };
    }

    // Lọc theo trạng thái duyệt (active, banned)
    if (approvalStatus) {
      filter.status = approvalStatus;
    }

    // Lọc theo username nếu có
    if (username) {
      filter.username = username;
    }

    let query = Comment.find(filter);

    // Sắp xếp theo thời gian: newest hoặc oldest
    if (sortBy === "newest") {
      query = query.sort({ createdAt: -1 });
    } else if (sortBy === "oldest") {
      query = query.sort({ createdAt: 1 });
    }

    const comments = await query.exec();
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cập nhật nội dung của một reply dựa trên replyId
router.put("/reply/:replyId", async (req, res) => {
  try {
    const { content } = req.body;
    // Tìm comment chứa reply có _id bằng replyId
    const comment = await Comment.findOne({
      "replies._id": req.params.replyId,
    });
    if (!comment) {
      return res
        .status(404)
        .json({ error: "Comment chứa reply không được tìm thấy" });
    }
    // Lấy reply từ mảng replies
    const reply = comment.replies.id(req.params.replyId);
    if (!reply) {
      return res.status(404).json({ error: "Reply không được tìm thấy" });
    }
    // Cập nhật nội dung của reply
    reply.content = content;
    await comment.save();
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/replies", async (req, res) => {
  try {
    const { sortBy, username } = req.query;
    const filter = {};

    if (username) {
      filter.replies = { $elemMatch: { username } };
    } else {
      filter["replies.0"] = { $exists: true };
    }

    const comments = await Comment.find(filter, { replies: 1, _id: 0 });
    let allReplies = comments.flatMap((comment) => comment.replies);

    if (sortBy === "newest") {
      allReplies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "oldest") {
      allReplies.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    res.json(allReplies);
  } catch (error) {
    console.error("Error in /replies endpoint:", error);
    res.status(500).json({ error: error.message });
  }
});

// Lấy chi tiết bình luận theo id
router.get("/:id", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Xóa một reply dựa trên replyId
router.delete("/reply/:replyId", async (req, res) => {
  try {
    // Tìm comment chứa reply có _id bằng replyId
    const comment = await Comment.findOne({
      "replies._id": req.params.replyId,
    });
    if (!comment) {
      return res
        .status(404)
        .json({ error: "Comment chứa reply không được tìm thấy" });
    }
    // Sử dụng pull để loại bỏ reply theo id
    comment.replies.pull(req.params.replyId);
    await comment.save();
    res.json({ message: "Reply deleted", comment });
  } catch (error) {
    console.error("Error deleting reply:", error);
    res.status(500).json({ error: error.message });
  }
});

// Báo cáo một reply (bình luận con)
router.post("/report/reply/:replyId", async (req, res) => {
  try {
    const { reporter, reason } = req.body;
    // Tìm comment chứa reply có _id bằng replyId
    const comment = await Comment.findOne({
      "replies._id": req.params.replyId,
    });
    if (!comment) {
      return res.status(404).json({ error: "Reply không được tìm thấy" });
    }
    // Lấy reply từ mảng replies
    const reply = comment.replies.id(req.params.replyId);
    if (!reply) {
      return res.status(404).json({ error: "Reply không được tìm thấy" });
    }
    // Nếu reply chưa có mảng reports, khởi tạo nó
    if (!reply.reports) {
      reply.reports = [];
    }
    // Thêm thông tin báo cáo vào mảng reports của reply
    reply.reports.push({ reporter, reason });
    await comment.save();
    res.status(200).json({ message: "Reply đã được báo cáo", comment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
