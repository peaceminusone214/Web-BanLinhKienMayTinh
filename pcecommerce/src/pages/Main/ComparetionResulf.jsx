import React from "react";
import { useLocation } from "react-router-dom";

function ComparisonResults() {
    window.scrollTo(0, 0);
    const location = useLocation();
    const comparisonResult = location.state?.comparisonResult || [];

    return (
        <div className="homepage-collection-swiper mx-auto mt-5" style={{ width: "1220px" }}>
            <h2>Kết quả so sánh</h2>

            <table className="table table-bordered table-striped mt-2">
                <thead>
                    <tr>
                        <th scope="col">Sản phẩm</th>
                        <th scope="col">Giá</th>
                        <th scope="col">Mô tả</th>
                        <th scope="col">Thương hiệu</th>
                        <th scope="col">Bảo hành</th>
                        <th scope="col">Cổng kết nối</th>
                        <th scope="col">Loại bộ nhớ</th>
                        <th scope="col">Core Clock</th>
                        <th scope="col">Boost Clock</th>
                    </tr>
                </thead>
                <tbody>
                    {comparisonResult.map((product) => (
                        <tr key={product._id}>
                            <td>
                                <img
                                    src={product.image_url}
                                    alt={product.product_name}
                                    className="img-fluid"
                                    style={{ width: "100px", objectFit: "cover" }}
                                />
                                <br />
                                <strong>{product.product_name}</strong>
                            </td>
                            <td>{product.price} VNĐ</td>
                            <td>{product.description}</td>
                            <td>{product.brand}</td>
                            <td>{product.specifications?.warranty}</td>
                            <td>{product.compatibility?.slot}</td>
                            <td>{product.specifications?.memory}</td>
                            <td>{product.specifications?.core_clock}</td>
                            <td>{product.specifications?.boost_clock}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ComparisonResults;
