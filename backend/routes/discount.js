const express = require("express");
const Discount = require("../models/Discount");
const Product = require("../models/Product");
const router = express.Router();

// Route thêm mã giảm giá (có thể thêm nhiều mã)
router.post("/add-discount", async (req, res) => {
  let discounts = req.body;

  if (!Array.isArray(discounts)) {
    discounts = [discounts];
  }

  if (discounts.length === 0) {
    return res.status(400).json({ message: "Dữ liệu mã giảm giá không hợp lệ" });
  }

  let errorMessages = [];

  try {
    for (let i = 0; i < discounts.length; i++) {
      const {
        code,
        discount_type,
        discount_value,
        start_date,
        end_date,
        applicable_categories,
        applicable_products,
      } = discounts[i];

      let missingFields = [];

      if (!code) missingFields.push("code");
      if (!discount_type) missingFields.push("discount_type");
      if (!discount_value) missingFields.push("discount_value");
      if (!start_date) missingFields.push("start_date");
      if (!end_date) missingFields.push("end_date");

      if (discount_type && !["percentage", "fixed_amount"].includes(discount_type)) {
        missingFields.push("discount_type (Không hợp lệ)");
      }

      if (start_date && end_date && new Date(start_date) >= new Date(end_date)) {
        errorMessages.push(`Mã giảm giá "${code}" có ngày bắt đầu phải trước ngày kết thúc.`);
      }

      // Kiểm tra danh mục hợp lệ
      if (applicable_categories) {
        for (let categoryId of applicable_categories) {
          const category = await Category.findById(categoryId);
          if (!category) {
            missingFields.push(`category_id ${categoryId} (Không hợp lệ)`);
          }
        }
      }

      // Kiểm tra sản phẩm hợp lệ
      if (applicable_products) {
        for (let productId of applicable_products) {
          const product = await Product.findById(productId);
          if (!product) {
            missingFields.push(`product_id ${productId} (Không hợp lệ)`);
          }
        }
      }

      const existingDiscount = await Discount.findOne({ code });
      if (existingDiscount) {
        errorMessages.push(`Mã giảm giá "${code}" đã tồn tại`);
      }

      if (missingFields.length > 0) {
        errorMessages.push(`Mã giảm giá thứ ${i + 1} thiếu các trường: ${missingFields.join(", ")}`);
      }
    }

    if (errorMessages.length > 0) {
      return res.status(400).json({ message: "Lỗi khi thêm mã giảm giá", errors: errorMessages });
    }

    for (let i = 0; i < discounts.length; i++) {
      const newDiscount = new Discount({
        ...discounts[i],
        updated_at: Date.now(),
      });
      await newDiscount.save();
    }

    res.status(201).json({ message: "Tất cả mã giảm giá đã được thêm thành công!" });
  } catch (err) {
    console.error("Lỗi:", err);
    res.status(500).json({ message: "Lỗi máy chủ khi thêm mã giảm giá" });
  }
});

// Route lấy danh sách mã giảm giá
router.get("/get-discounts", async (req, res) => {
  try {
    const discounts = await Discount.find().exec();

    if (discounts.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy mã giảm giá nào" });
    }

    // Trả về danh sách mã giảm giá
    res.status(200).json(discounts);
  } catch (err) {
    console.error("Lỗi:", err);
    res
      .status(500)
      .json({ message: "Lỗi máy chủ khi lấy danh sách mã giảm giá" });
  }
});

// Route xóa mã giảm giá (có thể xóa một hoặc nhiều giảm giá)
router.delete("/delete-discounts", async (req, res) => {
  const { ids } = req.body;

  // Kiểm tra xem mảng IDs có hợp lệ không
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "Mảng ID giảm giá không hợp lệ" });
  }

  try {
    // Xóa nhiều giảm giá hoặc chỉ 1 nếu mảng chỉ chứa 1 phần tử
    const deletedDiscounts = await Discount.deleteMany({ _id: { $in: ids } });

    // Nếu không có giảm giá nào bị xóa
    if (deletedDiscounts.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy giảm giá nào để xóa" });
    }

    // Trả về thông báo thành công
    res
      .status(200)
      .json({
        message: `${deletedDiscounts.deletedCount} giảm giá đã được xóa thành công`,
      });
  } catch (err) {
    console.error("Lỗi:", err);
    res.status(500).json({ message: "Lỗi máy chủ khi xóa giảm giá" });
  }
});

