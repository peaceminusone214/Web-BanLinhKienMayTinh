import React from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "./MainStyles/styleHome.css";

function Home() {

  const banners = [
    { id: 32, img: "/assets/interface-main/imgComp/banner-slide1.png" },
    { id: 70, img: "/assets/interface-main/imgComp/bannner-slide2.png" },
    { id: 65, img: "/assets/interface-main/imgComp/banner-slide3.png" },
    { id: 42, img: "/assets/interface-main/imgComp/banner-slide4.png" },
  ];



  const products = [
    {
      id: 5547,
      name: "Mainboard MSI B760 GAMING PLUS WIFI (DDR5)",
      img: "https://www.tncstore.vn/media/product/250-4569-card-man-hinh-gigabyte-rtx-3080-gaming-oc-10gd-1.jpg",
      price: "4.650.000 ₫",
      oldPrice: "5.178.000 ₫",
      discount: "-10%",
      status: "✓ Còn hàng",
      description: [
        "Model: B760 GAMING PLUS WIFI",
        "Socket: LGA 1700",
        "Hỗ trợ CPU: Intel 12th,13th",
        "Hỗ trợ RAM: 4x DDR5 (192GB)",
        "Kích thước: ATX",
      ],
    },
    {
      id: 9121,
      name: "Laptop HP Victus Gaming 15 FB2063DX",
      img: "https://product.hstatic.net/1000167396/product/56_087565e885ce4274abcf63ec3eff346a_master.png",
      price: "14.200.000 ₫",
      oldPrice: "15.340.000 ₫",
      discount: "-7%",
      status: "✓ Liên hệ",
      description: [
        "CPU: Ryzen 5 - 7535HS",
        "RAM: 8GB DDR5",
        "Ổ cứng: SSD 512GB NVMe",
        "Card đồ họa: AMD Radeon RX 6550M 4G",
        "Màn hình: 15.6 inch Full HD 144Hz",
      ],
    },
    {
      id: 9123,
      name: "Laptop HP Victus Gaming 15 FB2063DX",
      img: "https://bizweb.dktcdn.net/100/329/122/files/amd-5700g-02.jpg?v=1633579298069",
      price: "14.200.000 ₫",
      oldPrice: "15.340.000 ₫",
      discount: "-7%",
      status: "✓ Liên hệ",
      description: [
        "CPU: Ryzen 5 - 7535HS",
        "RAM: 8GB DDR5",
        "Ổ cứng: SSD 512GB NVMe",
        "Card đồ họa: AMD Radeon RX 6550M 4G",
        "Màn hình: 15.6 inch Full HD 144Hz",
      ],
    },
    {
      id: 9124,
      name: "Laptop HP Victus Gaming 15 FB2063DX",
      img: "https://anphat.com.vn/media/product/47721_last.jpg",
      price: "14.200.000 ₫",
      oldPrice: "15.340.000 ₫",
      discount: "-7%",
      status: "✓ Liên hệ",
      description: [
        "CPU: Ryzen 5 - 7535HS",
        "RAM: 8GB DDR5",
        "Ổ cứng: SSD 512GB NVMe",
        "Card đồ họa: AMD Radeon RX 6550M 4G",
        "Màn hình: 15.6 inch Full HD 144Hz",
      ],
    },
    {
      id: 9125,
      name: "Laptop HP Victus Gaming 15 FB2063DX",
      img: "https://www.tncstore.vn/media/product/250-4569-card-man-hinh-gigabyte-rtx-3080-gaming-oc-10gd-1.jpg",
      price: "14.200.000 ₫",
      oldPrice: "15.340.000 ₫",
      discount: "-7%",
      status: "✓ Liên hệ",
      description: [
        "CPU: Ryzen 5 - 7535HS",
        "RAM: 8GB DDR5",
        "Ổ cứng: SSD 512GB NVMe",
        "Card đồ họa: AMD Radeon RX 6550M 4G",
        "Màn hình: 15.6 inch Full HD 144Hz",
      ],
    },
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
                { id: 26, img: "/assets/interface-main/imgHome/imgProduct1.png" },
                { id: 27, img: "/assets/interface-main/imgHome/imgProduct2.png" },
                { id: 28, img: "/assets/interface-main/imgHome/imgProduct3.png" },
                { id: 29, img: "/assets/interface-main/imgHome/imgProduct4.jpg" },

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
            {/* <div className="banner-under-showcase-video">
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
            </div> */}

          </div>
        </div>
      </section>




      {/* Section ưu đãi */}


      <div className="box box-collection" style={{ marginTop: "80px" }} id="js-collection-box">
        {/* BOX HEADER */}
        <div className="box-header">
          <h2 className="heading heading-secondary text-center">ƯU ĐÃI DÀNH CHO BẠN</h2>
          <ul className="list-style-none d-flex align-items-center justify-content-between">
            <li className="js-collection-button cat-active" data-id="1" data-url="/collection/gia-shock">
              <p className="font-weight-bold">GIÁ SHOCK TRONG NGÀY</p>
              <span>Cập nhật liên tục</span>
            </li>
            <li className="js-collection-button" data-id="2" data-url="/collection/top-pc-cuc-khung">
              <p className="font-weight-bold">SIÊU SALE TRONG THÁNG</p>
              <span>Xem ngay kẻo lỡ</span>
            </li>
            <li className="js-collection-button" data-id="3" data-url="/collection/giai-nhiet-pc">
              <p className="font-weight-bold">TOP PC BÁN CHẠY</p>
              <span>Giá ưu đãi nhất</span>
            </li>
            <li className="js-collection-button" data-id="4" data-url="/collection/man-hinh-do-hoa">
              <p className="font-weight-bold">MÀN HÌNH ĐỒ HỌA</p>
              <span>Nhiều ưu đãi hấp dẫn</span>
            </li>
            <li className="js-collection-button" data-id="5" data-url="/collection/goc-thanh-ly">
              <p className="font-weight-bold">GÓC THANH LÝ</p>
              <span>Xả hàng tồn kho</span>
            </li>
          </ul>
        </div>
        {/* BOX CONTENT */}
        <div className="box-content">
          <div className="homepage-collection-swiper">
            {/* SWIPER WRAPPER */}
            <div className="grid grid--6-cols" id="js-collection-product">
              {products.map((product) => (
                <div key={product.id} className="swiper-slide min-width-0">
                  <div className="product p-item" data-id={product.id} data-type="product">
                    <a href={`/product/${product.id}`} className="p-img">
                      <img src={product.img} alt={product.name} />
                    </a>
                    <div className="p-content">
                      <a href={`/product/${product.id}`}>
                        <h3 className="p-name line-clamp-2">{product.name}</h3>
                      </a>
                      <p className="p-price color-secondary font-weight-bold text-20">
                        {product.price}
                      </p>
                      <span className="p-market-price">{product.oldPrice}</span>
                      <span className="color-secondary" style={{ marginLeft: "4px" }}>
                        {product.discount}
                      </span>
                      <div className="p-box d-flex align-items-center justify-content-between">
                        <div className="wrapper">
                          <p className="color-green">{product.status}</p>
                          <a href="javascript:;" className="p-compare color-primary" data-id={product.id}>
                            <span>+</span> So sánh
                          </a>
                        </div>
                        <a href="javascript:;" className="btn-cart-sp d-flex align-items-center justify-content-center">
                          <i className="static-icon static-icon-cart"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* BOX BOTTOM */}
        <div className="box-bottom">
          <a href="/collection/gia-shock" className="font-weight-500 color-white btn-view-more" id="js-collection-path">
            XEM TẤT CẢ +
          </a>
        </div>
      </div>


      <section className='banner-section'>
        <a
          href="/bo-pc-kcc-lap-rap/"
          className="box-category-big-image banner-hover"
          target="_blank"
          rel="nofollow"
        >
          <img
            src="/assets/interface-main/imgHome/banner_1.png"
            alt="Banner category"
            className="lazy-cat-img"
            data-src="/media/category/cat_big_2.png"
          />
        </a>

      </section>





      {/* Box Header */}

      <div className="pc-header d-flex align-center space-between">
        <h2 className="pc-heading">Bộ PC</h2>

        <div className="pc-sub-header d-flex align-center">
          <ul className="pc-list d-flex align-center">
            <li><a href="/bo-pc-kcc-cho-thue/"><p>Bộ PC cho thuê</p></a></li>
            <li><a href="/pc-server-kcc/"><p>PC Server</p></a></li>
            <li><a href="/pc-may-bo-kcc-i3-r3/"><p>PC Máy bộ I3 / R3</p></a></li>
            <li><a href="/pc-may-bo-kcc-i5-r5/"><p>PC Máy bộ I5 / R5</p></a></li>
            <li><a href="/pc-may-bo-kcc-i7-r7/"><p>PC Máy bộ I7 / R7</p></a></li>
          </ul>
          <a href="/bo-pc-kcc-lap-rap/" className="btn-view-all">XEM TẤT CẢ +</a>
        </div>
      </div>








    </div>
  )
}

export default Home
