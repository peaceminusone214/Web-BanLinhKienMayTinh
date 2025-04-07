import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './css/styleHeader.css'
import SearchBar from '../components/SearchBar.jsx';


const menuItems = [
  { id: 284, name: 'Tivi', icon: '/assets/interface-main/category/cat_icon_284.png' },
  
  {
    id: 2,
    name: 'Bộ PC',
    icon: '/assets/interface-main/category/cat_icon_2_1666948667.png',
    dropdown: {
      links: [
        'Bộ PC KCC cho thuê',
        'PC Máy bộ KCC I5 / R5',
        'Bộ PC KCC Powered by MSI',
        'PC Server KCC',
        'PC Máy bộ KCC I7 / R7',
        'Bộ PC KCC Powered by Gigabyte',
        'PC Máy bộ KCC I3 / R3',
        'PC Máy bộ KCC I9 / R9'
      ],
    }
  },

  { id: 5, name: 'MAIN', icon: 'assets/interface-main/category/cat_icon_5_1666946989.png' },

  {
    id: 6,
    name: 'CPU',
    icon: 'assets/interface-main/category/cat_icon_6_1666947154.png',
    dropdown: {
      links: [
        'Intel Core i9',
        'Intel Core i7',
        'Intel Core i5',
        'Intel Core i3',
        'AMD Ryzen 9',
        'AMD Ryzen 7',
        'AMD Ryzen 5',
        'AMD Ryzen 3'
      ],
    }
  },

  {
    id: 7,
    name: 'RAM',
    icon: '/assets/interface-main/category/cat_icon_7_1666947261.png',
    dropdown: {
      links: [
        'RAM DDR5',
        'RAM DDR4',
        'RAM Gaming RGB',
        'RAM Laptop',
        'RAM Server',
        'RAM ECC',
        'Combo RAM & Tản Nhiệt',
        'RAM Tốc độ cao'
      ],
    }
  },

  {
    id: 8,
    name: 'VGA',
    icon: '/assets/interface-main/category/cat_icon_8_1666947758.png',
    dropdown: {
      links: [
        'NVIDIA RTX 4090',
        'NVIDIA RTX 4080',
        'NVIDIA RTX 4070',
        'AMD Radeon RX 7900',
        'VGA Workstation',
        'VGA cho Game thủ',
        'VGA cho Designer',
        'VGA giá rẻ'
      ],
    }
  },

  { id: 9, name: 'Ổ cứng', icon: '/assets/interface-main/category/cat_icon_9_1666947423.png' },

  {
    id: 10,
    name: 'PSU',
    icon: '/assets/interface-main/category/cat_icon_10_1666948930.png',
    dropdown: {
      links: [
        'Nguồn 1000W+',
        'Nguồn 750W - 850W',
        'Nguồn Gaming RGB',
        'Nguồn có chứng chỉ 80 Plus Gold',
        'Nguồn Modular',
        'Nguồn cho Server',
        'Nguồn mini ITX',
        'Nguồn giá rẻ'
      ],
    }
  },

  {
    id: 11,
    name: 'Case',
    icon: '/assets/interface-main/category/cat_icon_11_1666948005.png',
    dropdown: {
      links: [
        'Case RGB Gaming',
        'Case Mini ITX',
        'Case Mid Tower',
        'Case Full Tower',
        'Case Silent',
        'Case mở rộng',
        'Case giá rẻ',
        'Case độc lạ'
      ],
    }
  },

  { id: 12, name: 'Màn hình', icon: '/assets/interface-main/category/cat_icon_12_1666948799.png' },

  {
    id: 13,
    name: 'Gaming Gear',
    icon: '/assets/interface-main/category/cat_icon_13_1666948138.png',
    dropdown: {
      links: [
        'Bàn phím cơ',
        'Chuột gaming',
        'Tai nghe gaming',
        'Lót chuột RGB',
        'Ghế gaming',
        'Bàn gaming',
        'Webcam',
        'Micro thu âm'
      ],
    }
  },

  { id: 14, name: 'Tản Nhiệt', icon: '/assets/interface-main/category/cat_icon_14_1666948072.png' }
];



function Header() {
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const handleMouseEnter = (id) => setActiveDropdown(id);
  const handleMouseLeave = () => setActiveDropdown(null);

  useEffect(() => {
    fetch(`${API_URL}/auth/session`, {
      credentials: "include", // Gửi cookie session
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
      await fetch(`${API_URL}/auth/logout`, { method: "POST", credentials: "include" });
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div>

      <section className="header-banner-top">
        <a href="/">
          <img
            src="/assets/interface-main/imgComp/bannerHeader.png" alt="#" />
        </a>
      </section>

      <section className="header-top">
        <div className="container">
          <div className="header-top-content d-flex position-relative justify-content-between align-items-center">
            <div className="item-left">
              <div className="item-group d-inline-block">
                <p href="/" className="title-group bg-linear cursor-pointer">
                  <i className="fa fa-share-alt" aria-hidden="true"></i> Hệ thống showroom
                </p>
              </div>

              <div className="item-group d-inline-block">
                <p href="/" className="title-group ml-0 bg-linear cursor-pointer">
                  <i className="" aria-hidden="true"></i> Bán hàng trực tuyến
                </p>
              </div>

              <a href="/" className="title-group title-group-hover">
                <i className="fa fa-users" aria-hidden="true"></i> Tuyển dụng
              </a>
              <a href="/" className="title-group title-group-hover">
                <i className="fa fa-envelope" aria-hidden="true"></i> Liên hệ
              </a>
              <a href="/about" className="title-group title-group-hover">
                <i className="fa fa-info-circle" aria-hidden="true"></i> Giới thiệu
              </a>
              <a href="/" className="title-group title-group-hover">
                <i className="fa fa-search" aria-hidden="true"></i> Tra cứu bảo hành
              </a>
              <a href="/News" className="title-group title-group-hover header-icon icon-2">
                <i className="fa fa-newspaper-o" aria-hidden="true"></i> Trang tin công nghệ
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
                  <a href="/login" className="title-group">Đăng nhập</a>
                  <span className="pl-chia">|</span>
                  <a href="/register" className="title-group">Đăng ký</a>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <div classname="clearfix"></div>


      {/* searchBar */}
      <SearchBar />

      <div className="header align-items-center justify-content-between">
        <div className="container">
          <div className="box-header-top d-flex justify-content-between align-items-center">
            <div className="menu-list">
              <ul className="header-nav-menu list-unstyled d-flex m-0">
                {menuItems.map(item => (
                  <li
                    key={item.id}
                    className={`header-nav-item position-relative ${item.dropdown ? 'dropdown' : ''}`}
                    onMouseEnter={() => handleMouseEnter(item.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <a className="header-nav-link d-flex align-items-center">
                      <img src={item.icon} className="lazy me-2" alt={item.name} />
                      {item.name}
                    </a>

                    {item.dropdown && activeDropdown === item.id && (
                      <div className="dropdown-menu">
                        <div className="dropdown-content">
                          {item.dropdown.links.map((link, idx) => (
                            <a key={idx} className="dropdown-item">{link}</a>
                          ))}
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default Header




