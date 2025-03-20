const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const router = express.Router();

// Route thêm đơn hàng
router.post("/add-order", async (req, res) => {
  try {
    let orders = req.body;

    if (!Array.isArray(orders) || orders.length === 0) {
      return res
        .status(400)
        .json({ message: "Danh sách đơn hàng trống hoặc không hợp lệ" });
    }

    const newOrders = [];

    for (const order of orders) {
      let totalAmount = 0;
      let productDetails = [];

      // Lặp qua danh sách sản phẩm trong đơn hàng
      for (const item of order.products) {
        const product = await Product.findById(item.product_id);

        if (!product) {
          return res
            .status(404)
            .json({
              message: `Sản phẩm với ID ${item.product_id} không tồn tại`,
            });
        }

        if (!item.quantity || isNaN(item.quantity) || item.quantity <= 0) {
          return res
            .status(400)
            .json({
              message: `Số lượng không hợp lệ cho sản phẩm ${product.product_name}`,
            });
        }

        if (!product.price || isNaN(product.price)) {
          return res
            .status(500)
            .json({
              message: `Giá sản phẩm ${product.product_name} không hợp lệ`,
            });
        }

        // Kiểm tra stock_quantity
        if (product.stock_quantity < item.quantity) {
          return res
            .status(400)
            .json({
              message: `Sản phẩm ${product.product_name} chỉ còn ${product.stock_quantity} trong kho`,
            });
        }

        // Tính tổng tiền
        const productTotal = product.price * item.quantity;
        totalAmount += productTotal;

        // Lưu thông tin sản phẩm trong đơn
        productDetails.push({
          product_id: product._id,
          product_name: product.product_name,
          image_url: product.image_url,
          quantity: item.quantity,
          price_per_unit: product.price,
          total_price: productTotal,
        });

        // Trừ số lượng tồn kho
        product.stock_quantity -= item.quantity;
        await product.save();
      }

      // Xác định trạng thái thanh toán và đơn hàng
      const paymentStatus = order.payment_status || "Unpaid"; // Mặc định chưa thanh toán
      const orderStatus = order.order_status || "Pending"; // Mặc định chờ xác nhận

      // Tạo đơn hàng
      const newOrder = new Order({
        user_id: order.user_id,
        products: productDetails,
        total_amount: totalAmount,
        payment_method: order.payment_method || "Credit Card",
        payment_status: paymentStatus,
        order_status: orderStatus,
        created_at: new Date(),
        updated_at: new Date(),
      });

      await newOrder.save();
      newOrders.push(newOrder);
    }

    res.status(201).json({
      message: `Thêm thành công ${newOrders.length} đơn hàng`,
      orders: newOrders,
    });
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

module.exports = router;
