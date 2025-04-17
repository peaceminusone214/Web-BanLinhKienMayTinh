const moment = require("moment");
const crypto = require("crypto");
const qs = require("qs");

// Sắp xếp object theo alphabet
function sortObject(obj) {
  const sorted = {};
  Object.keys(obj)
    .sort()
    .forEach((key) => {
      sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
    });
  return sorted;
}

/**
 * Tạo URL thanh toán VNPay đúng chuẩn
 * @param {Object} params - Thông tin thanh toán: amount, orderId, ipAddr, language, bankCode
 * @returns {string} URL
 */
function generateVNPayUrl({
  amount,
  orderId,
  ipAddr,
  language = "vn",
  bankCode = "",
}) {
  const vnp_TmnCode = process.env.VNP_TMN_CODE;
  const vnp_HashSecret = process.env.VNP_HASH_SECRET;
  const vnp_Url = process.env.VNP_URL;
  const vnp_ReturnUrl = process.env.VNP_RETURN_URL;

  const createDate = moment().format("YYYYMMDDHHmmss");
  const locale = language || "vn";
  const currCode = "VND";

  let vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode,
    vnp_Locale: locale,
    vnp_CurrCode: currCode,
    vnp_TxnRef: orderId,
    vnp_OrderInfo: `Thanh toán đơn hàng #${orderId}`,
    vnp_OrderType: "other",
    vnp_Amount: Math.round(amount * 100),
    vnp_ReturnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  if (bankCode) {
    vnp_Params.vnp_BankCode = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);
  const signData = qs.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", vnp_HashSecret);
  const secureHash = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  vnp_Params.vnp_SecureHash = secureHash;

  return vnp_Url + "?" + qs.stringify(vnp_Params, { encode: false });
}

module.exports = {
  generateVNPayUrl,
};
