import React from "react";
import '../components/css/styleSkeleton.css'

const Skeleton = ({ type = "product", count = 1 }) => {
  const renderSkeletons = () => {
    let skeletons = [];
    for (let i = 0; i < count; i++) {
      skeletons.push(
        <div className="skeleton-card" key={i}>
          {type === "product" ? (
            <>
              <div className="skeleton-img"></div>
              <div className="skeleton-title"></div>
              <div className="skeleton-price"></div>
              <div className="skeleton-status"></div>
              <div className="skeleton-btn"></div>
            </>
          ) : (
            <div className="skeleton-card"></div>
          )}
        </div>
      );
    }
    return skeletons;
  };

  return <>{renderSkeletons()}</>;
};

export default Skeleton;

