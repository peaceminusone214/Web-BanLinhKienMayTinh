import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate

function Createaccount() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); // Tạo biến navigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra nếu mật khẩu và xác nhận mật khẩu khớp nhau
    if (password !== confirmPassword) {
      setErrorMessage("Mật khẩu không khớp.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Hiển thị thông báo thành công và quay lại trang chủ
        alert(data.message); // Hoặc có thể hiển thị thông báo thành công
        navigate("/"); // Điều hướng về trang chủ
      } else {
        // Hiển thị lỗi nếu có
        setErrorMessage(data.message || "Đã có lỗi xảy ra.");
      }
    } catch (error) {
      setErrorMessage("Lỗi máy chủ. Vui lòng thử lại sau.");
    }
  };

  return (
    <div>
      <section
        className="sherah-wc sherah-wc__full sherah-wc-singup sherah-bg-cover"
        style={{ backgroundImage: 'url("img/credential-bg.svg")' }}
      >
        <div className="container-fluid p-0">
          <div className="row g-0">
            <div className="col-lg-6 col-md-6 col-12 sherah-wc-col-one">
              <div
                className="sherah-wc__inner"
                style={{ backgroundImage: 'url("img/welcome-bg.png")' }}
              >
                {/* Logo */}
                <div className="sherah-wc__logo">
                  <a>
                    <img
                      src="/assets/interface-main/imgComp/logo_WTC.png"
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
                    Register Your Account{" "}
                    <span>
                      Please enter your username and password to continue
                    </span>
                  </h3>
                  {/* Sign in Form */}
                  <form
                    className="sherah-wc__form-main p-0"
                    onSubmit={handleSubmit}
                  >
                    {errorMessage && (
                      <div className="error-message">{errorMessage}</div>
                    )}

                    {/* Username Field */}
                    <div className="col-12">
                      <div className="form-group">
                        <label className="sherah-wc__form-label">
                          Username
                        </label>
                        <div className="form-group__input">
                          <input
                            className="sherah-wc__form-input"
                            type="text"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="col-12">
                      <div className="form-group">
                        <label className="sherah-wc__form-label">
                          Password
                        </label>
                        <div className="form-group__input">
                          <input
                            className="sherah-wc__form-input"
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="●●●●●●"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="col-12">
                      <div className="form-group">
                        <label className="sherah-wc__form-label">
                          Confirm Password
                        </label>
                        <div className="form-group__input">
                          <input
                            className="sherah-wc__form-input"
                            type="password"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="●●●●●●"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group mg-top-20">
                        <div className="sherah-wc__bottom">
                          <p className="sherah-wc__text">
                            Already have an account?{" "}
                            <Link to="/login">Log in</Link>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="col-12">
                      <div className="form-group form-mg-top25">
                        <div className="sherah-wc__button sherah-wc__button--bottom">
                          <button className="ntfmax-wc__btn" type="submit">
                            SignUp
                          </button>
                        </div>
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

export default Createaccount;