// Route cập nhật mã giảm giá
router.put("/update-discount", async (req, res) => {
  try {
    const { _id, code, description, discount_value, min_order_value, start_date, end_date } = req.body;

    if (!_id) {
      return res.status(400).json({ message: "Thiếu ID mã giảm giá" });
    }

    // Kiểm tra mã giảm giá có tồn tại không
    const existingDiscount = await Discount.findById(_id);
    if (!existingDiscount) {
      return res.status(404).json({ message: "Mã giảm giá không tồn tại" });
    }

    // Cập nhật thông tin mã giảm giá
    existingDiscount.code = code || existingDiscount.code;
    existingDiscount.description = description || existingDiscount.description;
    existingDiscount.discount_value = discount_value || existingDiscount.discount_value;
    existingDiscount.min_order_value = min_order_value || existingDiscount.min_order_value;
    existingDiscount.start_date = start_date || existingDiscount.start_date;
    existingDiscount.end_date = end_date || existingDiscount.end_date;
    existingDiscount.updated_at = Date.now(); // Cập nhật thời gian sửa đổi

    await existingDiscount.save();

    res.json({
      message: "Cập nhật mã giảm giá thành công",
      discount: existingDiscount,
    });
  } catch (error) {
    console.error("Lỗi cập nhật mã giảm giá:", error);
    res.status(500).json({ message: "Lỗi server khi cập nhật mã giảm giá" });
  }
});

// Route lấy danh sách loại giảm giá (discount_type)
router.get("/get-discount-types", async (req, res) => {
  try {
    // Lấy danh sách loại giảm giá từ các mã giảm giá
    const discountTypes = await Discount.distinct("discount_type");

    // Kiểm tra nếu không có loại giảm giá nào
    if (discountTypes.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy loại giảm giá nào" });
    }

    // Trả về danh sách loại giảm giá
    res.status(200).json(discountTypes);
  } catch (err) {
    console.error("Lỗi:", err);
    res.status(500).json({ message: "Lỗi máy chủ khi lấy loại giảm giá" });
  }
});

// Route xử lý mã giảm giá
router.post("/apply-discount", async (req, res) => {
  try {
    const { discount_code, products } = req.body;

    if (!discount_code) {
      return res.status(400).json({ message: "Vui lòng nhập mã giảm giá!" });
    }

    const discount = await Discount.findOne({ code: discount_code });

    if (!discount || discount.status !== "active") {
      return res.status(400).json({ message: "Mã giảm giá không hợp lệ hoặc đã hết hạn!" });
    }

    // Tính tổng giá trị giỏ hàng (subtotal)
    let subtotal = 0;
    for (const item of products) {
      const product = await Product.findById(item.product_id);
      if (!product) {
        return res.status(400).json({ message: `Sản phẩm với ID ${item.product_id} không tồn tại!` });
      }
      subtotal += product.price * item.quantity;
    }

    // Kiểm tra giá trị tối thiểu của đơn hàng để áp dụng giảm giá
    if (subtotal < discount.min_order_value) {
      return res.status(400).json({ message: `Mã giảm giá chỉ áp dụng cho đơn hàng từ ${discount.min_order_value.toLocaleString()} đ!` });
    }

    // Tính số tiền giảm giá
    let discountAmount = 0;
    if (discount.discount_type === "percentage") {
      discountAmount = (subtotal * discount.discount_value) / 100;
    } else if (discount.discount_type === "fixed_amount") {
      discountAmount = discount.discount_value;
    }

    res.status(200).json({
      success: true,
      discount_code,
      discount_amount: discountAmount,
      message: `Mã giảm giá hợp lệ! Giảm ${discountAmount.toLocaleString()} đ`,
    });

  } catch (error) {
    console.error("Lỗi xử lý mã giảm giá:", error);
    res.status(500).json({ message: "Lỗi máy chủ khi áp dụng mã giảm giá!" });
  }
});

module.exports = router;
