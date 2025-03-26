const express = require("express");
const router = express.Router();
const News = require("../models/News");

// Lấy danh sách tin tức
router.get("/", async (req, res) => {
  try {
    const { isDisplayed } = req.query;
    const query = {};

    // Nếu query param isDisplayed = 'true', chỉ lấy tin có isDisplayed = true
    if (isDisplayed === "true") {
      query.isDisplayed = true;
    }

    const news = await News.find(query).sort({ createdAt: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Lấy tin tức theo ID
router.get("/:id", async (req, res) => {
  try {
    const newsItem = await News.findById(req.params.id);
    if (!newsItem) return res.status(404).json({ message: "Không tìm thấy tin tức" });
    res.json(newsItem);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Lấy danh sách tin theo category
router.get("/category/:category", async (req, res) => {
  try {
    const category = req.params.category.toLowerCase();
    const validCategories = ["tech", "game", "news", "product"];

    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: "Danh mục không hợp lệ!" });
    }

    // Lấy query param isDisplayed
    const { isDisplayed } = req.query;
    let query = { category };

    // Nếu query param isDisplayed = 'true', chỉ lấy tin có isDisplayed = true
    if (isDisplayed === "true") {
      query.isDisplayed = true;
    }

    const articles = await News.find(query).sort({ createdAt: -1 });
    if (articles.length === 0) {
      return res.status(404).json({ message: "Không có bài viết nào!" });
    }

    res.json(articles);
  } catch (error) {
    console.error("Lỗi server:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Thêm tin tức mới
router.post("/", async (req, res) => {
  try {
    const { title, content, category, image, author } = req.body;
    const newNews = new News({ title, content, category, image, author });
    await newNews.save();
    res.status(201).json(newNews);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Cập nhật tin tức
router.put("/:id", async (req, res) => {
  try {
    // req.body sẽ chứa isDisplayed, featured,...
    const updatedNews = await News.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedNews) {
      return res.status(404).json({ message: "Không tìm thấy tin tức" });
    }
    res.json(updatedNews);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Xóa tin tức
router.delete("/:id", async (req, res) => {
  try {
    const deletedNews = await News.findByIdAndDelete(req.params.id);
    if (!deletedNews) return res.status(404).json({ message: "Không tìm thấy tin tức" });
    res.json({ message: "Đã xóa tin tức" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;
