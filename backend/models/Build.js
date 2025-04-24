const mongoose = require("mongoose");

const BuildSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false, // Không bắt buộc
  },
  name: {
    type: String,
    required: false,
  },
  description: {
    type: String,
  },
  components: [
    {
      product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // ref tới bảng Product
      quantity: { type: Number, required: false },
    },
  ],
  total_price: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

// Middleware để cập nhật `updated_at` khi chỉnh sửa
BuildSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model("Build", BuildSchema);
