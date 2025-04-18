import { useDispatch, useSelector } from "react-redux";
import { addToCompare } from "../redux/actions/compareActions";
import "./css/styleCardProduct.css";

const CardProduct = ({ product }) => {
  const formattedPrice = product.price.toLocaleString();
  const dispatch = useDispatch();

  const compareList = useSelector((state) => state.compare.compareList);
  const isSelected = compareList.some(
    (p) => (p._id || p.id) === (product._id || product.id)
  );

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
              href="javascript:;"
              className="btn-cart-sp d-flex align-items-center justify-content-center"
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
