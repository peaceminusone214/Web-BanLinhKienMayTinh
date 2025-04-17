const express = require("express");
const router = express.Router();
const moment = require("moment");
const crypto = require("crypto");
const qs = require("qs");
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const sendOrderEmail = require("../utils/email");
const { sendMessage } = require("../utils/telegramBot");
const { generateVNPayUrl } = require("../utils/vnpayHelper");

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

function sortObject(obj) {
  const sorted = {};
  Object.keys(obj)
    .sort()
    .forEach((key) => {
      sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
    });
  return sorted;
}

//
router.post("/create_order_payment", async (req, res) => {
  try {
    const {
      user,
      fullName,
      email,
      products,
      amount,
      bankCode,
      language,
      shippingAddress,
      sendTelegram,
    } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Thiếu danh sách sản phẩm" });
    }

    let subtotal = 0;
    const productDetails = [];

    for (const item of products) {
      const product = await Product.findById(item.product_id);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Sản phẩm không tồn tại: ${item.product_id}` });
      }

      const total = product.price * item.quantity;
      subtotal += total;

      productDetails.push({
        product_id: product._id,
        product_name: product.product_name,
        image_url: product.image_url,
        quantity: item.quantity,
        price_per_unit: product.price,
        total_price: total,
      });
    }

    const VAT = subtotal * 0.1;
    const shipping_fee = 50000;
    const total_amount = subtotal + VAT + shipping_fee;

    const newOrder = new Order({
      user_id: user || null,
      fullName: fullName || "Khách",
      email: email || "",
      shipping_address: shippingAddress || {},
      products: productDetails,
      subtotal,
      VAT,
      shipping_fee,
      total_amount,
      payment_method: "vnpay",
      payment_status: "Unpaid",
      order_status: "Pending",
      created_at: new Date(),
      updated_at: new Date(),
    });

    const savedOrder = await newOrder.save();

    process.env.TZ = "Asia/Ho_Chi_Minh";
    const date = new Date();
    const createDate = moment(date).format("YYYYMMDDHHmmss");
    const ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress;

    const tmnCode = process.env.VNP_TMN_CODE;
    const secretKey = process.env.VNP_HASH_SECRET;
    let vnpUrl = process.env.VNP_URL;
    const returnUrl = process.env.VNP_RETURN_URL;

    const orderId = savedOrder._id.toString().slice(-6);
    const locale = language || "vn";
    const currCode = "VND";

    let vnp_Params = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: tmnCode,
      vnp_Locale: locale,
      vnp_CurrCode: currCode,
      vnp_TxnRef: orderId,
      vnp_OrderInfo: `Thanh toán cho mã GD: ${orderId}`,
      vnp_OrderType: "other",
      vnp_Amount: total_amount * 100,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    if (bankCode) {
      vnp_Params.vnp_BankCode = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);
    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const secureHash = hmac
      .update(Buffer.from(signData, "utf-8"))
      .digest("hex");
    vnp_Params.vnp_SecureHash = secureHash;

    const paymentUrl = generateVNPayUrl({
      amount: total_amount,
      orderId: savedOrder._id.toString().slice(-6),
      ipAddr,
      language,
      bankCode,
    });

    // Nếu có user và chưa kết nối Telegram → tạo token nếu cần
    let telegramConnectLink = null;
    if (user && sendTelegram) {
      const foundUser = await User.findById(user);
      if (foundUser && !foundUser.telegramChatId) {
        if (!foundUser.telegramConnectToken) {
          foundUser.telegramConnectToken = crypto
            .randomBytes(16)
            .toString("hex");
          await foundUser.save();
        }
        telegramConnectLink = `https://t.me/Auchobot_bot?start=${foundUser.telegramConnectToken}`;
      }
    }
    res.status(200).json({
      order: savedOrder,
      paymentUrl,
      telegramConnectLink,
    });
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng VNPay:", error);
    res.status(500).json({
      message: "Lỗi khi tạo đơn hàng VNPay",
      error: error.message,
    });
  }
});

//
router.get("/vnpay_return", async (req, res) => {
  try {
    const vnp_Params = req.query;
    const txnRef = vnp_Params.vnp_TxnRef;
    const responseCode = vnp_Params.vnp_ResponseCode;

    if (responseCode === "00") {
      const allOrders = await Order.find({});
      const matchedOrder = allOrders.find((o) =>
        o._id.toString().endsWith(txnRef)
      );

      if (matchedOrder) {
        matchedOrder.payment_status = "Paid";
        matchedOrder.order_status = "Confirmed";
        matchedOrder.updated_at = new Date();
        await matchedOrder.save();

        {
          /* console.log("matchedOrder.user_id:", matchedOrder.user_id); */
        }
        const user = (await User.findById(matchedOrder.user_id))
          ? await User.findById(matchedOrder.user_id)
          : null;

        // Fallback thông tin người dùng
        const fullName = matchedOrder.fullName || user?.name || "Khách hàng";
        const email = matchedOrder.email || user?.email;

        // Gộp địa chỉ giao hàng nếu có
        let shippingAddress = "Không có thông tin";
        if (matchedOrder.shipping_address) {
          const { street, ward, city, province } =
            matchedOrder.shipping_address;
          shippingAddress = [street, ward, city, province]
            .filter(Boolean)
            .join(", ");
        }

        // Chuyển products về plain object để tương thích với handlebars
        const plainProducts = matchedOrder.products.map((p) => ({
          product_name: p.product_name,
          quantity: p.quantity,
          total_price: p.total_price.toLocaleString(),
        }));

        // Gửi email nếu có email hợp lệ
        if (email) {
          await sendOrderEmail({
            fullName,
            email,
            orderId: matchedOrder._id,
            totalAmount: matchedOrder.total_amount,
            shippingAddress,
            products: plainProducts,
          });
        } else {
          console.warn("Không có email để gửi đơn hàng.");
        }

        // Gửi Telegram như cũ
        if (user?.telegramChatId) {
          const message =
            `*Thanh toán VNPay thành công!*\n\n` +
            `Mã đơn: ${matchedOrder._id}\n` +
            `Tên: ${fullName}\n` +
            `Tổng tiền: ${matchedOrder.total_amount.toLocaleString()} đ\n` +
            `Ngày giao: ${
              matchedOrder.deliveryDate || "Chưa xác định"
            }\n\n` +
            `Sản phẩm:\n` +
            matchedOrder.products
              .map((p) => `- ${p.product_name} x${p.quantity}`)
              .join("\n") +
            `\n\nĐịa chỉ: ${shippingAddress}`;

          await sendMessage(user.telegramChatId, message);
        }

        return res.redirect(`${FRONTEND_URL}/order-success`);
      } else {
        return res.send("Không tìm thấy đơn hàng phù hợp.");
      }
    } else {
      return res.redirect(`${FRONTEND_URL}/order-failed`);
    }
  } catch (error) {
    console.error("Lỗi xử lý callback VNPay:", error);
    return res.status(500).send("Lỗi hệ thống.");
  }
});

module.exports = router;
