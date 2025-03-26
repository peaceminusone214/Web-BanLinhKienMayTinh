import { useState, useEffect } from "react";
import { fetchFilteredProducts } from "../../api/productApi";
import "../css/styleCompFilter.css";

const ProductFilter = ({ onFilterChange }) => {
    const [isCategoryOpen, setCategoryOpen] = useState(false);
    const [isBrandOpen, setBrandOpen] = useState(false);

    const [selectedPrice, setSelectedPrice] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedBrand, setSelectedBrand] = useState("");
    const [selectedSort, setSelectedSort] = useState("");

    const [activePrice, setActivePrice] = useState(null);
    const [activeCategory, setActiveCategory] = useState(null);
    const [activeBrand, setActiveBrand] = useState(null);
    const [activeSort, setActiveSort] = useState(null);

    // Gọi API mỗi khi bộ lọc thay đổi
    useEffect(() => {
        const fetchData = async () => {
            const filters = {
                price: selectedPrice,
                category: selectedCategory,
                brand: selectedBrand,
                sort: selectedSort,
            };
            console.log("Filters being sent to API:", filters);

            try {
                const response = await fetchFilteredProducts(filters);
                console.log("Data received from API:", response);

                if (typeof onFilterChange === "function" && Array.isArray(response)) {
                    onFilterChange(response);
                } else {
                    console.warn("Không thể gọi onFilterChange - Dữ liệu hoặc callback không hợp lệ", response);
                }

            } catch (error) {
                console.error("Lỗi khi lấy sản phẩm:", error);
            }
        };

        fetchData();
    }, [selectedPrice, selectedCategory, selectedBrand, selectedSort, onFilterChange]);


    const toggleCategory = () => {
        setCategoryOpen(!isCategoryOpen);
        if (isBrandOpen) setBrandOpen(false);
    };

    const toggleBrand = () => {
        setBrandOpen(!isBrandOpen);
        if (isCategoryOpen) setCategoryOpen(false);
    };

    const clearFilters = () => {
        setSelectedPrice("");
        setSelectedCategory("");
        setSelectedBrand("");
        setSelectedSort("");

        setActivePrice(null);
        setActiveCategory(null);
        setActiveBrand(null);
        setActiveSort(null);
    };

    return (
        <div className="box-container-filter">
            {/* Bộ lọc khoảng giá */}
            <div className="box-filter-list">
                <h4 className="box-filter-list-name">Chọn khoảng giá:</h4>
                <div className="wrapper d-flex flex-wrap flex-1">
                    {[
                        { label: "Dưới 1 triệu", value: "0-1000000" },
                        { label: "1 triệu - 5 triệu", value: "1000000-5000000" },
                        { label: "5 triệu - 10 triệu", value: "5000000-10000000" },
                        { label: "10 triệu - 20 triệu", value: "10000000-20000000" },
                        { label: "20 triệu - 40 triệu", value: "20000000-40000000" },
                        { label: "Trên 40 triệu", value: "40000000+" },
                    ].map((priceOption, index) => (
                        <span
                            key={index}
                            className={`item-filter d-block hover-none ${activePrice === priceOption.value ? "active" : ""
                                }`}
                            onClick={() => {
                                setSelectedPrice(priceOption.value);
                                setActivePrice(priceOption.value);
                            }}
                        >
                            {priceOption.label}
                        </span>
                    ))}
                </div>
            </div>

            {/* Bộ lọc theo danh mục và thương hiệu */}
            <div className="box-filter-list d-flex">
                <h4 className="box-filter-list-name">Chọn theo tiêu chí:</h4>
                <div className="wrapper d-flex flex-wrap flex-1">
                    {/* Danh mục */}
                    <div className="box-filter-attribute">
                        <div className="box-filter-title" onClick={toggleCategory}>
                            <span className="attr-name box-item-filter">
                                Danh mục
                                <i
                                    className={`fa ${isCategoryOpen ? "fa-chevron-down" : "fa-chevron-right"
                                        } ms-2`}
                                ></i>
                            </span>
                        </div>
                        {isCategoryOpen && (
                            <div className="fox-filter-items">
                                <div className="box-filter-show d-flex flex-column gap-2">
                                    {[
                                        { label: "CPU", value: "cpu" },
                                        { label: "Tản Nhiệt", value: "cooling" },
                                        { label: "Ryzen 3", value: "ryzen-3" },
                                        { label: "Ryzen 5", value: "ryzen-5" },
                                        { label: "Ryzen 7", value: "ryzen-7" },
                                        { label: "Ryzen 9", value: "ryzen-9" },
                                    ].map((category, index) => (
                                        <span
                                            key={index}
                                            className={`item-filter d-block hover-none ${activeCategory === category.value ? "active" : ""
                                                }`}
                                            onClick={() => {
                                                setSelectedCategory(category.value);
                                                setActiveCategory(category.value);
                                            }}
                                        >
                                            {category.label}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Thương hiệu */}
                    <div className="box-filter-attribute">
                        <div className="box-filter-title item-filter" onClick={toggleBrand}>
                            <p>
                                <span className="attr-name">
                                    Thương hiệu
                                    <i
                                        className={`fa ${isBrandOpen ? "fa-chevron-down" : "fa-chevron-right"
                                            } ms-2`}
                                    ></i>
                                </span>
                            </p>
                        </div>
                        {isBrandOpen && (
                            <div className="fox-filter-items">
                                <div className="box-filter-show d-flex flex-column gap-2">
                                    {[
                                        { label: "Intel", value: "Intel" },
                                        { label: "AMD", value: "AMD" },
                                    ].map((brand, index) => (
                                        <span
                                            key={index}
                                            className={`item-filter d-block hover-none js-attr-item ${activeBrand === brand.value ? "active" : ""
                                                }`}
                                            onClick={() => {
                                                setSelectedBrand(brand.value);
                                                setActiveBrand(brand.value);
                                            }}
                                        >
                                            {brand.label}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bộ lọc sắp xếp */}
            <div className="box-filter-list d-flex justify-content-between align-items-center">
                <div className="box-title-category-left d-flex align-items-center">
                    <h4 className="box-filter-list-name m-0">Sắp xếp theo:</h4>
                    <ul className="sort-bar-left d-flex gap-2" style={{ marginLeft: "50px" }}>
                        {[
                            { label: "Mới nhất", value: "new" },
                            { label: "Giá tăng dần", value: "price-asc" },
                            { label: "Giá giảm dần", value: "price-desc" },
                            { label: "Lượt xem", value: "view" },
                            { label: "Đánh giá", value: "rating" },
                            { label: "Tên A-Z", value: "name" },
                        ].map((sortOption, index) => (
                            <li
                                key={index}
                                className={`d-flex align-items-center hover-primary color-secondary ${activeSort === sortOption.value ? "active" : ""
                                    }`}
                                onClick={() => {
                                    setSelectedSort(sortOption.value);
                                    setActiveSort(sortOption.value);
                                }}
                            >
                                {sortOption.label}
                            </li>
                        ))}
                    </ul>
                </div>
                <span
                    className="btn-clear-filter"
                    style={{ color: "red", cursor: "pointer" }}
                    onClick={clearFilters}
                >
                    <b>Xóa bộ lọc</b>
                </span>
            </div>
        </div>
    );
};

export default ProductFilter;
