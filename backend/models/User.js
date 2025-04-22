const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: false,
  },
  image_url: {
    type: String,
    required: false,
  },
  about: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  dateOfBirth: {
    type: Date,
    required: false,
  },
  address: {
    street: { type: String },
    province: { type: String },
    city: { type: String },
    ward: { type: String },
  },
  // Thông tin liên quan đến các Build đã lưu
  saved_builds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Build" }],
  created_at: { type: Date, default: Date.now },
  deleted: { type: Boolean, default: false },

  telegramChatId: { type: String, default: '' },
  telegramConnectToken: { type: String }
});

// Middleware (hook) của Mongoose để mã hóa mật khẩu trước khi lưu
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("User", UserSchema);
