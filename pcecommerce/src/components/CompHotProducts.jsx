import React from "react";



const HotProducts = ({ products }) => {
    return (
      <div className="category-hot">
        <h2 className="ch-title">
          <img
            src="/static/assets/072024/images/kccshop-static-gif-cat-box-hot-1.gif"
            alt="Sản phẩm nổi bật"
            width="424"
            height="60"
          />
        </h2>
        <Swiper className="swiper-category-hot">
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="product p-item">
                <a href={product.link} className="p-img">
                  <img src={product.img} alt={product.name} />
                  <div className="p-sale-off">
                    <p>Tiết kiệm {product.discount}</p>
                  </div>
                </a>
                <div className="p-content">
                  <h3 className="p-name">{product.name}</h3>
                  <p className="p-price">{product.price}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  };