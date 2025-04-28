const express = require("express");
const crypto = require("crypto");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();

router.post("/create", async (req, res) => {
  const { amount, orderInfo } = req.body;
  const requestId = Date.now().toString();
  const orderId = Date.now().toString();

  const rawSignature = `accessKey=${process.env.MOMO_ACCESS_KEY}&amount=${amount}&extraData=&ipnUrl=${process.env.MOMO_IPN_URL}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${process.env.MOMO_PARTNER_CODE}&redirectUrl=${process.env.MOMO_REDIRECT_URL}&requestId=${requestId}&requestType=captureWallet`;

  const signature = crypto
    .createHmac("sha256", process.env.MOMO_SECRET_KEY)
    .update(rawSignature)
    .digest("hex");

  const body = {
    partnerCode: process.env.MOMO_PARTNER_CODE,
    accessKey: process.env.MOMO_ACCESS_KEY,
    requestId,
    amount,
    orderId,
    orderInfo,
    redirectUrl: process.env.MOMO_REDIRECT_URL,
    ipnUrl: process.env.MOMO_IPN_URL,
    extraData: "",
    requestType: "captureWallet",
    signature,
    lang: "vi",
  };

  try {
    const momoRes = await axios.post(process.env.MOMO_ENDPOINT, body);
    return res.json({ payUrl: momoRes.data.payUrl });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Tạo thanh toán thất bại" });
  }
});

module.exports = router;
