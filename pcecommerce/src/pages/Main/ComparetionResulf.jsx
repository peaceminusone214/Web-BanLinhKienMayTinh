import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const CompareResult = () => {
  const compareList = useSelector((state) => state.compare.compareList);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  if (compareList.length === 0) {
    return <p className="text-center mt-5">Chưa có sản phẩm nào để so sánh.</p>;
  }

  const renderRow = (label, getValue) => (
    <tr>
      <th className="bg-light text-start">{label}</th>
      {compareList.map((product, index) => (
        <td key={index}>{getValue(product)}</td>
      ))}
    </tr>
  );

  return (
    <div
      className="homepage-collection-swiper mx-auto"
      style={{ width: "1220px" }}
    >
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Trang chủ</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            So sánh sản phẩm
          </li>
        </ol>
      </nav>
      <h3 className="mb-4">So sánh sản phẩm</h3>
      <div className="table-responsive">
        <table className="table table-bordered text-center align-middle">
          <thead className="table-primary">
            <tr>
              <th>Tiêu chí</th>
              {compareList.map((product, index) => (
                <th key={index}>{product.product_name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {renderRow("Ảnh", (p) => (
              <img
                src={p.image_url}
                alt={p.product_name}
                style={{ height: "80px" }}
              />
            ))}
            {renderRow("Giá bán", (p) => (
              <div>
                <p
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#d91605",
                    marginBottom: "12px",
                  }}
                >
                  {p.price.toLocaleString()} VNĐ
                </p>
                <button
                  style={{
                    backgroundColor: "#0072FF",
                    color: "white",
                    fontWeight: "600",
                    fontSize: "14px",
                    padding: "10px 18px",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "all 0.3s",
                  }}
                  onClick={() => navigate(`/product/${p._id}`)}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = "#d91605")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = "#0072FF")
                  }
                >
                  Mua ngay
                </button>
              </div>
            ))}

            {renderRow("Tình trạng", (p) => p.status)}
            {renderRow("Thương hiệu", (p) => p.brand)}
            {renderRow("Bảo hành", (p) => p.warranty || "Không có")}
            {renderRow("Số lượng kho", (p) => p.stock_quantity)}
            {renderRow("Mô tả", (p) => p.description)}
            {renderRow("Tình trạng sử dụng", (p) =>
              p.condition === "New" ? "Mới" : "Đã sử dụng"
            )}

            {renderRow("Thông số kỹ thuật", (p) =>
              p.specifications ? (
                <ul className="text-start">
                  {Object.entries(p.specifications).map(([key, val], idx) => (
                    <li key={idx}>
                      <strong>{key}:</strong> {val}
                    </li>
                  ))}
                </ul>
              ) : (
                "Không có"
              )
            )}

            {renderRow("Tương thích", (p) =>
              p.compatibility ? (
                <ul className="text-start">
                  {Object.entries(p.compatibility).map(([key, val], idx) => (
                    <li key={idx}>
                      <strong>{key}:</strong> {val}
                    </li>
                  ))}
                </ul>
              ) : (
                "Không có"
              )
            )}
            {renderRow("Khuyến mãi", (p) =>
              p.discount ? (
                <span className="badge bg-danger text-white fw-bold px-3 py-2">
                  {p.discount}
                </span>
              ) : (
                <span className="text-muted">Không có</span>
              )
            )}

            {renderRow("Đánh giá", (p) => {
              const rating = p.rating || 4.5;
              const stars =
                "★".repeat(Math.floor(rating)) +
                "☆".repeat(5 - Math.floor(rating));
              return (
                <div>
                  <div style={{ fontSize: "20px", color: "#ffc107" }}>
                    {stars}
                  </div>
                  <small className="text-muted">({rating}/5)</small>
                </div>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompareResult;
