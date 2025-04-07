import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFilteredProducts } from "../Service/productApi";
import { setFilters, clearFilters } from "../redux/actions/filterActions";
import './css/styleCompFilter.css'

const CompFilter = ({ onFilterChange }) => {
    const dispatch = useDispatch();
    const filter = useSelector(state => state.filter);
    const [isCategoryOpen, setCategoryOpen] = useState(false);
    const [isBrandOpen, setBrandOpen] = useState(false);
  

    const handleFilterChange = async (newFilters) => {
        const updatedFilters = { ...filter, ...newFilters };
        dispatch(setFilters(updatedFilters));

        try {
            const response = await fetchFilteredProducts(updatedFilters);
            onFilterChange(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy sản phẩm:", error);
        }
    };

    const resetFilters = () => {
        dispatch(clearFilters());
        handleFilterChange({ price: '', category: '', brand: '', sort: '' });
    };

    const toggleCategory = () => {
      setCategoryOpen(!isCategoryOpen);
      if (isBrandOpen) setBrandOpen(false);
    };
  
    const toggleBrand = () => {
      setBrandOpen(!isBrandOpen);
      if (isCategoryOpen) setCategoryOpen(false);
    };
    console.log('test', filter);

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
            { label: "Trên 40 triệu", value: "40000000+" }
          ].map((priceOption, index) => (
            <span
              key={index}
              className={`item-filter d-block hover-none ${filter.price === priceOption.value ? 'active' : ''}`}
              onClick={() => handleFilterChange({ price: priceOption.value })}

            >
              {priceOption.label}
            </span>
          ))}
        </div>
      </div>

      {/* Bộ lọc theo danh mục */}
      <div className="box-filter-list d-flex">
        <h4 className="box-filter-list-name">Chọn theo tiêu chí:</h4>
        <div className="wrapper d-flex flex-wrap flex-1">
          <div className="box-filter-attribute">
            <div className="box-filter-title" onClick={toggleCategory}>
              <span className="attr-name box-item-filter">
                Danh mục
                <i className={`fa ${isCategoryOpen ? 'fa-chevron-down' : 'fa-chevron-right'} ms-2`}></i>
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
                      className={`item-filter d-block hover-none ${filter.category === category.value ? 'active' : ''}`}
                      onClick={() => handleFilterChange({ category: category.value })}

                    >
                      {category.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bộ lọc theo thương hiệu */}
          <div className="box-filter-attribute">
            <div className="box-filter-title item-filter" onClick={toggleBrand}>
              <p>
                <span className="attr-name">
                  Thương hiệu
                  <i className={`fa ${isCategoryOpen ? 'fa-chevron-down' : 'fa-chevron-right'} ms-2`}></i>
                </span>
              </p>
            </div>

            {/* thương hiệu */}
            {isBrandOpen && (
              <div className="fox-filter-items">
                <div className="box-filter-show d-flex flex-column gap-2">
                  {[
                    { label: "Intel", value: "Intel" },
                    { label: "AMD", value: "AMD" },
                  ].map((brand, index) => (
                    <span
                      key={index}
                      className={`item-filter d-block hover-none ${filter.brand === brand.value ? 'active' : ''}`}
                      onClick={() => handleFilterChange({ brand: brand.value })}

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
                className={`d-flex align-items-center hover-primary color-secondary ${filter.sort === sortOption.value ? 'active' : ''}`}
                onClick={() => handleFilterChange({ sort: sortOption.value })}

              >
                {sortOption.label}
              </li>
            ))}
          </ul>
        </div>
        <span
          className="btn-clear-filter"
          style={{ color: "red", cursor: "pointer" }}
          onClick={resetFilters}
          >
          <b>Xóa bộ lọc</b>
        </span>
      </div>
    </div>
  );
};

    


export default CompFilter;
