import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import ProductList from '../../components/ProductList';
import { getCategoryBySlug } from "../../api/categoriesApi";
import ProductFilter from '../../components/CompCategory/ProductFilter';

const SearchResultsPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const { state } = useLocation();
  const searchResults = state?.searchResults || [];

  // Fetch dữ liệu danh mục
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const categoryData = await getCategoryBySlug(slug);
        setCategory(categoryData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };
    fetchData();
  }, [slug]);

  const handleSelectProduct = (product) => {
    setSelectedProducts((prev) => {
      if (prev.some((item) => item._id === product._id)) {
        return prev.filter((item) => item._id !== product._id);
      }
      return [...prev, product];
    });
  };

  const handleFilterChange = (filteredData) => {};

  return (
    <div className="homepage-collection-swiper mx-auto" style={{ width: "1220px" }}>
      <ProductFilter onFilterChange={handleFilterChange} />

      <h2 className='ms-3'>Kết quả tìm kiếm</h2>

      {searchResults.length > 0 ? (
        <>
          <p className="ms-3">Tìm thấy {searchResults.length} sản phẩm</p>
          <ProductList
            products={searchResults}
            handleSelectProduct={handleSelectProduct}
            selectedProducts={selectedProducts}
          />
        </>
      ) : (
        <p>Không tìm thấy sản phẩm nào.</p>
      )}
    </div>
  );
};

export default SearchResultsPage;
