import React, { useEffect, useState } from 'react';

import "./MainStyles/styleHome.css";

import BannerShowcase from '../../components/Banner';
import News from '../../components/NewsSections';
import ProductList from '../../components/ProductList';

import CompCategoryHeader from '../../components/CompCategoryHeader';
import { fetchCategories } from '../../api/categoriesApi';

import CompBannerSections from '../../components/CompBannerSections';

function Home() {

  const banners = [
    { id: 32, img: "/assets/interface-main/imgComp/banner-slide1.png" },
    { id: 70, img: "/assets/interface-main/imgComp/bannner-slide2.png" },
    { id: 65, img: "/assets/interface-main/imgComp/banner-slide3.png" },
    { id: 42, img: "/assets/interface-main/imgComp/banner-slide4.png" },
  ];

  const articles = [
    {
      id: 1,
      title: "Bản firmware mới của AMD mang đến các tối ưu hiệu suất cho các vi xử lý Ryzen 9000",
      img: "https://kccshop.vn/media/news/25563-erwpxmfvqk8vnasdrxv7ma-1200-80-png_11zon.jpg",
      link: "/ban-firmware-moi-cua-amd-mang-den-cac-toi-uu-hieu-suat-cho-cac-vi-xu-ly-ryzen-9000/",
      date: "14-07-2024",
      description: "Gigabyte đã bắt đầu cập nhật các bo mạch chủ AM5 của mình lên firmware AGESA 1.2.0.0a, hỗ trợ vi xử lý desktop Ryzen 9000 series sắp tới của AMD. Được phát hiện bởi HXL trên X (Twitter), các cập nhật BIOS mới từ Gigabyte với firmware AGESA mới nhất của AMD cung cấp các tối ưu hiệu suất mới cho dòng chip Zen 5 mới. Những cập nhật mới này đến đúng lúc để người dùng có thể cập nhật trước khi vi xử lý Ryzen 9000 của AMD ra mắt."
    },
    {
      id: 2,
      title: "Kết quả Ryzen 9 9900X được cho là đặt AMD lên đỉnh cao với danh hiệu CPU đơn luồng mạnh nhất trên Geekbench",
      img: "https://kccshop.vn/media/news/25562-xh5it4jz6hnp63jl2zcvn3-1200-80_11zon.jpg",
      link: "/ket-qua-ryzen-9-9900x-duoc-cho-la-dat-amd-len-dinh-cao-voi-danh-hieu-cpu-don-luong-manh-nhat-tren-geekbench/",
      date: "14-07-2024",
      description: "Kiểm tra CPU AMD Ryzen 9 9900X trên Geekbench 6 được cho là đã xuất hiện từ Benchleaks. Một bài kiểm tra CPU đơn luồng với điểm số 3,401 điểm đáng chú ý và nếu thông tin này là thật, nó sẽ dẫn đầu bảng xếp hạng Geekbench 6 về hiệu năng xử lý đơn luồng. Điểm số đa luồng được báo cáo là 19,756 điểm, tuy không ấn tượng bằng các CPU 24 luồng tiêu dùng tốt nhất từ Intel, nhưng vẫn không thua kém quá nhiều."
    },
    {
      id: 3,
      title: "ASRock chuẩn bị các GPU AMD cho công việc suy luận AI và hệ thống đa GPU",
      img: "https://kccshop.vn/media/news/25561-ucmckunbtogwtfu8hyw4vp-1200-80_11zon.jpg",
      link: "/asrock-chuan-bi-cac-gpu-amd-cho-cong-viec-suy-luan-ai-va-he-thong-da-gpu/",
      date: "13-07-2024",
      description: "ASRock (qua momomo_us) đã tái thương hiệu các card đồ họa AMD Radeon RX 7900 XT và RX 7900 XTX WS dựa trên Navi 31 thành dòng mới Creator, dành cho các công việc tạo sinh và cài đặt máy trạm. Những card đồ họa dòng WS này ban đầu được ra mắt tại Computex 2024."
    },
    {
      id: 4,
      title: "Vụ lừa đảo Nvidia RTX 4090 sử dụng GPU RTX 3080 Ti dán lại nhãn, chip nhớ giả mạo",
      img: "https://kccshop.vn/media/news/25560-wtjsjem9ovszcdvbzutpms-1200-80-png_11zon.jpg",
      link: "/vu-lua-dao-nvidia-rtx-4090-su-dung-gpu-rtx-3080-ti-dan-la-i-nhan-chip-nho-gia-mao/",
      date: "13-07-2024",
      description: "Làm thế nào để làm giả một card đồ họa GeForce RTX 4090, một trong những card đồ họa tốt nhất hiện nay, với giá ít nhất 1.500 đô la mà không cần truy cập vào bộ vi xử lý AD102 của Nvidia và bộ nhớ GDDR6X của Micron? Dễ dàng, theo NorthWest Repair, một cửa hàng sửa chữa nổi tiếng."
    }
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


  //categories
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCategories();
      setCategories(data);
    };

    loadCategories();
  }, []);





  return (
    <div className="homepage">

      {/* Showcase Section */}
      <BannerShowcase banners={banners} />



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
                      <div class="p-sale-off ms-2">
                        <p class="font-weight-500 text-uppercase">
                          Tiết kiệm
                          <span class="d-block text-12 font-weight-bold color-white">320,000 ₫</span>
                        </p>
                      </div>
                    </a>
                    <div className="p-content">
                      <a href={`/product/${product.id}`}>
                        <h3 className="p-name line-clamp-2">{product.name}</h3>
                      </a>
                      <p className="p-price color-secondary font-weight-bold text-20">
                        {product.price}
                      </p>
                      <span className="p-market-price">{product.oldPrice}</span>
                      <span className="p-market-sale color-secondary" style={{ marginLeft: "4px", fontSize: "13px", color: "blue" }}>
                        {product.discount}
                      </span>
                      <div className="p-box d-flex align-items-center justify-content-between">
                        <div className="wrapper">
                          <p className="color-green">{product.status}</p>
                          <a href="javascript:;" className="p-compare color-primary" data-id={product.id}>
                            <span>+</span> So sánh
                          </a>
                        </div>
                        <a href="javascript:;" className="btn-cart-sp d-flex align-items-center justify-content-center" >
                          <i class="static-icon static-icon-cart"></i>
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




      {/* Product Section */}
      <section>
        {categories.map(category => (

          <section key={category.id}>
            <CompBannerSections category={category} />
            <CompCategoryHeader category={category} />

            <div class="box-content">
              <div class="swiper-slide min-width-0">
                <ProductList categoryId={category.id} />
              </div>
            </div>

          </section>
        ))}
      </section>




      {/* News Section home */}
      <News articles={articles} />





    </div>
  )
}

export default Home
