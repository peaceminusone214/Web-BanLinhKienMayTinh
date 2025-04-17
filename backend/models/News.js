const mongoose = require("mongoose");

const NewsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  author: { type: String, default: "Admin" },
  views: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  isDisplayed: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  displaySection: { type: String, default: "" },
});

module.exports = mongoose.model("News", NewsSchema);
