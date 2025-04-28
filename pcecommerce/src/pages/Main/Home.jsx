import React, { useEffect, useState } from "react";
import BannerShowcase from "../../components/Banner";
import {
  fetchProducts,
  fetchProductsByCategory,
} from "../../Service/productApi";
import { fetchCategories } from "../../Service/categoriesApi";
import News from "../../components/NewsSections";
import ProductList from "../../components/ProductList";
import CompCategoryHeader from "../../components/CompCategoryHeader";
import CompBannerSections from "../../components/CompBannerSections";
import CompareSection from "../../components/CompareSection";
import { useDispatch, useSelector } from "react-redux";
import {
  setProduct,
  setCategories,
  setProductsByCategory,
  setLoading,
} from "../../redux/actions/productActions";
import CollectionSection from "../../components/CollectionSection";
import "./MainStyles/styleHome.css";

function Home() {
  // product
  // const [product, setProducts] = useState([]);
  // const [categories, setCategories] = useState([]);
  // const [productsByCategory, setProductsByCategory] = useState({});
  // const [loading, setLoading] = useState(true);

  const banners = [
    { id: 32, img: "/assets/interface-main/imgComp/banner-slide1.png" },
    //{ id: 70, img: "/assets/interface-main/imgComp/bannner-slide2.png" },
    //{ id: 65, img: "/assets/interface-main/imgComp/banner-slide3.png" },
    //{ id: 42, img: "/assets/interface-main/imgComp/banner-slide4.png" },
  ];

  const articles = [
    {
      id: 1,
      title:
        "Bản firmware mới của AMD mang đến các tối ưu hiệu suất cho các vi xử lý Ryzen 9000",
      img: "https://kccshop.vn/media/news/25563-erwpxmfvqk8vnasdrxv7ma-1200-80-png_11zon.jpg",
      link: "/ban-firmware-moi-cua-amd-mang-den-cac-toi-uu-hieu-suat-cho-cac-vi-xu-ly-ryzen-9000/",
      date: "14-07-2024",
      description:
        "Gigabyte đã bắt đầu cập nhật các bo mạch chủ AM5 của mình lên firmware AGESA 1.2.0.0a, hỗ trợ vi xử lý desktop Ryzen 9000 series sắp tới của AMD. Được phát hiện bởi HXL trên X (Twitter), các cập nhật BIOS mới từ Gigabyte với firmware AGESA mới nhất của AMD cung cấp các tối ưu hiệu suất mới cho dòng chip Zen 5 mới. Những cập nhật mới này đến đúng lúc để người dùng có thể cập nhật trước khi vi xử lý Ryzen 9000 của AMD ra mắt.",
    },
    {
      id: 2,
      title:
        "Kết quả Ryzen 9 9900X được cho là đặt AMD lên đỉnh cao với danh hiệu CPU đơn luồng mạnh nhất trên Geekbench",
      img: "https://kccshop.vn/media/news/25562-xh5it4jz6hnp63jl2zcvn3-1200-80_11zon.jpg",
      link: "/ket-qua-ryzen-9-9900x-duoc-cho-la-dat-amd-len-dinh-cao-voi-danh-hieu-cpu-don-luong-manh-nhat-tren-geekbench/",
      date: "14-07-2024",
      description:
        "Kiểm tra CPU AMD Ryzen 9 9900X trên Geekbench 6 được cho là đã xuất hiện từ Benchleaks. Một bài kiểm tra CPU đơn luồng với điểm số 3,401 điểm đáng chú ý và nếu thông tin này là thật, nó sẽ dẫn đầu bảng xếp hạng Geekbench 6 về hiệu năng xử lý đơn luồng. Điểm số đa luồng được báo cáo là 19,756 điểm, tuy không ấn tượng bằng các CPU 24 luồng tiêu dùng tốt nhất từ Intel, nhưng vẫn không thua kém quá nhiều.",
    },
    {
      id: 3,
      title:
        "ASRock chuẩn bị các GPU AMD cho công việc suy luận AI và hệ thống đa GPU",
      img: "https://kccshop.vn/media/news/25561-ucmckunbtogwtfu8hyw4vp-1200-80_11zon.jpg",
      link: "/asrock-chuan-bi-cac-gpu-amd-cho-cong-viec-suy-luan-ai-va-he-thong-da-gpu/",
      date: "13-07-2024",
      description:
        "ASRock (qua momomo_us) đã tái thương hiệu các card đồ họa AMD Radeon RX 7900 XT và RX 7900 XTX WS dựa trên Navi 31 thành dòng mới Creator, dành cho các công việc tạo sinh và cài đặt máy trạm. Những card đồ họa dòng WS này ban đầu được ra mắt tại Computex 2024.",
    },
    {
      id: 4,
      title:
        "Vụ lừa đảo Nvidia RTX 4090 sử dụng GPU RTX 3080 Ti dán lại nhãn, chip nhớ giả mạo",
      img: "https://kccshop.vn/media/news/25560-wtjsjem9ovszcdvbzutpms-1200-80-png_11zon.jpg",
      link: "/vu-lua-dao-nvidia-rtx-4090-su-dung-gpu-rtx-3080-ti-dan-la-i-nhan-chip-nho-gia-mao/",
      date: "13-07-2024",
      description:
        "Làm thế nào để làm giả một card đồ họa GeForce RTX 4090, một trong những card đồ họa tốt nhất hiện nay, với giá ít nhất 1.500 đô la mà không cần truy cập vào bộ vi xử lý AD102 của Nvidia và bộ nhớ GDDR6X của Micron? Dễ dàng, theo NorthWest Repair, một cửa hàng sửa chữa nổi tiếng.",
    },
  ];

  const dispatch = useDispatch();
  const { products, categories, productsByCategory, loading } = useSelector(
    (state) => state.product
  );

  console.log("products: ", products);
  console.log("categories: ", categories);
  console.log("productsByCategory: ", productsByCategory);
  console.log("loading: ", loading);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        dispatch(setProduct(data));
      } catch (error) {
        console.error("Lỗi khi load sản phẩm:", error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    loadProducts();
  }, [dispatch]);
  // get pd by cat
  useEffect(() => {
    const loadProductsByCategory = async (categoryId) => {
      try {
        const data = await fetchProductsByCategory(categoryId);
        dispatch(setProductsByCategory(categoryId, data));
      } catch (error) {
        console.error("Lỗi khi load sản phẩm theo danh mục:", error);
      }
    };

    if (Array.isArray(categories) && categories.length > 0) {
      categories.forEach((category) => {
        loadProductsByCategory(category._id);
      });
    }
  }, [categories, dispatch]);
  //categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        dispatch(setCategories(data));
      } catch (error) {
        console.error("Lỗi khi load danh mục:", error);
      }
    };

    loadCategories();
  }, [dispatch]);

  useEffect(() => {
    if (products) {
      console.log("ProductList:", products);
      console.log("Category:", categories);
      console.log("🏠 Home mounted");
    }
  }, [products]);

  if (loading) return <p>Đang tải sản phẩm...</p>;

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
                {
                  id: 26,
                  img: "/assets/interface-main/imgHome/imgProduct1.png",
                },
                {
                  id: 27,
                  img: "/assets/interface-main/imgHome/imgProduct2.png",
                },
                {
                  id: 28,
                  img: "/assets/interface-main/imgHome/imgProduct3.png",
                },
                {
                  id: 29,
                  img: "/assets/interface-main/imgHome/imgProduct4.jpg",
                },
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
      <CollectionSection />

      {/* Product Section */}
      <section>
        {categories && Array.isArray(categories) && categories.length > 0 ? (
          categories.map((categoryItem) => {
            const productsList = productsByCategory[categoryItem._id] || [];
            const limit = productsList.length >= 10 ? 10 : 5;

            return (
              <section key={categoryItem._id}>
                <CompBannerSections category={categoryItem} />
                <CompCategoryHeader category={categoryItem} />
                <div className="box-content">
                  <div className="swiper-slide min-width-0">
                    <ProductList products={productsList.slice(0, limit)} />
                  </div>
                </div>
              </section>
            );
          })
        ) : (
          <p>Không có danh mục nào để hiển thị.</p>
        )}
      </section>
      {/* News Section home */}
      <News articles={articles} />
      <CompareSection />
    </div>
  );
}

export default Home;
