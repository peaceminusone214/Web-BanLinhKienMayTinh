import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCompare } from "../redux/actions/compareActions";
import "./css/styleCardProduct.css";

const CardProduct = ({ product }) => {
  const [user, setUser] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL;
  const formattedPrice = product.price.toLocaleString();
  const dispatch = useDispatch();

  const compareList = useSelector((state) => state.compare.compareList);
  const isSelected = compareList.some(
    (p) => (p._id || p.id) === (product._id || product.id)
  );

  const fetchUserFromSession = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/session`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok)
        throw new Error("Không lấy được thông tin user từ session");
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error("Lỗi lấy user từ session:", error);
    }
  };

  useEffect(() => {
    fetchUserFromSession();
  }, []);

  const handleAddToCart = async (product) => {
    const productId = product._id || product.id;

    const alreadyMerged = localStorage.getItem("alreadyMerged") === "true";
    const cartKey = "cart";
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const existingIndex = cart.findIndex((item) => item.id === productId);

    if (existingIndex !== -1) {
      cart[existingIndex].quantity += 1;
      console.log("Tăng số lượng sản phẩm:", productId);
    } else {
      cart.push({ id: productId, quantity: 1 });
      console.log("Thêm sản phẩm mới vào giỏ:", productId);
    }

    localStorage.setItem(cartKey, JSON.stringify(cart));

    if (alreadyMerged && user?.userId) {
      try {
        await fetch(`${API_URL}/cart/sync`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            user_id: user.userId,
            cartItems: cart.map((item) => ({
              id: item.id,
              quantity: item.quantity,
              price: product.price || 0,
            })),
            note: "",
          }),
        });
        console.log("Đã đồng bộ cart server sau thêm sản phẩm.");
      } catch (error) {
        console.error("Lỗi đồng bộ cart khi thêm sản phẩm:", error);
      }
    }
  };

  const handleCompare = () => {
    if (!isSelected) {
      dispatch(addToCompare(product));
      console.log("Add product to compare:", product);
    }
  };

  return (
    <div className="swiper-slide min-width-0">
      <div className="product p-item" data-id={product.id} data-type="product">
        <a href={`/product/${product._id}`} className="p-img">
          <img src={product.image_url} alt={product.product_name} />
          <div className="p-sale-off ms-2">
            <p className="font-weight-500 text-uppercase">
              Tiết kiệm
              <span className="d-block text-12 font-weight-bold color-white">
                {Math.round(product.price * 0.1).toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </span>
            </p>
          </div>
        </a>
        <div className="p-content">
          <a href={`/product/${product._id}`}>
            <h3 className="p-name line-clamp-2">{product.product_name}</h3>
          </a>
          <p className="p-price-card font-weight-bold text-20">
            {formattedPrice} VNĐ
          </p>
          <span className="p-market-price">{product.oldPrice}</span>
          <span
            className="p-market-sale color-secondary"
            style={{
              marginLeft: "4px",
              fontSize: "13px",
              color: "blue",
            }}
          >
            {product.discount}
          </span>
          <div className="p-box d-flex align-items-center justify-content-between">
            <div className="wrapper">
              <p className="color-green">{product.status}</p>
              <button
                className="p-compare border-0 bg-transparent"
                onClick={handleCompare}
                disabled={isSelected}
                style={{
                  color: isSelected ? "#28a745" : "#007bff",
                  fontWeight: "500",
                }}
              >
                {isSelected ? "✔ Đã chọn" : "+ So sánh"}
              </button>
            </div>
            <a
              className="btn-cart-sp d-flex align-items-center justify-content-center"
              onClick={() => handleAddToCart(product)}
            >
              <i className="static-icon static-icon-cart"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardProduct;
