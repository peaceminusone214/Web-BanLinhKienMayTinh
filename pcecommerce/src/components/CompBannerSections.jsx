import React from 'react';


const CompBannerSections = ({ category }) => {
    return (
      <section className='banner-section'>
        <a
          href={`/category/${category.slug}`}
          className="box-category-big-image banner-hover"
          target="_blank"
          rel="nofollow"
        >
          <img
            src={`/assets/interface-main/imgHome/banner_${category.id}.png`}
            alt={`Banner ${category.name}`}
            className="lazy-cat-img"
            data-src={`/media/category/cat_big_${category.id}.png`}
          />
        </a>
      </section>
    );
  };


export default CompBannerSections;