import React, { useState, useEffect } from "react";

function Uploadproduct() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [categories, setCategories] = useState([]); // State để lưu trữ danh sách danh mục
  const [selectedCategory, setSelectedCategory] = useState(""); // State lưu trữ danh mục được chọn
  const [otherCategory, setOtherCategory] = useState(""); // State lưu trữ danh mục nhập tay khác
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [otherBrand, setOtherBrand] = useState("");
  const [specifications, setSpecifications] = useState([]);
  const [svalues, setSValues] = useState([]);
  const [compatibilities, setCompatibilities] = useState([]);
  const [cvalues, setCValues] = useState([]);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [productImageUrl, setProductImageUrl] = useState("");
  const [condition, setCondition] = useState("New");
  const [warranty, setWarranty] = useState("6 tháng");
  const [specificationGroups, setSpecificationGroups] = useState([
    {
      selectedSpecification: "",
      otherSpecification: "",
      selectedSValue: "",
      otherSValue: "",
    },
  ]);
  const [compatibilityGroups, setCompatibilityGroups] = useState([
    { selectedCompatibility: "", otherCompatibility: "", selectedCValue: "", otherCValue: "" },
  ]);

  const handleAddSpecificationGroup = () => {
    setSpecificationGroups([
      ...specificationGroups,
      {
        selectedSpecification: "",
        otherSpecification: "",
        selectedSValue: "",
        otherSValue: "",
      },
    ]);
  };

  const handleRemoveSpecificationGroup = (index) => {
    setSpecificationGroups(specificationGroups.filter((_, i) => i !== index));
  };

  const handleChangeSpecification = (index, event) => {
    const newGroups = [...specificationGroups];
    newGroups[index].selectedSpecification = event.target.value;
    setSpecificationGroups(newGroups);
  };

  const handleInputChangeSpecification = (index, event) => {
    const newGroups = [...specificationGroups];
    newGroups[index].otherSpecification = event.target.value;
    setSpecificationGroups(newGroups);
  };

  const handleChangeSValue = (index, event) => {
    const newGroups = [...specificationGroups];
    newGroups[index].selectedSValue = event.target.value;
    setSpecificationGroups(newGroups);
  };

  const handleInputChangeSValue = (index, event) => {
    const newGroups = [...specificationGroups];
    newGroups[index].otherSValue = event.target.value;
    setSpecificationGroups(newGroups);
  };

  const handleAddCompatibilityGroup = () => {
    setCompatibilityGroups([
      ...compatibilityGroups,
      { selectedCompatibility: "", otherCompatibility: "", selectedCValue: "", otherCValue: "" },
    ]);
  };
  
  const handleRemoveCompatibilityGroup = (index) => {
    setCompatibilityGroups(compatibilityGroups.filter((_, i) => i !== index));
  };
  
  const handleChangeCompatibility = (index, event) => {
    const newGroups = [...compatibilityGroups];
    newGroups[index].selectedCompatibility = event.target.value;
    setCompatibilityGroups(newGroups);
  };
  
  const handleInputChangeCompatibility = (index, event) => {
    const newGroups = [...compatibilityGroups];
    newGroups[index].otherCompatibility = event.target.value;
    setCompatibilityGroups(newGroups);
  };
  
  const handleChangeCValue = (index, event) => {
    const newGroups = [...compatibilityGroups];
    newGroups[index].selectedCValue = event.target.value;
    setCompatibilityGroups(newGroups);
  };
  
  const handleInputChangeCValue = (index, event) => {
    const newGroups = [...compatibilityGroups];
    newGroups[index].otherCValue = event.target.value;
    setCompatibilityGroups(newGroups);
  };  

  const conditions = [
    { value: "New", label: "Mới" },
    { value: "Used", label: "Đã sử dụng" },
  ];

  useEffect(() => {
    // Gọi API để lấy danh sách danh mục
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${API_URL}/product/categories`
        );
        const data = await response.json();

        // Giả sử API trả về dữ liệu là một mảng các đối tượng chứa trường 'name'
        setCategories(data.map((category) => category.name));
      } catch (err) {
        console.error("Lỗi khi lấy danh mục:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleChangeCategory = (event) => {
    setSelectedCategory(event.target.value);
    if (event.target.value !== "newCategory") {
      setOtherCategory(""); // Nếu chọn danh mục khác, reset giá trị ô nhập
    }
  };

  const handleInputChangeCategory = (event) => {
    setOtherCategory(event.target.value);
  };

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch(
          `${API_URL}/product/get-brands`
        );
        const data = await response.json();
        setBrands(data); // Trực tiếp gán data cho brands
      } catch (err) {
        console.error("Lỗi khi lấy thương hiệu:", err);
      }
    };
    fetchBrands();
  }, []);

  const handleChangeBrand = (event) => {
    setSelectedBrand(event.target.value);
    if (event.target.value !== "newBrand") {
      setOtherBrand("");
    }
  };

  const handleInputChangeBrand = (event) => {
    setOtherBrand(event.target.value);
  };

  useEffect(() => {
    const fetchSpecifications = async () => {
      try {
        const response = await fetch(
          `${API_URL}/product/get-specifications`
        );
        const data = await response.json();
        setSpecifications(data);
      } catch (err) {
        console.error("Lỗi khi lấy thông số kỹ thuật:", err);
      }
    };
    fetchSpecifications();
  }, []);

  useEffect(() => {
    const fetchSValues = async () => {
      try {
        const response = await fetch(
          `${API_URL}/product/get-specificationvalues`
        );
        const data = await response.json();
        setSValues(data);
      } catch (err) {
        console.error("Lỗi khi lấy thông số kỹ thuật:", err);
      }
    };
    fetchSValues();
  }, []);

  useEffect(() => {
    const fetchCompatibilities = async () => {
      try {
        const response = await fetch(`${API_URL}/product/get-compatibilities`);
        const data = await response.json();
        setCompatibilities(data);
      } catch (err) {
        console.error("Lỗi khi lấy compatibilities:", err);
      }
    };
  
    fetchCompatibilities();
  }, []);
  
  useEffect(() => {
    const fetchCValues = async () => {
      try {
        const response = await fetch(`${API_URL}/product/get-compatibilityvalues`);
        const data = await response.json();
        setCValues(data);
      } catch (err) {
        console.error("Lỗi khi lấy giá trị compatibility:", err);
      }
    };
  
    fetchCValues();
  }, []);
  
  //Hàm thêm sản phẩm
  const handleSubmit = async () => {
    try {
      const categoryId = await fetch(
        `${API_URL}/product/get-category-id`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: selectedCategory }),
        }
      )
        .then((response) => response.json())
        .then((data) => data.categoryId);

      const specifications = {};
      specificationGroups.forEach((group) => {
        const key =
          group.selectedSpecification !== "newSpecification"
            ? group.selectedSpecification
            : group.otherSpecification;

        const value =
          group.selectedSValue !== "newSValue"
            ? group.selectedSValue
            : group.otherSValue;

        if (key) specifications[key] = value;
      });

    // Xử lý compatibility (key-value giống specifications)
    const compatibility = {};
    compatibilityGroups.forEach((group) => {
      const key = group.selectedCompatibility !== "newCompatibility" 
        ? group.selectedCompatibility 
        : group.otherCompatibility;

      const value = group.selectedCValue !== "newCValue" 
        ? group.selectedCValue 
        : group.otherCValue;

      if (key) compatibility[key] = value;
    });

      const data = {
        product_name: productName,
        description: productDescription,
        category_id: categoryId,
        price: originalPrice,
        stock_quantity: quantity,
        image_url: productImageUrl,
        brand: selectedBrand,
        condition: condition,
        specifications: specifications,
        compatibility: compatibility,
        warranty: warranty,
      };

      const response = await fetch(
        `${API_URL}/product/add-product`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        alert("Sản phẩm đã tải thành công! 🎉");

        // Reset tất cả các trường về mặc định
        setProductName("");
        setProductDescription("");
        setSelectedCategory("");
        setOriginalPrice("");
        setQuantity("");
        setProductImageUrl("");
        setSelectedBrand("");
        setCondition("");
        setWarranty("");
        setSpecificationGroups([]);
        setCompatibilityGroups([]);
      }
    } catch (err) {
      console.error("Lỗi khi gửi dữ liệu:", err);
      alert("Lỗi khi gửi sản phẩm, vui lòng thử lại.");
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
                              Upload Product
                            </h2>
                            <ul className="sherah-breadcrumb__list">
                              <li>
                                <a href="#">Home</a>
                              </li>
                              <li className="active">
                                <a href="profile-info.html">Upload Product</a>
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
                              {/* Product Info */}
                              <div className="product-form-box sherah-border mg-top-30">
                                <h4 className="form-title m-0">
                                  Thông tin cơ bản
                                </h4>
                                <div className="row">
                                  <div className="col-12">
                                    <div className="form-group">
                                      <label className="sherah-wc__form-label">
                                        Tên sản phẩm
                                      </label>
                                      <div className="form-group__input">
                                        <input
                                          className="sherah-wc__form-input"
                                          placeholder="Nhập"
                                          type="text"
                                          name="product_name"
                                          value={productName}
                                          onChange={(e) =>
                                            setProductName(e.target.value)
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-12">
                                    <div className="form-group">
                                      <label className="sherah-wc__form-label">
                                        Mô tả sản phẩm
                                      </label>
                                      <div className="form-group__input">
                                        <textarea
                                          className="sherah-wc__form-input"
                                          placeholder="Nhập"
                                          type="text"
                                          name="p_description"
                                          value={productDescription}
                                          onChange={(e) =>
                                            setProductDescription(
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
                                        Danh mục
                                      </label>
                                      <div className="d-flex">
                                        <select
                                          className="form-group__input"
                                          aria-label="Default select example"
                                          value={selectedCategory}
                                          onChange={handleChangeCategory}
                                        >
                                          <option value="">
                                            Chọn danh mục
                                          </option>
                                          {categories.length > 0 ? (
                                            categories.map(
                                              (category, index) => (
                                                <option
                                                  key={index}
                                                  value={category}
                                                >
                                                  {category}
                                                </option>
                                              )
                                            )
                                          ) : (
                                            <option disabled>
                                              Không có danh mục nào
                                            </option>
                                          )}
                                          <option value="newCategory">
                                            Danh mục mới
                                          </option>{" "}
                                          {/* Thêm tùy chọn "Danh mục mới" */}
                                        </select>
                                        <input
                                          type="text"
                                          className="form-group__input ml-2"
                                          placeholder={
                                            selectedCategory === "newCategory"
                                              ? "Nhập Danh mục mới"
                                              : "Chỉ được nhập khi chọn Danh mục mới"
                                          }
                                          value={otherCategory}
                                          onChange={handleInputChangeCategory}
                                          readOnly={
                                            selectedCategory !== "newCategory"
                                          } // Chỉ cho phép nhập khi chọn "Danh mục mới"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-12">
                                    <div className="form-group">
                                      <label className="sherah-wc__form-label">
                                        Thương hiệu
                                      </label>
                                      <div className="d-flex">
                                        <select
                                          className="form-group__input"
                                          aria-label="Default select example"
                                          value={selectedBrand}
                                          onChange={handleChangeBrand}
                                        >
                                          <option value="">
                                            Chọn thương hiệu
                                          </option>
                                          {brands.length > 0 ? (
                                            brands.map((brand, index) => (
                                              <option key={index} value={brand}>
                                                {brand}
                                              </option>
                                            ))
                                          ) : (
                                            <option disabled>
                                              Không có thương hiệu nào
                                            </option>
                                          )}
                                          <option value="newBrand">
                                            Thương hiệu mới
                                          </option>{" "}
                                          {/* Thêm tùy chọn "Thương hiệu mới" */}
                                        </select>
                                        <input
                                          type="text"
                                          className="form-group__input ml-2"
                                          placeholder={
                                            selectedBrand === "newBrand"
                                              ? "Nhập Thương hiệu mới"
                                              : "Chỉ được nhập khi chọn Thương hiệu mới"
                                          }
                                          value={otherBrand}
                                          onChange={handleInputChangeBrand}
                                          readOnly={
                                            selectedBrand !== "newBrand"
                                          } // Chỉ cho phép nhập khi chọn "Thương hiệu mới"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 col-12">
                                    <div className="form-group">
                                      <label className="sherah-wc__form-label">
                                        Giá thành
                                      </label>
                                      <div className="form-group__input">
                                        <input
                                          className="sherah-wc__form-input"
                                          placeholder="Nhập"
                                          type="text"
                                          name="original_price"
                                          value={originalPrice}
                                          onChange={(e) =>
                                            setOriginalPrice(e.target.value)
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 col-12"></div>
                                  <div className="col-lg-6 col-md-6 col-12">
                                    <div className="form-group">
                                      <label className="sherah-wc__form-label">
                                        Tình trạng
                                      </label>
                                      <select
                                        className="form-group__input"
                                        aria-label="Default select example"
                                        name="condition"
                                        value={condition}
                                        onChange={(e) =>
                                          setCondition(e.target.value)
                                        }
                                      >
                                        {conditions.map((condition, index) => (
                                          <option
                                            key={index}
                                            value={condition.value}
                                          >
                                            {condition.label}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 col-12">
                                    <div className="form-group">
                                      <label className="sherah-wc__form-label">
                                        Thời hạn bảo hành
                                      </label>
                                      <select
                                        className="form-group__input"
                                        aria-label="Default select example"
                                        name="warranty"
                                        value={warranty}
                                        onChange={(e) =>
                                          setWarranty(e.target.value)
                                        }
                                      >
                                        <option value="6 tháng">6 tháng</option>
                                        <option value="12 tháng">
                                          12 tháng
                                        </option>
                                        <option value="24 tháng">
                                          24 tháng
                                        </option>
                                        <option value="36 tháng">
                                          36 tháng
                                        </option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 col-12">
                                    <div className="form-group">
                                      <label className="sherah-wc__form-label">
                                        Số lượng
                                      </label>
                                      <div className="form-group__input">
                                        <input
                                          className="sherah-wc__form-input"
                                          placeholder="Nhập"
                                          type="text"
                                          name="quantity"
                                          value={quantity}
                                          onChange={(e) =>
                                            setQuantity(e.target.value)
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-12">
                                    <div className="form-group">
                                      <label className="sherah-wc__form-label">
                                        Tag
                                      </label>
                                      <div className="form-group__input">
                                        <textarea
                                          className="sherah-wc__form-input"
                                          placeholder="Nhập"
                                          type="text"
                                          name="p_title"
                                          defaultValue={""}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* End Product Info */}
                            </div>
                            <div className="col-lg-6 col-12">
                              {/* Specifications */}
                              <div className="product-form-box sherah-border mg-top-30">
                                <h4 className="form-title m-0">
                                  Thông số kỹ thuật
                                </h4>

                                {specificationGroups.map((group, index) => (
                                  <div
                                    key={index}
                                    className="spec-group position-relative p-2 border mb-2"
                                  >
                                    <div className="col-12">
                                      <div className="form-group">
                                        <label className="sherah-wc__form-label">
                                          Thuộc tính thông số
                                        </label>
                                        <div className="d-flex">
                                          <select
                                            className="form-group__input"
                                            value={group.selectedSpecification}
                                            onChange={(e) =>
                                              handleChangeSpecification(
                                                index,
                                                e
                                              )
                                            }
                                          >
                                            <option value="">
                                              Chọn thông số
                                            </option>
                                            {specifications.length > 0 ? (
                                              specifications.map(
                                                (specification, i) => (
                                                  <option
                                                    key={i}
                                                    value={specification}
                                                  >
                                                    {specification}
                                                  </option>
                                                )
                                              )
                                            ) : (
                                              <option disabled>
                                                Không có thông số nào
                                              </option>
                                            )}
                                            <option value="newSpecification">
                                              Thông số mới
                                            </option>
                                          </select>
                                          <input
                                            type="text"
                                            className="form-group__input ml-2"
                                            placeholder={
                                              group.selectedSpecification ===
                                              "newSpecification"
                                                ? "Nhập Thông số mới"
                                                : "Chỉ được nhập khi chọn Thông số mới"
                                            }
                                            value={group.otherSpecification}
                                            onChange={(e) =>
                                              handleInputChangeSpecification(
                                                index,
                                                e
                                              )
                                            }
                                            readOnly={
                                              group.selectedSpecification !==
                                              "newSpecification"
                                            }
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    <div className="col-12">
                                      <div className="form-group">
                                        <label className="sherah-wc__form-label">
                                          Giá trị thông số
                                        </label>
                                        <div className="d-flex">
                                          <select
                                            className="form-group__input"
                                            value={group.selectedSValue}
                                            onChange={(e) =>
                                              handleChangeSValue(index, e)
                                            }
                                          >
                                            {group.selectedSpecification &&
                                            group.selectedSpecification !==
                                              "" ? (
                                              <>
                                                <option value="">
                                                  Chọn giá trị
                                                </option>
                                                {group.selectedSpecification !==
                                                "newSpecification" ? (
                                                  [
                                                    ...new Set(
                                                      svalues.map(
                                                        (svalue) =>
                                                          svalue[
                                                            group
                                                              .selectedSpecification
                                                          ]
                                                      )
                                                    ),
                                                  ]
                                                    .sort((a, b) =>
                                                      typeof a === "string"
                                                        ? a.localeCompare(b)
                                                        : a - b
                                                    )
                                                    .map((uniqueValue, i) => (
                                                      <option
                                                        key={i}
                                                        value={uniqueValue}
                                                      >
                                                        {uniqueValue}
                                                      </option>
                                                    ))
                                                ) : (
                                                  <option disabled>
                                                    Chọn thông số trước
                                                  </option>
                                                )}
                                                <option value="newSValue">
                                                  Giá trị mới
                                                </option>
                                              </>
                                            ) : (
                                              <option value="">
                                                Vui lòng chọn thông số trước
                                              </option>
                                            )}
                                          </select>
                                          <input
                                            type="text"
                                            className="form-group__input ml-2"
                                            placeholder={
                                              group.selectedSValue ===
                                              "newSValue"
                                                ? "Nhập Giá trị mới"
                                                : "Chỉ được nhập khi chọn Giá trị mới"
                                            }
                                            value={group.otherSValue}
                                            onChange={(e) =>
                                              handleInputChangeSValue(index, e)
                                            }
                                            readOnly={
                                              group.selectedSValue !==
                                              "newSValue"
                                            }
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    <a
                                      href="#"
                                      className="sherah-table__action sherah-color2 sherah-color2__bg--offset"
                                      onClick={() =>
                                        handleRemoveSpecificationGroup(index)
                                      }
                                    >
                                      {/* Delete icon */}
                                      <svg
                                        className="sherah-color2__fill"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16.247"
                                        height="18.252"
                                        viewBox="0 0 16.247 18.252"
                                      >
                                        <g
                                          id="Icon"
                                          transform="translate(-160.007 -18.718)"
                                        >
                                          <path
                                            id="Path_484"
                                            data-name="Path 484"
                                            d="M185.344,88.136c0,1.393,0,2.786,0,4.179-.006,1.909-1.523,3.244-3.694,3.248q-3.623.007-7.246,0c-2.15,0-3.682-1.338-3.687-3.216q-.01-4.349,0-8.7a.828.828,0,0,1,.822-.926.871.871,0,0,1,1,.737c.016.162.006.326.006.489q0,4.161,0,8.321c0,1.061.711,1.689,1.912,1.69q3.58,0,7.161,0c1.2,0,1.906-.631,1.906-1.695q0-4.311,0-8.622a.841.841,0,0,1,.708-.907.871.871,0,0,1,1.113.844C185.349,85.1,185.343,86.618,185.344,88.136Z"
                                            transform="translate(-9.898 -58.597)"
                                          />
                                          <path
                                            id="Path_485"
                                            data-name="Path 485"
                                            d="M164.512,21.131c0-.517,0-.98,0-1.443.006-.675.327-.966,1.08-.967q2.537,0,5.074,0c.755,0,1.074.291,1.082.966.005.439.005.878.009,1.317a.615.615,0,0,0,.047.126h.428c1,0,2,0,3,0,.621,0,1.013.313,1.019.788s-.4.812-1.04.813q-7.083,0-14.165,0c-.635,0-1.046-.327-1.041-.811s.4-.786,1.018-.789C162.165,21.127,163.3,21.131,164.512,21.131Zm1.839-.021H169.9v-.764h-3.551Z"
                                            transform="translate(0 0)"
                                          />
                                          <path
                                            id="Path_486"
                                            data-name="Path 486"
                                            d="M225.582,107.622c0,.9,0,1.806,0,2.709a.806.806,0,0,1-.787.908.818.818,0,0,1-.814-.924q0-2.69,0-5.38a.82.82,0,0,1,.81-.927.805.805,0,0,1,.79.9C225.585,105.816,225.582,106.719,225.582,107.622Z"
                                            transform="translate(-58.483 -78.508)"
                                          />
                                          <path
                                            id="Path_487"
                                            data-name="Path 487"
                                            d="M266.724,107.63c0-.9,0-1.806,0-2.709a.806.806,0,0,1,.782-.912.818.818,0,0,1,.818.919q0,2.69,0,5.38a.822.822,0,0,1-.806.931c-.488,0-.792-.356-.794-.938C266.721,109.411,266.724,108.521,266.724,107.63Z"
                                            transform="translate(-97.561 -78.509)"
                                          />
                                        </g>
                                      </svg>
                                    </a>
                                  </div>
                                ))}

                                {/* Nút thêm thông số */}
                                <button
                                  className="btn btn-primary mt-3"
                                  onClick={handleAddSpecificationGroup}
                                >
                                  Thêm thông số
                                </button>
                              </div>
                              {/* End Specification */}
                              {/* Compatibility */}
                              <div className="product-form-box sherah-border mg-top-30">
                                <h4 className="form-title m-0">
                                  Tính tương thích
                                </h4>

                                {compatibilityGroups.map((group, index) => (
                                  <div
                                    key={index}
                                    className="spec-group position-relative p-2 border mb-2"
                                  >
                                    <div className="col-12">
                                      <div className="form-group">
                                        <label className="sherah-wc__form-label">
                                          Thuộc tính tương thích
                                        </label>
                                        <div className="d-flex">
                                          <select
                                            className="form-group__input"
                                            value={group.selectedCompatibility}
                                            onChange={(e) =>
                                              handleChangeCompatibility(
                                                index,
                                                e
                                              )
                                            }
                                          >
                                            <option value="">
                                              Chọn tính tương thích
                                            </option>
                                            {compatibilities.length > 0 ? (
                                              compatibilities.map(
                                                (compatibility, i) => (
                                                  <option
                                                    key={i}
                                                    value={compatibility}
                                                  >
                                                    {compatibility}
                                                  </option>
                                                )
                                              )
                                            ) : (
                                              <option disabled>
                                                Không có tính tương thích
                                              </option>
                                            )}
                                            <option value="newCompatibility">
                                              Tính tương thích mới
                                            </option>
                                          </select>
                                          <input
                                            type="text"
                                            className="form-group__input ml-2"
                                            placeholder={
                                              group.selectedCompatibility ===
                                              "newCompatibility"
                                                ? "Nhập Tính tương thích mới"
                                                : "Chỉ được nhập khi chọn Tính tương thích mới"
                                            }
                                            value={group.otherCompatibility}
                                            onChange={(e) =>
                                              handleInputChangeCompatibility(
                                                index,
                                                e
                                              )
                                            }
                                            readOnly={
                                              group.selectedCompatibility !==
                                              "newCompatibility"
                                            }
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    <div className="col-12">
                                      <div className="form-group">
                                        <label className="sherah-wc__form-label">
                                          Giá trị tính tương thích
                                        </label>
                                        <div className="d-flex">
                                          <select
                                            className="form-group__input"
                                            value={group.selectedCValue}
                                            onChange={(e) =>
                                              handleChangeCValue(index, e)
                                            }
                                          >
                                            {group.selectedCompatibility &&
                                            group.selectedCompatibility !==
                                              "" ? (
                                              <>
                                                <option value="">
                                                  Chọn giá trị
                                                </option>
                                                {group.selectedCompatibility !==
                                                "newCompatibility" ? (
                                                  [
                                                    ...new Set(
                                                      cvalues.map(
                                                        (cvalue) =>
                                                          cvalue[
                                                            group
                                                              .selectedCompatibility
                                                          ]
                                                      )
                                                    ),
                                                  ]
                                                    .sort((a, b) =>
                                                      typeof a === "string"
                                                        ? a.localeCompare(b)
                                                        : a - b
                                                    )
                                                    .map((uniqueValue, i) => (
                                                      <option
                                                        key={i}
                                                        value={uniqueValue}
                                                      >
                                                        {uniqueValue}
                                                      </option>
                                                    ))
                                                ) : (
                                                  <option disabled>
                                                    Chọn tính tương thích trước
                                                  </option>
                                                )}
                                                <option value="newCValue">
                                                  Giá trị mới
                                                </option>
                                              </>
                                            ) : (
                                              <option value="">
                                                Vui lòng chọn tính tương thích mới
                                              </option>
                                            )}
                                          </select>
                                          <input
                                            type="text"
                                            className="form-group__input ml-2"
                                            placeholder={
                                              group.selectedCValue ===
                                              "newCValue"
                                                ? "Nhập Giá trị mới"
                                                : "Chỉ được nhập khi chọn Giá trị mới"
                                            }
                                            value={group.otherCValue}
                                            onChange={(e) =>
                                              handleInputChangeCValue(index, e)
                                            }
                                            readOnly={
                                              group.selectedCValue !==
                                              "newCValue"
                                            }
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    <a
                                      href="#"
                                      className="sherah-table__action sherah-color2 sherah-color2__bg--offset"
                                      onClick={() =>
                                        handleRemoveCompatibilityGroup(index)
                                      }
                                    >
                                      {/* Delete icon */}
                                      <svg
                                        className="sherah-color2__fill"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16.247"
                                        height="18.252"
                                        viewBox="0 0 16.247 18.252"
                                      >
                                        <g
                                          id="Icon"
                                          transform="translate(-160.007 -18.718)"
                                        >
                                          <path
                                            id="Path_484"
                                            data-name="Path 484"
                                            d="M185.344,88.136c0,1.393,0,2.786,0,4.179-.006,1.909-1.523,3.244-3.694,3.248q-3.623.007-7.246,0c-2.15,0-3.682-1.338-3.687-3.216q-.01-4.349,0-8.7a.828.828,0,0,1,.822-.926.871.871,0,0,1,1,.737c.016.162.006.326.006.489q0,4.161,0,8.321c0,1.061.711,1.689,1.912,1.69q3.58,0,7.161,0c1.2,0,1.906-.631,1.906-1.695q0-4.311,0-8.622a.841.841,0,0,1,.708-.907.871.871,0,0,1,1.113.844C185.349,85.1,185.343,86.618,185.344,88.136Z"
                                            transform="translate(-9.898 -58.597)"
                                          />
                                          <path
                                            id="Path_485"
                                            data-name="Path 485"
                                            d="M164.512,21.131c0-.517,0-.98,0-1.443.006-.675.327-.966,1.08-.967q2.537,0,5.074,0c.755,0,1.074.291,1.082.966.005.439.005.878.009,1.317a.615.615,0,0,0,.047.126h.428c1,0,2,0,3,0,.621,0,1.013.313,1.019.788s-.4.812-1.04.813q-7.083,0-14.165,0c-.635,0-1.046-.327-1.041-.811s.4-.786,1.018-.789C162.165,21.127,163.3,21.131,164.512,21.131Zm1.839-.021H169.9v-.764h-3.551Z"
                                            transform="translate(0 0)"
                                          />
                                          <path
                                            id="Path_486"
                                            data-name="Path 486"
                                            d="M225.582,107.622c0,.9,0,1.806,0,2.709a.806.806,0,0,1-.787.908.818.818,0,0,1-.814-.924q0-2.69,0-5.38a.82.82,0,0,1,.81-.927.805.805,0,0,1,.79.9C225.585,105.816,225.582,106.719,225.582,107.622Z"
                                            transform="translate(-58.483 -78.508)"
                                          />
                                          <path
                                            id="Path_487"
                                            data-name="Path 487"
                                            d="M266.724,107.63c0-.9,0-1.806,0-2.709a.806.806,0,0,1,.782-.912.818.818,0,0,1,.818.919q0,2.69,0,5.38a.822.822,0,0,1-.806.931c-.488,0-.792-.356-.794-.938C266.721,109.411,266.724,108.521,266.724,107.63Z"
                                            transform="translate(-97.561 -78.509)"
                                          />
                                        </g>
                                      </svg>
                                    </a>
                                  </div>
                                ))}

                                {/* Nút thêm tính tương thích */}
                                <button
                                  className="btn btn-primary mt-3"
                                  onClick={handleAddCompatibilityGroup}
                                >
                                  Thêm tính tương thích
                                </button>
                              </div>
                              {/* End Compatibility */}
                            </div>
                          </div>
                          <div className="product-form-box sherah-border mg-top-30">
                            <div className="form-group">
                              <div className="image-upload-group">
                                <div className="image-upload-group__single image-upload-group__single--upload">
                                  <input
                                    type="file"
                                    className="btn-check"
                                    name="options"
                                    id="input-img1"
                                    autoComplete="off"
                                  />
                                  <label
                                    className="image-upload-label"
                                    htmlFor="input-img1"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="91.787"
                                      height="84.116"
                                      viewBox="0 0 91.787 84.116"
                                    >
                                      <g
                                        id="Group_1021"
                                        data-name="Group 1021"
                                        transform="translate(891.292 39.276)"
                                      >
                                        <path
                                          id="Path_536"
                                          data-name="Path 536"
                                          d="M-891.292,158.124q1.434-5.442,2.867-10.884c1.3-4.961,2.586-9.926,3.9-14.884a2.8,2.8,0,0,1,2.664-2.251,2.654,2.654,0,0,1,2.763,1.848,3.929,3.929,0,0,1,.037,2q-3.073,12-6.226,23.984c-.64,2.452.088,3.739,2.533,4.394q29.033,7.775,58.067,15.543a2.893,2.893,0,0,0,3.97-2.327c.626-2.487,1.227-4.98,1.849-7.468a2.9,2.9,0,0,1,3.436-2.368,2.894,2.894,0,0,1,2.124,3.726c-.627,2.609-1.256,5.219-1.944,7.813A8.547,8.547,0,0,1-826,183.469q-29.3-7.827-58.584-15.682a8.566,8.566,0,0,1-6.552-6.853,1.264,1.264,0,0,0-.16-.3Z"
                                          transform="translate(0 -138.958)"
                                        />
                                        <path
                                          id="Path_537"
                                          data-name="Path 537"
                                          d="M-767.966,21.9c-9.648,0-19.3-.062-28.943.029a9.215,9.215,0,0,1-8.88-5.491,7.393,7.393,0,0,1-.451-3.232c-.027-14.606-.053-29.212,0-43.818a8.532,8.532,0,0,1,8.907-8.66q29.346-.008,58.693,0a8.581,8.581,0,0,1,8.877,8.872q.017,21.685,0,43.37a8.551,8.551,0,0,1-8.9,8.923C-748.432,21.915-758.2,21.9-767.966,21.9ZM-773.938.457l4.606-5.528q4.674-5.611,9.345-11.224a6.85,6.85,0,0,1,7.183-2.522c1.734.377,2.87,1.622,3.969,2.909q6.341,7.428,12.7,14.838a6.488,6.488,0,0,1,.426.631l.211-.158v-.789q0-14.429,0-28.857c0-2.179-1.125-3.294-3.316-3.295q-29.216,0-58.432,0c-2.141,0-3.277,1.115-3.278,3.25q-.008,18.865,0,37.73a5.429,5.429,0,0,0,.07.624l.239.127a5.744,5.744,0,0,1,.529-.721Q-794.05,1.826-788.4-3.808c3.131-3.127,7.065-3.129,10.21,0C-776.8-2.422-775.412-1.022-773.938.457Zm-25.649,14.9a3.316,3.316,0,0,0,2.611.808q28.949,0,57.9,0c.239,0,.478,0,.717-.005a2.828,2.828,0,0,0,2.864-2.923c.02-1.195-.052-2.393.023-3.584a2.712,2.712,0,0,0-.78-2.072q-8.569-9.946-17.1-19.927c-1.071-1.25-1.417-1.243-2.489.044q-7.71,9.264-15.424,18.523c-1.468,1.762-3.193,1.826-4.833.189q-3.076-3.071-6.147-6.147c-.963-.962-1.146-.963-2.1-.01q-6.688,6.684-13.377,13.367C-798.31,14.2-798.937,14.753-799.587,15.358Z"
                                          transform="translate(-69.752)"
                                        />
                                        <path
                                          id="Path_538"
                                          data-name="Path 538"
                                          d="M-734.635,39.893a7.657,7.657,0,0,1-7.659-7.6,7.688,7.688,0,0,1,7.7-7.667,7.682,7.682,0,0,1,7.612,7.663A7.653,7.653,0,0,1-734.635,39.893Zm-.029-5.742a1.9,1.9,0,0,0,1.938-1.906,1.934,1.934,0,0,0-1.886-1.884,1.927,1.927,0,0,0-1.936,1.92A1.9,1.9,0,0,0-734.664,34.151Z"
                                          transform="translate(-122.238 -52.421)"
                                        />
                                      </g>
                                    </svg>
                                    <span>Tải hình ảnh lên</span>
                                  </label>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="form-group">
                                  <label className="sherah-wc__form-label">
                                    Hoặc nhập Link hình ảnh của sản phẩm
                                  </label>
                                  <div className="form-group__input">
                                    <textarea
                                      className="sherah-wc__form-input"
                                      placeholder="Nhập Link ở đây"
                                      type="text"
                                      name="product_image_url"
                                      value={productImageUrl}
                                      onChange={(e) =>
                                        setProductImageUrl(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className=" mg-top-40 sherah-dflex sherah-dflex-gap-30 justify-content-end">
                            <button
                              type="submit"
                              className="sherah-btn sherah-btn__primary"
                              onClick={handleSubmit}
                            >
                              Thêm sản phẩm
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

export default Uploadproduct;
