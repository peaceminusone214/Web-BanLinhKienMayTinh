import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProductList from "../components/ProductList";

const CollectionSection = () => {
  const { products } = useSelector((state) => state.product);
  const [selectedTab, setSelectedTab] = useState(null);

  // Cap nhat sau
  const getTabProducts = () => {
    return [
      {
        id: 1,
        title: "GIÁ SHOCK TRONG NGÀY",
        subtitle: "Cập nhật liên tục",
        slug: "gia-shock",
        products: products.filter((p) =>
          [
            "67d0ea7ce8b0d2e73733324c",
            "67d0ef95e8b0d2e73733330e",
            "67d0ed29e8b0d2e7373332e4",
            "67d0eb11e8b0d2e73733326c",
            "67d0eed1e8b0d2e7373332f6",
          ].includes(p._id)
        ),
      },
      {
        id: 2,
        title: "SIÊU SALE TRONG THÁNG",
        subtitle: "Xem ngay kẻo lỡ",
        slug: "top-pc-cuc-khung",
        products: products.filter((p) =>
          [
            "67d0eed2e8b0d2e7373332fe",
            "67d0ef95e8b0d2e73733330e",
            "67d0f278e8b0d2e73733337e",
            "67d0ef95e8b0d2e73733330a",
            "67d0eb12e8b0d2e73733326e",
          ].includes(p._id)
        ),
      },
      {
        id: 3,
        title: "TOP PC BÁN CHẠY",
        subtitle: "Giá ưu đãi nhất",
        slug: "giai-nhiet-pc",
        products: products.filter((p) =>
          [
            "67d0ea7ce8b0d2e73733324c",
            "67d0ef95e8b0d2e73733330e",
            "67d0ed29e8b0d2e7373332e4",
            "67d0eb11e8b0d2e73733326c",
            "67d0eed1e8b0d2e7373332f6",
          ].includes(p._id)
        ),
      },
      {
        id: 4,
        title: "MÀN HÌNH ĐỒ HỌA",
        subtitle: "Nhiều ưu đãi hấp dẫn",
        slug: "man-hinh-do-hoa",
        products: [],
      },
      {
        id: 5,
        title: "GÓC THANH LÝ",
        subtitle: "Xả hàng tồn kho",
        slug: "goc-thanh-ly",
        products: [],
      },
    ];
  };

  const tabs = getTabProducts();

  useEffect(() => {
    if (products.length > 0) {
      setSelectedTab(tabs[0]);
    }
  }, [products]);

  if (!selectedTab) return null;

  return (
    <div className="box box-collection" style={{ marginTop: "80px" }}>
      <div className="box-header">
        <h2 className="heading heading-secondary text-center">
          ƯU ĐÃI DÀNH CHO BẠN
        </h2>
        <ul className="list-style-none d-flex align-items-center justify-content-between">
          {tabs.map((tab) => (
            <li
              key={tab.id}
              className={`js-collection-button ${
                selectedTab.id === tab.id ? "cat-active" : ""
              }`}
              onClick={() => setSelectedTab(tab)}
              style={{ cursor: "pointer" }}
            >
              <p className="font-weight-bold">{tab.title}</p>
              <span>{tab.subtitle}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="box-content">
        <div className="homepage-collection-swiper">
          <div className="product-list-flex">
            <ProductList products={selectedTab.products.slice(0, 5)} />
          </div>
        </div>
      </div>

      <div className="box-bottom">
        <a
          href={`News/san-pham`}
          className="font-weight-500 color-white btn-view-more"
        >
          XEM TẤT CẢ +
        </a>
      </div>
    </div>
  );
};

export default CollectionSection;
