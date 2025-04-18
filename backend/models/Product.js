const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  product_name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock_quantity: {
    type: Number,
    required: true,
  },
  image_url: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  condition: {
    type: String,
    enum: ["New", "Used"],
    required: true,
  },
  specifications: {
    type: Object,
    required: function () {
      // Chỉ yêu cầu specifications cho một số danh mục sản phẩm cụ thể
      const requiredCategories = [
        "CPU",
        "Mainboard",
        "RAM",
        "SSD",
        "HDD",
        "VGA",
        "PSU",
        "Tản nhiệt khí",
        "Tản nhiệt AIO",
      ];
      return requiredCategories.includes(this.category_id.name);
    },
  },
  warranty: {
    type: String,
    required: function () {
      // Chỉ yêu cầu warranty cho một số danh mục sản phẩm cụ thể
      const requiredCategories = [
        "CPU",
        "Mainboard",
        "RAM",
        "VGA",
        "SSD",
        "HDD",
      ];
      return requiredCategories.includes(this.category_id.name);
    },
  },
  compatibility: {
    type: Object,
    required: function () {
      // Chỉ yêu cầu compatibility cho một số danh mục sản phẩm cụ thể
      const requiredCategories = [
        "CPU",
        "Mainboard",
        "VGA",
        "RAM",
        "PSU",
        "Case",
        "Tản nhiệt khí",
        "Tản nhiệt AIO",
      ];
      return requiredCategories.includes(this.category_id.name);
    },
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["In Stock", "Out of Stock", "Discontinued"],
    default: "In Stock",
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

// Cập nhật tự động `updated_at` khi sửa sản phẩm
ProductSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model("Product", ProductSchema);
