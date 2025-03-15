import React from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import '../components/css/styleBanner.css';




const BannerShowcase = ({ banners }) => (
  <Swiper
    modules={[Autoplay, Navigation, Pagination]}
    spaceBetween={10}
    slidesPerView={1}
    loop={true}
    autoplay={{ delay: 4000, disableOnInteraction: false }}
    pagination={{ clickable: true }}
    navigation={true}
  >
    {banners.map((item, index) => (
      <SwiperSlide key={index}>
        <img src={item.img} alt={`Banner ${index}`} className="d-block w-100" />
      </SwiperSlide>
    ))}
  </Swiper>
);

export default BannerShowcase;
