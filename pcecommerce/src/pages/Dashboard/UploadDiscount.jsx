import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Uploaddiscount() {
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [discountTypes, setDiscountTypes] = useState([]);
  const [code, setCode] = useState("");
  const [discountDescription, setDiscountDescription] = useState("");
  const [selectedDiscountType, setSelectedDiscountType] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [discountValue, setDiscountValue] = useState(0);
  const [minOrderValue, setMinOrderValue] = useState(0);
  const [maxUses, setMaxUses] = useState(1);
  const [useCount, setUseCount] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);

  const discountTypeLabels = {
    fixed_amount: "Giảm thẳng",
    percentage: "Phần trăm",
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/product/get-product-names`);
        const data = await response.json();

        setProducts(data);
      } catch (err) {
        console.error("Lỗi khi lấy sản phẩm:", err);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/product/categories`);
        const data = await response.json();

        setCategories(data.map((category) => category.name));
      } catch (err) {
        console.error("Lỗi khi lấy danh mục:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleChangeCategory = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleChangeProduct = (event) => {
    setSelectedProduct(event.target.value);
  };

  useEffect(() => {
    const fetchDiscountTypes = async () => {
      try {
        const response = await fetch(`${API_URL}/discount/get-discount-types`);
        const data = await response.json();
        setDiscountTypes(data);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách:", err);
      }
    };
    fetchDiscountTypes();
  }, []);

  const handleChangeDiscountType = (event) => {
    setSelectedDiscountType(event.target.value);
  };

  //Hàm thêm mã giảm giá
  const handleSubmit = async () => {
    try {
      const data = {
        code: code,
        description: discountDescription,
        discount_type: selectedDiscountType,
        discount_value: discountValue,
        min_order_value: minOrderValue,
        applicable_categories: selectedCategories,
        applicable_products: selectedProducts,
        max_uses: maxUses,
        uses_count: useCount,
        start_date: startDate,
        end_date: endDate,
      };

      const response = await fetch(`${API_URL}/discount/add-discount`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Mã giảm giá đã được thêm thành công! 🎉");

        // Reset tất cả các state
        setCode("");
        setDiscountDescription("");
        setSelectedDiscountType("");
        setDiscountValue(0);
        setMinOrderValue(0);
        setSelectedCategories([]);
        setSelectedProducts([]);
        setMaxUses(1);
        setUseCount(0);
        setStartDate("");
        setEndDate("");
        navigate("/admin/discount");
      } else {
        const errorData = await response.json();
        alert(`Lỗi: ${errorData.message}`);
      }
    } catch (err) {
      console.error("Lỗi khi gửi dữ liệu:", err);
      alert("Lỗi khi thêm mã giảm giá, vui lòng thử lại.");
    }
  };

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
                      <div className="row">
                        <div className="col-12">
                          <div className="sherah-breadcrumb mg-top-30">
                            <h2 className="sherah-breadcrumb__title">
                              Thêm mã giảm giá
                            </h2>
                            <ul className="sherah-breadcrumb__list">
                              <li>
                                <a href="#">admin</a>
                              </li>
                              <li className="active">
                                <a href="/admin/uploaddiscount">
                                  uploaddiscount
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="sherah-page-inner sherah-border sherah-basic-page sherah-default-bg mg-top-25 p-0">
                        <form
                          onSubmit={(event) => {
                            event.preventDefault();
                            handleSubmit();
                          }}
                          className="sherah-wc__form-main"
                          action="#"
                        >
                          <div className="row">
                            <div className="col-lg-6 col-12">
                              {/* Discount Info */}
                              <div className="product-form-box sherah-border mg-top-30">
                                <h4 className="form-title m-0">
                                  Thông tin mã giảm giá
                                </h4>
                                <div className="row">
                                  <div className="col-12">
                                    <div className="form-group">
                                      <label className="sherah-wc__form-label">
                                        Mã giảm giá
                                      </label>
                                      <div className="form-group__input">
                                        <input
                                          className="sherah-wc__form-input"
                                          placeholder="Nhập"
                                          type="text"
                                          name="code"
                                          value={code}
                                          onChange={(e) =>
                                            setCode(e.target.value)
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-12">
                                    <div className="form-group">
                                      <label className="sherah-wc__form-label">
                                        Mô tả
                                      </label>
                                      <div className="form-group__input">
                                        <textarea
                                          className="sherah-wc__form-input"
                                          placeholder="Nhập"
                                          type="text"
                                          name="description"
                                          value={discountDescription}
                                          onChange={(e) =>
                                            setDiscountDescription(
                                              e.target.value
                                            )
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-12">
                                    <div className="form-group">
                                      <label className="sherah-wc__form-label">
                                        Loại mã giảm giá
                                      </label>
                                      <div className="d-flex">
                                        <select
                                          className="form-group__input"
                                          aria-label="Default select example"
                                          value={selectedDiscountType}
                                          onChange={handleChangeDiscountType}
                                        >
                                          <option value="">
                                            Chọn loại mã giảm giá
                                          </option>
                                          {discountTypes.length > 0 ? (
                                            discountTypes.map(
                                              (discountType, index) => (
                                                <option
                                                  key={index}
                                                  value={discountType}
                                                >
                                                  {discountTypeLabels[
                                                    discountType
                                                  ] || discountType}
                                                </option>
                                              )
                                            )
                                          ) : (
                                            <option disabled>
                                              Không có loại mã giảm giá nào
                                            </option>
                                          )}
                                        </select>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-12">
                                    <div className="form-group">
                                      <label className="sherah-wc__form-label">
                                        Giá trị giảm
                                      </label>
                                      <div className="form-group__input">
                                        <input
                                          className="sherah-wc__form-input"
                                          type="number"
                                          placeholder="Nhập giá trị giảm"
                                          value={discountValue}
                                          onChange={(e) =>
                                            setDiscountValue(
                                              Number(e.target.value)
                                            )
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-lg-6 col-md-6 col-12">
                                    <div className="form-group">
                                      <label className="sherah-wc__form-label">
                                        Giá trị đơn hàng tối thiểu
                                      </label>
                                      <div className="form-group__input">
                                        <input
                                          className="sherah-wc__form-input"
                                          type="number"
                                          placeholder="Nhập giá trị tối thiểu"
                                          value={minOrderValue}
                                          onChange={(e) =>
                                            setMinOrderValue(
                                              Number(e.target.value)
                                            )
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-lg-6 col-md-6 col-12">
                                    <div className="form-group">
                                      <label className="sherah-wc__form-label">
                                        Số lần cho phép sử dụng
                                      </label>
                                      <div className="form-group__input">
                                        <input
                                          className="sherah-wc__form-input"
                                          type="number"
                                          placeholder="Nhập số lần sử dụng"
                                          value={maxUses}
                                          onChange={(e) =>
                                            setMaxUses(Number(e.target.value))
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* End Discount Info */}
                            </div>
                            <div className="col-lg-6 col-12">
                              {/* Time, cat, prod, quantity */}
                              <div className="product-form-box sherah-border mg-top-30">
                                <h4 className="form-title m-0">
                                  Thời gian, danh mục, sản phẩm áp dụng
                                </h4>
                                <div className="col-12">
                                  <div className="form-group">
                                    <label className="sherah-wc__form-label">
                                      Ngày bắt đầu
                                    </label>
                                    <div className="form-group__input">
                                      <input
                                        className="sherah-wc__form-input"
                                        type="date"
                                        value={startDate}
                                        onChange={(e) =>
                                          setStartDate(e.target.value)
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="col-12">
                                  <div className="form-group">
                                    <label className="sherah-wc__form-label">
                                      Ngày kết thúc
                                    </label>
                                    <div className="form-group__input">
                                      <input
                                        className="sherah-wc__form-input"
                                        type="date"
                                        value={endDate}
                                        onChange={(e) =>
                                          setEndDate(e.target.value)
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-12">
                                  <div className="form-group">
                                    <label className="sherah-wc__form-label">
                                      Danh mục áp dụng
                                    </label>
                                    <div className="d-flex">
                                      <select
                                        className="form-group__input"
                                        aria-label="Default select example"
                                        value={selectedCategory}
                                        onChange={handleChangeCategory}
                                      >
                                        <option value="">Chọn danh mục</option>
                                        {categories.length > 0 ? (
                                          categories.map((category, index) => (
                                            <option
                                              key={index}
                                              value={category}
                                            >
                                              {category}
                                            </option>
                                          ))
                                        ) : (
                                          <option disabled>
                                            Không có danh mục nào
                                          </option>
                                        )}
                                      </select>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-12">
                                  <div className="form-group">
                                    <label className="sherah-wc__form-label">
                                      Sản phẩm áp dụng
                                    </label>
                                    <div className="d-flex">
                                      <select
                                        className="form-group__input"
                                        aria-label="Default select example"
                                        value={selectedProduct}
                                        onChange={handleChangeProduct}
                                      >
                                        <option value="">Chọn sản phẩm</option>
                                        {products.length > 0 ? (
                                          products.map((product) => (
                                            <option
                                              key={product._id}
                                              value={product._id}
                                            >
                                              {product.product_name}
                                            </option>
                                          ))
                                        ) : (
                                          <option disabled>
                                            Không có sản phẩm nào
                                          </option>
                                        )}
                                      </select>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-12">
                                  <div className="form-group">
                                    <label className="sherah-wc__form-label">
                                      Số lượng mã giảm giá
                                    </label>
                                    <div className="form-group__input">
                                      <input
                                        className="sherah-wc__form-input"
                                        type="number"
                                        placeholder="Nhập số lượng mã giảm giá"
                                        value={useCount}
                                        onChange={(e) =>
                                          setUseCount(Number(e.target.value))
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* End Time, cat, prod, quantity */}
                            </div>
                          </div>
                          <div className=" mg-top-40 sherah-dflex sherah-dflex-gap-30 justify-content-end">
                            <button
                              type="submit"
                              className="sherah-btn sherah-btn__primary"
                              onClick={handleSubmit}
                            >
                              Thêm mã giảm giá
                            </button>
                            <button className="sherah-btn sherah-btn__third">
                              Hủy
                            </button>
                          </div>
                        </form>
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
}

export default Uploaddiscount;
