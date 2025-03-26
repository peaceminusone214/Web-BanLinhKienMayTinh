const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Discount = require("../models/Discount");
const sendOrderEmail = require("../utils/email");
const router = express.Router();

// Route thêm đơn hàng
router.post("/add-order", async (req, res) => {
  try {
    let orders = req.body;
    if (!Array.isArray(orders) || orders.length === 0) {
      return res.status(400).json({ message: "Danh sách đơn hàng trống hoặc không hợp lệ" });
    }

    const newOrders = [];

    for (const order of orders) {
      let subtotal = 0;
      let productDetails = [];

      for (const item of order.products) {
        const product = await Product.findById(item.product_id);
        if (!product) return res.status(404).json({ message: `Sản phẩm ${item.product_id} không tồn tại` });

        if (product.stock_quantity < item.quantity) {
          return res.status(400).json({ message: `Sản phẩm ${product.product_name} chỉ còn ${product.stock_quantity} trong kho` });
        }

        const productTotal = product.price * item.quantity;
        subtotal += productTotal;

        productDetails.push({
          product_id: product._id,
          product_name: product.product_name,
          image_url: product.image_url,
          quantity: item.quantity,
          price_per_unit: product.price,
          total_price: productTotal,
        });

        product.stock_quantity -= item.quantity;
        await product.save();
      }

      let discountAmount = 0;
      if (order.discount_code) {
        const discount = await Discount.findOne({ code: order.discount_code });
        if (discount && discount.status === "active" && subtotal >= discount.min_order_value) {
          discountAmount = discount.discount_type === "percentage"
            ? (subtotal * discount.discount_value) / 100
            : discount.discount_value;
        }
      }

      const VAT = (subtotal - discountAmount) * 0.1;
      const shippingFee = order.shipping_fee ?? 50000;
      const totalAmount = subtotal - discountAmount + VAT + shippingFee;

      const newOrder = new Order({
        user_id: order.user_id,
        products: productDetails,
        subtotal,
        discount_code: order.discount_code || "",
        discount_amount: discountAmount,
        VAT,
        shipping_fee: shippingFee,
        total_amount: totalAmount,
        fullName: order.fullName,
        phone: order.phone,
        email: order.email,
        payment_method: order.payment_method || "COD",
        payment_status: order.payment_status || "Unpaid",
        order_status: order.order_status || "Pending",
        note: order.note || "",
        deliveryDate: order.deliveryDate || "",
        deliveryTime: order.deliveryTime || "",
        shipping_address: order.shipping_address,
      });

      await newOrder.save();
      newOrders.push(newOrder);

      // Gửi email xác nhận đơn hàng
      await sendOrderEmail({
        fullName: order.fullName,
        email: order.email,
        orderId: newOrder._id,
        totalAmount,
        shippingAddress: `${order.shipping_address.street}, ${order.shipping_address.ward}, ${order.shipping_address.city}, ${order.shipping_address.province}`,
        products: productDetails,
      });
    }

    res.status(201).json({ message: `Thêm thành công ${newOrders.length} đơn hàng`, orders: newOrders });
  } catch (err) {
    console.error("Lỗi:", err);
    res.status(500).json({ message: "Lỗi máy chủ khi thêm đơn hàng" });
  }
});

// Route lấy danh sách đơn hàng
router.get("/get-orders", async (req, res) => {
  try {
    // Tìm tất cả đơn hàng trong cơ sở dữ liệu
    const orders = await Order.find()
      .populate("user_id", "name") // Lấy thông tin người dùng
      .populate("build_id") // Lấy thông tin build nếu cần
      .exec();

    // Kiểm tra nếu không có đơn hàng nào
    if (orders.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng nào" });
    }

    // Trả về danh sách đơn hàng
    res.status(200).json(orders);
  } catch (err) {
    console.error("Lỗi:", err);
    res.status(500).json({ message: "Lỗi máy chủ khi lấy đơn hàng" });
  }
});

// Route lấy thông tin đơn hàng
router.post("/get-orderinfos", async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Vui lòng cung cấp ID đơn hàng" });
    }

    // Tìm đơn hàng theo ID và populate thông tin người dùng
    const order = await Order.findById(id)
      .populate("user_id", "name email") // Lấy thông tin người dùng
      .exec();

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    res.status(200).json(order);
  } catch (err) {
    console.error("Lỗi:", err);
    res.status(500).json({ message: "Lỗi máy chủ khi lấy thông tin đơn hàng" });
  }
});

// Route xóa đơn hàng (có thể xóa một hoặc nhiều đơn hàng)
router.delete("/delete-orders", async (req, res) => {
  const { ids } = req.body;

  // Kiểm tra xem mảng IDs có hợp lệ không
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "Mảng ID đơn hàng không hợp lệ" });
  }

  try {
    // Xóa nhiều đơn hàng hoặc chỉ 1 đơn hàng nếu mảng chỉ chứa 1 phần tử
    const deletedOrders = await Order.deleteMany({ _id: { $in: ids } });

    // Nếu không có đơn hàng nào bị xóa
    if (deletedOrders.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy đơn hàng nào để xóa" });
    }

    // Trả về thông báo thành công
    res
      .status(200)
      .json({
        message: `${deletedOrders.deletedCount} đơn hàng đã được xóa thành công`,
      });
  } catch (err) {
    console.error("Lỗi:", err);
    res.status(500).json({ message: "Lỗi máy chủ khi xóa đơn hàng" });
  }
});

// Route cập nhật trạng thái đơn hàng
router.put("/update-order-status/:orderId", async (req, res) => {
  try {
    const { order_status } = req.body;
    const { orderId } = req.params;

    // Kiểm tra trạng thái hợp lệ
    const validStatuses = [
      "Pending", "Confirmed", "Processing", "Shipped", "OutForDelivery", "Delivered", "Cancelled", "Returned", "Refunded", "Failed"
    ];
    if (!validStatuses.includes(order_status)) {
      return res.status(400).json({ message: "Trạng thái đơn hàng không hợp lệ" });
    }

    // Cập nhật đơn hàng
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { order_status, updated_at: Date.now() },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    res.status(200).json({ message: "Cập nhật trạng thái thành công" });
  } catch (err) {
    console.error("Lỗi khi cập nhật trạng thái đơn hàng:", err);
    res.status(500).json({ message: "Lỗi máy chủ khi cập nhật trạng thái đơn hàng" });
  }
});

module.exports = router;
