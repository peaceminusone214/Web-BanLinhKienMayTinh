import React from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import '../Main/styleHome.css'



function Home() {

  const banners = [
    { id: 32, img: "/assets/interface-main/imgComp/banner-slide1.png" },
    { id: 70, img: "/assets/interface-main/imgComp/bannner-slide2.png" },
    { id: 65, img: "/assets/interface-main/imgComp/banner-slide3.png" },
    { id: 42, img: "/assets/interface-main/imgComp/banner-slide4.png" },
  ];


  return (
    <div className="homepage">



      {/* Showcase Section */}
      <section className="homepage-showcase">
        <div className="container">
          <div className="section-showcase">
            <Swiper
              modules={[Autoplay, Navigation, Pagination]}
              spaceBetween={10}
              slidesPerView={1}
              loop={true}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              navigation={true}
              className="swiper-showcase"
            >
              {banners.map((item, index) => (
                <SwiperSlide key={index}>
                  <a href={`/ad.php?id=${item.id}`} target="_blank" rel="nofollow">
                    <img src={item.img} alt="Showcase" className="d-block lazy" />
                  </a>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      {/* Banner dưới Showcase */}
      <section className="homepage-banner">
        <div className="container">
          <div className="banner-under-showcase grid grid--banner-homepage">
            {/* Banner List */}
            <div className="banner-under-showcase-list grid grid--3-cols">
              {[
                { id: 26, img: "/media/banner/Webnh8.png" },
                { id: 27, img: "/media/banner/15.png" },
                { id: 28, img: "/media/banner/16.png" },
              ].map((item, index) => (
                <a
                  key={index}
                  href={`/ad.php?id=${item.id}`}
                  className="banner-under-showcase-image banner-hover"
                  target="_blank"
                  rel="nofollow"
                >
                  <img src={item.img} alt="Banner" className="lazy w-100" />
                </a>
              ))}
            </div>

            {/* Video Banner */}
            <div className="banner-under-showcase-video">
              <a
                href="https://youtu.be/J6oxmKXResw?si=Qc-wkbb-TxB97Zvj"
                className="banner-under-showcase-image banner-hover"
                data-fancybox=""
              >
                <img
                  src="/media/banner/z5985541950671_1ff16564c05339aca0f2ce25623da907.jpg"
                  alt="Banner"
                  className="lazy w-100"
                />
                <i className="fa fa-play-circle banner-video-icon-play" aria-hidden="true"></i>
              </a>
            </div>
          </div>
        </div>
      </section>








    </div>
  )
}

export default Home
