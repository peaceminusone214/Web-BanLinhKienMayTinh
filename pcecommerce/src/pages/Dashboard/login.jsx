import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Để chuyển hướng người dùng

  const handleLogin = async (e) => {
    e.preventDefault(); // Ngừng hành vi mặc định của form

    try {
      // Gửi yêu cầu đăng nhập với credentials
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json(); // Lấy dữ liệu JSON từ response

      if (response.ok) {
        alert(data.message); // Hiển thị thông điệp thành công

        // **Lấy vai trò từ session thay vì token**
        const userResponse = await fetch(`${API_URL}/auth/session`, {
          credentials: "include",
        });

        const userData = await userResponse.json();

        if (userResponse.ok && userData.user) {
          const roles = userData.user.roles || [];

          // Kiểm tra các vai trò và điều hướng tương ứng
          if (roles.includes("admin")) {
            navigate("/admin"); // Chuyển hướng đến trang admin
          } else if (roles.includes("employee")) {
            navigate("/"); // Chuyển hướng đến trang employee hoặc dashboard
          } else {
            navigate("/"); // Trang mặc định nếu không có vai trò hợp lệ
          }
        } else {
          alert("Không thể lấy thông tin người dùng.");
        }
      } else {
        alert(data.message); // Hiển thị thông điệp lỗi từ server
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div>
      <section
        className="sherah-wc sherah-wc__full sherah-bg-cover"
        style={{
          backgroundImage:
            'url("/assets/interface-dashboard/img/credential-bg.svg")',
        }}
      >
        <div className="container-fluid p-0">
          <div className="row g-0">
            <div className="col-lg-6 col-md-6 col-12 sherah-wc-col-one">
              <div
                className="sherah-wc__inner"
                style={{
                  backgroundImage:
                    'url("/assets/interface-dashboard/img/welcome-bg.png")',
                }}
              >
                {/* Logo */}
                <div className="sherah-wc__logo">
                  <a>
                    <img
                      src="/assets/interface-dashboard/img/logo.png"
                      alt="#"
                    />
                  </a>
                </div>
                {/* Middle Image */}
                <div className="sherah-wc__middle">
                  <a>
                    <img
                      src="/assets/interface-dashboard/img/welcome-vector.png"
                      alt="#"
                    />
                  </a>
                </div>
                {/* Welcome Heading */}
                <h2 className="sherah-wc__title">
                  Welcome to Sherah eCommerce <br /> Admin Panel
                </h2>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 sherah-wc-col-two">
              <div className="sherah-wc__form">
                <div className="sherah-wc__form-inner">
                  <h3 className="sherah-wc__form-title sherah-wc__form-title__one">
                    Đăng nhập vào tài khoản của bạn{" "}
                    <span>
                      Vui lòng nhập tài khoản và mật khẩu
                    </span>
                  </h3>
                  {/* Sign in Form */}
                  <form
                    className="sherah-wc__form-main p-0"
                    onSubmit={handleLogin} // Gọi handleLogin khi submit form
                  >
                    <div className="form-group">
                      <label className="sherah-wc__form-label">Tài khoản</label>
                      <div className="form-group__input">
                        <input
                          className="sherah-wc__form-input"
                          type="text"
                          name="username"
                          placeholder="Nhập tài khoản của bạn"
                          required
                          value={username} // Liên kết với state
                          onChange={(e) => setUsername(e.target.value)} // Cập nhật username khi thay đổi
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="sherah-wc__form-label">Mật khẩu</label>
                      <div className="form-group__input">
                        <input
                          className="sherah-wc__form-input"
                          placeholder="●●●●●●"
                          id="password-field"
                          type="password"
                          name="password"
                          maxLength={20}
                          required
                          value={password} // Liên kết với state
                          onChange={(e) => setPassword(e.target.value)} // Cập nhật password khi thay đổi
                        />
                      </div>
                    </div>
                    <div className="form-group form-mg-top25">
                      <div className="sherah-wc__button sherah-wc__button--bottom">
                        <button className="ntfmax-wc__btn" type="submit">
                          Đăng nhập
                        </button>
                      </div>
                    </div>
                    <div className="form-group mg-top-20">
                      <div className="sherah-wc__bottom">
                        <p className="sherah-wc__text">
                          Bạn chưa có tài khoản?{" "}
                          <Link to ="/register">Đăng ký ngay</Link>
                        </p>
                      </div>
                    </div>
                  </form>
                  {/* End Sign in Form */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;
