import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/styleHeader.css";
import SearchBar from "../components/SearchBar.jsx";

function Header() {
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/auth/session`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Chưa đăng nhập");
        return res.json();
      })
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div>
      <section className="header-banner-top">
        <a href="/">
          <img src="" alt="#" />
        </a>
      </section>

      <section className="header-top">
        <div className="container">
          <div className="header-top-content d-flex position-relative justify-content-between align-items-center">
            <div className="item-left">
              <div className="item-group d-inline-block">
                <p href="/" className="title-group bg-linear cursor-pointer">
                  <i className="fa fa-share-alt" aria-hidden="true"></i> Hệ
                  thống showroom
                </p>
              </div>

              <div className="item-group d-inline-block">
                <p
                  href="/"
                  className="title-group ml-0 bg-linear cursor-pointer"
                >
                  <i className="" aria-hidden="true"></i> Bán hàng trực tuyến
                </p>
              </div>

              <a href="/" className="title-group title-group-hover">
                <i className="fa fa-users" aria-hidden="true"></i> Tuyển dụng
              </a>
              <a href="/contact" className="title-group title-group-hover">
                <i className="fa fa-envelope" aria-hidden="true"></i> Liên hệ
              </a>
              <a href="/about" className="title-group title-group-hover">
                <i className="fa fa-info-circle" aria-hidden="true"></i> Giới
                thiệu
              </a>
              <a href="/" className="title-group title-group-hover">
                <i className="fa fa-search" aria-hidden="true"></i> Tra cứu bảo
                hành
              </a>
              <a
                href="/News"
                className="title-group title-group-hover header-icon icon-2"
              >
                <i className="fa fa-newspaper-o" aria-hidden="true"></i> Trang
                tin công nghệ
              </a>
            </div>
            <div className="item-right d-flex align-items-center">
              <i className="fa fa-user-circle" aria-hidden="true"></i>
              {user ? (
                <>
                  <span className="title-group">Xin chào, {user.username}</span>
                  <span className="pl-chia">|</span>
                  <a href="/" className="title-group" onClick={handleLogout}>
                    Đăng xuất
                  </a>
                </>
              ) : (
                <>
                  <a href="/login" className="title-group">
                    Đăng nhập
                  </a>
                  <span className="pl-chia">|</span>
                  <a href="/register" className="title-group">
                    Đăng ký
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <div classname="clearfix"></div>

      {/* searchBar */}
      <SearchBar />

      <div class="header align-items-center justify-content-between">
        <div class="container">
          <div class="box-header-top d-flex justify-content-between align-items-center">
            <div class="menu-list">
              <ul class="header-nav-menu">
                <li class="header-nav-item" data-id="284">
                  <a href="/" class="header-nav-link">
                    <img
                      src="/assets/interface-main/category/cat_icon_284.png"
                      class="lazy"
                      alt="Tivi"
                    />
                    Tivi
                  </a>
                </li>
                {/* <li className="header-nav-item dropdown" data-id="2">
                  <a href="index.html" className="header-nav-link">
                    <img src="/assets/interface-main/category/cat_icon_2_1666948667.png" className="lazy" alt="Bộ PC" />
                    Bộ PC
                  </a>
                  <div className="dropdown-menu">
                    <div className="dropdown-content">
                      <a href="#">Bộ PC KCC cho thuê</a>
                      <a href="#">PC Máy bộ KCC I5 / R5</a>
                      <a href="#">Bộ PC KCC Powered by MSI</a>
                      <a href="#">PC Server KCC</a>
                      <a href="#">PC Máy bộ KCC I7 / R7</a>
                      <a href="#">Bộ PC KCC Powered by Gigabyte</a>
                      <a href="#">PC Máy bộ KCC I3 / R3</a>
                      <a href="#">PC Máy bộ KCC I9 / R9</a>
                    </div>
                    <div className="dropdown-image">
                      <img src="/assets/interface-main/images/pc110.jpg" alt="Icon Image" />
                    </div>
                  </div>
                </li>




                <li class="header-nav-item" data-id="1">
                  <a href="https://kccshop.vn/laptop/" class="header-nav-link">
                    <img src="/assets/interface-main/category/cat_icon_1_1666948464.png" class="lazy" alt="Laptop" />
                    Laptop
                  </a>
                </li> */}

                <li class="header-nav-item" data-id="5">
                  <a href="/category/main" class="header-nav-link">
                    <img
                      src="assets/interface-main/category/cat_icon_5_1666946989.png"
                      class="lazy"
                      alt="MAIN"
                    />
                    MAIN
                  </a>
                </li>

                <li class="header-nav-item" data-id="6">
                  <a href="/category/cpu" class="header-nav-link">
                    <img
                      src="assets/interface-main/category/cat_icon_6_1666947154.png"
                      class="lazy"
                      alt="CPU"
                    />
                    CPU
                  </a>
                </li>

                <li class="header-nav-item" data-id="7">
                  <a href="/category/ram" class="header-nav-link">
                    <img
                      src="/assets/interface-main/category/cat_icon_7_1666947261.png"
                      class="lazy"
                      alt="RAM"
                    />
                    RAM
                  </a>
                </li>

                <li class="header-nav-item" data-id="8">
                  <a href="/category/vga" class="header-nav-link">
                    <img
                      src="/assets/interface-main/category/cat_icon_8_1666947758.png"
                      class="lazy"
                      alt="VGA"
                    />
                    VGA
                  </a>
                </li>

                <li class="header-nav-item" data-id="9">
                  <a href="/categories/hdd,ssd" class="header-nav-link">
                    <img
                      src="/assets/interface-main/category/cat_icon_9_1666947423.png"
                      class="lazy"
                      alt="Ổ cứng"
                    />
                    Ổ cứng
                  </a>
                </li>

                <li class="header-nav-item" data-id="10">
                  <a href="/category/psu" class="header-nav-link">
                    <img
                      src="/assets/interface-main/category/cat_icon_10_1666948930.png"
                      class="lazy"
                      alt="PSU"
                    />
                    PSU
                  </a>
                </li>

                <li class="header-nav-item" data-id="11">
                  <a href="/category/case" class="header-nav-link">
                    <img
                      src="/assets/interface-main/category/cat_icon_11_1666948005.png"
                      class="lazy"
                      alt="Case"
                    />
                    Case
                  </a>
                </li>

                <li class="header-nav-item" data-id="12">
                  <a href="/category/monitor" class="header-nav-link">
                    <img
                      src="/assets/interface-main/category/cat_icon_12_1666948799.png"
                      class="lazy"
                      alt="Màn hình"
                    />
                    Màn hình
                  </a>
                </li>

                <li class="header-nav-item" data-id="13">
                  <a
                    href="/categories/headphones,keyboard,mouse,gamingchair"
                    class="header-nav-link"
                  >
                    <img
                      src="/assets/interface-main/category/cat_icon_13_1666948138.png"
                      class="lazy"
                      alt="Gaming Gear"
                    />
                    Gaming Gear
                  </a>
                </li>

                <li class="header-nav-item" data-id="14">
                  <a
                    href="/categories/tannhietkhi,tanaio,fanled"
                    class="header-nav-link"
                  >
                    <img
                      src="/assets/interface-main/category/cat_icon_14_1666948072.png"
                      class="lazy"
                      alt="Tản Nhiệt"
                    />
                    Tản Nhiệt
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
