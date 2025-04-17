const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Discount = require("../models/Discount");
const User = require("../models/User");
const sendOrderEmail = require("../utils/email");
const { sendMessage } = require("../utils/telegramBot");
const crypto = require("crypto");
const router = express.Router();

// Hàm tạo token ngẫu nhiên
const generateToken = () => {
  return crypto.randomBytes(16).toString("hex");
};

// Route thêm đơn hàng
router.post("/add-order", async (req, res) => {
  try {
    let orders = req.body;
    if (!Array.isArray(orders) || orders.length === 0) {
      return res
        .status(400)
        .json({ message: "Danh sách đơn hàng trống hoặc không hợp lệ" });
    }

    const telegramConnectionInfo = [];
    const newOrders = [];

    for (const order of orders) {
      let subtotal = 0;
      let productDetails = [];

      for (const item of order.products) {
        const product = await Product.findById(item.product_id);
        if (!product)
          return res
            .status(404)
            .json({ message: `Sản phẩm ${item.product_id} không tồn tại` });

        if (product.stock_quantity < item.quantity) {
          return res
            .status(400)
            .json({
              message: `Sản phẩm ${product.product_name} chỉ còn ${product.stock_quantity} trong kho`,
            });
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
        if (
          discount &&
          discount.status === "active" &&
          subtotal >= discount.min_order_value
        ) {
          discountAmount =
            discount.discount_type === "percentage"
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

    res
      .status(201)
      .json({
        message: `Thêm thành công ${newOrders.length} đơn hàng`,
        orders: newOrders,
      });
  } catch (err) {
    console.error("Lỗi:", err);
    res.status(500).json({ message: "Lỗi máy chủ khi thêm đơn hàng" });
  }
});

// // Route thêm đơn hàng
// router.post("/add-order", async (req, res) => {
//   try {
//     let orders = req.body;
//     if (!Array.isArray(orders) || orders.length === 0) {
//       return res.status(400).json({ message: "Danh sách đơn hàng trống hoặc không hợp lệ" });
//     }

//     const telegramConnectionInfo = [];
//     const newOrders = [];

//     for (const order of orders) {
//       let subtotal = 0;
//       let productDetails = [];

//       for (const item of order.products) {
//         const product = await Product.findById(item.product_id);
//         if (!product)
//           return res
//             .status(404)
//             .json({ message: `Sản phẩm ${item.product_id} không tồn tại` });

//         if (product.stock_quantity < item.quantity) {
//           return res.status(400).json({
//             message: `Sản phẩm ${product.product_name} chỉ còn ${product.stock_quantity} trong kho`,
//           });
//         }

//         const productTotal = product.price * item.quantity;
//         subtotal += productTotal;

//         productDetails.push({
//           product_id: product._id,
//           product_name: product.product_name,
//           image_url: product.image_url,
//           quantity: item.quantity,
//           price_per_unit: product.price,
//           total_price: productTotal,
//         });

//         product.stock_quantity -= item.quantity;
//         await product.save();
//       }

//       let discountAmount = 0;
//       if (order.discount_code) {
//         const discount = await Discount.findOne({ code: order.discount_code });
//         if (
//           discount &&
//           discount.status === "active" &&
//           subtotal >= discount.min_order_value
//         ) {
//           discountAmount =
//             discount.discount_type === "percentage"
//               ? (subtotal * discount.discount_value) / 100
//               : discount.discount_value;
//         }
//       }

//       const VAT = (subtotal - discountAmount) * 0.1;
//       const shippingFee = order.shipping_fee ?? 50000;
//       const totalAmount = subtotal - discountAmount + VAT + shippingFee;

//       const newOrder = new Order({
//         user_id: order.user_id,
//         products: productDetails,
//         subtotal,
//         discount_code: order.discount_code || "",
//         discount_amount: discountAmount,
//         VAT,
//         shipping_fee: shippingFee,
//         total_amount: totalAmount,
//         fullName: order.fullName,
//         phone: order.phone,
//         email: order.email,
//         payment_method: order.payment_method || "COD",
//         payment_status: order.payment_status || "Unpaid",
//         order_status: order.order_status || "Pending",
//         note: order.note || "",
//         deliveryDate: order.deliveryDate || "",
//         deliveryTime: order.deliveryTime || "",
//         shipping_address: order.shipping_address,
//       });

//       await newOrder.save();
//       newOrders.push(newOrder);

//       // Gửi email xác nhận đơn hàng
//       await sendOrderEmail({
//         fullName: order.fullName,
//         email: order.email,
//         orderId: newOrder._id,
//         totalAmount,
//         shippingAddress: `${order.shipping_address.street}, ${order.shipping_address.ward}, ${order.shipping_address.city}, ${order.shipping_address.province}`,
//         products: productDetails,
//       });

//       // Lấy thông tin user để kiểm tra kết nối Telegram
//       const user = await User.findById(order.user_id);

//       if (!user) {
//         console.warn(`⚠️ Không tìm thấy user với ID: ${order.user_id}`);
//         continue;
//       }

//       // Gộp kiểm tra và tạo token nếu cần
//       if (!user.telegramChatId || !user.telegramConnectToken) {
//         if (!user.telegramConnectToken) {
//           user.telegramConnectToken = generateToken();
//           await user.save();
//           console.log(
//             `✅ Gán token Telegram cho user ${user._id}: ${user.telegramConnectToken}`
//           );
//         }
//       }

//       // Nếu user chưa kết nối Telegram (chatId null) → đẩy vào frontend
//       if (!user.telegramChatId && user.telegramConnectToken) {
//         telegramConnectionInfo.push({
//           userId: user._id,
//           connectionLink: `https://t.me/Auchobot_bot?start=${user.telegramConnectToken}`,
//         });

//         console.log(
//           `🧑 User ${user._id} chưa kết nối Telegram → Link: https://t.me/Auchobot_bot?start=${user.telegramConnectToken}`
//         );
//       } else {
//         console.log(
//           `✅ User ${user._id} đã kết nối Telegram (chatId: ${user.telegramChatId})`
//         );
//       }
//     }

//     console.log("📦 Tổng số đơn:", newOrders.length);
//     console.log("🔗 Đang xử lý kết nối Telegram...");
//     for (const order of newOrders) {
//       if (!order.user_id) {
//         console.warn("⚠️ Đơn không có user_id, bỏ qua Telegram.");
//         // Tìm token trong order.note với định dạng: guestToken=abc123
//         const guestTokenMatch = order.note?.match(/guestToken=([a-zA-Z0-9]+)/);
//         const guestToken = guestTokenMatch ? guestTokenMatch[1] : null;

//         if (guestToken) {
//           const guestUser = await User.findOne({
//             telegramConnectToken: guestToken,
//           });

//           if (guestUser?.telegramChatId) {
//             // Gửi thông báo đơn hàng
//             const message =
//               `📦 *Đơn hàng mới đã được đặt thành công!*\n\n` +
//               `🧾 Mã đơn: ${order._id}\n` +
//               `👤 Tên: ${order.fullName}\n` +
//               `💵 Tổng tiền: ${order.total_amount.toLocaleString()} đ\n` +
//               `📅 Ngày giao: ${order.deliveryDate || "Chưa xác định"}\n\n` +
//               `🛍️ Sản phẩm:\n` +
//               order.products
//                 .map((p) => `- ${p.product_name} x${p.quantity}`)
//                 .join("\n") +
//               `\n\n🚚 Địa chỉ: ${order.shipping_address?.street || ""}, ${
//                 order.shipping_address?.ward || ""
//               }, ${order.shipping_address?.city || ""}, ${
//                 order.shipping_address?.province || ""
//               }`;

//             await sendMessage(guestUser.telegramChatId, message);
//             console.log(
//               `✅ Đã gửi đơn hàng cho khách guestToken=${guestToken} (chatId: ${guestUser.telegramChatId})`
//             );
//           } else {
//             console.warn(
//               `❌ Không tìm thấy chatId cho guestToken=${guestToken}`
//             );
//           }
//         } else {
//           console.warn("⚠️ Không có guestToken trong order.note");
//         }
//         continue;
//       }

//       const user = await User.findById(order.user_id);

//       if (!user) {
//         console.warn(`⚠️ Không tìm thấy user với ID: ${order.user_id}`);
//         continue;
//       }

//       // Nếu chưa kết nối Telegram, và chưa có token thì tạo
//       if (!user.telegramChatId) {
//         if (!user.telegramConnectToken) {
//           user.telegramConnectToken = generateToken();
//           await user.save();
//           console.log(
//             `✅ Tạo token Telegram cho user ${user._id}: ${user.telegramConnectToken}`
//           );
//         }

//         telegramConnectionInfo.push({
//           userId: user._id,
//           connectionLink: `https://t.me/Auchobot_bot?start=${user.telegramConnectToken}`,
//         });

//         console.log(
//           `🧑 User ${user._id} chưa kết nối Telegram → Link: https://t.me/Auchobot_bot?start=${user.telegramConnectToken}`
//         );
//       } else {
//         console.log(
//           `✅ User ${user._id} đã kết nối Telegram (chatId: ${user.telegramChatId})`
//         );
//       }
//     }
//     console.log("✅ Gửi response về frontend");
//     console.log("📤 telegramConnectionInfo gửi về:", telegramConnectionInfo);
//     res.status(201).json({
//       message: `Thêm thành công ${newOrders.length} đơn hàng`,
//       orders: newOrders,
//       telegramConnectionInfo,
//     });
//   } catch (err) {
//     console.error("Lỗi:", err);
//     res.status(500).json({ message: "Lỗi máy chủ khi thêm đơn hàng" });
//   }
// });

// Route lấy danh sách đơn hàng
router.get("/get-orders", async (req, res) => {
  try {
    // Tìm tất cả đơn hàng chưa bị xoá
    const orders = await Order.find({ deleted: { $ne: true } }) // Lọc những đơn hàng chưa bị xóa
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

// Route lấy danh sách đơn hàng đã bị xoá
router.get("/get-deleted-orders", async (req, res) => {
  try {
    // Tìm tất cả đơn hàng có deleted = true
    const deletedOrders = await Order.find({ deleted: true })
      .populate("user_id", "name") // Lấy thông tin người dùng
      .populate("build_id") // Lấy thông tin build nếu cần
      .exec();

    // Kiểm tra nếu không có đơn hàng nào
    if (deletedOrders.length === 0) {
      return res
        .status(404)
        .json({ message: "Không có đơn hàng đã bị xoá nào" });
    }

    // Trả về danh sách đơn hàng đã xoá
    res.status(200).json(deletedOrders);
  } catch (err) {
    console.error("Lỗi:", err);
    res.status(500).json({ message: "Lỗi máy chủ khi lấy đơn hàng đã xoá" });
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

// Route xóa mềm đơn hàng (có thể xóa một hoặc nhiều đơn hàng)
router.delete("/delete-orders", async (req, res) => {
  const { ids } = req.body;

  // Kiểm tra xem mảng IDs có hợp lệ không
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "Mảng ID đơn hàng không hợp lệ" });
  }

  try {
    // Cập nhật trường deleted = true cho các đơn hàng có ID trong danh sách
    const result = await Order.updateMany(
      { _id: { $in: ids } },
      { $set: { deleted: true } }
    );

    // Nếu không có đơn hàng nào được cập nhật
    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy đơn hàng nào để xóa" });
    }

    // Trả về thông báo thành công
    res.status(200).json({
      message: `${result.modifiedCount} đơn hàng đã được đánh dấu là đã xoá`,
    });
  } catch (err) {
    console.error("Lỗi:", err);
    res.status(500).json({ message: "Lỗi máy chủ khi xoá đơn hàng" });
  }
});

// Route khôi phục đơn hàng đã xoá (có thể khôi phục một hoặc nhiều đơn hàng)
router.patch("/restore-orders", async (req, res) => {
  const { ids } = req.body;

  // Kiểm tra xem mảng IDs có hợp lệ không
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "Mảng ID đơn hàng không hợp lệ" });
  }

  try {
    // Cập nhật lại deleted = false cho các đơn hàng có ID trong danh sách
    const result = await Order.updateMany(
      { _id: { $in: ids }, deleted: true },
      { $set: { deleted: false } }
    );

    // Nếu không có đơn hàng nào được cập nhật
    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy đơn hàng nào để khôi phục" });
    }

    // Trả về thông báo thành công
    res.status(200).json({
      message: `${result.modifiedCount} đơn hàng đã được khôi phục`,
    });
  } catch (err) {
    console.error("Lỗi:", err);
    res.status(500).json({ message: "Lỗi máy chủ khi khôi phục đơn hàng" });
  }
});

// Route cập nhật trạng thái đơn hàng
router.put("/update-order-status/:orderId", async (req, res) => {
  try {
    const { order_status } = req.body;
    const { orderId } = req.params;

    // Kiểm tra trạng thái hợp lệ
    const validStatuses = [
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
    ];
    if (!validStatuses.includes(order_status)) {
      return res
        .status(400)
        .json({ message: "Trạng thái đơn hàng không hợp lệ" });
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
    res
      .status(500)
      .json({ message: "Lỗi máy chủ khi cập nhật trạng thái đơn hàng" });
  }
});

module.exports = router;
