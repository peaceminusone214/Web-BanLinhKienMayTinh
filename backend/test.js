const crypto = require('crypto');
const qs = require('qs');

const signData = 'vnp_Amount=999000000&vnp_Command=pay&vnp_CreateDate=20250323155258&vnp_CurrCode=VND&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh toán đơn hàng 1742719978939&vnp_OrderType=billpayment&vnp_ReturnUrl=http://localhost:5000/payment/vnpay_return&vnp_TmnCode=YOVECNZU&vnp_TxnRef=1742719978939&vnp_Version=2.1.0';
const secretKey = 'CBYAUK2EK85R6U5I16WTO5JD60YYM5MT';

const hmac = crypto.createHmac('sha512', secretKey);
const hash = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

console.log('Calculated hash:', hash);
