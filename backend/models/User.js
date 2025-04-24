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
  role: {
    type: String,
    enum: ["admin", "cashier", "productManagement", "guest"],
    default: "guest",
  },  
  created_at: { type: Date, default: Date.now },
  staff: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false },
  telegramChatId: { type: String, default: '' },
  telegramConnectToken: { type: String }
});

// Middleware để mã hóa mật khẩu và tự động gán staff theo role
UserSchema.pre("save", async function (next) {
  const staffRoles = ["admin", "cashier", "productManagement"];

  if (this.isModified("role")) {
    this.staff = staffRoles.includes(this.role);
  }

  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Middleware khi update bằng findOneAndUpdate
UserSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  const staffRoles = ["admin", "cashier", "productManagement"];

  if (update.role) {
    update.staff = staffRoles.includes(update.role);
    this.setUpdate(update);
  }

  next();
});

module.exports = mongoose.model("User", UserSchema);