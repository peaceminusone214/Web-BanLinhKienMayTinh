import React from "react";

function Createaccount() {
  return (
    <div>
      <>
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
                    <a href="index.html">
                      <img src="img/logo.png" alt="#" />
                    </a>
                  </div>
                  {/* Middle Image */}
                  <div className="sherah-wc__middle">
                    <a href="index.html">
                      <img src="img/welcome-vector.png" alt="#" />
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
                      Login Your Account{" "}
                      <span>
                        Please enter your email and password to continue
                      </span>
                    </h3>
                    {/* Sign in Form */}
                    <form
                      className="sherah-wc__form-main p-0"
                      action="index.html"
                      method="post"
                    >
                      <div className="row">
                        <div className="col-lg-6 col-md-6 col-12">
                          <div className="form-group">
                            <label className="sherah-wc__form-label">
                              First Name *
                            </label>
                            <div className="form-group__input">
                              <input
                                className="sherah-wc__form-input"
                                type="text"
                                name="email"
                                placeholder="Tegforor"
                                required="required"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-12">
                          <div className="form-group">
                            <label className="sherah-wc__form-label">
                              Last Name *
                            </label>
                            <div className="form-group__input">
                              <input
                                className="sherah-wc__form-input"
                                type="text"
                                name="email"
                                placeholder="Tegforor"
                                required="required"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-group">
                            <label className="sherah-wc__form-label">
                              Email Address
                            </label>
                            <div className="form-group__input">
                              <input
                                className="sherah-wc__form-input"
                                type="email"
                                name="email"
                                placeholder="demo3243@gmail.com"
                                required="required"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          {/* Form Group */}
                          <div className="form-group">
                            <label className="sherah-wc__form-label">
                              Password
                            </label>
                            <div className="form-group__input">
                              <input
                                className="sherah-wc__form-input"
                                placeholder="●●●●●●"
                                id="password-field"
                                type="password"
                                name="password"
                                maxLength={8}
                                required="required"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          {/* Form Group */}
                          <div className="form-group">
                            <label className="sherah-wc__form-label">
                              Confirm Password
                            </label>
                            <div className="form-group__input">
                              <input
                                className="sherah-wc__form-input"
                                placeholder="●●●●●●"
                                id="password-field"
                                type="password"
                                name="password"
                                maxLength={8}
                                required="required"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-group mg-top-20">
                            <div className="sherah-wc__bottom">
                              <p className="sherah-wc__text">
                                Already have an account?{" "}
                                <a href="create-account.html">Log in</a>
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          {/* Form Group */}
                          <div className="form-group form-mg-top25">
                            <div className="sherah-wc__button sherah-wc__button--bottom">
                              <button className="ntfmax-wc__btn" type="submit">
                                SignUp
                              </button>
                              <div className="sherah-wc__inside--group">
                                <button
                                  className="ntfmax-wc__btn ntfmax-wc__btn-social "
                                  type="submit"
                                >
                                  <div className="ntfmax-wc__btn-icon">
                                    <i className="fa-brands fa-google" />
                                  </div>
                                  Sign In with Google
                                </button>
                                <button
                                  className="ntfmax-wc__btn ntfmax-wc__btn-social "
                                  type="submit"
                                >
                                  <div className="ntfmax-wc__btn-icon">
                                    <i className="fa-brands fa-twitter" />
                                  </div>
                                  Sign In with Google
                                </button>
                              </div>
                            </div>
                          </div>
                          {/* Form Group */}
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
        {/* sherah Scripts */}
      </>
    </div>
  );
}

export default Createaccount;
