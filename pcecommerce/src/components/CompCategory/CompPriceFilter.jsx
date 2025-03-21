import React from 'react';


const PriceFilter = () => {
    const priceRanges = [
      { label: "Dưới 2 triệu", min: 0, max: 2000000 },
      { label: "2 triệu - 3 triệu", min: 2000000, max: 3000000 },
      { label: "3 triệu - 5 triệu", min: 3000000, max: 5000000 },
      { label: "5 triệu - 7 triệu", min: 5000000, max: 7000000 },
      { label: "7 triệu - 9 triệu", min: 7000000, max: 9000000 },
      { label: "9 triệu - 12 triệu", min: 9000000, max: 12000000 },
      { label: "12 triệu - 15 triệu", min: 12000000, max: 15000000 },
      { label: "Trên 15 triệu", min: 15000000 },
    ];
    return (
      <div className="box-filter-list">
        <h4 className="box-filter-list-name">Chọn khoảng giá:</h4>
        <div className="wrapper d-flex flex-wrap">
          {priceRanges.map((range, index) => (
            <a key={index} href={`https://kccshop.vn/main-bo-mach-chu/?min=${range.min}&max=${range.max}`} className="item-filter d-block hover-none">
              {range.label}
            </a>
          ))}
        </div>
      </div>
    );
  };