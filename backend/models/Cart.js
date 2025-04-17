const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    items: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
        },
      },
    ],
    deliveryDate: {
      type: String,
      required: false,
    },
    deliveryTime: {
      type: String,
      required: false,
    },
    total_price: {
      type: Number,
      default: 0,
    },
    note: {
      type: String,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

// Tự động cập nhật tổng giá tiền, update_at khi lưu giỏ hàng
CartSchema.pre("save", function (next) {
  this.total_price = this.items?.length
    ? this.items.reduce((total, item) => total + item.price * item.quantity, 0)
    : 0;
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model("Cart", CartSchema);
