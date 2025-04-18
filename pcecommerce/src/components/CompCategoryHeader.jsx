import React from "react";
import { Link } from "react-router-dom";

const CompCategoryHeader = ({ category }) => (
  <div className="pc-header d-flex align-center space-between">
    <h2 className="pc-heading">{category.name}</h2>
    <div className="pc-sub-header d-flex align-center">
      <ul className="pc-list d-flex align-center">
        {category.subCategories.map((sub, idx) => (
          <li key={idx}>
            <Link to={`/category/${sub.slug}`}>
              <p>{sub.name}</p>
            </Link>
          </li>
        ))}
      </ul>
      <Link to={`/category/${category.slug}`} className="btn-view-all">
        XEM TẤT CẢ +
      </Link>
    </div>
  </div>
);

export default CompCategoryHeader;
