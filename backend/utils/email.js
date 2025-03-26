const nodemailer = require("nodemailer");
const path = require("path");
const hbs = require("nodemailer-express-handlebars");
require("dotenv").config();

// Cấu hình email server
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

// Cấu hình Handlebars cho Nodemailer
transporter.use(
  "compile",
  hbs({
    viewEngine: {
      extname: ".hbs",
      partialsDir: path.join(__dirname, "../emailTemplates"),
      defaultLayout: false,
    },
    viewPath: path.join(__dirname, "../emailTemplates"),
    extName: ".hbs",
  })
);

// Hàm gửi email xác nhận đơn hàng
const sendOrderEmail = async (orderData) => {
  const mailOptions = {
    from: `"PC Shop" <your-email@gmail.com>`,
    to: orderData.email,
    subject: "Xác nhận đơn hàng từ PC Shop",
    template: "orderConfirmation",
    context: {
      fullName: orderData.fullName,
      orderId: orderData.orderId,
      totalAmount: orderData.totalAmount.toLocaleString(),
      shippingAddress: orderData.shippingAddress,
      products: orderData.products,
    },
  };

  await transporter.sendMail(mailOptions);
  console.log("✅ Email đã gửi thành công!");
};

module.exports = sendOrderEmail;
