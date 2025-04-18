import React from "react";

// Tạo đối tượng ánh xạ giữa _id
const imageMapping = {
  "67a613a17e4ea09f9424efa4": "/assets/interface-main/imgHome/banner_6.jpg", //"PC"
  "67a612f27e4ea09f9424ef96": "/assets/interface-main/imgHome/banner_2.png", // "MAIN"
  "67a611647e4ea09f9424ef91": "/assets/interface-main/imgHome/banner_3.png", // "CPU"
  "67a6132f7e4ea09f9424ef98": "/assets/interface-main/imgHome/banner_4.png", // "RAM"
  "67a613787e4ea09f9424ef9e": "/assets/interface-main/imgHome/banner_5.png", // "VGA"
};

const CompBannerSections = ({ category }) => {
  // Lấy hình ảnh từ ánh xạ
  const imageToDisplay =
    imageMapping[category._id] ||
    "/assets/interface-main/imgHome/banner_default.png";

  return (
    <section className="banner-section">
      <a
        href={`/category/${category.slug}`}
        className="box-category-big-image banner-hover"
        target="_blank"
        rel="nofollow"
      >
        <img
          src={imageToDisplay}
          alt={`Banner ${category.name}`}
          className="lazy-cat-img"
          data-src={`/media/category/cat_big_${category._id}.png`}
        />
      </a>
    </section>
  );
};

export default CompBannerSections;
