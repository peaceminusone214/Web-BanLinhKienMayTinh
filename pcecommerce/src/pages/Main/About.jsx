import React from "react";
import "./MainStyles/styleAbout.css";

function About() {
  return (
    <div>
      {/* Breadcrumb */}
      <div className="breadcrumb-container1">
        <div className="breadcrumb2">
          <a href="/">Trang chủ</a>
          <span>/</span>
          <span className="current">Giới thiệu</span>
        </div>
      </div>

      <div className="about-container">
        <h1 className="about-title">GIỚI THIỆU CHUNG</h1>

        <div className="about-intro-box">
          <div className="about-intro-text">
            <p>
              Công ty TNHH Máy tính Nguyễn Công là đơn vị tiên phong trong việc
              cung cấp các giải pháp công nghệ thông tin, linh kiện máy tính và
              thiết bị gaming gear. Trải qua nhiều năm phát triển, chúng tôi
              luôn đặt khách hàng làm trung tâm và không ngừng nỗ lực để mang
              đến những sản phẩm, dịch vụ chất lượng.
            </p>
            <ul>
              <li>Đội ngũ nhân viên nhiệt tình, chuyên nghiệp</li>
              <li>Hệ thống sản phẩm đa dạng, giá thành cạnh tranh</li>
              <li>Chế độ hậu mãi, bảo hành uy tín</li>
            </ul>
            <p>
              Với sứ mệnh “Khách hàng là số 1”, chúng tôi cam kết tiếp tục phát
              triển và đổi mới để đáp ứng nhu cầu ngày càng cao của thị trường
              công nghệ.
            </p>
          </div>
          <div className="about-intro-image">
            <img
              src="/assets/icons/about-illustration.png"
              alt="HAHAHA illustration"
            />
          </div>
        </div>

        {/* KHUNG GIÁ TRỊ CỐT LÕI */}
        <div className="core-values-box">
          <h2 className="about-subtitle">GIÁ TRỊ CỐT LÕI</h2>
          <div className="core-values">
            <div className="core-value-item">
              <img src="/assets/icons/value1.png" alt="icon1" />
              <span>Khách hàng là số 1</span>
            </div>
            <div className="core-value-item">
              <img src="/assets/icons/value2.png" alt="icon2" />
              <span>Đoàn kết</span>
            </div>
            <div className="core-value-item">
              <img src="/assets/icons/value3.png" alt="icon3" />
              <span>Trung thực liêm chính</span>
            </div>
            <div className="core-value-item">
              <img src="/assets/icons/value4.png" alt="icon4" />
              <span>Sáng tạo</span>
            </div>
            <div className="core-value-item">
              <img src="/assets/icons/value5.png" alt="icon5" />
              <span>Luôn học tập</span>
            </div>
            <div className="core-value-item">
              <img src="/assets/icons/value6.png" alt="icon6" />
              <span>Kết quả</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
