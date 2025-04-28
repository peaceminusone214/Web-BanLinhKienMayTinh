import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProductList from "../../components/ProductList"; // Import ProductList
import ProductFilter from "../../components/CompCategory/ProductFilter";
import { getCategoryBySlug } from "../../Service/categoriesApi";
import { fetchProductsByCategory } from "../../Service/productApi";
import { useParams } from "react-router-dom";

function CompareProducts() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [comparisonResult, setComparisonResult] = useState([]);
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();

  // Lấy danh sách tất cả các sản phẩm
  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/product/get-products`,
        { withCredentials: true }
      );
      setProducts(response.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // Thêm/sửa sản phẩm trong danh sách so sánh
  const handleSelectProduct = (product) => {
    setSelectedProducts((prev) => {
      if (prev.some((item) => item._id === product._id)) {
        return prev.filter((item) => item._id !== product._id); // Nếu sản phẩm đã có trong danh sách thì bỏ chọn
      }
      return [...prev, product]; // Nếu chưa có thì thêm vào danh sách
    });
  };

  // Thực hiện so sánh và chuyển đến trang kết quả so sánh
  const handleCompare = async () => {
    if (selectedProducts.length < 2) {
      alert("Vui lòng chọn ít nhất 2 sản phẩm để so sánh!");
      return;
    }

    try {
      const productIds = selectedProducts.map((product) => product._id);
      const response = await axios.get(
        `${API_URL}/product/compare-products`,
        {
          params: { ids: productIds },
        }
      );

      setComparisonResult(response.data);
      navigate("/comparison-results", {
        state: { comparisonResult: response.data },
      }); // Dùng navigate để chuyển hướng
    } catch (err) {
      console.error("Error comparing products:", err);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const categoryData = await getCategoryBySlug(slug);
        setCategory(categoryData);

        if (categoryData && categoryData._id) {
          const productsList = await fetchProductsByCategory(categoryData._id);
          setProducts(productsList);
          setFilteredProducts(productsList); // set mặc định cho filtered
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchData();
  }, [slug]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFilterChange = useCallback((filteredData) => {
    console.log("Filtered Data received in CategoryPage:", filteredData);

    if (!filteredData) {
      console.warn("filteredData is null or undefined");
      return;
    }

    if (!Array.isArray(filteredData)) {
      console.warn("filteredData is not an array:", typeof filteredData);
      return;
    }

    filteredData.forEach((product, index) => {
      console.log(
        `rpoduct ${index + 1}: ${product.product_name || "(không có tên)"}`
      );
    });

    setFilteredProducts(filteredData);
  }, []);

  return (
    <div
      className="homepage-collection-swiper mx-auto"
      style={{ width: "1220px" }}
    >
      <ProductFilter onFilterChange={handleFilterChange} />
      <h2 className="mx-3 mb-2"> So sánh sản phẩm </h2>
      <ProductList
        products={filteredProducts}
        handleSelectProduct={handleSelectProduct}
        selectedProducts={selectedProducts}
      />

      <div
        className="d-flex justify-content-end mt-5"
        style={{ width: "200px", height: "40px" }}
      >
        <button
          className="btn btn-outline-primary"
          onClick={handleCompare}
          style={{ fontWeight: "600", width: "100%", height: "100%" }}
        >
          So Sánh
        </button>
      </div>
    </div>
  );
}

export default CompareProducts;
