import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import moment from "moment";
import axios from "axios";

const Product = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState("");
  const [activeTab, setActiveTab] = useState("p_tab_1");

  const [replyName, setReplyName] = useState("");

  // State cho danh sách bình luận của sản phẩm hiện tại
  const [reviews, setReviews] = useState([]);

  // Các biến state cho form bình luận
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const [image, setImage] = useState(null);

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
      if (valueMappings[value]) return valueMappings[value];
      return value.replace(/\b(years?|Years?)\b/g, "năm");
    }
    return value;
  };

  // Các state reply và report
  const [expandedReplies, setExpandedReplies] = useState({}); 
  const [activeReplyForm, setActiveReplyForm] = useState(null); 
  const [replyContent, setReplyContent] = useState("");

  // Function to calculate average rating
  const calculateAverageRating = () => {
    if (!reviews || reviews.length === 0) return 0;
    
    const totalRating = reviews.reduce((sum, review) => sum + parseInt(review.rating || 0), 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  // Tạo component hiển thị sao đánh giá
  const RatingStars = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <span key={i} className="sherah-color4">
            <i className="fa fa-star" />
          </span>
        ))}
        {hasHalfStar && (
          <span className="sherah-color4">
            <i className="fa fa-star-half-o" />
          </span>
        )}
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <span key={i + fullStars + (hasHalfStar ? 1 : 0)} className="sherah-color4">
            <i className="fa fa-star-o" />
          </span>
        ))}
      </>
    );
  };

  // Hàm lấy danh sách bình luận của sản phẩm theo productId
  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${API_URL}/comment`, {
        params: { productId: id },
      });
      // Chỉ hiển thị các bình luận có trạng thái "active"
      const activeReviews = res.data.filter((rev) => rev.status === "active");
      setReviews(activeReviews);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách bình luận:", err);
    }
  };

  // Lấy thông tin sản phẩm và bình luận
  useEffect(() => {
    if (!id) return;
    fetch(`${API_URL}/product/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Lỗi API sản phẩm: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        if (data.category_id && typeof data.category_id === "string") {
          fetchCategory(data.category_id);
        }
        fetchReviews(); // Lấy bình luận sau khi sản phẩm được load
      })
      .catch((err) => console.error("Lỗi khi lấy sản phẩm:", err));
  }, [id, API_URL]);

  const fetchCategory = (categoryId) => {
    fetch(`${API_URL}/product/get-category`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

  // Xử lý chọn file ảnh từ máy tính
  // const handleImageChange = (e) => {
  //   if (e.target.files && e.target.files[0]) {
  //     setImage(e.target.files[0]);
  //   }
  // };

  // // Xử lý dán ảnh từ clipboard
  // const handlePaste = (e) => {
  //   const items = e.clipboardData.items;
  //   for (let i = 0; i < items.length; i++) {
  //     if (items[i].type.indexOf("image") !== -1) {
  //       const file = items[i].getAsFile();
  //       setImage(file);
  //     }
  //   }
  // };

  // Xử lý gửi bình luận mới
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("productId", id);
    formData.append("username", firstName);
    formData.append("email", email);
    formData.append("content", review);
    formData.append("rating", rating);
    if (image) {
      formData.append("image", image);
    }
    try {
      const res = await axios.post(`${API_URL}/comment`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Comment submitted:", res.data);
      // Thêm bình luận mới vào đầu danh sách reviews
      setReviews([res.data, ...reviews]);
      // Reset form sau khi gửi
      setFirstName("");
      setEmail("");
      setReview("");
      setRating(5);
      setImage(null);
    } catch (err) {
      console.error("Error submitting comment:", err);
    }
  };

  // Hàm xử lý mở/thu gọn reply cho 1 bình luận
  const toggleReplies = (commentId) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  // Hàm gửi reply cho bình luận
  const handleReplySubmit = async (commentId) => {
    if (!replyName.trim() || !replyContent.trim()) {
      alert("Vui lòng nhập tên và nội dung reply.");
      return;
    }
    try {
      const res = await axios.post(`${API_URL}/comment/reply/${commentId}`, {
        username: replyName,
        content: replyContent,
        role: "user",
      });
      // Sau khi gửi thành công, cập nhật lại danh sách bình luận (ví dụ qua fetchReviews)
      fetchReviews();
      setReplyName("");
      setReplyContent("");
      setActiveReplyForm(null);
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
  };
  
 
// Hàm báo cáo bình luận
const handleReport = async (commentId) => {
  try {
    const reporter = prompt("Nhập tên người dùng để báo cáo:");
    if (!reporter) return;

    const reason = prompt("Nhập lý do báo cáo:");
    if (!reason) return;

    await axios.post(`${API_URL}/comment/report/${commentId}`, {
      reporter,
      reason,
    });
    alert("Bình luận đã được báo cáo");
  } catch (error) {
    console.error("Error reporting comment:", error);
  }
};

const handleReportReply = async (replyId) => {
  try {
    const reporter = prompt("Nhập tên người dùng để báo cáo reply:");
    if (!reporter) return;

    const reason = prompt("Nhập lý do báo cáo reply:");
    if (!reason) return;

    await axios.post(`${API_URL}/comment/report/reply/${replyId}`, {
      reporter,
      reason,
    });
    alert("Reply đã được báo cáo");
  } catch (error) {
    console.error("Error reporting reply:", error);
  }
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
                                  {product.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                                </h5>
                                <div className="sherah-product-card__meta sherah-dflex sherah-flex-gap-30">
                                  <div className="sherah-product-card__rating sherah-dflex sherah-flex-gap-5">
                                    <RatingStars rating={calculateAverageRating()} />
                                    ({reviews.length})
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
                                  Đánh giá(đường tam tạng)
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
                {/* Tab: Reviews */}
<div
  className={`tab-pane fade ${activeTab === "p_tab_3" ? "show active" : ""}`}
  id="p_tab_3"
  role="tabpanel"
  aria-labelledby="nav-home-tab"
>
  {/* Danh sách bình luận cho sản phẩm */}
  <div className="sherah-user-reviews">
    {reviews.length > 0 ? (
      reviews.map((item) => (
        <div key={item._id} className="sherah-user-reviews__single">
          <div className="shera-user-reviews_thumb">
            <img
              src={
                item.image
                  ? `${API_URL}/${item.image}`
                  : "/assets/interface-dashboard/img/def-1.png"
              }
              alt="Review"
            />
          </div>
          <div className="sherah-user-reviews__content">
            <div className="sherah-user-reviews__header">
              <h4 className="sherah-user-reviews_title">{item.username}</h4>
              <span className="sherah-review-date">
                {moment(item.createdAt).format("DD/MM/YYYY HH:mm")}
              </span>
            </div>
            <div className="sherah-product-card__rating sherah-dflex sherah-flex-gap-5">
              {Array.from({ length: parseInt(item.rating) }).map((_, idx) => (
                <span key={idx} className="sherah-color4">
                  <i className="fa fa-star" />
                </span>
              ))}
            </div>
            <p className="sherah-user-reviews__text">{item.content}</p>


                  {/* Các nút thao tác: Reply & Báo cáo */}
                  <div className="sherah-user-reviews__buttons">
  <button
    onClick={() =>
      setActiveReplyForm(activeReplyForm === item._id ? null : item._id)
    }
    className="sherah-color2 sherah-color2__bg--opactity"
    style={{
      backgroundColor: "#ffebeb", 
      color: "white", 
      border: "none", 
      borderRadius: "5px", 
      padding: "8px 20px",    
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "5px",
    }}
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
        // stroke="#ff6767" 
      />
    </svg>
    Reply
  </button>

  <button
  onClick={() => handleReport(item._id)}
  className="sherah-color3 sherah-color3__bg--opactity"
  style={{
    backgroundColor: "#6176fe",  
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "8px 12px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  }}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="#e3db90"  
  >
    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
  </svg>
  <span style={{ color: "#FFFFFF" }}>Báo cáo</span> 
</button>

</div>

            {/* Hiển thị danh sách reply  */}
            {item.replies && item.replies.length > 0 && (
              <div className="sherah-replies">
                {(expandedReplies[item._id]
                  ? item.replies
                  : item.replies.slice(0, 2)
                ).map((reply, idx) => (
                  <div
                    key={idx}
                    className="sherah-user-reviews__single sherah-user-reviews__single--reply"
                  >
                    <div className="shera-user-reviews_thumb">
                      <img
                        src={
                          reply.role === 'admin'
                            ? "/assets/interface-dashboard/img/icon-admin1.png"
                            : reply.image
                              ? `${API_URL}/${reply.image}`
                              : "/assets/interface-dashboard/img/def-1.png"
                        }
                        alt="Reply"
                      />
                    </div>
                    <div className="sherah-user-reviews__content">
                      <h4 className="sherah-user-reviews_title">
                        {reply.username}
                      </h4>
                      <div className="sherah-product-card__rating sherah-dflex sherah-flex-gap-5">
                        {reply.rating &&
                          Array.from({ length: parseInt(reply.rating) }).map(
                            (_, i) => (
                              <span key={i} className="sherah-color4">
                                <i className="fa fa-star" />
                              </span>
                            )
                          )}
                      </div>
                      <p className="sherah-user-reviews__text">
                        {reply.content}
                      </p>
                      <div className="sherah-user-reviews__buttons">
                        <button
                          onClick={() =>
                            setActiveReplyForm(activeReplyForm === item._id ? null : item._id)
                          }
                          className="sherah-color2 sherah-color2__bg--opactity"
                          style={{
                            backgroundColor: "#ffebeb",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            padding: "8px 20px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
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
                            // stroke="#ff6767" 
                            />
                          </svg>
                          Reply
                        </button>

                        <button
                          onClick={() => handleReportReply(reply._id)}
                          className="sherah-color3 sherah-color3__bg--opactity"
                          style={{
                            backgroundColor: "#6176fe",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            padding: "8px 12px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="#e3db90"
                          >
                            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                          </svg>
                          <span style={{ color: "#FFFFFF" }}>Báo cáo</span>
                        </button>


                      </div>
                    </div>
                  </div>
                ))}
                {item.replies.length > 2 && (
                  <button
                  onClick={() => toggleReplies(item._id)}
                  style={{
                    backgroundColor: expandedReplies[item._id] ? "#8a4af3" : "#f4a261",  
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    padding: "8px 12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="white"
                  >
                    {expandedReplies[item._id] ? (
                      <path d="M5 12h14" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    ) : (
                      <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    )}
                  </svg>
                  <span>{expandedReplies[item._id] ? "Ẩn bớt" : "Xem thêm"}</span>
                </button>
                
                )}
              </div>
            )}
       
            {/* Form gửi reply với giao diện giống "Add Your Review" */}
            {activeReplyForm === item._id && (
              <div className="sherah-review-comment mg-top-30">
                <h3 className="sherah-review-comment__title">
                  Add Your Reply
                </h3>
                <form
                  className="sherah-wc__form-main sherah-form-main--v2 p-0"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleReplySubmit(item._id);
                  }}
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
                            value={replyName}
                            onChange={(e) =>
                              setReplyName(e.target.value)
                            }
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group">
                        <label className="sherah-wc__form-label">
                          Reply *
                        </label>
                        <div className="form-group__input">
                          <textarea
                            className="sherah-wc__form-input sherah-wc__form-input--big"
                            placeholder="Write your reply..."
                            value={replyContent}
                            onChange={(e) =>
                              setReplyContent(e.target.value)
                            }
                            required
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
            )}
          </div>
        </div>
      ))
    ) : (
      <p>No reviews yet.</p>
    )}
  </div>

  {/* Form gửi bình luận mới */}
  <div className="sherah-review-comment mg-top-30">
    <h3 className="sherah-review-comment__title">Add Your Review</h3>
    <form
      className="sherah-wc__form-main sherah-form-main--v2 p-0"
      onSubmit={handleSubmit}
      // onPaste={handlePaste}
    >
      <div className="row">
        <div className="col-lg-6 col-md-6 col-12">
          <div className="form-group">
            <label className="sherah-wc__form-label">First Name *</label>
            <div className="form-group__input">
              <input
                className="sherah-wc__form-input"
                placeholder="Your name here"
                type="text"
                name="f_name"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
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
                type="email"
                name="e_address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <label className="sherah-wc__form-label">Review*</label>
            <div className="form-group__input">
              <textarea
                className="sherah-wc__form-input sherah-wc__form-input--big"
                placeholder="Write your text"
                name="d_area"
                required
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <label className="sherah-wc__form-label">Rating*</label>
            <div className="form-group__input">
              <select
                className="sherah-wc__form-input"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              >
                <option value={1}>1 star</option>
                <option value={2}>2 stars</option>
                <option value={3}>3 stars</option>
                <option value={4}>4 stars</option>
                <option value={5}>5 stars</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="form-group">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
          id="uploadImage"
        />
        <label
          htmlFor="uploadImage"
          className="sherah-btn sherah-btn__secondary"
        >
          Upload Image
        </label>
        {image && <span className="ml-2">{image.name}</span>}
      </div> */}
      <div className="form-group mg-top-30">
        <button type="submit" className="sherah-btn sherah-btn__primary">
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
