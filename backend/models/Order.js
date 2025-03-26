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
  fullName: { type: String },
  phone: { type: String },
  email: { type: String },
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
  payment_status: {
    type: String,
    enum: ["Unpaid", "Paid", "Refund"],
  },
  payment_method: {
    type: String,
    enum: ["COD", "Bank Transfer"],
  },
  shipping_address: {
    street: { type: String },
    province: { type: String },
    city: { type: String },
    ward: { type: String },
  },
  deliveryDate: {
    type: String,
    required: false,
  },
  deliveryTime: {
    type: String,
    required: false,
  },
  note: {
    type: String,
  },
  discount_code: { type: String },
  discount_amount: { type: Number, default: 0 },
  shipping_fee: { type: Number, default: 0 },
  VAT: { type: Number, required: true, default: 0 },
  subtotal: { type: Number },
  total_amount: { type: Number },
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
