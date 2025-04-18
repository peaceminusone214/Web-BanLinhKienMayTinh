// import React, { useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useParams, useLocation } from 'react-router-dom';
// import { setSearchResults } from '../../redux/actions/filterActions';
// import { fetchFilteredProducts } from '../../Service/productApi';
// import ProductList from '../../components/ProductList';
// import CompFilter from '../../components/CompFilter';

import { useSelector } from "react-redux";
import ProductList from "../../components/ProductList";

const SearchResultsPage = () => {
  // const { slug } = useParams();
  // const dispatch = useDispatch();
  // const filter = useSelector(state => state.filter);
  // const searchResults = useSelector(state => state.filter.searchResults);  // Lấy kết quả tìm kiếm từ Redux

  // const { state } = useLocation();

  // Nếu không có kết quả tìm kiếm từ `state`, ta sẽ lấy lại kết quả từ API
  // useEffect(() => {
  //   window.scrollTo(0, 0);

  //   const fetchData = async () => {
  //     try {
  //       const response = await fetchFilteredProducts(filter);
  //       dispatch(setSearchResults(response.data));  // Lưu kết quả vào Redux
  //     } catch (error) {
  //       console.error("Lỗi khi lấy sản phẩm:", error);
  //     }
  //   };

  //   if (!searchResults.length && state?.searchResults) {
  //     // Nếu không có searchResults từ Redux mà có searchResults từ location state, ta cập nhật Redux
  //     dispatch(setSearchResults(state.searchResults));
  //   } else {
  //     fetchData();
  //   }
  // }, [dispatch, filter, searchResults, state]);

  const { results, keyword } = useSelector((state) => state.search);

  return (
    <div
      className="search-results-page container"
      style={{ maxWidth: "1220px", margin: "0 auto", padding: "20px 15px" }}
    >
      {/* Breadcrumb / điều hướng */}
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="/">Trang chủ</a>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Kết quả tìm kiếm
          </li>
        </ol>
      </nav>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Kết quả tìm kiếm</h2>
        {results.length > 0 && (
          <span className="text-muted">
            Tìm thấy <strong>{results.length}</strong> sản phẩm cho từ khóa:{" "}
            <strong className="text-primary">"{keyword}"</strong>
          </span>
        )}
      </div>

      {results.length > 0 ? (
        <div className="product-results">
          <ProductList products={results} />
        </div>
      ) : (
        <div className="alert alert-warning">
          Không tìm thấy sản phẩm nào cho từ khóa: <strong>{keyword}</strong>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
