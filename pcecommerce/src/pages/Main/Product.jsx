import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const Product = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState("");
  const [activeTab, setActiveTab] = useState("p_tab_1");
  const fieldLabels = {
    core_count: "Số nhân",
    thread_count: "Số luồng",
    base_clock: "Xung nhịp cơ bản",
    boost_clock: "Xung nhịp tối đa",
    tdp: "Công suất (TDP)",
    socket: "Socket",
    ram_support: "Hỗ trợ RAM",
    storage_capacity: "Dung lượng lưu trữ",
    warranty: "Bảo hành",
    condition: "Tình trạng",
  };
  
  const valueMappings = {
    New: "Mới",
    Used: "Đã sử dụng",
  };
  
  const formatValue = (value) => {
    if (typeof value === "string") {
      // Chuyển "New" -> "Mới", "Used" -> "Đã sử dụng"
      if (valueMappings[value]) return valueMappings[value];
  
      // Chuyển đổi "year" hoặc "years" thành "năm"
      return value.replace(/\b(years?|Years?)\b/g, "năm");
    } 
    return value;
  };  

  useEffect(() => {
    if (!id) return;

    // Lấy thông tin sản phẩm
    fetch(`${API_URL}/product/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Lỗi API sản phẩm: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        // Chỉ gọi fetchCategory nếu category_id hợp lệ
        if (data.category_id && typeof data.category_id === "string") {
          fetchCategory(data.category_id);
        }
      })
      .catch((err) => console.error("Lỗi khi lấy sản phẩm:", err));
  }, [id]);

  const fetchCategory = (categoryId) => {
    fetch(`${API_URL}/product/get-category`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: categoryId }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Lỗi API danh mục: ${res.status}`);
        return res.json();
      })
      .then((categoryData) => {
        console.log("Dữ liệu danh mục nhận được:", categoryData);
        setCategory(categoryData);
      })
      .catch((err) => console.error("Lỗi khi lấy danh mục:", err));
  };

  if (!product) return <p>Loading sản phẩm...</p>;

  return (
    <div>
      <>
        <div className="sherah-body-area">
          {/* sherah Dashboard */}
          <section className="sherah-adashboard sherah-show">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="sherah-body">
                    {/* Dashboard Inner */}
                    <div className="sherah-dsinner">
                      <div className="row mg-top-30">
                        <div className="col-12 sherah-flex-between">
                          {/* Sherah Breadcrumb */}
                          <div className="sherah-breadcrumb">
                            <h2 className="sherah-breadcrumb__title">
                              Thông tin sản phẩm
                            </h2>
                            <ul className="sherah-breadcrumb__list">
                              <li>
                                <a href="#">Home</a>
                              </li>
                              <li className="active">
                                <Link to="/product/">Product</Link>
                              </li>
                            </ul>
                          </div>
                          {/* End Sherah Breadcrumb */}
                        </div>
                      </div>
                      <div className="product-detail-body sherah-default-bg sherah-border mg-top-30">
                        <div className="row">
                          <div className="col-lg-6 col-md-6 col-12">
                            {/* Product Slider */}
                            <div className="product-gallery">
                              {/* product details image */}
                              <div className="product-details-image">
                                <ul
                                  className="nav-pills nav flex-nowrap product-thumbs"
                                  id="pills-tab"
                                  role="tablist"
                                >
                                  <li
                                    className="single-thumbs"
                                    role="presentation"
                                  >
                                    <a
                                      className="active"
                                      id="pills-home-tab"
                                      data-bs-toggle="pill"
                                      href="#pills-home"
                                      role="tab"
                                      aria-controls="pills-home"
                                      aria-selected="true"
                                    >
                                      <img
                                        src={product.image_url}
                                        alt={product.name}
                                      />
                                    </a>
                                  </li>
                                  <li
                                    className="single-thumbs"
                                    role="presentation"
                                  >
                                    <a
                                      id="pills-profile-tab"
                                      data-bs-toggle="pill"
                                      href="#pills-profile"
                                      role="tab"
                                      aria-controls="pills-profile"
                                      aria-selected="false"
                                    >
                                      <img
                                        src={product.image_url}
                                        alt="thumbs"
                                      />
                                    </a>
                                  </li>
                                  <li
                                    className="single-thumbs"
                                    role="presentation"
                                  >
                                    <a
                                      id="pills-contact-tab"
                                      data-bs-toggle="pill"
                                      href="#pills-contact"
                                      role="tab"
                                      aria-controls="pills-contact"
                                      aria-selected="false"
                                    >
                                      <img
                                        src={product.image_url}
                                        alt="thumbs"
                                      />
                                    </a>
                                  </li>
                                  <li
                                    className="single-thumbs"
                                    role="presentation"
                                  >
                                    <a
                                      id="pills-four-tab"
                                      data-bs-toggle="pill"
                                      href="#pills-four"
                                      role="tab"
                                      aria-controls="pills-four"
                                      aria-selected="false"
                                    >
                                      <img
                                        src={product.image_url}
                                        alt="thumbs"
                                      />
                                    </a>
                                  </li>
                                </ul>
                                <div className="main-preview-image">
                                  <div
                                    className="tab-content product-image"
                                    id="pills-tabContent"
                                  >
                                    <div
                                      className="tab-pane fade show active"
                                      id="pills-home"
                                      role="tabpanel"
                                      aria-labelledby="pills-home-tab"
                                    >
                                      <div className="single-product-image">
                                        <img
                                          src={product.image_url}
                                          alt="product"
                                        />
                                      </div>
                                      {/* single product image */}
                                    </div>
                                    <div
                                      className="tab-pane fade"
                                      id="pills-profile"
                                      role="tabpanel"
                                      aria-labelledby="pills-profile-tab"
                                    >
                                      <div className="single-product-image">
                                        <img
                                          src={product.image_url}
                                          alt="product"
                                        />
                                      </div>
                                      {/* single product image */}
                                    </div>
                                    <div
                                      className="tab-pane fade"
                                      id="pills-contact"
                                      role="tabpanel"
                                      aria-labelledby="pills-contact-tab"
                                    >
                                      <div className="single-product-image">
                                        <img
                                          src={product.image_url}
                                          alt="product"
                                        />
                                      </div>
                                      {/* single product image */}
                                    </div>
                                    <div
                                      className="tab-pane fade"
                                      id="pills-four"
                                      role="tabpanel"
                                      aria-labelledby="pills-four-tab"
                                    >
                                      <div className="single-product-image">
                                        <img
                                          src={product.image_url}
                                          alt="product"
                                        />
                                      </div>
                                      {/* single product image */}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* product details image */}
                            </div>
                            {/* End Product slider */}
                          </div>
                          <div className="col-lg-6 col-md-6 col-12">
                            <div className="product-detail-body__content">
                              <h2 className="product-detail-body__title">
                                {product.product_name}
                              </h2>
                              <p className="product-detail-body__stats">
                                Sold 21 Products in last 10 Hours
                              </p>
                              <div className="product-detail-body__deal--rating">
                                <h5 className="sherah-product-card__price">
                                  <del>*Giá sale*</del>
                                  {product.price} VNĐ
                                </h5>
                                <div className="sherah-product-card__meta sherah-dflex sherah-flex-gap-30">
                                  <div className="sherah-product-card__rating sherah-dflex sherah-flex-gap-5">
                                    <span className="sherah-color4">
                                      <i className="fa fa-star" />
                                    </span>
                                    <span className="sherah-color4">
                                      <i className="fa fa-star" />
                                    </span>
                                    <span className="sherah-color4">
                                      <i className="fa fa-star" />
                                    </span>
                                    <span className="sherah-color4">
                                      <i className="fa fa-star" />
                                    </span>
                                    <span className="sherah-color4">
                                      <i className="fa fa-star" />
                                    </span>
                                    (33)
                                  </div>
                                </div>
                              </div>
                              <p className="product-detail-body__stock sherah-color3">
                                Còn {product.stock_quantity} sản phẩm.
                              </p>
                              <div className="product-detail-body__text">
                                {product.description}
                              </div>
                              {/* Sherah Product Button */}
                              <div className="product-inside-button">
                                <div className="sherah-button-group">
                                  <div className="quantity">
                                    {/* Input Order */}
                                    <div className="input-group">
                                      <div className="button minus">
                                        <button
                                          type="button"
                                          className="btn btn-primary btn-number"
                                          disabled="disabled"
                                          data-type="minus"
                                          data-field="quant[1]"
                                        >
                                          -
                                        </button>
                                      </div>
                                      <input
                                        type="text"
                                        name="quant[1]"
                                        className="input-number"
                                        data-min={1}
                                        data-max={10}
                                        defaultValue={0}
                                      />
                                      <div className="button plus">
                                        <button
                                          type="button"
                                          className="btn btn-primary btn-number"
                                          data-type="plus"
                                          data-field="quant[1]"
                                        >
                                          +
                                        </button>
                                      </div>
                                    </div>
                                    {/*/ End Input Order */}
                                  </div>
                                  <a href="#" className="sherah-btn">
                                    Add to Cart
                                  </a>
                                  <a href="#" className="sherah-btn default">
                                    <svg
                                      className="sherah-default__fill sherah-default__heart"
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="21.559"
                                      height="19.349"
                                      viewBox="0 0 21.559 19.349"
                                    >
                                      <path
                                        id="Path_533"
                                        data-name="Path 533"
                                        d="M111.852,15.093v.924a1.034,1.034,0,0,0-.03.135,7.2,7.2,0,0,1-1.211,3.339,14.326,14.326,0,0,1-2.5,2.868c-1.887,1.684-3.8,3.337-5.713,4.994a1.2,1.2,0,0,1-1.7-.04q-2.192-1.885-4.378-3.777a22.751,22.751,0,0,1-3.411-3.5,7.509,7.509,0,0,1-1.514-3.347,6.362,6.362,0,0,1,1.4-5.335,5.368,5.368,0,0,1,5.028-1.9,5.245,5.245,0,0,1,3.221,1.768c.184.2.352.414.539.635.092-.119.171-.225.255-.327s.18-.216.277-.318a5.235,5.235,0,0,1,5.72-1.543,5.583,5.583,0,0,1,3.813,4.222C111.746,14.284,111.784,14.692,111.852,15.093Z"
                                        transform="translate(-90.794 -8.871)"
                                        strokeWidth={1}
                                      />
                                    </svg>
                                  </a>
                                  <a href="#" className="sherah-btn default">
                                    <svg
                                      className="sherah-default__fill"
                                      xmlns="http://www.w3.org/2000/svg"
                                      width={18}
                                      height={20}
                                      viewBox="0 0 18 20"
                                    >
                                      <g
                                        id="Com"
                                        transform="translate(-0.268 0)"
                                      >
                                        <path
                                          id="Path_527"
                                          data-name="Path 527"
                                          d="M7.895.663a4.9,4.9,0,0,1-.024.662c-.012,0-.206.035-.425.082A8.8,8.8,0,0,0,.334,8.8,9.839,9.839,0,0,0,.45,11.808a8.86,8.86,0,0,0,3.875,5.507l.226.14.56-.413a6.464,6.464,0,0,0,.56-.436.953.953,0,0,0-.218-.136,7.762,7.762,0,0,1-1.934-1.524,7.446,7.446,0,0,1-1.878-3.917,9.631,9.631,0,0,1,0-2.085,7.5,7.5,0,0,1,1.116-2.95A7.776,7.776,0,0,1,5.751,3.352a8.609,8.609,0,0,1,2.017-.678l.127-.023V3.2a3.624,3.624,0,0,0,.02.546c.04,0,2.521-1.843,2.521-1.871S7.954,0,7.915,0A5.311,5.311,0,0,0,7.895.663Z"
                                          transform="translate(0 0)"
                                        />
                                        <path
                                          id="Path_528"
                                          data-name="Path 528"
                                          d="M13.219,2.958a3.6,3.6,0,0,0-.54.44,1.467,1.467,0,0,0,.27.168,7.818,7.818,0,0,1,2.918,2.95,7.809,7.809,0,0,1,.842,2.615,8.959,8.959,0,0,1-.1,2.362,7.546,7.546,0,0,1-4.848,5.514,10.126,10.126,0,0,1-1.275.343c-.044,0-.056-.1-.056-.546a3.622,3.622,0,0,0-.02-.546c-.04,0-2.521,1.843-2.521,1.871S10.376,20,10.416,20a5.307,5.307,0,0,0,.02-.662v-.659l.151-.023a14,14,0,0,0,1.755-.468A8.765,8.765,0,0,0,18,11.154a9.922,9.922,0,0,0-.119-2.962,8.86,8.86,0,0,0-3.875-5.507l-.226-.14Z"
                                          transform="translate(0.206)"
                                        />
                                      </g>
                                    </svg>
                                  </a>
                                </div>
                              </div>
                              {/* End Sherah Product Button */}
                              <div className="sherah-border-btm pd-top-40 mg-btm-40" />
                              <div className="sherah-products-meta">
                                <ul className="sherah-products-meta__list">
                                  <li>
                                    <span className="p-list-title">SKU :</span>{" "}
                                    Chưa{" "}
                                  </li>
                                  <li>
                                    <span className="p-list-title">
                                      Category :{" "}
                                    </span>{" "}
                                    {category.name}
                                  </li>
                                  <li>
                                    <span className="p-list-title">Tags :</span>{" "}
                                    Chưa{" "}
                                  </li>
                                  <li>
                                    <span className="p-list-title">Share:</span>
                                    <ul className="sherah-contact-info sherah-contact-social">
                                      <li className="sherah-border">
                                        <a href="#">
                                          <span className="sherah-color1__bg--offset">
                                            <i className="fa-brands fa-facebook-f" />
                                          </span>
                                        </a>
                                      </li>
                                      <li className="sherah-border">
                                        <a href="#">
                                          <span className="sherah-color1__bg--offset">
                                            <i className="fa-brands fa-twitter" />
                                          </span>
                                        </a>
                                      </li>
                                      <li className="sherah-border">
                                        <a href="#">
                                          <span className="sherah-color1__bg--offset">
                                            <i className="fa-brands fa-linkedin" />
                                          </span>
                                        </a>
                                      </li>
                                      <li className="sherah-border">
                                        <a href="#">
                                          <span className="sherah-color1__bg--offset">
                                            <i className="fa-brands fa-instagram" />
                                          </span>
                                        </a>
                                      </li>
                                    </ul>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="product-detail-body sherah-default-bg sherah-border mg-top-30">
                        <div className="row">
                          <div className="col-12">
                            <div className="sherah-product-tabs mg-btm-30">
                              <div
                                className="sherah-product-tabs__list list-group "
                                id="list-tab"
                                role="tablist"
                              >
                                <a
                                  className={`list-group-item ${
                                    activeTab === "p_tab_1" ? "active" : ""
                                  }`}
                                  href="#p_tab_1"
                                  onClick={() => setActiveTab("p_tab_1")}
                                  data-bs-toggle="list"
                                  role="tab"
                                >
                                  Chi tiết sản phẩm
                                </a>
                                <a
                                  className={`list-group-item ${
                                    activeTab === "p_tab_2" ? "active" : ""
                                  }`}
                                  href="#p_tab_2"
                                  onClick={() => setActiveTab("p_tab_2")}
                                  data-bs-toggle="list"
                                  role="tab"
                                >
                                  Mô tả sản phẩm(chưa)
                                </a>
                                <a
                                  className={`list-group-item ${
                                    activeTab === "p_tab_3" ? "active" : ""
                                  }`}
                                  href="#p_tab_3"
                                  onClick={() => setActiveTab("p_tab_3")}
                                  data-bs-toggle="list"
                                  role="tab"
                                >
                                  Đánh giá(chưa)
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-12">
                            <div className="tab-content" id="nav-tabContent">
                              <div
                                className={`tab-pane fade ${
                                  activeTab === "p_tab_1" ? "show active" : ""
                                }`}
                                id="p_tab_1"
                                role="tabpanel"
                                aria-labelledby="nav-home-tab"
                              >
                                  <div className="sherah-table p-0">
      <table className="product-overview-table mg-top-30">
        <tbody>
          <tr>
            <td>
              <span className="product-overview-table_title">Tên sản phẩm</span>
            </td>
            <td>
              <span className="product-overview-table_text">{product.product_name}</span>
            </td>
          </tr>
          <tr>
            <td>
              <span className="product-overview-table_title">Hãng</span>
            </td>
            <td>
              <span className="product-overview-table_text">{product.brand}</span>
            </td>
          </tr>
          <tr>
            <td>
              <span className="product-overview-table_title">Tình trạng</span>
            </td>
            <td>
              <span className="product-overview-table_text">{formatValue(product.condition)}</span>
            </td>
          </tr>
          {product.specifications && (
            <>
              <tr>
                <td colSpan="2" className="product-overview-table_section">
                  <strong>Thông số kỹ thuật</strong>
                </td>
              </tr>
              {Object.entries(product.specifications).map(([key, value]) => (
                <tr key={key}>
                  <td>
                    <span className="product-overview-table_title">
                      {fieldLabels[key] || key}
                    </span>
                  </td>
                  <td>
                    <span className="product-overview-table_text">
                      {formatValue(value)}
                    </span>
                  </td>
                </tr>
              ))}
            </>
          )}
          {product.warranty && (
            <tr>
              <td>
                <span className="product-overview-table_title">{fieldLabels.warranty}</span>
              </td>
              <td>
                <span className="product-overview-table_text">{formatValue(product.warranty)}</span>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
                              </div>
                              <div
                                className={`tab-pane fade ${
                                  activeTab === "p_tab_2" ? "show active" : ""
                                }`}
                                id="p_tab_2"
                                role="tabpanel"
                                aria-labelledby="nav-home-tab"
                              >
                                <ul className="sherah-features-list">
                                  <li>
                                    <svg
                                      className="sherah-offset__fill"
                                      xmlns="http://www.w3.org/2000/svg"
                                      width={12}
                                      height={11}
                                      viewBox="0 0 12 11"
                                    >
                                      <g
                                        id="Group_1022"
                                        data-name="Group 1022"
                                        transform="translate(-165.75 -19.435)"
                                      >
                                        <path
                                          id="Path_550"
                                          data-name="Path 550"
                                          d="M165.75,24.587c.03-.212.052-.424.091-.634a5.39,5.39,0,0,1,7.9-3.832c.034.018.067.039.112.065l-.594,1.028a4.214,4.214,0,0,0-4.085-.04,4.027,4.027,0,0,0-2.048,2.56,4.254,4.254,0,0,0,3.005,5.353,4.023,4.023,0,0,0,3.607-.767,4.223,4.223,0,0,0,1.622-3.369h1.212c-.03.3-.042.6-.09.892a5.39,5.39,0,0,1-1.64,3.124,5.363,5.363,0,0,1-7.062.271,5.344,5.344,0,0,1-1.932-3.29c-.039-.214-.062-.43-.092-.646Z"
                                        />
                                        <path
                                          id="Path_551"
                                          data-name="Path 551"
                                          d="M271.957,39.458a1.187,1.187,0,0,0-.106.085l-5.782,5.782a1.168,1.168,0,0,0-.08.1L263,42.428l.807-.8,2.126,2.127,5.18-5.18.848.857Z"
                                          transform="translate(-94.207 -18.545)"
                                        />
                                      </g>
                                    </svg>
                                    Fiber or filament: type, size, length
                                  </li>
                                  <li>
                                    <svg
                                      className="sherah-offset__fill"
                                      xmlns="http://www.w3.org/2000/svg"
                                      width={12}
                                      height={11}
                                      viewBox="0 0 12 11"
                                    >
                                      <g
                                        id="Group_1022"
                                        data-name="Group 1022"
                                        transform="translate(-165.75 -19.435)"
                                      >
                                        <path
                                          id="Path_550"
                                          data-name="Path 550"
                                          d="M165.75,24.587c.03-.212.052-.424.091-.634a5.39,5.39,0,0,1,7.9-3.832c.034.018.067.039.112.065l-.594,1.028a4.214,4.214,0,0,0-4.085-.04,4.027,4.027,0,0,0-2.048,2.56,4.254,4.254,0,0,0,3.005,5.353,4.023,4.023,0,0,0,3.607-.767,4.223,4.223,0,0,0,1.622-3.369h1.212c-.03.3-.042.6-.09.892a5.39,5.39,0,0,1-1.64,3.124,5.363,5.363,0,0,1-7.062.271,5.344,5.344,0,0,1-1.932-3.29c-.039-.214-.062-.43-.092-.646Z"
                                        />
                                        <path
                                          id="Path_551"
                                          data-name="Path 551"
                                          d="M271.957,39.458a1.187,1.187,0,0,0-.106.085l-5.782,5.782a1.168,1.168,0,0,0-.08.1L263,42.428l.807-.8,2.126,2.127,5.18-5.18.848.857Z"
                                          transform="translate(-94.207 -18.545)"
                                        />
                                      </g>
                                    </svg>
                                    Yarn: diameter, twist, weight or size,
                                    count, fiber content for mixed yarns, ply.
                                  </li>
                                  <li>
                                    <svg
                                      className="sherah-offset__fill"
                                      xmlns="http://www.w3.org/2000/svg"
                                      width={12}
                                      height={11}
                                      viewBox="0 0 12 11"
                                    >
                                      <g
                                        id="Group_1022"
                                        data-name="Group 1022"
                                        transform="translate(-165.75 -19.435)"
                                      >
                                        <path
                                          id="Path_550"
                                          data-name="Path 550"
                                          d="M165.75,24.587c.03-.212.052-.424.091-.634a5.39,5.39,0,0,1,7.9-3.832c.034.018.067.039.112.065l-.594,1.028a4.214,4.214,0,0,0-4.085-.04,4.027,4.027,0,0,0-2.048,2.56,4.254,4.254,0,0,0,3.005,5.353,4.023,4.023,0,0,0,3.607-.767,4.223,4.223,0,0,0,1.622-3.369h1.212c-.03.3-.042.6-.09.892a5.39,5.39,0,0,1-1.64,3.124,5.363,5.363,0,0,1-7.062.271,5.344,5.344,0,0,1-1.932-3.29c-.039-.214-.062-.43-.092-.646Z"
                                        />
                                        <path
                                          id="Path_551"
                                          data-name="Path 551"
                                          d="M271.957,39.458a1.187,1.187,0,0,0-.106.085l-5.782,5.782a1.168,1.168,0,0,0-.08.1L263,42.428l.807-.8,2.126,2.127,5.18-5.18.848.857Z"
                                          transform="translate(-94.207 -18.545)"
                                        />
                                      </g>
                                    </svg>
                                    Weight: ounces per squared or yards per
                                    pound.
                                  </li>
                                  <li>
                                    <svg
                                      className="sherah-offset__fill"
                                      xmlns="http://www.w3.org/2000/svg"
                                      width={12}
                                      height={11}
                                      viewBox="0 0 12 11"
                                    >
                                      <g
                                        id="Group_1022"
                                        data-name="Group 1022"
                                        transform="translate(-165.75 -19.435)"
                                      >
                                        <path
                                          id="Path_550"
                                          data-name="Path 550"
                                          d="M165.75,24.587c.03-.212.052-.424.091-.634a5.39,5.39,0,0,1,7.9-3.832c.034.018.067.039.112.065l-.594,1.028a4.214,4.214,0,0,0-4.085-.04,4.027,4.027,0,0,0-2.048,2.56,4.254,4.254,0,0,0,3.005,5.353,4.023,4.023,0,0,0,3.607-.767,4.223,4.223,0,0,0,1.622-3.369h1.212c-.03.3-.042.6-.09.892a5.39,5.39,0,0,1-1.64,3.124,5.363,5.363,0,0,1-7.062.271,5.344,5.344,0,0,1-1.932-3.29c-.039-.214-.062-.43-.092-.646Z"
                                        />
                                        <path
                                          id="Path_551"
                                          data-name="Path 551"
                                          d="M271.957,39.458a1.187,1.187,0,0,0-.106.085l-5.782,5.782a1.168,1.168,0,0,0-.08.1L263,42.428l.807-.8,2.126,2.127,5.18-5.18.848.857Z"
                                          transform="translate(-94.207 -18.545)"
                                        />
                                      </g>
                                    </svg>
                                    Thickness: vertical depth.
                                  </li>
                                  <li>
                                    <svg
                                      className="sherah-offset__fill"
                                      xmlns="http://www.w3.org/2000/svg"
                                      width={12}
                                      height={11}
                                      viewBox="0 0 12 11"
                                    >
                                      <g
                                        id="Group_1022"
                                        data-name="Group 1022"
                                        transform="translate(-165.75 -19.435)"
                                      >
                                        <path
                                          id="Path_550"
                                          data-name="Path 550"
                                          d="M165.75,24.587c.03-.212.052-.424.091-.634a5.39,5.39,0,0,1,7.9-3.832c.034.018.067.039.112.065l-.594,1.028a4.214,4.214,0,0,0-4.085-.04,4.027,4.027,0,0,0-2.048,2.56,4.254,4.254,0,0,0,3.005,5.353,4.023,4.023,0,0,0,3.607-.767,4.223,4.223,0,0,0,1.622-3.369h1.212c-.03.3-.042.6-.09.892a5.39,5.39,0,0,1-1.64,3.124,5.363,5.363,0,0,1-7.062.271,5.344,5.344,0,0,1-1.932-3.29c-.039-.214-.062-.43-.092-.646Z"
                                        />
                                        <path
                                          id="Path_551"
                                          data-name="Path 551"
                                          d="M271.957,39.458a1.187,1.187,0,0,0-.106.085l-5.782,5.782a1.168,1.168,0,0,0-.08.1L263,42.428l.807-.8,2.126,2.127,5.18-5.18.848.857Z"
                                          transform="translate(-94.207 -18.545)"
                                        />
                                      </g>
                                    </svg>
                                    Fabric structure
                                  </li>
                                  <li>
                                    <svg
                                      className="sherah-offset__fill"
                                      xmlns="http://www.w3.org/2000/svg"
                                      width={12}
                                      height={11}
                                      viewBox="0 0 12 11"
                                    >
                                      <g
                                        id="Group_1022"
                                        data-name="Group 1022"
                                        transform="translate(-165.75 -19.435)"
                                      >
                                        <path
                                          id="Path_550"
                                          data-name="Path 550"
                                          d="M165.75,24.587c.03-.212.052-.424.091-.634a5.39,5.39,0,0,1,7.9-3.832c.034.018.067.039.112.065l-.594,1.028a4.214,4.214,0,0,0-4.085-.04,4.027,4.027,0,0,0-2.048,2.56,4.254,4.254,0,0,0,3.005,5.353,4.023,4.023,0,0,0,3.607-.767,4.223,4.223,0,0,0,1.622-3.369h1.212c-.03.3-.042.6-.09.892a5.39,5.39,0,0,1-1.64,3.124,5.363,5.363,0,0,1-7.062.271,5.344,5.344,0,0,1-1.932-3.29c-.039-.214-.062-.43-.092-.646Z"
                                        />
                                        <path
                                          id="Path_551"
                                          data-name="Path 551"
                                          d="M271.957,39.458a1.187,1.187,0,0,0-.106.085l-5.782,5.782a1.168,1.168,0,0,0-.08.1L263,42.428l.807-.8,2.126,2.127,5.18-5.18.848.857Z"
                                          transform="translate(-94.207 -18.545)"
                                        />
                                      </g>
                                    </svg>
                                    Woven fabrics: weave type, warp and filling
                                    yarn count per linear inch
                                  </li>
                                  <li>
                                    <svg
                                      className="sherah-offset__fill"
                                      xmlns="http://www.w3.org/2000/svg"
                                      width={12}
                                      height={11}
                                      viewBox="0 0 12 11"
                                    >
                                      <g
                                        id="Group_1022"
                                        data-name="Group 1022"
                                        transform="translate(-165.75 -19.435)"
                                      >
                                        <path
                                          id="Path_550"
                                          data-name="Path 550"
                                          d="M165.75,24.587c.03-.212.052-.424.091-.634a5.39,5.39,0,0,1,7.9-3.832c.034.018.067.039.112.065l-.594,1.028a4.214,4.214,0,0,0-4.085-.04,4.027,4.027,0,0,0-2.048,2.56,4.254,4.254,0,0,0,3.005,5.353,4.023,4.023,0,0,0,3.607-.767,4.223,4.223,0,0,0,1.622-3.369h1.212c-.03.3-.042.6-.09.892a5.39,5.39,0,0,1-1.64,3.124,5.363,5.363,0,0,1-7.062.271,5.344,5.344,0,0,1-1.932-3.29c-.039-.214-.062-.43-.092-.646Z"
                                        />
                                        <path
                                          id="Path_551"
                                          data-name="Path 551"
                                          d="M271.957,39.458a1.187,1.187,0,0,0-.106.085l-5.782,5.782a1.168,1.168,0,0,0-.08.1L263,42.428l.807-.8,2.126,2.127,5.18-5.18.848.857Z"
                                          transform="translate(-94.207 -18.545)"
                                        />
                                      </g>
                                    </svg>
                                    Knitted fabric: knit type, wale and course
                                    count per inch
                                  </li>
                                  <li>
                                    <svg
                                      className="sherah-offset__fill"
                                      xmlns="http://www.w3.org/2000/svg"
                                      width={12}
                                      height={11}
                                      viewBox="0 0 12 11"
                                    >
                                      <g
                                        id="Group_1022"
                                        data-name="Group 1022"
                                        transform="translate(-165.75 -19.435)"
                                      >
                                        <path
                                          id="Path_550"
                                          data-name="Path 550"
                                          d="M165.75,24.587c.03-.212.052-.424.091-.634a5.39,5.39,0,0,1,7.9-3.832c.034.018.067.039.112.065l-.594,1.028a4.214,4.214,0,0,0-4.085-.04,4.027,4.027,0,0,0-2.048,2.56,4.254,4.254,0,0,0,3.005,5.353,4.023,4.023,0,0,0,3.607-.767,4.223,4.223,0,0,0,1.622-3.369h1.212c-.03.3-.042.6-.09.892a5.39,5.39,0,0,1-1.64,3.124,5.363,5.363,0,0,1-7.062.271,5.344,5.344,0,0,1-1.932-3.29c-.039-.214-.062-.43-.092-.646Z"
                                        />
                                        <path
                                          id="Path_551"
                                          data-name="Path 551"
                                          d="M271.957,39.458a1.187,1.187,0,0,0-.106.085l-5.782,5.782a1.168,1.168,0,0,0-.08.1L263,42.428l.807-.8,2.126,2.127,5.18-5.18.848.857Z"
                                          transform="translate(-94.207 -18.545)"
                                        />
                                      </g>
                                    </svg>
                                    Finishes: chemicals such as resins,
                                    starches, waxes and mechanical effects such
                                    as
                                  </li>
                                  <li>
                                    <svg
                                      className="sherah-offset__fill"
                                      xmlns="http://www.w3.org/2000/svg"
                                      width={12}
                                      height={11}
                                      viewBox="0 0 12 11"
                                    >
                                      <g
                                        id="Group_1022"
                                        data-name="Group 1022"
                                        transform="translate(-165.75 -19.435)"
                                      >
                                        <path
                                          id="Path_550"
                                          data-name="Path 550"
                                          d="M165.75,24.587c.03-.212.052-.424.091-.634a5.39,5.39,0,0,1,7.9-3.832c.034.018.067.039.112.065l-.594,1.028a4.214,4.214,0,0,0-4.085-.04,4.027,4.027,0,0,0-2.048,2.56,4.254,4.254,0,0,0,3.005,5.353,4.023,4.023,0,0,0,3.607-.767,4.223,4.223,0,0,0,1.622-3.369h1.212c-.03.3-.042.6-.09.892a5.39,5.39,0,0,1-1.64,3.124,5.363,5.363,0,0,1-7.062.271,5.344,5.344,0,0,1-1.932-3.29c-.039-.214-.062-.43-.092-.646Z"
                                        />
                                        <path
                                          id="Path_551"
                                          data-name="Path 551"
                                          d="M271.957,39.458a1.187,1.187,0,0,0-.106.085l-5.782,5.782a1.168,1.168,0,0,0-.08.1L263,42.428l.807-.8,2.126,2.127,5.18-5.18.848.857Z"
                                          transform="translate(-94.207 -18.545)"
                                        />
                                      </g>
                                    </svg>
                                    Calendaring and napping applied to the woven
                                    fabric to yield or enhance style,
                                    durability, and utility values.
                                  </li>
                                  <li>
                                    <svg
                                      className="sherah-offset__fill"
                                      xmlns="http://www.w3.org/2000/svg"
                                      width={12}
                                      height={11}
                                      viewBox="0 0 12 11"
                                    >
                                      <g
                                        id="Group_1022"
                                        data-name="Group 1022"
                                        transform="translate(-165.75 -19.435)"
                                      >
                                        <path
                                          id="Path_550"
                                          data-name="Path 550"
                                          d="M165.75,24.587c.03-.212.052-.424.091-.634a5.39,5.39,0,0,1,7.9-3.832c.034.018.067.039.112.065l-.594,1.028a4.214,4.214,0,0,0-4.085-.04,4.027,4.027,0,0,0-2.048,2.56,4.254,4.254,0,0,0,3.005,5.353,4.023,4.023,0,0,0,3.607-.767,4.223,4.223,0,0,0,1.622-3.369h1.212c-.03.3-.042.6-.09.892a5.39,5.39,0,0,1-1.64,3.124,5.363,5.363,0,0,1-7.062.271,5.344,5.344,0,0,1-1.932-3.29c-.039-.214-.062-.43-.092-.646Z"
                                        />
                                        <path
                                          id="Path_551"
                                          data-name="Path 551"
                                          d="M271.957,39.458a1.187,1.187,0,0,0-.106.085l-5.782,5.782a1.168,1.168,0,0,0-.08.1L263,42.428l.807-.8,2.126,2.127,5.18-5.18.848.857Z"
                                          transform="translate(-94.207 -18.545)"
                                        />
                                      </g>
                                    </svg>
                                    Fabric width: The length of the filling or
                                    course
                                  </li>
                                </ul>
                              </div>
                              <div
                                className={`tab-pane fade ${
                                  activeTab === "p_tab_3" ? "show active" : ""
                                }`}
                                id="p_tab_3"
                                role="tabpanel"
                                aria-labelledby="nav-home-tab"
                              >
                                {/* Sherah Review */}
                                <div className="sherah-user-reviews">
                                  {/* Single Review */}
                                  <div className="sherah-user-reviews__single">
                                    <div className="shera-user-reviews_thumb">
                                      <img src="/assets/interface-dashboard/img/review-1.png" />
                                    </div>
                                    <div className="sherah-user-reviews__content">
                                      <h4 className="sherah-user-reviews_title">
                                        Abubokkor Siddik
                                      </h4>
                                      <div className="sherah-product-card__rating sherah-dflex sherah-flex-gap-5">
                                        <span className="sherah-color4">
                                          <i className="fa fa-star" />
                                        </span>
                                        <span className="sherah-color4">
                                          <i className="fa fa-star" />
                                        </span>
                                        <span className="sherah-color4">
                                          <i className="fa fa-star" />
                                        </span>
                                        <span className="sherah-color4">
                                          <i className="fa fa-star" />
                                        </span>
                                      </div>
                                      <p className="sherah-user-reviews__text">
                                        This is some unreal beauty!I really
                                        liked it! What a beautiful light it
                                        comes from! The radius of bright light
                                        is about meters
                                      </p>
                                      <div className="sherah-user-reviews__buttons">
                                        <a
                                          href="#"
                                          className="sherah-color3 sherah-color3__bg--opactity"
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="17.136"
                                            height="15.5"
                                            viewBox="0 0 17.136 15.5"
                                          >
                                            <path
                                              id="Icon"
                                              d="M106.729,13.669v.694a.779.779,0,0,0-.022.1,5.407,5.407,0,0,1-.909,2.507,10.756,10.756,0,0,1-1.877,2.153c-1.417,1.265-2.855,2.505-4.29,3.75a.9.9,0,0,1-1.28-.03q-1.646-1.415-3.287-2.836a17.082,17.082,0,0,1-2.561-2.63,5.638,5.638,0,0,1-1.136-2.513,4.777,4.777,0,0,1,1.049-4.005,4.03,4.03,0,0,1,3.775-1.423,3.938,3.938,0,0,1,2.419,1.328c.138.149.264.31.4.477.069-.089.128-.169.192-.246s.135-.162.208-.239A3.931,3.931,0,0,1,103.71,9.6a4.192,4.192,0,0,1,2.863,3.17C106.65,13.062,106.679,13.368,106.729,13.669Z"
                                              transform="translate(-90.443 -8.519)"
                                              fill="none"
                                              stroke="#09ad95"
                                              strokeWidth="1.7"
                                            />
                                          </svg>{" "}
                                          80
                                        </a>
                                        <a
                                          href="#"
                                          className="sherah-color2 sherah-color2__bg--opactity"
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="17.684"
                                            height="15.304"
                                            viewBox="0 0 17.684 15.304"
                                          >
                                            <path
                                              id="Icon"
                                              d="M122.755,24.156c-.059.315-.1.635-.18.945a7.044,7.044,0,0,1-1.362,2.647l-.383.482-1.064-.84.358-.454a5.942,5.942,0,0,0,1.108-2.061,4.449,4.449,0,0,0-.089-2.687,4.951,4.951,0,0,0-2.707-3.014,4.9,4.9,0,0,0-2.089-.447q-4.115-.007-8.231,0c-.032,0-.065,0-.094,0l3.064,3.06-.963.962-4.69-4.694,4.71-4.711.925.925-3.1,3.1h.24q4.005,0,8.01,0a6.442,6.442,0,0,1,3.671,1.067,6.311,6.311,0,0,1,2.422,3,5.989,5.989,0,0,1,.417,1.86.716.716,0,0,0,.025.114Z"
                                              transform="translate(-105.221 -13.137)"
                                              fill="#ff6767"
                                              stroke="#ff6767"
                                              strokeWidth="0.3"
                                            />
                                          </svg>{" "}
                                          Reply
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                  {/* End Single Review */}
                                  {/* Single Review */}
                                  <div className="sherah-user-reviews__single sherah-user-reviews__single--reply">
                                    <div className="shera-user-reviews_thumb">
                                      <img src="/assets/interface-dashboard/img/review-2.png" />
                                    </div>
                                    <div className="sherah-user-reviews__content">
                                      <h4 className="sherah-user-reviews_title">
                                        Admin
                                      </h4>
                                      <div className="sherah-product-card__rating sherah-dflex sherah-flex-gap-5">
                                        <span className="sherah-color4">
                                          <i className="fa fa-star" />
                                        </span>
                                        <span className="sherah-color4">
                                          <i className="fa fa-star" />
                                        </span>
                                        <span className="sherah-color4">
                                          <i className="fa fa-star" />
                                        </span>
                                        <span className="sherah-color4">
                                          <i className="fa fa-star" />
                                        </span>
                                      </div>
                                      <p className="sherah-user-reviews__text">
                                        Thank Your for opinion.
                                      </p>
                                      <div className="sherah-user-reviews__buttons">
                                        <a
                                          href="#"
                                          className="sherah-color3 sherah-color3__bg--opactity"
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="17.136"
                                            height="15.5"
                                            viewBox="0 0 17.136 15.5"
                                          >
                                            <path
                                              id="Icon"
                                              d="M106.729,13.669v.694a.779.779,0,0,0-.022.1,5.407,5.407,0,0,1-.909,2.507,10.756,10.756,0,0,1-1.877,2.153c-1.417,1.265-2.855,2.505-4.29,3.75a.9.9,0,0,1-1.28-.03q-1.646-1.415-3.287-2.836a17.082,17.082,0,0,1-2.561-2.63,5.638,5.638,0,0,1-1.136-2.513,4.777,4.777,0,0,1,1.049-4.005,4.03,4.03,0,0,1,3.775-1.423,3.938,3.938,0,0,1,2.419,1.328c.138.149.264.31.4.477.069-.089.128-.169.192-.246s.135-.162.208-.239A3.931,3.931,0,0,1,103.71,9.6a4.192,4.192,0,0,1,2.863,3.17C106.65,13.062,106.679,13.368,106.729,13.669Z"
                                              transform="translate(-90.443 -8.519)"
                                              fill="none"
                                              stroke="#09ad95"
                                              strokeWidth="1.7"
                                            />
                                          </svg>{" "}
                                          80
                                        </a>
                                        <a
                                          href="#"
                                          className="sherah-color2 sherah-color2__bg--opactity"
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="17.684"
                                            height="15.304"
                                            viewBox="0 0 17.684 15.304"
                                          >
                                            <path
                                              id="Icon"
                                              d="M122.755,24.156c-.059.315-.1.635-.18.945a7.044,7.044,0,0,1-1.362,2.647l-.383.482-1.064-.84.358-.454a5.942,5.942,0,0,0,1.108-2.061,4.449,4.449,0,0,0-.089-2.687,4.951,4.951,0,0,0-2.707-3.014,4.9,4.9,0,0,0-2.089-.447q-4.115-.007-8.231,0c-.032,0-.065,0-.094,0l3.064,3.06-.963.962-4.69-4.694,4.71-4.711.925.925-3.1,3.1h.24q4.005,0,8.01,0a6.442,6.442,0,0,1,3.671,1.067,6.311,6.311,0,0,1,2.422,3,5.989,5.989,0,0,1,.417,1.86.716.716,0,0,0,.025.114Z"
                                              transform="translate(-105.221 -13.137)"
                                              fill="#ff6767"
                                              stroke="#ff6767"
                                              strokeWidth="0.3"
                                            />
                                          </svg>{" "}
                                          Reply
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                  {/* End Single Review */}
                                  {/* Single Review */}
                                  <div className="sherah-user-reviews__single">
                                    <div className="shera-user-reviews_thumb">
                                      <img src="/assets/interface-dashboard/img/review-3.png" />
                                    </div>
                                    <div className="sherah-user-reviews__content">
                                      <h4 className="sherah-user-reviews_title">
                                        Deniella Rhodes
                                      </h4>
                                      <div className="sherah-product-card__rating sherah-dflex sherah-flex-gap-5">
                                        <span className="sherah-color4">
                                          <i className="fa fa-star" />
                                        </span>
                                        <span className="sherah-color4">
                                          <i className="fa fa-star" />
                                        </span>
                                        <span className="sherah-color4">
                                          <i className="fa fa-star" />
                                        </span>
                                        <span className="sherah-color4">
                                          <i className="fa fa-star" />
                                        </span>
                                      </div>
                                      <p className="sherah-user-reviews__text">
                                        Rreally liked it! What a beautiful light
                                        it comes from! The radius of bright.
                                      </p>
                                      <div className="sherah-user-reviews__buttons">
                                        <a
                                          href="#"
                                          className="sherah-color3 sherah-color3__bg--opactity"
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="17.136"
                                            height="15.5"
                                            viewBox="0 0 17.136 15.5"
                                          >
                                            <path
                                              id="Icon"
                                              d="M106.729,13.669v.694a.779.779,0,0,0-.022.1,5.407,5.407,0,0,1-.909,2.507,10.756,10.756,0,0,1-1.877,2.153c-1.417,1.265-2.855,2.505-4.29,3.75a.9.9,0,0,1-1.28-.03q-1.646-1.415-3.287-2.836a17.082,17.082,0,0,1-2.561-2.63,5.638,5.638,0,0,1-1.136-2.513,4.777,4.777,0,0,1,1.049-4.005,4.03,4.03,0,0,1,3.775-1.423,3.938,3.938,0,0,1,2.419,1.328c.138.149.264.31.4.477.069-.089.128-.169.192-.246s.135-.162.208-.239A3.931,3.931,0,0,1,103.71,9.6a4.192,4.192,0,0,1,2.863,3.17C106.65,13.062,106.679,13.368,106.729,13.669Z"
                                              transform="translate(-90.443 -8.519)"
                                              fill="none"
                                              stroke="#09ad95"
                                              strokeWidth="1.7"
                                            />
                                          </svg>{" "}
                                          80
                                        </a>
                                        <a
                                          href="#"
                                          className="sherah-color2 sherah-color2__bg--opactity"
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="17.684"
                                            height="15.304"
                                            viewBox="0 0 17.684 15.304"
                                          >
                                            <path
                                              id="Icon"
                                              d="M122.755,24.156c-.059.315-.1.635-.18.945a7.044,7.044,0,0,1-1.362,2.647l-.383.482-1.064-.84.358-.454a5.942,5.942,0,0,0,1.108-2.061,4.449,4.449,0,0,0-.089-2.687,4.951,4.951,0,0,0-2.707-3.014,4.9,4.9,0,0,0-2.089-.447q-4.115-.007-8.231,0c-.032,0-.065,0-.094,0l3.064,3.06-.963.962-4.69-4.694,4.71-4.711.925.925-3.1,3.1h.24q4.005,0,8.01,0a6.442,6.442,0,0,1,3.671,1.067,6.311,6.311,0,0,1,2.422,3,5.989,5.989,0,0,1,.417,1.86.716.716,0,0,0,.025.114Z"
                                              transform="translate(-105.221 -13.137)"
                                              fill="#ff6767"
                                              stroke="#ff6767"
                                              strokeWidth="0.3"
                                            />
                                          </svg>{" "}
                                          Reply
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                  {/* End Single Review */}
                                  {/* Single Review */}
                                  <div className="sherah-user-reviews__single">
                                    <div className="shera-user-reviews_thumb">
                                      <img src="/assets/interface-dashboard/img/review-4.png" />
                                    </div>
                                    <div className="sherah-user-reviews__content">
                                      <h4 className="sherah-user-reviews_title">
                                        Deniella Rhodes
                                      </h4>
                                      <div className="sherah-product-card__rating sherah-dflex sherah-flex-gap-5">
                                        <span className="sherah-color4">
                                          <i className="fa fa-star" />
                                        </span>
                                        <span className="sherah-color4">
                                          <i className="fa fa-star" />
                                        </span>
                                        <span className="sherah-color4">
                                          <i className="fa fa-star" />
                                        </span>
                                        <span className="sherah-color4">
                                          <i className="fa fa-star" />
                                        </span>
                                      </div>
                                      <p className="sherah-user-reviews__text">
                                        Rreally liked it! What a beautiful light
                                        it comes from! The radius of bright.
                                      </p>
                                      <div className="sherah-user-reviews__buttons">
                                        <a
                                          href="#"
                                          className="sherah-color3 sherah-color3__bg--opactity"
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="17.136"
                                            height="15.5"
                                            viewBox="0 0 17.136 15.5"
                                          >
                                            <path
                                              id="Icon"
                                              d="M106.729,13.669v.694a.779.779,0,0,0-.022.1,5.407,5.407,0,0,1-.909,2.507,10.756,10.756,0,0,1-1.877,2.153c-1.417,1.265-2.855,2.505-4.29,3.75a.9.9,0,0,1-1.28-.03q-1.646-1.415-3.287-2.836a17.082,17.082,0,0,1-2.561-2.63,5.638,5.638,0,0,1-1.136-2.513,4.777,4.777,0,0,1,1.049-4.005,4.03,4.03,0,0,1,3.775-1.423,3.938,3.938,0,0,1,2.419,1.328c.138.149.264.31.4.477.069-.089.128-.169.192-.246s.135-.162.208-.239A3.931,3.931,0,0,1,103.71,9.6a4.192,4.192,0,0,1,2.863,3.17C106.65,13.062,106.679,13.368,106.729,13.669Z"
                                              transform="translate(-90.443 -8.519)"
                                              fill="none"
                                              stroke="#09ad95"
                                              strokeWidth="1.7"
                                            />
                                          </svg>{" "}
                                          80
                                        </a>
                                        <a
                                          href="#"
                                          className="sherah-color2 sherah-color2__bg--opactity"
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="17.684"
                                            height="15.304"
                                            viewBox="0 0 17.684 15.304"
                                          >
                                            <path
                                              id="Icon"
                                              d="M122.755,24.156c-.059.315-.1.635-.18.945a7.044,7.044,0,0,1-1.362,2.647l-.383.482-1.064-.84.358-.454a5.942,5.942,0,0,0,1.108-2.061,4.449,4.449,0,0,0-.089-2.687,4.951,4.951,0,0,0-2.707-3.014,4.9,4.9,0,0,0-2.089-.447q-4.115-.007-8.231,0c-.032,0-.065,0-.094,0l3.064,3.06-.963.962-4.69-4.694,4.71-4.711.925.925-3.1,3.1h.24q4.005,0,8.01,0a6.442,6.442,0,0,1,3.671,1.067,6.311,6.311,0,0,1,2.422,3,5.989,5.989,0,0,1,.417,1.86.716.716,0,0,0,.025.114Z"
                                              transform="translate(-105.221 -13.137)"
                                              fill="#ff6767"
                                              stroke="#ff6767"
                                              strokeWidth="0.3"
                                            />
                                          </svg>{" "}
                                          Reply
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                  {/* End Single Review */}
                                </div>
                                {/* End Sherah Review */}
                                {/* Sherah Comment */}
                                <div className="sherah-review-comment mg-top-30">
                                  <h3 className="sherah-review-comment__title">
                                    Add Your Review
                                  </h3>
                                  <form
                                    className="sherah-wc__form-main sherah-form-main--v2 p-0"
                                    action="#"
                                    method="post"
                                  >
                                    <div className="row">
                                      <div className="col-lg-6 col-md-6 col-12">
                                        <div className="form-group">
                                          <label className="sherah-wc__form-label">
                                            First Name *
                                          </label>
                                          <div className="form-group__input">
                                            <input
                                              className="sherah-wc__form-input"
                                              placeholder="Your name here"
                                              type="text"
                                              name="f_name"
                                              required="required"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-lg-6 col-md-6 col-12">
                                        <div className="form-group">
                                          <label className="sherah-wc__form-label">
                                            Email Address*
                                          </label>
                                          <div className="form-group__input">
                                            <input
                                              className="sherah-wc__form-input"
                                              placeholder="Your email address here"
                                              type="text"
                                              name="e_address"
                                              required="required"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-12">
                                        <div className="form-group">
                                          <label className="sherah-wc__form-label">
                                            Review*
                                          </label>
                                          <div className="form-group__input">
                                            <textarea
                                              className="sherah-wc__form-input sherah-wc__form-input--big"
                                              placeholder="Write your text"
                                              type="text"
                                              name="d_area"
                                              required="required"
                                              defaultValue={""}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="form-group mg-top-30">
                                      <button
                                        type="submit"
                                        className="sherah-btn sherah-btn__primary"
                                      >
                                        Submit Now
                                      </button>
                                    </div>
                                  </form>
                                </div>
                                {/* End Sherah Comment */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* End Dashboard Inner */}
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* End sherah Dashboard */}
        </div>
        {/* sherah Scripts */}
      </>
    </div>
  );
};

export default Product;
