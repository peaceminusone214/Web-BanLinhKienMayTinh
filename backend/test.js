const qs = require("qs");
const crypto = require("crypto");

const secretKey = "Z4DIO7EDLH6T45PSJMYYMVGWEFOD99LP";
const params = {
  vnp_Amount: "1000000",
  vnp_BankCode: "NCB",
  vnp_CreateDate: "20250326120000",
  vnp_ResponseCode: "00",
  vnp_TxnRef: "123456",
};

// Sắp xếp tham số theo thứ tự bảng chữ cái và tạo chuỗi ký
const sortedParams = {};
Object.keys(params)
  .sort()
  .forEach((key) => {
    sortedParams[key] = encodeURIComponent(params[key]).replace(/%20/g, "+");
  });
const signData = qs.stringify(sortedParams, { encode: false });
const hmac = crypto.createHmac("sha512", secretKey);
const secureHashCalculated = hmac
  .update(Buffer.from(signData, "utf-8"))
  .digest("hex");

console.log("Chuỗi ký:", signData);
console.log("Calculated secure hash:", secureHashCalculated);
