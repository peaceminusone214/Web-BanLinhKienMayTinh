import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchSearchResults } from "../redux/actions/searchAction";
import "../../src/components/css/styleSearchBar.css";

function SearchBar() {
  const [searchText, setSearchText] = useState("");
  const [cartCount, setCartCount] = useState(0);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const clearSearch = () => {
    setSearchText("");
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      await dispatch(fetchSearchResults(searchText));
      navigate("/search-results");
    }
  };

  return (
    <div>
      {/* searchBar */}
      <div className="container search-bar">
        <div className="box-header-top d-flex justify-content-between align-items-center">
          {/* Logo & Thanh tìm kiếm */}
          <div className="header-left-group d-flex align-items-center">
            <a
              href="/"
              className="header-left-logo d-flex justify-content-center"
              style={{ width: "250px" }}
            >
              <img
                src="/assets/interface-main/imgComp/logo_WTC.png"
                alt="Logo"
              />
            </a>

            {/* Thanh tìm kiếm */}
            <div className="header-search">
              <form onSubmit={handleSearchSubmit} className="search-bar">
                <input
                  type="text"
                  name="q"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="search-bar-input-2"
                  autoComplete="off"
                  value={searchText}
                  onChange={handleSearchChange}
                />
                {searchText && (
                  <i
                    className="fa fa-times-circle search-bar-remove"
                    onClick={clearSearch}
                  ></i>
                )}
                <button type="submit" className="search-bar-btn">
                  <i className="fa fa-search"></i>
                </button>
              </form>
            </div>
          </div>

          {/* Hotline, Cấu hình PC, Giỏ hàng */}
          <div className="header-right-group d-flex justify-content-between">
            <a
              href="tel:0912074444"
              className="build-pc d-flex align-items-center hover-primary"
            >
              <img
                src="/assets/interface-main/category/static-icon-phone-2022-2.png"
                className="header-right-group-icon"
                alt="Phone icon"
              />
              <span>
                Hotline mua hàng <br />
                <b>0912.345.678</b>
              </span>
            </a>

            {/* Cấu hình PC */}
            <a
              href="/buildpc"
              className="build-pc d-flex align-items-center hover-primary"
            >
              <i className="header-right-group-icon sprite sprite-icon-cauhinh"></i>
              <img
                src="/assets/interface-main/category/buildpc.png"
                className="header-right-group-icon"
                alt="Phone icon"
              />
              <span>
                Xây dựng <br />
                <b>Cấu hình PC</b>
              </span>
            </a>

            {/* Giỏ hàng */}
            <a
              href="/cart"
              className="cart-header d-flex align-items-center hover-primary"
            >
              <div className="box-cart-header" style={{ width: "30px" }}>
                <img
                  src="/assets/interface-main/category/static-icon-cart-2022.png"
                  className="header-right-group-icon"
                  alt="Cart icon"
                />
                {cartCount > 0 && (
                  <div
                    className="header-features-cart-amount amount-cart"
                    id="js-header-cart-amount"
                  >
                    {cartCount}
                  </div>
                )}
              </div>
              <span className="d-flex align-items-center">Giỏ hàng</span>

              {/* Tooltip giỏ hàng */}
              <div className="cart-ttip">
                <div className="cart-ttip-item-container loaded">
                  <h5 className="header-null-cart">
                    {cartCount === 0
                      ? "Có 0 sản phẩm trong giỏ hàng"
                      : `Có ${cartCount} sản phẩm trong giỏ hàng`}
                  </h5>
                </div>
                <div className="cart-ttip-price">
                  <p>Tổng cộng:</p>
                  <p>
                    <i>(Số lượng: {cartCount} sản phẩm)</i>
                  </p>
                  <p>0₫</p>
                </div>
                <div className="cart-ttip-price-button">
                  <a href="/cart" className="color-white">
                    THANH TOÁN NGAY
                  </a>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
