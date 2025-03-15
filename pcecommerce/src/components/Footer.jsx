import React from 'react';
import '../components/css/styleFooter.css'



function Footer() {
  return (
    <div>
      <footer className="footer">
        {/* Section 1: Dịch vụ hỗ trợ */}
        <div className="footer-services">
          <div className="service-item">
            <img src="/assets/interface-main/imgFooter/delivery.png" alt="Giao hàng" />
            <h3>GIAO HÀNG TOÀN QUỐC</h3>
            <p>Giao hàng trước, trả tiền sau COD</p>
          </div>
          <div className="service-item">
            <img src="/assets/interface-main/imgFooter/return.png" alt="Đổi trả" />
            <h3>ĐỔI TRẢ DỄ DÀNG</h3>
            <p>Đổi mới trong 15 ngày đầu</p>
          </div>
          <div className="service-item">
            <img src="/assets/interface-main/imgFooter/payment.png" alt="Thanh toán" />
            <h3>THANH TOÁN TIỆN LỢI</h3>
            <p>Tiền mặt, chuyển khoản, trả góp 0%</p>
          </div>
          <div className="service-item">
            <img src="/assets/interface-main/imgFooter/support.png" alt="Hỗ trợ" />
            <h3>HỖ TRỢ NHIỆT TÌNH</h3>
            <p>Tư vấn miễn phí 24/7</p>
          </div>
        </div>

        {/* Section 2: Đăng ký nhận tin khuyến mãi */}
        <div className="footer-newsletter">
          <h2>Nhận tin khuyến mãi</h2>
          <p>Vui lòng để lại Email để nhận thông tin khuyến mãi từ PC Parts Store</p>
          <div className="newsletter-input">
            <input type="email" placeholder="Nhập email đăng ký nhận tin khuyến mãi" />
            <button>➤</button>
          </div>
        </div>

        {/* Section 3: Thông tin và hỗ trợ */}
        <div className="footer-info">
          <div>
            <h3>THÔNG TIN CÔNG TY</h3>
            <ul>
              <li>Giới thiệu công ty</li>
              <li>Tin tức công nghệ</li>
              <li>Thông tin liên hệ</li>
              <li>Nội quy PC Parts Store</li>
            </ul>
          </div>
          <div>
            <h3>HỖ TRỢ KHÁCH HÀNG</h3>
            <ul>
              <li>Hướng dẫn mua hàng</li>
              <li>Chính sách trả góp</li>
              <li>Yêu cầu báo giá</li>
              <li>Xây dựng cấu hình</li>
            </ul>
          </div>
          <div>
            <h3>CHÍNH SÁCH CHUNG</h3>
            <ul>
              <li>Chính sách bảo hành</li>
              <li>Chính sách đổi trả</li>
              <li>Chính sách vận chuyển</li>
              <li>Chính sách bảo mật</li>
            </ul>
          </div>
          <div>
            <h3>THÔNG TIN KHÁC</h3>
            <p>Fan Page PC Parts Store</p>
            <p>📞 0987654321 (8:00 - 21:00)</p>
            <p>📧 oitroioilatroi@luadao.vip</p>
          </div>
        </div>

        {/* Section 4: Phương thức thanh toán */}
        <div className="footer-payment">
          <h3>PHƯƠNG THỨC THANH TOÁN</h3>
          <div className="payment-methods">
            <img src="/assets/interface-main/imgFooter/zalopay.png" alt="ZaloPay" />
            <img src="/assets/interface-main/imgFooter/alepay.png" alt="AlePay" />
            <img src="/assets/interface-main/imgFooter/momo.png" alt="MoMo" />
            <img src="/assets/interface-main/imgFooter/visa.png" alt="Visa" />
            <img src="/assets/interface-main/imgFooter/mastercard.png" alt="Mastercard" />
            <img src="/assets/interface-main/imgFooter/vnpay.png" alt="VNPay" />
            <img src="/assets/interface-main/imgFooter/atm.png" alt="ATM" />
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
