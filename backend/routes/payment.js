// routes/payment.js
const express = require("express");
const router = express.Router();
const moment = require("moment");
const crypto = require("crypto");
const qs = require("qs");

// Hàm sắp xếp đối tượng theo thứ tự chữ cái của các key
function sortObject(obj) {
  let sorted = {};
  let keys = Object.keys(obj).sort();
  keys.forEach((key) => {
    sorted[key] = obj[key];
  });
  return sorted;
}

router.post("/vnpay", (req, res) => {
    const orderData = req.body;
    
    let vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = process.env.VNP_TMN_CODE;
    vnp_Params["vnp_Amount"] = (orderData.total * 100).toString();
    vnp_Params["vnp_CurrCode"] = "VND";
    vnp_Params["vnp_TxnRef"] = orderData.orderId;
    vnp_Params["vnp_OrderInfo"] = `Thanh toan don hang ${orderData.orderId}`;
    vnp_Params["vnp_OrderType"] = "billpayment";
    vnp_Params["vnp_Locale"] = "vn";
    vnp_Params["vnp_ReturnUrl"] = process.env.VNP_RETURN_URL;
    vnp_Params["vnp_CreateDate"] = moment().format("YYYYMMDDHHmmss");
  
    // Lấy IP của khách hàng và chuyển đổi nếu cần (ví dụ: "::1" -> "127.0.0.1")
    let ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress || "127.0.0.1";
    if (ipAddr === "::1") {
      ipAddr = "127.0.0.1";
    }
    vnp_Params["vnp_IpAddr"] = ipAddr;
  
    console.log("Dữ liệu trước khi sắp xếp:", vnp_Params);
    
    vnp_Params = sortObject(vnp_Params);
    console.log("Dữ liệu sau khi sắp xếp:", vnp_Params);
  
    const signData = qs.stringify(vnp_Params, { encode: false });
    console.log("Chuỗi ký (signData):", signData);
  
    const secretKey = process.env.VNP_HASH_SECRET;
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    console.log("Chữ ký được tạo:", signed);
  
    vnp_Params["vnp_SecureHash"] = signed;
    // Thêm tham số vnp_SecureHashType
    vnp_Params["vnp_SecureHashType"] = "SHA512";
    
    const vnpUrl = process.env.VNP_URL + "?" + qs.stringify(vnp_Params, { encode: true });
    console.log("URL thanh toán được tạo:", vnpUrl);

  
    res.json({ url: vnpUrl });
});

// Endpoint xử lý callback VNPay (nếu cần)
// router.get("/vnpay_return", (req, res) => {
//   let vnpData = req.query;
//   console.log("Dữ liệu callback nhận được:", vnpData);

//   const secureHash = vnpData.vnp_SecureHash;
//   delete vnpData.vnp_SecureHash;
//   delete vnpData.vnp_SecureHashType;

//   // Decode các giá trị của vnpData trước khi sắp xếp
//   for (let key in vnpData) {
//     vnpData[key] = decodeURIComponent(vnpData[key]);
//   }

//   vnpData = sortObject(vnpData);
//   // const signData = qs.stringify(vnpData, { encode: false });
//   const signData = new URLSearchParams(vnpData).toString();

//   const secretKey = process.env.VNP_HASH_SECRET;
//   const hmac = crypto.createHmac("sha512", secretKey);
//   const checkHash = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

//   console.log("Chuỗi ký callback:", signData);
//   console.log("Chữ ký kiểm tra callback:", checkHash);

//   //
//   console.log("🔹 Dữ liệu VNPay gửi về:", vnpData);
//   res.send("Check terminal log để debug!");
//   //

//   if (secureHash === checkHash) {
//     if (vnpData.vnp_ResponseCode === "00") {
//       res.send("Thanh toán thành công");
//     } else {
//       res.send("Thanh toán không thành công");
//     }
//   } else {
//     res.status(400).send("Chữ ký không hợp lệ");
//   }
// });

