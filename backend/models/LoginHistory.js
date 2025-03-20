const mongoose = require("mongoose");

const LoginHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  loginIp: { type: String },
  loginPlatform: { type: String },
  loginTime: { type: Date },
});

module.exports = mongoose.model("LoginHistory", LoginHistorySchema);
