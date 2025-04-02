// routes/payment.js

const express = require('express');
const router = express.Router();
const moment = require('moment');
const crypto = require('crypto');
const qs = require('qs');
const Order = require('../models/Order'); // Model đơn hàng

// Hàm sắp xếp các tham số theo thứ tự bảng chữ cái
function sortObject(obj) {
  const sorted = {};
  Object.keys(obj)
    .sort()
    .forEach(key => {
      sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
    });
  return sorted;
}

/**
 * POST: Tạo đơn hàng và trả về URL thanh toán VNPay
 * Endpoint: /api/payment/create_order_payment
 */
router.post('/create_order_payment', async (req, res, next) => {
  try {
    // Lấy thông tin đơn hàng từ request body
    const { user, products, amount, bankCode, language } = req.body;

    // Tạo đơn hàng mới (đơn giản, bạn có thể điều chỉnh theo logic của dự án)
    const newOrder = new Order({
      user_id: user,
      products, // Nếu cần, xử lý chuyển đổi dữ liệu products theo đúng schema của Order
      amount,
      order_status: 'Pending',
      payment_status: 'Unpaid',
      createdAt: new Date()
    });
    const savedOrder = await newOrder.save();

    // Cấu hình thông tin thanh toán VNPay
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');
    const ipAddr =
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress;
    const tmnCode = process.env.VNP_TMN_CODE;
    const secretKey = process.env.VNP_HASH_SECRET;
    let vnpUrl = process.env.VNP_URL; // Ví dụ: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"
    const returnUrl = process.env.VNP_RETURN_URL; // Ví dụ: "http://localhost:5000/api/payment/vnpay_return"

    // Dùng 6 ký tự cuối của _id làm vnp_TxnRef (dùng cho test, đảm bảo tính duy nhất nếu có thể)
    const orderId = savedOrder._id.toString().slice(-6);
    const locale = language || 'vn';
    const currCode = 'VND';

    let vnp_Params = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Locale: locale,
      vnp_CurrCode: currCode,
      vnp_TxnRef: orderId,
      vnp_OrderInfo: 'Thanh toán cho mã GD: ' + orderId,
      vnp_OrderType: 'other',
      vnp_Amount: amount * 100, // VNPay nhân 100
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    if (bankCode) {
      vnp_Params.vnp_BankCode = bankCode;
    }

    // Sắp xếp tham số và tạo chữ ký
    vnp_Params = sortObject(vnp_Params);
    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const secureHash = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
    vnp_Params.vnp_SecureHash = secureHash;

    // Ghép URL thanh toán
    vnpUrl += '?' + qs.stringify(vnp_Params, { encode: false });

    return res.status(200).json({
      order: savedOrder,
      paymentUrl: vnpUrl
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET: Xử lý callback trả về từ VNPay (IPN)
 * Endpoint: /api/payment/vnpay_return
 * (Hiện tạm thời bỏ qua kiểm tra chữ ký để test flow)
 */
router.get('/vnpay_return', async (req, res, next) => {
  try {
    // Lấy các tham số trả về từ VNPay (ví dụ: vnp_ResponseCode, vnp_TxnRef, vnp_OrderInfo, …)
    const vnp_Params = req.query;
    console.log("VNPay Return params:", vnp_Params);

    // Tùy vào ứng dụng của bạn, bạn có thể hiển thị thông báo thành công/thất bại cho khách hàng.
    // Ví dụ, nếu vnp_ResponseCode === '00' thì thanh toán thành công, ngược lại thất bại.
    if (vnp_Params.vnp_ResponseCode === '00') {
      // Thanh toán thành công
      res.send("Thanh toán thành công. Cảm ơn bạn đã mua hàng!");
    } else {
      // Thanh toán thất bại hoặc bị hủy
      res.send("Thanh toán không thành công. Vui lòng thử lại!");
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
