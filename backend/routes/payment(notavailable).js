// // routes/payment.js
// const express = require('express');
// const router = express.Router();
// const moment = require('moment');
// const crypto = require('crypto');
// const Order = require('../models/Order'); // Model đơn hàng

// // Đồng bộ biến môi trường theo file .env
// const vnp_TmnCode = process.env.VNP_TMN_CODE;
// const vnp_HashSecret = process.env.VNP_HASH_SECRET;
// const vnp_Url = process.env.VNP_URL;
// const vnp_ReturnUrl = process.env.VNP_RETURN_URL;

// /**
//  * Hàm xây dựng chuỗi query string theo quy tắc của VNPAY:
//  * - Sắp xếp các tham số theo thứ tự bảng chữ cái
//  * - Encode giá trị với encodeURIComponent và thay %20 bằng dấu +
//  */
// function buildQueryString(params) {
//   return Object.keys(params)
//     .sort()
//     .map(key => `${key}=${encodeURIComponent(params[key]).replace(/%20/g, '+')}`)
//     .join('&');
// }

// /**
//  * Hàm tạo chuỗi ký (signData).
//  * Lưu ý: Khi ký, KHÔNG thực hiện encode trên giá trị (encode = false).
//  */
// function buildSignData(params) {
//   return Object.keys(params)
//     .sort()
//     .map(key => `${key}=${decodeURIComponent(params[key])}`) // DECODE ở bước verify
//     .join('&');
// }

// /**
//  * Hàm tạo URL thanh toán VNPAY
//  */
// function createVnpayUrl(order) {
//   let vnp_Params = {
//     vnp_Version: '2.1.0',
//     vnp_Command: 'pay',
//     vnp_TmnCode: vnp_TmnCode,
//     vnp_Amount: order.amount * 100, // chuyển đổi sang đơn vị nhỏ nhất
//     vnp_CurrCode: 'VND',
//     vnp_TxnRef: order.id, 
//     vnp_OrderInfo: `Thanh toán đơn hàng ${order.id}`,
//     vnp_OrderType: 'other',
//     vnp_Locale: 'vn',
//     vnp_ReturnUrl: vnp_ReturnUrl,
//     // Chuyển "::ffff:127.0.0.1" về "127.0.0.1" nếu cần
//     vnp_IpAddr: (order.ip === '::1') ? '127.0.0.1' : ((order.ip.indexOf('::ffff:') > -1) ? order.ip.split('::ffff:')[1] : order.ip),
//     vnp_CreateDate: moment().format('YYYYMMDDHHmmss')
//   };

//   // Tạo signData
//   let signData = buildSignData(vnp_Params);
//   console.log("SignData:", signData);

//   // Tạo chữ ký (ví dụ sha512)
//   let hmac = crypto.createHmac('sha512', vnp_HashSecret);
//   let secureHash = hmac.update(signData).digest('hex');
//   console.log("SecureHash:", secureHash);

//   vnp_Params.vnp_SecureHash = secureHash;

//   // Tạo query string
//   let queryString = buildQueryString(vnp_Params);
//   console.log("QueryString:", queryString);

//   let paymentUrl = `${vnp_Url}?${queryString}`;
//   console.log("Payment URL:", paymentUrl);

//   return paymentUrl;
// }

// // -------------- TẠO THANH TOÁN --------------
// router.post('/create_payment', (req, res) => {
//   console.log("Payload nhận được:", req.body);

//   // Lấy thông tin đơn hàng từ request body
//   let order = {
//     id: req.body.orderId,     
//     amount: Number(req.body.amount),
//     ip: req.ip
//   };

//   if (!order.id || isNaN(order.amount)) {
//     return res.status(400).json({ message: "orderId hoặc amount không hợp lệ" });
//   }

//   // Tạo URL thanh toán VNPAY
//   let paymentUrl = createVnpayUrl(order);

//   // Chuyển hướng khách hàng đến cổng thanh toán VNPAY
//   return res.redirect(paymentUrl);
// });

// // -------------- XỬ LÝ RETURN URL (USER REDIRECT) --------------
// router.get('/vnpay_return', (req, res) => {
//   console.log("Params nhận từ VNPAY (returnUrl):", req.query);

//   let vnp_Params = { ...req.query };
//   let secureHash = vnp_Params.vnp_SecureHash;

