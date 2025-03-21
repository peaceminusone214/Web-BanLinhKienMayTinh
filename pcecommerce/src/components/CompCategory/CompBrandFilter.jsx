import React from 'react';


const BrandFilter = () => {
    const brands = ["ASROCK", "ASUS", "BIOSTAR", "COLORFUL", "CORSAIR", "GIGABYTE", "Huananzhi", "MSI", "NZXT"];
    return (
      <div className="box-filter-list box-filter-brand">
        {brands.map((brand, index) => (
          <div className="item-filter" key={index}>
            <a href={`https://kccshop.vn/main-bo-mach-chu/?brand=${index}`} className="d-flex align-items-center justify-content-center h-100 hover-none">
              <p>{brand}</p>
            </a>
          </div>
        ))}
      </div>
    );
  };