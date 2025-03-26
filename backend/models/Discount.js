const mongoose = require("mongoose");

const DiscountSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: true,
  },
  description: {
    type: String,
  },
  discount_type: {
    type: String,
    enum: ["percentage", "fixed_amount"],
    required: true,
  },
  discount_value: {
    type: Number,
    required: true,
  },
  min_order_value: {
    type: Number,
    default: 0,
  },
  applicable_categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
  applicable_products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  max_uses: {
    type: Number,
    default: 1,
  },
  uses_count: {
    type: Number,
    default: 0,
  },
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "expired", "disabled"],
    default: "active",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Cập nhật trạng thái khi truy vấn
DiscountSchema.pre("save", function (next) {
  const now = new Date();
  if (this.end_date < now) {
    this.status = "expired";
  }
  next();
});

module.exports = mongoose.model("Discount", DiscountSchema);