// router.get("/vnpay_return", (req, res) => {
//   let vnpData = req.query;
//   console.log("🔹 Dữ liệu VNPay gửi về:", vnpData);

//   // const secureHash = vnpData.vnp_SecureHash;
//   const secureHash = vnpData.vnp_SecureHash ? vnpData.vnp_SecureHash.trim() : "";

//   delete vnpData.vnp_SecureHash;
//   delete vnpData.vnp_SecureHashType;

//   for (let key in vnpData) {
//     vnpData[key] = decodeURIComponent(vnpData[key]);
//   }

//   vnpData = sortObject(vnpData);
//   // const signData = new URLSearchParams(vnpData).toString(); // Dùng URLSearchParams thay vì qs.stringify()
//   const signData = qs.stringify(vnpData, { encode: false });

//   console.log("🔹 Chuỗi ký callback:", signData);

//   // const secretKey = process.env.VNP_HASH_SECRET;
//   // // const hmac = crypto.createHmac("sha512", secretKey);
//   // const hmac = crypto.createHmac("sha256", secretKey);  // Nếu cần SHA256

//   // const checkHash = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

//   // console.log("🔹 Chữ ký VNPay gửi:", secureHash);
//   // console.log("🔹 Chữ ký kiểm tra callback:", checkHash);

//   // console.log("🔹 VNP_HASH_SECRET:", process.env.VNP_HASH_SECRET);

//   const secretKey = process.env.VNP_HASH_SECRET;

// // Thử lần lượt SHA512, SHA256, MD5
// const hashAlgorithms = ["sha512", "sha256", "md5"];

// hashAlgorithms.forEach((algo) => {
//   const hmac = crypto.createHmac(algo, secretKey);
//   const checkHash = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

//   console.log(`🔹 Chữ ký kiểm tra callback (${algo}):`, checkHash);
// });


//   if (secureHash === checkHash) {
//     if (vnpData.vnp_ResponseCode === "00") {
//       res.send("✅ Thanh toán thành công");
//     } else {
//       res.send("❌ Thanh toán không thành công");
//     }
//   } else {
//     res.status(400).send("🚨 Chữ ký không hợp lệ!");
//   }
// });


router.get("/vnpay_return", (req, res) => {
  let vnpData = req.query;
  console.log("🔹 Dữ liệu VNPay gửi về:", vnpData);

  const secureHash = vnpData.vnp_SecureHash ? vnpData.vnp_SecureHash.trim() : "";

  delete vnpData.vnp_SecureHash;
  delete vnpData.vnp_SecureHashType;

  for (let key in vnpData) {
    vnpData[key] = decodeURIComponent(vnpData[key]);
  }

  vnpData = sortObject(vnpData);
  const signData = new URLSearchParams(vnpData).toString(); // Chuyển object về query string
  console.log("🔹 Chuỗi ký callback:", signData);

  const secretKey = process.env.VNP_HASH_SECRET;

  // Thử với SHA512, SHA256, MD5
  const hashAlgorithms = ["sha512", "sha256", "md5"];
  let isValidSignature = false; // Cờ kiểm tra chữ ký hợp lệ

  hashAlgorithms.forEach((algo) => {
    const hmac = crypto.createHmac(algo, secretKey);
    const checkHash = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    console.log(`🔹 Chữ ký kiểm tra callback (${algo}):`, checkHash);

    // So sánh chữ ký của VNPay gửi về
    if (secureHash.toLowerCase() === checkHash.toLowerCase()) {
      isValidSignature = true;
    }
  });

  console.log("🔹 Chữ ký VNPay gửi:", secureHash);

  if (isValidSignature) {
    if (vnpData.vnp_ResponseCode === "00") {
      res.send("✅ Thanh toán thành công");
    } else {
      res.send("❌ Thanh toán không thành công");
    }
  } else {
    res.status(400).send("🚨 Chữ ký không hợp lệ!");
  }
});

router.get("/test", (req, res) => {
  res.send("✅ Payment API is working!");
});


module.exports = router;
