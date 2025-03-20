const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  build_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Build",
  },
  products: [
    {
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      product_name: { type: String, required: true },
      image_url: { type: String, required: true },
      quantity: { type: Number, required: true },
      price_per_unit: { type: Number, required: true },
      total_price: { type: Number, required: true },
    },
  ],
  order_status: {
    type: String,
    enum: [
      "Pending",
      "Confirmed",
      "Processing",
      "Shipped",
      "OutForDelivery",
      "Delivered",
      "Cancelled",
      "Returned",
      "Refunded",
      "Failed",
    ],
  },
  total_amount: {
    type: Number,
    required: true,
  },
  payment_status: {
    type: String,
    enum: ["Unpaid", "Paid", "Refund"],
  },
  payment_method: {
    type: String,
    enum: ["Credit Card", "PayPal", "Bank Transfer"],
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

module.exports = mongoose.model("Order", OrderSchema);
