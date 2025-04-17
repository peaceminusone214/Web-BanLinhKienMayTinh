const mongoose = require("mongoose");

const ReplySchema = new mongoose.Schema({
  username: { type: String, required: true },
  content: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  createdAt: { type: Date, default: Date.now },
  reports: [ 
    {
      reporter: { type: String, required: true },
      reason: { type: String },
      createdAt: { type: Date, default: Date.now }
    }
  ],
});

const ReportSchema = new mongoose.Schema({
  reporter: { type: String, required: true },
  reason: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const CommentSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {        
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  image: {
    type: String,
  },
  status: {
    type: String,
    enum: ["active", "banned"],
    default: "active",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Danh sách các reply (bình luận con)
  replies: [ReplySchema],
  // Danh sách báo cáo bình luận
  reports: [ReportSchema],

});

module.exports = mongoose.model("Comment", CommentSchema);