//   delete vnp_Params.vnp_SecureHash;
//   delete vnp_Params.vnp_SecureHashType;

//   let signData = buildSignData(vnp_Params); // ✅ Dùng lại hàm buildSignData y như lúc tạo
//   console.log("SignData (Return):", signData);

//   let hmac = crypto.createHmac('sha512', vnp_HashSecret);
//   let checkSum = hmac.update(signData).digest('hex');

//   if (secureHash === checkSum) {
//     if (vnp_Params.vnp_ResponseCode === '00') {
//       // Cập nhật trạng thái đơn hàng
//       return res.send('Thanh toán thành công (returnUrl)');
//     } else {
//       return res.send('Thanh toán thất bại (returnUrl)');
//     }
//   } else {
//     return res.send('Chữ ký không hợp lệ (returnUrl)');
//   }
// });

// router.get('/vnpay_ipn', (req, res) => {
//   console.log("Params nhận từ VNPAY (IPN):", req.query);

//   let vnp_Params = { ...req.query };
//   let secureHash = vnp_Params.vnp_SecureHash;

//   delete vnp_Params.vnp_SecureHash;
//   delete vnp_Params.vnp_SecureHashType;

//   let signData = buildSignData(vnp_Params); // ✅ Dùng lại hàm
//   console.log("SignData (IPN):", signData);

//   let hmac = crypto.createHmac('sha512', vnp_HashSecret);
//   let checkSum = hmac.update(signData).digest('hex');

//   if (secureHash === checkSum) {
//     if (vnp_Params.vnp_ResponseCode === '00') {
//       console.log("Thanh toán IPN thành công:", vnp_Params.vnp_TxnRef);
//       return res.status(200).json({ RspCode: '00', Message: 'IPN Success' });
//     } else {
//       console.log("Giao dịch thất bại:", vnp_Params.vnp_TxnRef);
//       return res.status(200).json({ RspCode: '00', Message: 'IPN Failed Transaction' });
//     }
//   } else {
//     console.log("Sai chữ ký IPN");
//     return res.status(200).json({ RspCode: '97', Message: 'Invalid Signature' });
//   }
// });


// module.exports = router;






// // router.get('/vnpay_ipn', async (req, res, next) => {
// //   try {
// //     // Lấy tham số từ query (VNPay gửi qua GET)
// //     let vnp_Params = req.query;
// //     console.log("VNPay IPN params:", vnp_Params);

// //     // Tạm thời bỏ qua kiểm tra chữ ký
// //     // const secureHash = vnp_Params['vnp_SecureHash'];
// //     // delete vnp_Params['vnp_SecureHash'];
// //     // delete vnp_Params['vnp_SecureHashType'];
// //     // vnp_Params = sortObject(vnp_Params);
// //     // const signData = qs.stringify(vnp_Params, { encode: false });
// //     // const hmac = crypto.createHmac("sha512", process.env.VNP_HASH_SECRET);
// //     // const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
// //     // if (secureHash !== signed) {
// //     //   console.error("Invalid signature in VNPay IPN callback");
// //     //   return res.status(400).json({ RspCode: '97', Message: 'Invalid signature' });
// //     // }

// //     // Ví dụ: Cập nhật đơn hàng (ở đây bạn có thể thêm logic cập nhật trạng thái thanh toán vào database)
// //     // Nếu bạn dùng vnp_TxnRef để nhận dạng đơn hàng, ví dụ:
// //     const txnRef = vnp_Params['vnp_TxnRef'];
// //     // Đây là ví dụ update đơn hàng (bạn cần điều chỉnh logic theo model của bạn)
// //     // await Order.findOneAndUpdate({ _id: { $regex: txnRef + '$' } }, { payment_status: 'Paid' });
// //     console.log(`Payment success for order reference: ${txnRef}`);

// //     // Phản hồi lại cho VNPay rằng bạn đã nhận được kết quả thanh toán thành công
// //     return res.status(200).json({ RspCode: '00', Message: 'IPN Success (signature skipped)' });
// //   } catch (error) {
// //     next(error);
// //   }
// // });


const express = require('express');
const router = express.Router();
const moment = require('moment');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Order = require('../models/Order'); // Model đơn hàng

