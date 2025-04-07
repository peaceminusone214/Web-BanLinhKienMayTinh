import { useSelector, useDispatch } from "react-redux";
import { removeFromCompare } from "../redux/actions/compareActions";
import { useNavigate} from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import "../components/css/styleCompareSection.css"
const CompareSection = () => {
    const compareList = useSelector((state) => state.compare.compareList);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [visible, setVisible] = useState(true);
    const prevLength = useRef(compareList.length);

    useEffect(() => {
        if (compareList.length > prevLength.current) {
            setVisible(true);
        }
        prevLength.current = compareList.length;
    }, [compareList]);

    if (compareList.length === 0 || !visible) return null;

    return (
        <section className="mt-5">
            <div className="global-compare-group" style={{ display: "block", maxWidth: "700px" }}>
                <div className="title-compare d-flex align-items-center justify-content-between p-2">
                    <p className="mb-0 text-white fw-bolder">SO SÁNH SẢN PHẨM</p>
                    <span
                        className="fa fa-times text-light"
                        style={{ cursor: "pointer" }}
                        onClick={() => setVisible(false)}
                    ></span>
                </div>

                <div className="pro-compare-holder p-2">
                    <div className="d-flex flex-wrap gap-3">
                        {compareList.map((product) => (
                            <div
                                className="position-relative text-center border bg-white rounded"
                                key={product._id || product.id}
                                style={{ width: "120px", padding: "5px" }}
                            >
                                <span
                                    className="fa fa-times text-danger position-absolute top-0 end-0 m-1"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => dispatch(removeFromCompare(product._id || product.id))}
                                ></span>
                                <img
                                    src={product.image_url}
                                    alt={product.product_name}
                                    style={{ width: "100%", height: "80px", objectFit: "contain" }}
                                />
                                <span className="d-block mt-2" style={{ fontSize: "12px" }}>
                                    {product.product_name}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="text-end mt-3">
                        <button className="btn btn-primary" onClick={() => navigate("/compare-results")}>
                            SO SÁNH ({compareList.length})
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CompareSection;
