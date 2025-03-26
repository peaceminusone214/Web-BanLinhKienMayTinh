import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProductList from "../../components/ProductList"; // Import ProductList
import ProductFilter from "../../components/CompCategory/ProductFilter";
import { getCategoryBySlug } from "../../api/categoriesApi";
import { fetchProductsByCategory } from "../../api/productApi";
import { useParams } from "react-router-dom";

function CompareProducts() {
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [comparisonResult, setComparisonResult] = useState([]);
    const { slug } = useParams();
    const [category, setCategory] = useState(null);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const navigate = useNavigate();

    // Fetch products by category slug and set category
    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchData = async () => {
            try {
                const categoryData = await getCategoryBySlug(slug);
                setCategory(categoryData);

                if (categoryData && categoryData._id) {
                    const productsList = await fetchProductsByCategory(categoryData._id);
                    setProducts(productsList);
                    setFilteredProducts(productsList); // set default filtered products
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            }
        };

        fetchData();
    }, [slug]);

    // Handle adding/removing products to comparison
    const handleSelectProduct = (product) => {
        setSelectedProducts((prev) => {
            if (prev.some((item) => item._id === product._id)) {
                return prev.filter((item) => item._id !== product._id); // Remove if already selected
            }
            return [...prev, product]; // Add if not already selected
        });
    };

    // Perform comparison and navigate to results page
    const handleCompare = async () => {
        if (selectedProducts.length < 2) {
            alert("Vui lòng chọn ít nhất 2 sản phẩm để so sánh!");
            return;
        }

        try {
            const productIds = selectedProducts.map((product) => product._id);
            const response = await axios.get("http://localhost:5000/api/product/compare-products", {
                params: { ids: productIds },
            });

            setComparisonResult(response.data);
            navigate("/comparison-results", { state: { comparisonResult: response.data } });
        } catch (err) {
            console.error("Error comparing products:", err);
        }
    };

    // Handle filtering products
    const handleFilterChange = useCallback((filteredData) => {
        setFilteredProducts(filteredData);
    }, []);

    return (
        <div className="homepage-collection-swiper mx-auto" style={{ width: "1220px" }}>
            <ProductFilter onFilterChange={handleFilterChange} />
            <h2 className="mx-3 mb-2">So sánh sản phẩm</h2>
            <ProductList
                products={filteredProducts}
                handleSelectProduct={handleSelectProduct}
                selectedProducts={selectedProducts}
            />

            <div className="d-flex justify-content-end mt-5" style={{ width: '200px', height: '40px' }}>
                <button
                    className="btn btn-outline-primary"
                    onClick={handleCompare}
                    style={{ fontWeight: '600', width: '100%', height: '100%' }}
                >
                    So Sánh
                </button>
            </div>
        </div>
    );
}

export default CompareProducts;