// Lấy các biến môi trường từ file .env
const vnp_TmnCode    = process.env.VNP_TMN_CODE;
const vnp_HashSecret = process.env.VNP_HASH_SECRET;
const vnp_Url        = process.env.VNP_URL;
const vnp_ReturnUrl  = process.env.VNP_RETURN_URL;

/**
 * Hàm sắp xếp các tham số theo thứ tự bảng chữ cái và loại bỏ các tham số rỗng.
 */
function sortParams(obj) {
  return Object.entries(obj)
    .filter(([key, value]) => value !== "" && value !== undefined && value !== null)
    .sort(([a], [b]) => a.localeCompare(b))
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
}

/**
 * Hàm tạo chuỗi ký (signData) từ các tham số đã được sắp xếp.
 * Ở đây không thực hiện encode vì cần giữ nguyên giá trị gốc.
 */
function buildSignData(params) {
  return Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
}

/**
 * Hàm build query string: encode từng giá trị (sử dụng encodeURIComponent)
 * và thay thế %20 bằng dấu +.
 */
function buildQueryString(params) {
  return Object.keys(params)
    .sort()
    .map(key => `${key}=${encodeURIComponent(params[key]).replace(/%20/g, '+')}`)
    .join('&');
}

/**
 * Hàm tạo URL thanh toán VNPAY.
 * Quy trình:
 * 1. Tạo đối tượng tham số (vnp_Params) theo định dạng VNPAY.
 * 2. Sắp xếp các tham số và tạo chuỗi ký (signData).
 * 3. Tính chữ ký bằng HMAC SHA512 với secret key (VNP_HASH_SECRET).
 * 4. Gán chữ ký vào tham số và tạo query string để nối vào URL thanh toán.
 */
function createVnpayUrl(order) {
  // Các tham số cần gửi tới VNPAY
  let vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: vnp_TmnCode,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: order.id,
    vnp_OrderInfo: `Payment for ${order.id}`,
    vnp_OrderType: "other",
    vnp_Amount: order.amount * 100, // chuyển đổi sang đơn vị nhỏ nhất
    vnp_ReturnUrl: vnp_ReturnUrl,
    vnp_IpAddr: order.ip,
    vnp_CreateDate: moment().format("YYYYMMDDHHmmss")
  };

  // Sắp xếp các tham số
  const sortedParams = sortParams(vnp_Params);
  
  // Tạo chuỗi ký từ các tham số gốc (không encode)
  const signData = buildSignData(sortedParams);
  
  // Tính chữ ký với thuật toán HMAC SHA512
  const hmac = crypto.createHmac("sha512", vnp_HashSecret);
  const secureHash = hmac.update(signData).digest("hex");

  // Gán chữ ký vào tham số
  sortedParams.vnp_SecureHash = secureHash;

  // Tạo query string với encode (thay %20 thành dấu +)
  const queryString = buildQueryString(sortedParams);
  const paymentUrl = `${vnp_Url}?${queryString}`;

  return paymentUrl;
}

/**
 * Route POST tạo URL thanh toán.
 * Input: { orderId, amount } từ request body.
 * Output: JSON chứa paymentUrl.
 */
router.post('/create_payment', async (req, res) => {
  const { orderId, amount } = req.body;
  if (!orderId || !amount) {
    return res.status(400).json({ message: 'Thiếu orderId hoặc amount' });
  }

  let order;
  // Nếu orderId là một ObjectId hợp lệ, dùng findById, ngược lại, dùng orderNumber
  if (mongoose.Types.ObjectId.isValid(orderId)) {
    order = await Order.findById(orderId);
  } else {
    order = await Order.findOne({ orderNumber: orderId });
  }
  
  if (!order) {
    return res.status(401).json({ success: false, message: "Order not found" });
  }

  // Lấy địa chỉ IP: nếu chạy sau proxy, xử lý trường hợp IPv6 chuyển sang IPv4
  const ip = req.ip.includes('::ffff:') ? req.ip.split('::ffff:')[1] : req.ip;

  // Sử dụng order.orderNumber nếu có, hoặc order._id.toString() nếu không có orderNumber
  let orderIdentifier = order.orderNumber ? order.orderNumber : order._id.toString();

  let orderData = {
    id: orderIdentifier,
    amount: Number(amount),
    ip: ip
  };

  const paymentUrl = createVnpayUrl(orderData);
  return res.json({ success: true, paymentUrl });
});

module.exports = router;

