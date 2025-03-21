import React from "react";

// Component SortBar
const SortFilter = () => {
    const sortOptions = ["Mới nhất", "Giá tăng dần", "Giá giảm dần", "Lượt xem", "Đánh giá", "Tên A->Z", "Còn hàng"];
    return (
      <div className="box-filter-list d-flex justify-content-between align-items-center">
        <h4 className="box-filter-list-name">Sắp xếp theo:</h4>
        <ul className="sort-bar-left d-flex">
          {sortOptions.map((option, index) => (
            <a key={index} href="" className="d-flex align-items-center hover-primary color-secondary">
              {option}
            </a>
          ))}
        </ul>
      </div>
    );
  };

  