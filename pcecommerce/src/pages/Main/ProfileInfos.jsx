import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function ProfileInfo() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [roleToDisplay, setRoleToDisplay] = useState("");
  const [activeTab, setActiveTab] = useState("id1");
  const [user, setUser] = useState(null);
  const [logins, setLogins] = useState([]);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  // Hàm thay đổi tab khi thẻ được click
  const handleTabClick = (tabId) => {
    setActiveTab(tabId); // Cập nhật tab đang active
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Gọi API session để lấy thông tin user ban đầu
        const sessionResponse = await fetch(`${API_URL}/auth/session`, {
          credentials: "include",
        });
        if (!sessionResponse.ok) throw new Error("Lỗi khi lấy dữ liệu session");

        const sessionData = await sessionResponse.json();
        let user = sessionData.user;

        if (user?.userId) {
          // Gọi API bổ sung thông tin user
          const userResponse = await fetch(`${API_URL}/user/get-user/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ userId: user.userId }),
          });

          if (userResponse.ok) {
            const additionalUserData = await userResponse.json();
            user = { ...user, ...additionalUserData };
          } else {
            console.warn(
              "Không thể lấy dữ liệu user bổ sung, giữ lại dữ liệu session"
            );
          }
        }

        setUser(user);
        setRoleToDisplay(user.roles?.join(", ") || "No roles available");
      } catch (error) {
        console.error("Lỗi lấy dữ liệu user:", error);
        setUser(null);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (!user) return;

    fetch(`${API_URL}/user/get-login-history`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ userId: user._id }), // Sử dụng userId từ session
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("API login history response:", data); // Kiểm tra dữ liệu API trả về
        if (Array.isArray(data)) {
          setLogins(data); // Chỉ set nếu là mảng
        } else {
          console.error("Lỗi: API không trả về mảng!", data);
          setLogins([]); // Đặt giá trị mặc định để tránh lỗi .map()
        }
      })
      .catch((error) => console.error("Lỗi lấy lịch sử đăng nhập:", error));
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    if (newPassword !== confirmPassword) {
      setMessage("Mật khẩu mới không khớp!");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/user/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId: user._id, oldPassword, newPassword }), // Dùng userId từ session
      });

      const data = await response.json();
      setMessage(response.ok ? "Đổi mật khẩu thành công!" : `${data.message}`);
    } catch (error) {
      setMessage("Lỗi kết nối server!");
    }
  };

  if (!user) {
    return <div>Loading...</div>; // Display a loading state until the user data is fetched
  }

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
                      {/* Sherah Breadcrumb */}
                      <div className="sherah-breadcrumb mg-top-30">
                        <h2 className="sherah-breadcrumb__title">Cài đặt</h2>
                        <ul className="sherah-breadcrumb__list">
                          <li>
                            <Link to="/admin">Trang chủ</Link>
                          </li>
                          <li className="active">
                            <Link to="/admin/profileinfo">Cài đặt</Link>
                          </li>
                        </ul>
                      </div>
                      {/* End Sherah Breadcrumb */}
                      <div className="sherah-personals">
                        <div className="row">
                          <div className="col-lg-3 col-md-2 col-12 sherah-personals__list mg-top-30">
                            <div className="sherah-psidebar sherah-default-bg">
                              {/* Features Tab List */}
                              <div
                                className="list-group sherah-psidebar__list"
                                id="list-tab"
                                role="tablist"
                              >
                                <a
                                  className={`list-group-item ${
                                    activeTab === "id1" ? "active" : ""
                                  }`}
                                  data-bs-toggle="list"
                                  href="#id1"
                                  role="tab"
                                  onClick={() => handleTabClick("id1")}
                                >
                                  <span className="sherah-psidebar__icon">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="15.137"
                                      height="18.151"
                                      viewBox="0 0 15.137 18.151"
                                    >
                                      <g
                                        id="Icon"
                                        transform="translate(-127.285 -217.094)"
                                      >
                                        <path
                                          id="Path_170"
                                          data-name="Path 170"
                                          d="M142.35,419.766a7.862,7.862,0,0,0-.848-2.97,3.353,3.353,0,0,0-2.566-1.817,1.5,1.5,0,0,0-1.176.242c-.2.152-.422.281-.637.415a4.018,4.018,0,0,1-4.074.264c-.428-.2-.8-.5-1.205-.738a1.126,1.126,0,0,0-.59-.214,3.558,3.558,0,0,0-1.664.413,3.71,3.71,0,0,0-1.65,1.987,9.533,9.533,0,0,0-.618,4.357,2.808,2.808,0,0,0,1.984,2.447c.232.072.471.12.707.18h9.607c.008-.027.03-.03.054-.032a2.906,2.906,0,0,0,2.747-2.994A11.6,11.6,0,0,0,142.35,419.766Zm-2.985,3.494c-1.506.018-3.012,0-4.518,0v0h-4.323a2.435,2.435,0,0,1-1.276-.3,1.763,1.763,0,0,1-.892-1.556,9.141,9.141,0,0,1,.523-3.565,3.452,3.452,0,0,1,.766-1.219,2.21,2.21,0,0,1,1.5-.617c.071,0,.12.044.175.077.425.253.818.557,1.269.768a5.066,5.066,0,0,0,5.088-.319c.246-.152.488-.31.73-.467a.357.357,0,0,1,.233-.053,2.3,2.3,0,0,1,1.95,1.33,6.775,6.775,0,0,1,.691,2.433,10.99,10.99,0,0,1,.074,1.45A1.888,1.888,0,0,1,139.365,423.26Z"
                                          transform="translate(0 -189.086)"
                                        />
                                        <path
                                          id="Path_171"
                                          data-name="Path 171"
                                          d="M201.205,217.094a4.372,4.372,0,1,0,4.358,4.377A4.363,4.363,0,0,0,201.205,217.094Zm0,7.68a3.308,3.308,0,1,1,3.3-3.314A3.3,3.3,0,0,1,201.2,224.775Z"
                                          transform="translate(-66.452 0)"
                                        />
                                      </g>
                                    </svg>
                                  </span>
                                  <span className="sherah-psidebar__title">
                                    Thông tin cá nhân
                                  </span>
                                </a>
                                <a
                                  className={`list-group-item ${
                                    activeTab === "id2" ? "active" : ""
                                  }`}
                                  data-bs-toggle="list"
                                  href="#id2"
                                  role="tab"
                                  onClick={() => handleTabClick("id2")}
                                >
                                  <span className="sherah-psidebar__icon">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="17.997"
                                      height="18.151"
                                      viewBox="0 0 17.997 18.151"
                                    >
                                      <g
                                        id="Icon"
                                        transform="translate(535.5 -309.627)"
                                      >
                                        <path
                                          id="Path_172"
                                          data-name="Path 172"
                                          d="M-535.5,507.86a.741.741,0,0,1,.514-.431c.877-.289,1.748-.6,2.622-.895.45-.154.671-.047.839.4.008.021.021.041.057.111a2.423,2.423,0,0,0,.332-.358,3.931,3.931,0,0,1,5.917-.935.483.483,0,0,0,.278.1c.41.011.82,0,1.229.006a1.652,1.652,0,0,1,1.445.786c.016.024.032.047.058.084.48-.321.952-.643,1.431-.954a6.259,6.259,0,0,1,.928-.56,1.681,1.681,0,0,1,2.118.744,1.68,1.68,0,0,1-.437,2.192c-1.252.914-2.519,1.809-3.792,2.695a4.866,4.866,0,0,1-2,.818,14.538,14.538,0,0,1-1.763.151c-1.3.052-2.61.081-3.915.12-.051,0-.1.008-.153.012.032.442-.068.588-.49.732l-2.655.907a1.359,1.359,0,0,0-.139.065h-.281a.829.829,0,0,1-.423-.541c-.34-1.024-.694-2.043-1.044-3.063-.223-.65-.451-1.3-.676-1.948Zm4.346.165c.324.947.639,1.858.945,2.772.04.119.112.109.2.106,1.633-.052,3.265-.109,4.9-.153a4.706,4.706,0,0,0,2.6-.8c1.234-.849,2.449-1.726,3.667-2.6a.651.651,0,0,0,.163-.918.657.657,0,0,0-.916-.174c-.8.526-1.587,1.058-2.378,1.592a.318.318,0,0,0-.113.144,1.645,1.645,0,0,1-1.668,1.172c-.931,0-1.862,0-2.793,0a1.48,1.48,0,0,1-.158-.005.526.526,0,0,1-.463-.458.524.524,0,0,1,.36-.558,1.007,1.007,0,0,1,.277-.032c.937,0,1.874,0,2.811,0a.6.6,0,0,0,.628-.452.6.6,0,0,0-.622-.74c-.486-.006-.972-.01-1.458,0a.8.8,0,0,1-.623-.255,2.826,2.826,0,0,0-4.29.378A2.37,2.37,0,0,1-531.154,508.025Zm-3.15.288,1.419,4.149,1.911-.652-1.419-4.149Z"
                                          transform="translate(0 -185.88)"
                                        />
                                        <path
                                          id="Path_173"
                                          data-name="Path 173"
                                          d="M-372.749,314.085a4.454,4.454,0,0,1-4.455,4.441,4.457,4.457,0,0,1-4.452-4.464,4.462,4.462,0,0,1,4.483-4.435A4.46,4.46,0,0,1-372.749,314.085Zm-1.054-.006a3.4,3.4,0,0,0-3.4-3.4,3.407,3.407,0,0,0-3.4,3.4,3.4,3.4,0,0,0,3.4,3.395A3.4,3.4,0,0,0-373.8,314.079Z"
                                          transform="translate(-146.635 0)"
                                        />
                                        <path
                                          id="Path_174"
                                          data-name="Path 174"
                                          d="M-314.223,347.29a.522.522,0,0,1-.479.532.519.519,0,0,1-.563-.442c-.044-.244-.067-.263-.322-.264a.648.648,0,0,0-.209,0c-.079.028-.181.074-.209.14-.021.05.04.167.1.211.4.307.81.6,1.208.905a1.225,1.225,0,0,1,.393,1.434,1.188,1.188,0,0,1-.671.68.214.214,0,0,0-.157.177.509.509,0,0,1-.523.428.54.54,0,0,1-.515-.446.237.237,0,0,0-.118-.139,1.247,1.247,0,0,1-.78-1.043.544.544,0,0,1,.467-.632.524.524,0,0,1,.576.486c.02.148.089.221.241.215.088,0,.176,0,.263,0,.105,0,.224-.01.23-.131a.336.336,0,0,0-.117-.242c-.374-.291-.758-.568-1.139-.851a1.231,1.231,0,0,1-.505-.793,1.221,1.221,0,0,1,.732-1.354.22.22,0,0,0,.165-.188.506.506,0,0,1,.5-.415.5.5,0,0,1,.52.407.252.252,0,0,0,.177.2A1.22,1.22,0,0,1-314.223,347.29Z"
                                          transform="translate(-208.187 -34.252)"
                                        />
                                      </g>
                                    </svg>
                                  </span>
                                  <span className="sherah-psidebar__title">
                                    Phương thức
                                    <br />
                                    thanh toán
                                  </span>
                                </a>
                                <a
                                  className={`list-group-item ${
                                    activeTab === "id4" ? "active" : ""
                                  }`}
                                  data-bs-toggle="list"
                                  href="#id4"
                                  role="tab"
                                  onClick={() => handleTabClick("id4")}
                                >
                                  <span className="sherah-psidebar__icon">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="18.329"
                                      height="17.617"
                                      viewBox="0 0 18.329 17.617"
                                    >
                                      <g
                                        id="Icon"
                                        transform="translate(427.5 -241.625)"
                                      >
                                        <path
                                          id="Path_176"
                                          data-name="Path 176"
                                          d="M-427.5,259.24v-6.009h1.476c-.014-.061-.023-.111-.036-.16a9.441,9.441,0,0,1-.255-4.047,8.6,8.6,0,0,1,4.172-6.386,7.476,7.476,0,0,1,5.655-.785c4.286.973,7.049,5.8,6.052,10.533-.059.28-.128.558-.2.864h1.465v5.991H-427.5Zm11.277-9.617c0,.005,0,.013.006.015a.388.388,0,0,0,.048.027,4.613,4.613,0,0,1,2.682,3.445c.025.115.075.143.174.142.448,0,.9-.007,1.343,0,.127,0,.188-.041.232-.178a8.248,8.248,0,0,0,.363-3.579,7.6,7.6,0,0,0-3.054-5.414,6.4,6.4,0,0,0-4.128-1.236,6.281,6.281,0,0,0-4.706,2.165,8.013,8.013,0,0,0-1.661,8.052c.042.144.105.193.242.19.442-.01.883-.008,1.325,0,.117,0,.164-.039.192-.168a4.706,4.706,0,0,1,2.17-3.153c.195-.12.4-.213.608-.321a3.556,3.556,0,0,1,.072-4.717,2.737,2.737,0,0,1,3.963-.062A3.554,3.554,0,0,1-416.223,249.623Zm-10.19,8.4h16.165v-3.564h-16.165Zm4.312-4.793h7.524a.562.562,0,0,0-.006-.073,3.314,3.314,0,0,0-2.579-2.547,13.3,13.3,0,0,0-1.733-.052,2.987,2.987,0,0,0-.78.088A3.429,3.429,0,0,0-422.1,253.234Zm1.936-5.942a1.977,1.977,0,0,0,1.872,2.065,1.993,1.993,0,0,0,1.859-2.085,1.989,1.989,0,0,0-1.877-2.065A1.981,1.981,0,0,0-420.166,247.293Z"
                                        />
                                        <path
                                          id="Path_177"
                                          data-name="Path 177"
                                          d="M-358.31,507.432h-1.17v-1.171h1.17Z"
                                          transform="translate(-64.793 -250.596)"
                                        />
                                        <path
                                          id="Path_178"
                                          data-name="Path 178"
                                          d="M-301.73,507.4h-1.17v-1.174h1.17Z"
                                          transform="translate(-118.689 -250.565)"
                                        />
                                        <path
                                          id="Path_179"
                                          data-name="Path 179"
                                          d="M-246.575,506.138h1.172v1.177h-1.172Z"
                                          transform="translate(-172.342 -250.479)"
                                        />
                                        <path
                                          id="Path_180"
                                          data-name="Path 180"
                                          d="M-190.257,507.456v-1.162h1.177v1.162Z"
                                          transform="translate(-225.989 -250.627)"
                                        />
                                        <path
                                          id="Path_181"
                                          data-name="Path 181"
                                          d="M-132.4,506.308v1.166h-1.177v-1.166Z"
                                          transform="translate(-279.982 -250.64)"
                                        />
                                      </g>
                                    </svg>
                                  </span>
                                  <span className="sherah-psidebar__title">
                                    Lịch sử đăng nhập
                                  </span>
                                </a>
                                <a
                                  className={`list-group-item ${
                                    activeTab === "id5" ? "active" : ""
                                  }`}
                                  data-bs-toggle="list"
                                  href="#id5"
                                  role="tab"
                                  onClick={() => handleTabClick("id5")}
                                >
                                  <span className="sherah-psidebar__icon">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="13.498"
                                      height="17.259"
                                      viewBox="0 0 13.498 17.259"
                                    >
                                      <g
                                        id="Icon"
                                        transform="translate(660.4 -193.609)"
                                      >
                                        <path
                                          id="Path_184"
                                          data-name="Path 184"
                                          d="M-660.4,203.045a1.613,1.613,0,0,1,.523-.923,1.916,1.916,0,0,1,.388-.246.186.186,0,0,0,.127-.2c0-.8-.008-1.607,0-2.411a5.44,5.44,0,0,1,2.5-4.683,5.586,5.586,0,0,1,3.571-.959,5.609,5.609,0,0,1,3.648,1.591,5.179,5.179,0,0,1,1.621,3.125,16.885,16.885,0,0,1,.075,1.849.488.488,0,0,1-.5.495q-1.044.01-2.088,0a.5.5,0,0,1-.508-.511c-.006-.337,0-.674,0-1.011a2.567,2.567,0,0,0-2.756-2.516,2.562,2.562,0,0,0-2.443,2.363c-.035.9-.007,1.8-.007,2.724h7.7a1.513,1.513,0,0,1,1.477.863,1.669,1.669,0,0,1,.161.7c.012,2.006.01,4.012.005,6.018a1.515,1.515,0,0,1-1.333,1.538.193.193,0,0,0-.046.022h-10.734a.3.3,0,0,0-.063-.024,1.538,1.538,0,0,1-.973-.549,1.792,1.792,0,0,1-.345-.776Zm6.733,6.812h5.108c.426,0,.619-.19.619-.609q0-2.95,0-5.9c0-.416-.194-.6-.624-.6h-10.182c-.426,0-.619.19-.619.609q0,2.942,0,5.884c0,.439.188.621.641.621Zm4.687-10.191a5.512,5.512,0,0,0-.138-1.6,4.667,4.667,0,0,0-5.709-3.293,4.527,4.527,0,0,0-3.472,4.046c-.063.951-.022,1.909-.026,2.865,0,.014.013.029.018.04h1.014v-.19q0-1.146,0-2.293a3.686,3.686,0,0,1,.265-1.381,3.7,3.7,0,0,1,4.171-2.146,3.562,3.562,0,0,1,2.847,3.532c0,.139,0,.278,0,.423Z"
                                          transform="translate(0 0)"
                                        />
                                        <path
                                          id="Path_185"
                                          data-name="Path 185"
                                          d="M-538.592,438.065c0-.243,0-.487,0-.73a.158.158,0,0,0-.109-.174,1.479,1.479,0,0,1-.883-1.448,1.5,1.5,0,0,1,1.146-1.363,1.508,1.508,0,0,1,1.734.918,1.481,1.481,0,0,1-.735,1.868.236.236,0,0,0-.163.257c.009.448,0,.9,0,1.345,0,.354-.193.582-.494.585s-.5-.228-.5-.593C-538.592,438.508-538.592,438.286-538.592,438.065Zm.5-2.76a.5.5,0,0,0-.5.5.5.5,0,0,0,.5.5.5.5,0,0,0,.5-.5A.5.5,0,0,0-538.094,435.3Z"
                                          transform="translate(-115.541 -230.447)"
                                        />
                                      </g>
                                    </svg>
                                  </span>
                                  <span className="sherah-psidebar__title">
                                    Đổi mật khẩu{" "}
                                  </span>
                                </a>
                                <a
                                  className={`list-group-item ${
                                    activeTab === "id6" ? "active" : ""
                                  }`}
                                  data-bs-toggle="list"
                                  href="#id6"
                                  role="tab"
                                  onClick={() => handleTabClick("id6")}
                                >
                                  <span className="sherah-psidebar__icon">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="14.217"
                                      height="14.272"
                                      viewBox="0 0 14.217 14.272"
                                    >
                                      <g
                                        id="Icon"
                                        transform="translate(660.76 -197.338)"
                                      >
                                        <path
                                          id="Path_186"
                                          data-name="Path 186"
                                          d="M-418.017,281.88a1.04,1.04,0,0,1-.1-.209c-.04-.183-.143-.229-.325-.22-.371.017-.742.008-1.114,0a.155.155,0,0,0-.166.105,1.371,1.371,0,0,1-1.552.76,1.376,1.376,0,0,1-1.059-1.337,1.374,1.374,0,0,1,1.08-1.35,1.37,1.37,0,0,1,1.525.711.17.17,0,0,0,.178.112c.391-.005.782-.007,1.173,0,.1,0,.155-.031.175-.129a.258.258,0,0,1,.044-.109c.118-.145.057-.24-.06-.356-.814-.8-1.62-1.615-2.429-2.423-.038-.038-.078-.074-.123-.116a1.7,1.7,0,0,1-1.249.189,1.81,1.81,0,0,1-1.409-1.847,1.809,1.809,0,0,1,1.518-1.7,1.826,1.826,0,0,1,2.126,1.889,2.91,2.91,0,0,1-.221.731c-.027.078-.041.125.027.192q1.323,1.292,2.641,2.59c.01.01.023.018.044.034a2.084,2.084,0,0,1,.9-.233,2.094,2.094,0,0,1,.9.234c.033-.031.063-.057.091-.084q1.072-1.071,2.145-2.141a.172.172,0,0,0,.05-.217,1.265,1.265,0,0,1,.287-1.4,1.294,1.294,0,0,1,1.413-.364,1.293,1.293,0,0,1,.94,1.1,1.35,1.35,0,0,1-1.24,1.575,2.737,2.737,0,0,1-.594-.088.208.208,0,0,0-.151.021q-1.15,1.14-2.291,2.288c-.007.007-.009.017,0-.009l.25.8,1.751.323c.017-.025.035-.047.05-.072a1.809,1.809,0,0,1,2.046-.859,1.846,1.846,0,0,1,1.286,1.816,1.8,1.8,0,0,1-1.681,1.772,1.827,1.827,0,0,1-1.923-1.588c-.006-.047-.044-.121-.079-.129-.558-.127-1.118-.245-1.683-.367a1.954,1.954,0,0,1-.559.674.138.138,0,0,0-.032.121c.232.782.469,1.562.7,2.344.023.076.062.094.136.1a1.378,1.378,0,0,1,1.27,1.451,1.38,1.38,0,0,1-1.46,1.294,1.376,1.376,0,0,1-1.29-1.489,1.308,1.308,0,0,1,.4-.857.149.149,0,0,0,.043-.18q-.373-1.149-.74-2.3c-.023-.071-.044-.12-.137-.117a1.7,1.7,0,0,1-.787-.183.141.141,0,0,0-.192.028q-1.367,1.375-2.741,2.741c-.076.075-.053.128-.019.205a1.787,1.787,0,0,1-.808,2.384,1.731,1.731,0,0,1-1.964-.2,1.719,1.719,0,0,1-.592-1.9,1.741,1.741,0,0,1,1.416-1.322,1.786,1.786,0,0,1,1.17.154.131.131,0,0,0,.179-.027q1.388-1.4,2.781-2.786A.511.511,0,0,0-418.017,281.88Zm-3.619-5.23a.889.889,0,0,0,.871-.887.855.855,0,0,0-.847-.868.853.853,0,0,0-.865.849A.862.862,0,0,0-421.636,276.65Zm-.216,10.6a.827.827,0,0,0,.849-.858.856.856,0,0,0-.851-.853.855.855,0,0,0-.861.857A.854.854,0,0,0-421.852,287.253Zm6.268-6.28a.853.853,0,0,0-.864-.85.854.854,0,0,0-.847.853.857.857,0,0,0,.857.859A.856.856,0,0,0-415.585,280.973Zm5.229,1.046a.857.857,0,0,0-.864-.851.858.858,0,0,0-.847.855.859.859,0,0,0,.858.859A.858.858,0,0,0-410.356,282.019Zm-1.581-5.132a.424.424,0,0,0,.44-.408.43.43,0,0,0-.422-.443.423.423,0,0,0-.429.418A.42.42,0,0,0-411.937,276.887Zm-9.029,4.516a.425.425,0,0,0,.437-.411.43.43,0,0,0-.425-.44.422.422,0,0,0-.427.42A.42.42,0,0,0-420.966,281.4Zm5.909,4.993a.423.423,0,0,0,.433.429.425.425,0,0,0,.415-.418.418.418,0,0,0-.426-.434A.416.416,0,0,0-415.057,286.4Z"
                                          transform="translate(-237.087 -76.608)"
                                        />
                                      </g>
                                    </svg>
                                  </span>
                                  <span className="sherah-psidebar__title">
                                    Tài khoản
                                    <br />
                                    mạng xã hội
                                  </span>
                                </a>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-9 col-md-10 col-12  sherah-personals__content mg-top-30">
                            <div className="sherah-ptabs">
                              <div className="sherah-ptabs__inner">
                                <div
                                  className="tab-content"
                                  id="nav-tabContent"
                                >
                                  {/*  Features Single Tab */}
                                  <div
                                    className={`tab-pane fade ${
                                      activeTab === "id1" ? "show active" : ""
                                    }`} // Chỉ hiển thị tab1 khi activeTab là 'id1'
                                    id="id1"
                                    role="tabpanel"
                                  >
                                    <form action="#">
                                      <div className="row">
                                        <div className="col-12">
                                          <div className="sherah-ptabs__separate">
                                            <div className="sherah-ptabs__form-main">
                                              <div className="sherah__item-group sherah-default-bg sherah-border">
                                                {/*Profile Cover Info */}
                                                <div className="sherah-profile-cover sherah-offset-bg sherah-dflex">
                                                  <div className="sherah-profile-cover__img">
                                                    <img
                                                      src={user.image_url}
                                                      alt="#"
                                                    />
                                                  </div>
                                                  <div className="sherah-profile-cover__content">
                                                    <h3 className="sherah-profile-cover__title">
                                                      {user.name}
                                                    </h3>
                                                    <span className="sherah-profile-cover__text sherah-color1">
                                                      Thành viên:{" "}
                                                      {roleToDisplay}
                                                    </span>
                                                    <ul className="sherah-social mg-top-30">
                                                      <li>
                                                        <a
                                                          href="#"
                                                          className="sherah-pcolor sherah-border sherah-default-bg"
                                                        >
                                                          <i className="fa-brands fa-facebook-f" />
                                                        </a>
                                                      </li>
                                                      <li>
                                                        <a
                                                          href="#"
                                                          className="sherah-pcolor sherah-border sherah-default-bg"
                                                        >
                                                          <i className="fa-brands fa-twitter" />
                                                        </a>
                                                      </li>
                                                      <li>
                                                        <a
                                                          href="#"
                                                          className="sherah-pcolor sherah-border sherah-default-bg"
                                                        >
                                                          <i className="fa-brands fa-linkedin" />
                                                        </a>
                                                      </li>
                                                      <li>
                                                        <a
                                                          href="#"
                                                          className="sherah-pcolor sherah-border sherah-default-bg"
                                                        >
                                                          <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width={13}
                                                            height={13}
                                                            viewBox="0 0 13 13"
                                                          >
                                                            <path
                                                              id="Path_193"
                                                              data-name="Path 193"
                                                              d="M-395.137,386.139q0-.953,0-1.906c0-.237-.074-.31-.311-.31h-3.775a1.256,1.256,0,0,1-.866-.3,1.162,1.162,0,0,1-.323-1.239,1.136,1.136,0,0,1,.963-.773c.122-.011.245-.017.367-.017h3.609c.272,0,.336-.064.336-.337q0-1.875,0-3.749a1.257,1.257,0,0,1,.3-.866,1.162,1.162,0,0,1,1.239-.323,1.137,1.137,0,0,1,.773.963c.011.122.017.245.017.367q0,1.8,0,3.609c0,.272.064.336.337.336h3.749a1.257,1.257,0,0,1,.866.3,1.162,1.162,0,0,1,.323,1.239,1.137,1.137,0,0,1-.963.773c-.122.011-.245.017-.367.017q-1.8,0-3.609,0c-.272,0-.336.064-.336.337q0,1.875,0,3.749a1.256,1.256,0,0,1-.3.866,1.162,1.162,0,0,1-1.239.323,1.1,1.1,0,0,1-.769-.963c-.024-.617-.016-1.236-.022-1.854C-395.137,386.3-395.137,386.22-395.137,386.139Z"
                                                              transform="translate(400.472 -376.258)"
                                                            />
                                                          </svg>
                                                        </a>
                                                      </li>
                                                    </ul>
                                                  </div>
                                                </div>
                                                {/* End Profile Cover Info */}
                                                <div className="sherah-profile-info__v2 mg-top-30">
                                                  <h3 className="sherah-profile-info__heading mg-btm-30">
                                                    Thông tin cá nhân
                                                  </h3>
                                                  <ul className="sherah-profile-info__list sherah-dflex-column">
                                                    <li className="sherah-dflex">
                                                      <h4 className="sherah-profile-info__title">
                                                        Họ và Tên :
                                                      </h4>
                                                      <p className="sherah-profile-info__text">
                                                        {user.name}
                                                      </p>
                                                    </li>
                                                    <li className="sherah-dflex">
                                                      <h4 className="sherah-profile-info__title">
                                                        Giới thiệu :
                                                      </h4>
                                                      <p className="sherah-profile-info__text">
                                                        {user.about}
                                                      </p>
                                                    </li>
                                                    <li className="sherah-dflex">
                                                      <h4 className="sherah-profile-info__title">
                                                        Email :
                                                      </h4>
                                                      <p className="sherah-profile-info__text">
                                                        {user.email}
                                                      </p>
                                                    </li>
                                                    <li className="sherah-dflex">
                                                      <h4 className="sherah-profile-info__title">
                                                        Số điện thoại :
                                                      </h4>
                                                      <p className="sherah-profile-info__text">
                                                        {user.phoneNumber}
                                                      </p>
                                                    </li>
                                                    <li className="sherah-dflex">
                                                      <h4 className="sherah-profile-info__title">
                                                        Ngày sinh :
                                                      </h4>
                                                      <p className="sherah-profile-info__text">
                                                        {new Date(
                                                          user.dateOfBirth
                                                        ).toLocaleDateString(
                                                          "vi-VN"
                                                        )}
                                                      </p>
                                                    </li>
                                                    <li className="sherah-dflex">
                                                      <h4 className="sherah-profile-info__title">
                                                        Địa chỉ :
                                                      </h4>
                                                      <p className="sherah-profile-info__text">
                                                        {user.address}
                                                      </p>
                                                    </li>
                                                  </ul>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </form>
                                  </div>
                                  <div
                                    className={`tab-pane fade ${
                                      activeTab === "id2" ? "show active" : ""
                                    }`}
                                    id="id2"
                                    role="tabpanel"
                                  >
                                    <form action="#">
                                      <div className="sherah-paymentm sherah__item-group sherah-default-bg sherah-border">
                                        {/* Payment Button */}
                                        <div className="sherah__item-button--group mg-btm-20">
                                          <button className="sherah-btn">
                                            Add New Bank
                                          </button>
                                          <button className="sherah-btn sherah-btn__secondary">
                                            Add New Card
                                          </button>
                                        </div>
                                        {/* End Payment Button */}
                                        <h4 className="sherah-default-bg sherah-border__title">
                                          Add a payment method
                                        </h4>
                                        <ul className="sherah-paymentm__list">
                                          <li className="sherah-paymentm__single">
                                            <div className="sherah-paymentm__name">
                                              <div className="sherah-paymentm__icon">
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  width="31.848"
                                                  height="31.815"
                                                  viewBox="0 0 31.848 31.815"
                                                >
                                                  <path
                                                    id="Path_194"
                                                    data-name="Path 194"
                                                    d="M-432.817,324.212v-.746c.012-.016.033-.031.035-.049a7.408,7.408,0,0,1,1.968-3.705,1.133,1.133,0,0,1,.958-.416c.253.014.507,0,.754,0V306.175c-.262,0-.509-.01-.754,0a1.1,1.1,0,0,1-.977-.44c-.3-.373-.6-.738-.88-1.125a6.9,6.9,0,0,1-1.1-2.6v-.746a1.611,1.611,0,0,1,.825-.746q7.247-3.626,14.483-7.273a1.253,1.253,0,0,1,1.234,0q7.25,3.654,14.509,7.289a1.136,1.136,0,0,1,.76,1.467,7.11,7.11,0,0,1-2.116,3.89,1.3,1.3,0,0,1-.7.275,5.4,5.4,0,0,1-.867.011V319.3a5.821,5.821,0,0,1,.883.011,1.237,1.237,0,0,1,.669.264,7.114,7.114,0,0,1,2.124,3.886,1.132,1.132,0,0,1-.648,1.437h-30.476A1.434,1.434,0,0,1-432.817,324.212Zm26.9-23.648c-.083-.055-.113-.081-.147-.1q-5.325-2.675-10.656-5.34a.545.545,0,0,0-.419.034q-4.569,2.279-9.129,4.574c-.522.262-1.043.526-1.646.83Zm2.828,22.451.088-.074c-.328-.509-.661-1.015-.982-1.528a.527.527,0,0,0-.513-.254q-7.137.011-14.274.006-5.271,0-10.542,0c-.117,0-.282,0-.343.069a5.738,5.738,0,0,0-1.094,1.778Zm.04-20.553h-27.792c.371.576.7,1.08,1.023,1.594a.552.552,0,0,0,.543.258q12.376-.008,24.752,0a1.146,1.146,0,0,0,.217,0,.334.334,0,0,0,.186-.081A6.107,6.107,0,0,0-403.045,302.461Zm-20.421,3.729v13.084h3.757V306.19Zm9.392,0v13.084h3.757V306.19Zm-11.3,13.094V306.2H-427.2v13.084Zm7.569-13.1v13.095h1.827V306.189Zm9.391,0v13.084h1.829V306.19Z"
                                                    transform="translate(432.817 -293.081)"
                                                    fill="#fff"
                                                  />
                                                </svg>
                                              </div>
                                              <div className="sherah-paymentm__content">
                                                <h4 className="sherah-paymentm__title sherah-pcolor">
                                                  Bank of America{" "}
                                                </h4>
                                                <p className="sherah-paymentm__text">
                                                  Bank
                                                  <span>**************</span>
                                                  5421
                                                </p>{" "}
                                                <p />
                                                <span className="sherah-paymentm__badge sherah-color3">
                                                  Verified
                                                </span>
                                              </div>
                                            </div>
                                            <div className="sherah-paymentm__manage-btn">
                                              <button className="sherah-btn sherah-btn__fourth">
                                                Manage
                                              </button>
                                            </div>
                                          </li>
                                          <li className="sherah-paymentm__single">
                                            <div className="sherah-paymentm__name">
                                              <div className="sherah-paymentm__icon">
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  width="50.088"
                                                  height="15.42"
                                                  viewBox="0 0 50.088 15.42"
                                                >
                                                  <g
                                                    id="Group_40"
                                                    data-name="Group 40"
                                                    transform="translate(274.731 -345.699)"
                                                  >
                                                    <path
                                                      id="Path_195"
                                                      data-name="Path 195"
                                                      d="M-129.666,361.644h-3.762c-.158-.7-.315-1.311-.431-1.933-.05-.27-.169-.34-.424-.339-1.516.006-3.033-.01-4.549.012a.616.616,0,0,0-.435.32c-.236.517-.41,1.063-.632,1.587-.053.126-.2.3-.306.3-1.331.021-2.662.014-4.053.014.075-.2.119-.328.175-.456,1.911-4.334,3.835-8.663,5.726-13.006a2.212,2.212,0,0,1,2.281-1.476q1.32.03,2.641,0c.347-.008.5.072.579.45q1.475,6.8,2.995,13.593c.048.217.129.426.194.639Zm-6.109-10.723-.115-.019-2.073,5.364h3.35Z"
                                                      transform="translate(-94.977 -0.705)"
                                                      fill="#fff"
                                                    />
                                                    <path
                                                      id="Path_196"
                                                      data-name="Path 196"
                                                      d="M-185.365,357.068c.887.271,1.725.59,2.59.776a5.708,5.708,0,0,0,2.951-.027A2.633,2.633,0,0,0-179,357.4a1.025,1.025,0,0,0,.076-1.651,7.67,7.67,0,0,0-1.3-.851c-.636-.362-1.315-.652-1.935-1.038-3.3-2.051-2.2-5.446-.023-6.861a8.7,8.7,0,0,1,5.566-1.268,18.485,18.485,0,0,1,2.538.47c.131.029.329.255.314.365-.137.981-.315,1.956-.488,2.979a7.32,7.32,0,0,0-3.554-.72,4.322,4.322,0,0,0-1.5.352.938.938,0,0,0-.167,1.759,22.134,22.134,0,0,0,1.951,1.1,15.945,15.945,0,0,1,1.474.86,3.944,3.944,0,0,1,.75,5.942,5.813,5.813,0,0,1-3.082,1.877,12.81,12.81,0,0,1-7.086-.229c-.387-.114-.451-.3-.374-.67C-185.662,358.9-185.522,357.973-185.365,357.068Z"
                                                      transform="translate(-64.679)"
                                                      fill="#fff"
                                                    />
                                                    <path
                                                      id="Path_197"
                                                      data-name="Path 197"
                                                      d="M-245.317,346.665l-2.944,6.844c-1.092,2.541-2.189,5.08-3.27,7.626a.591.591,0,0,1-.639.439c-1.173-.022-2.346-.011-3.52,0a.382.382,0,0,1-.445-.324q-1.723-5.928-3.465-11.85a1.564,1.564,0,0,1,0-.272c2.7,2.048,5.118,4.191,6,7.668.166-.412.306-.75.439-1.09,1.12-2.863,2.244-5.725,3.351-8.594a.591.591,0,0,1,.665-.457C-247.9,346.683-246.642,346.665-245.317,346.665Z"
                                                      transform="translate(-11.01 -0.695)"
                                                      fill="#fff"
                                                    />
                                                    <path
                                                      id="Path_198"
                                                      data-name="Path 198"
                                                      d="M-207.828,346.722h4.071l-2.538,14.889h-4.071C-209.517,356.635-208.673,351.685-207.828,346.722Z"
                                                      transform="translate(-46.855 -0.744)"
                                                      fill="#fff"
                                                    />
                                                    <path
                                                      id="Path_199"
                                                      data-name="Path 199"
                                                      d="M-274.731,346.279a1.606,1.606,0,0,1,.4-.107c1.986-.006,3.972-.02,5.958,0,1.165.014,1.626.446,1.86,1.588.368,1.8.747,3.6,1.12,5.4a1.072,1.072,0,0,1,.017.331c-1.931-3.923-5.27-5.972-9.351-7.043Z"
                                                      transform="translate(0 -0.337)"
                                                      fill="#fff"
                                                    />
                                                  </g>
                                                </svg>
                                              </div>
                                              <div className="sherah-paymentm__content">
                                                <h4 className="sherah-paymentm__title sherah-pcolor">
                                                  Master Card
                                                </h4>
                                                <p className="sherah-paymentm__text">
                                                  Bank **********5535
                                                </p>
                                                <span className="sherah-paymentm__badge sherah-color3">
                                                  Verified
                                                </span>
                                              </div>
                                            </div>
                                            <div className="sherah-paymentm__manage-btn">
                                              <button className="sherah-btn sherah-btn__fourth">
                                                Manage
                                              </button>
                                            </div>
                                          </li>
                                          <li className="sherah-paymentm__single">
                                            <div className="sherah-paymentm__name">
                                              <div className="sherah-paymentm__icon">
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  width="60.189"
                                                  height="15.999"
                                                  viewBox="0 0 60.189 15.999"
                                                >
                                                  <g
                                                    id="Group_1032"
                                                    data-name="Group 1032"
                                                    transform="translate(1446.793 -907.836)"
                                                  >
                                                    <path
                                                      id="Path_1033"
                                                      data-name="Path 1033"
                                                      d="M-329.756,907.836a4.573,4.573,0,0,0,.6.088,3.857,3.857,0,0,1,2.011.877,2.647,2.647,0,0,1,.87,1.784,6.1,6.1,0,0,1-.918,3.878,4.251,4.251,0,0,1-2.788,1.864,8.468,8.468,0,0,1-1.942.177c-.381,0-.763,0-1.144,0a.645.645,0,0,0-.716.6c-.138.845-.268,1.691-.4,2.537-.041.262-.081.525-.123.787a.453.453,0,0,1-.463.411q-1.189.01-2.378,0a.4.4,0,0,1-.394-.5q.3-1.862.588-3.724.279-1.766.56-3.531.264-1.677.525-3.354.1-.668.212-1.335a.7.7,0,0,1,.508-.555Zm-2.7,6.059a7.092,7.092,0,0,0,1.139-.065,1.653,1.653,0,0,0,1.457-1.287,3.013,3.013,0,0,0,.1-.8,1.136,1.136,0,0,0-1.02-1.225,7.909,7.909,0,0,0-1.633-.081.368.368,0,0,0-.366.318c-.029.137-.047.276-.069.414-.136.855-.269,1.71-.41,2.565-.021.129-.006.176.139.167C-332.893,913.885-332.672,913.895-332.451,913.895Z"
                                                      transform="translate(-1075.842)"
                                                      fill="#fff"
                                                    />
                                                    <path
                                                      id="Path_1034"
                                                      data-name="Path 1034"
                                                      d="M-1438.994,907.836a4.745,4.745,0,0,0,.6.089,3.863,3.863,0,0,1,2.01.876,2.656,2.656,0,0,1,.872,1.813,6.114,6.114,0,0,1-.919,3.848,4.257,4.257,0,0,1-2.786,1.864,7.792,7.792,0,0,1-1.717.176c-.467,0-.933,0-1.4,0a.642.642,0,0,0-.686.581q-.25,1.558-.49,3.118a.672.672,0,0,1-.735.637c-.682,0-1.365,0-2.047,0a.481.481,0,0,1-.5-.3v-.211a.234.234,0,0,0,.023-.054q.229-1.447.457-2.895.337-2.145.674-4.291c.238-1.509.482-3.018.711-4.528a.79.79,0,0,1,.544-.729Zm-2.7,6.06a6.754,6.754,0,0,0,1.155-.068,1.638,1.638,0,0,0,1.376-1.066,2.828,2.828,0,0,0,.163-.731c.073-.786-.145-1.367-1.094-1.531a7.834,7.834,0,0,0-1.561-.063.384.384,0,0,0-.37.37c-.157.994-.311,1.989-.472,2.983-.016.1.016.108.1.107C-1442.169,913.894-1441.933,913.9-1441.7,913.9Z"
                                                      fill="#fff"
                                                    />
                                                    <path
                                                      id="Path_1035"
                                                      data-name="Path 1035"
                                                      d="M395.615,907.836a.49.49,0,0,1,.251.59c-.29,1.774-.567,3.551-.846,5.327q-.443,2.812-.884,5.625-.07.445-.145.89a.637.637,0,0,1-.637.569c-.642.009-1.285.007-1.927,0a.378.378,0,0,1-.39-.461c.066-.5.15-.99.227-1.485q.248-1.581.5-3.161t.5-3.146q.25-1.588.5-3.176c.063-.4.126-.8.187-1.2a.475.475,0,0,1,.294-.369Z"
                                                      transform="translate(-1782.483)"
                                                      fill="#fff"
                                                    />
                                                    <path
                                                      id="Path_1036"
                                                      data-name="Path 1036"
                                                      d="M-1086.3,1045.741c.028-.175.057-.347.083-.52a.4.4,0,0,1,.455-.394h2.137a.387.387,0,0,1,.421.5q-.325,2.079-.656,4.157c-.181,1.148-.361,2.3-.547,3.444a.64.64,0,0,1-.68.572q-.964,0-1.927,0a.4.4,0,0,1-.431-.522c.028-.168.055-.335.083-.5-.045-.02-.056.018-.075.035a4.4,4.4,0,0,1-3.658,1.157,3.232,3.232,0,0,1-2.157-1.068,3.711,3.711,0,0,1-.883-1.991,5.409,5.409,0,0,1,2.584-5.33,4.91,4.91,0,0,1,2.993-.638,4.211,4.211,0,0,1,1.256.28,1.9,1.9,0,0,1,.9.722C-1086.38,1045.675-1086.364,1045.719-1086.3,1045.741Zm-2.268,1.253a2.442,2.442,0,0,0-1.094.23,2.57,2.57,0,0,0-1.461,2.507,1.6,1.6,0,0,0,1.2,1.5,2.523,2.523,0,0,0,3.158-1.785,2.143,2.143,0,0,0-.054-1.4A1.753,1.753,0,0,0-1088.571,1046.994Z"
                                                      transform="translate(-341.992 -132.658)"
                                                      fill="#fff"
                                                    />
                                                    <path
                                                      id="Path_1037"
                                                      data-name="Path 1037"
                                                      d="M21.474,1052.022a4.163,4.163,0,0,1-1.2.841,4.412,4.412,0,0,1-3.48.161,3.166,3.166,0,0,1-1.982-2.282,5.338,5.338,0,0,1,3.5-6.32,4.9,4.9,0,0,1,3.217.089,1.769,1.769,0,0,1,.884.7c.027.041.059.079.112.151.031-.185.061-.338.082-.492.045-.336.165-.446.5-.446H25.2a.393.393,0,0,1,.429.5q-.339,2.145-.675,4.29-.257,1.633-.516,3.265a.667.667,0,0,1-.729.611H21.857c-.364,0-.521-.187-.461-.546C21.422,1052.385,21.443,1052.226,21.474,1052.022Zm-1.128-5.436a2.486,2.486,0,0,0-1.589.472,2.525,2.525,0,0,0-1.047,2.232,1.562,1.562,0,0,0,.747,1.335,2.089,2.089,0,0,0,1.12.294,2.494,2.494,0,0,0,2.5-1.922,2.111,2.111,0,0,0-.063-1.358A1.713,1.713,0,0,0,20.346,1046.585Z"
                                                      transform="translate(-1417.427 -132.249)"
                                                      fill="#fff"
                                                    />
                                                    <path
                                                      id="Path_1038"
                                                      data-name="Path 1038"
                                                      d="M-687.913,1056.48c.292-.428.574-.841.855-1.255q1.1-1.623,2.2-3.248a.724.724,0,0,1,.654-.349c.7.008,1.4.005,2.107,0a.416.416,0,0,1,.418.206.428.428,0,0,1-.069.475q-3.224,4.646-6.444,9.294c-.32.461-.642.921-.958,1.385a.621.621,0,0,1-.575.3c-.762-.016-1.526-.023-2.288,0a.362.362,0,0,1-.321-.517,1.39,1.39,0,0,1,.1-.152q1.091-1.541,2.185-3.079a.267.267,0,0,0,.04-.274q-1.2-3.5-2.392-7.005a.657.657,0,0,1-.063-.291.376.376,0,0,1,.371-.348c.758,0,1.515,0,2.273,0a.631.631,0,0,1,.594.491c.183.6.363,1.208.543,1.812l.724,2.417C-687.946,1056.39-687.932,1056.425-687.913,1056.48Z"
                                                      transform="translate(-731.614 -139.461)"
                                                      fill="#fff"
                                                    />
                                                  </g>
                                                </svg>
                                              </div>
                                              <div className="sherah-paymentm__content">
                                                <h4 className="sherah-paymentm__title sherah-pcolor">
                                                  Paypal Account
                                                </h4>
                                                <p className="sherah-paymentm__text">
                                                  Bank **********5535
                                                </p>
                                                <span className="sherah-paymentm__badge sherah-color3">
                                                  Verified
                                                </span>
                                              </div>
                                            </div>
                                            <div className="sherah-paymentm__manage-btn">
                                              <button className="sherah-btn sherah-btn__fourth">
                                                Manage
                                              </button>
                                            </div>
                                          </li>
                                        </ul>
                                      </div>
                                    </form>
                                  </div>
                                  <div
                                    className={`tab-pane fade ${
                                      activeTab === "id4" ? "show active" : ""
                                    }`}
                                    id="id4"
                                    role="tabpanel"
                                  >
                                    <form action="#">
                                      <div className="sherah-personals__history sherah-paymentm sherah__item-group sherah-default-bg sherah-border">
                                        <table
                                          id="sherah-table__main"
                                          className="sherah-table__main sherah-table__main--activity"
                                        >
                                          <thead className="sherah-table__head">
                                            <tr>
                                              <th className="sherah-table__column-1 sherah-table__h1">
                                                Name
                                              </th>
                                              <th className="sherah-table__column-2 sherah-table__h2">
                                                IP
                                              </th>
                                              <th className="sherah-table__column-3 sherah-table__h3">
                                                Time
                                              </th>
                                              <th className="sherah-table__column-4 sherah-table__h4">
                                                Action
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody className="sherah-table__body">
                                            {logins.map((login) => (
                                              <tr key={login._id}>
                                                <td className="sherah-table__column-1 sherah-table__data-1">
                                                  <div className="sherah-table__product-content">
                                                    <p className="sherah-table__product-desc">
                                                      {login.loginPlatform}
                                                    </p>
                                                  </div>
                                                </td>
                                                <td className="sherah-table__column-2 sherah-table__data-2">
                                                  <div className="sherah-table__product-content">
                                                    <p className="sherah-table__product-desc">
                                                      {login.loginIp}
                                                    </p>
                                                  </div>
                                                </td>
                                                <td className="sherah-table__column-3 sherah-table__data-3">
                                                  <div className="sherah-table__product-content">
                                                    <p className="sherah-table__product-desc">
                                                      {new Date(
                                                        login.loginTime
                                                      ).toLocaleString(
                                                        "en-US",
                                                        {
                                                          month: "short",
                                                          day: "2-digit",
                                                          year: "numeric",
                                                          hour: "2-digit",
                                                          minute: "2-digit",
                                                          second: "2-digit",
                                                          hour12: true,
                                                        }
                                                      )}
                                                    </p>
                                                  </div>
                                                </td>
                                                <td className="sherah-table__column-4 sherah-table__data-4">
                                                  <div className="sherah-table__product-content">
                                                    <div className="sherah-table__status__group">
                                                      <a
                                                        href="#"
                                                        className="sherah-table__action sherah-color2 sherah-color2__bg--offset"
                                                      >
                                                        <svg
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
                                                              fill="#ff6767"
                                                            />
                                                            <path
                                                              id="Path_485"
                                                              data-name="Path 485"
                                                              d="M164.512,21.131c0-.517,0-.98,0-1.443.006-.675.327-.966,1.08-.967q2.537,0,5.074,0c.755,0,1.074.291,1.082.966.005.439.005.878.009,1.317a.615.615,0,0,0,.047.126h.428c1,0,2,0,3,0,.621,0,1.013.313,1.019.788s-.4.812-1.04.813q-7.083,0-14.165,0c-.635,0-1.046-.327-1.041-.811s.4-.786,1.018-.789C162.165,21.127,163.3,21.131,164.512,21.131Zm1.839-.021H169.9v-.764h-3.551Z"
                                                              transform="translate(0 0)"
                                                              fill="#ff6767"
                                                            />
                                                            <path
                                                              id="Path_486"
                                                              data-name="Path 486"
                                                              d="M225.582,107.622c0,.9,0,1.806,0,2.709a.806.806,0,0,1-.787.908.818.818,0,0,1-.814-.924q0-2.69,0-5.38a.82.82,0,0,1,.81-.927.805.805,0,0,1,.79.9C225.585,105.816,225.582,106.719,225.582,107.622Z"
                                                              transform="translate(-58.483 -78.508)"
                                                              fill="#ff6767"
                                                            />
                                                            <path
                                                              id="Path_487"
                                                              data-name="Path 487"
                                                              d="M266.724,107.63c0-.9,0-1.806,0-2.709a.806.806,0,0,1,.782-.912.818.818,0,0,1,.818.919q0,2.69,0,5.38a.822.822,0,0,1-.806.931c-.488,0-.792-.356-.794-.938C266.721,109.411,266.724,108.521,266.724,107.63Z"
                                                              transform="translate(-97.561 -78.509)"
                                                              fill="#ff6767"
                                                            />
                                                          </g>
                                                        </svg>
                                                      </a>
                                                    </div>
                                                  </div>
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </form>
                                  </div>
                                  <div
                                    className={`tab-pane fade ${
                                      activeTab === "id5" ? "show active" : ""
                                    }`}
                                    id="id5"
                                    role="tabpanel"
                                  >
                                    <div className="sherah-paymentm sherah__item-group sherah-default-bg sherah-border ">
                                      <h4 className="sherah__item-group sherah-default-bg sherah-border__title">
                                        Đổi mật khẩu
                                      </h4>
                                      <div className="row">
                                        <div className="col-xxl-8  col-lg-6 col-md-6 col-12">
                                          {/* Change Password Form */}
                                          <form
                                            className="sherah-wc__form-main sherah-form-main--v2 p-0"
                                            onSubmit={handleSubmit}
                                          >
                                            <div className="form-group">
                                              <label className="sherah-wc__form-label">
                                                Mật khẩu cũ *
                                              </label>
                                              <div className="form-group__input">
                                                <input
                                                  className="sherah-wc__form-input"
                                                  placeholder="●●●●●●"
                                                  type="password"
                                                  value={oldPassword}
                                                  onChange={(e) =>
                                                    setOldPassword(
                                                      e.target.value
                                                    )
                                                  }
                                                  maxLength={8}
                                                  required
                                                />
                                              </div>
                                            </div>
                                            <div className="form-group">
                                              <label className="sherah-wc__form-label">
                                                Mật khẩu mới *
                                              </label>
                                              <div className="form-group__input">
                                                <input
                                                  className="sherah-wc__form-input"
                                                  placeholder="●●●●●●"
                                                  type="password"
                                                  value={newPassword}
                                                  onChange={(e) =>
                                                    setNewPassword(
                                                      e.target.value
                                                    )
                                                  }
                                                  maxLength={8}
                                                  required
                                                />
                                              </div>
                                            </div>
                                            <div className="form-group">
                                              <label className="sherah-wc__form-label">
                                                Nhập lại mật khẩu mới *
                                              </label>
                                              <div className="form-group__input">
                                                <input
                                                  className="sherah-wc__form-input"
                                                  placeholder="●●●●●●"
                                                  type="password"
                                                  value={confirmPassword}
                                                  onChange={(e) =>
                                                    setConfirmPassword(
                                                      e.target.value
                                                    )
                                                  }
                                                  maxLength={8}
                                                  required
                                                />
                                              </div>
                                            </div>
                                            {message && <p>{message}</p>}
                                            <div className="form-group mg-top-30">
                                              <button
                                                type="submit"
                                                className="sherah-btn sherah-btn__primary"
                                              >
                                                Đổi mật khẩu
                                              </button>
                                            </div>
                                          </form>
                                          {/* End Change Password Form */}
                                        </div>
                                        <div className="col-xxl-4 col-lg-6 col-md-6 col-12">
                                          <div className="sherah-password__img">
                                            <img
                                              src="/assets/interface-dashboard/img/p-update-img.png"
                                              alt=""
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    className={`tab-pane fade ${
                                      activeTab === "id6" ? "show active" : ""
                                    }`}
                                    id="id6"
                                    role="tabpanel"
                                  >
                                    <div
                                      className="sherah-accordion accordion accordion-flush sherah__item-group sherah-default-bg sherah-border"
                                      id="sherah-accordion"
                                    >
                                      <div className="sherah__item-group sherah-default-bg sherah-border mg-top-30">
                                        <h4 className="sherah-default-bg sherah-border__title">
                                          Tài khoản
                                        </h4>
                                        <div className="sherah__item-form--group">
                                          <form className="sherah-wc__form-main p-0">
                                            <div className="row">
                                              <div className="col-lg-6 col-12">
                                                <div className="sherah__item-form--group mg-top-form-20">
                                                  <label className="sherah-wc__form-label">
                                                    Facebook *
                                                  </label>
                                                  <div className="sherah-input-icon">
                                                    <input
                                                      className="sherah-wc__form-input"
                                                      type="url"
                                                      placeholder="Facebook profile link"
                                                    />
                                                    <div className="sherah-form-icon sherah-color1">
                                                      <i className="fa-brands fa-facebook-f" />
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="col-lg-6 col-12">
                                                <div className="sherah__item-form--group mg-top-form-20">
                                                  <label className="sherah-wc__form-label">
                                                    Instagram *
                                                  </label>
                                                  <div className="sherah-input-icon">
                                                    <input
                                                      className="sherah-wc__form-input"
                                                      type="url"
                                                      placeholder="Instagram profile link"
                                                    />
                                                    <div className="sherah-form-icon sherah-color1">
                                                      <i className="fa-brands fa-instagram" />
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="col-lg-6 col-12">
                                                <div className="sherah__item-form--group mg-top-form-20">
                                                  <label className="sherah-wc__form-label">
                                                    Twitter *
                                                  </label>
                                                  <div className="sherah-input-icon">
                                                    <input
                                                      className="sherah-wc__form-input"
                                                      type="url"
                                                      placeholder="Twitter profile link"
                                                    />
                                                    <div className="sherah-form-icon sherah-color1">
                                                      <i className="fa-brands fa-twitter" />
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="col-lg-6 col-12">
                                                <div className="sherah__item-form--group  mg-top-form-20">
                                                  <label className="sherah-wc__form-label">
                                                    Google Plus*
                                                  </label>
                                                  <div className="sherah-input-icon">
                                                    <input
                                                      className="sherah-wc__form-input"
                                                      type="url"
                                                      placeholder="Google Plus profile link"
                                                    />
                                                    <div className="sherah-form-icon sherah-color1">
                                                      <i className="fa-brands fa-google-plus" />
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="col-lg-6 col-12">
                                                <div className="sherah__item-form--group  mg-top-form-20">
                                                  <label className="sherah-wc__form-label">
                                                    Pinterest*{" "}
                                                  </label>
                                                  <div className="sherah-input-icon">
                                                    <input
                                                      className="sherah-wc__form-input"
                                                      type="url"
                                                      placeholder="Pinterest profile Link"
                                                    />
                                                    <div className="sherah-form-icon sherah-color1">
                                                      <i className="fa-brands fa-pinterest" />
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="col-lg-6 col-12">
                                                <div className="sherah__item-form--group  mg-top-form-20">
                                                  <label className="sherah-wc__form-label">
                                                    Dribbble *
                                                  </label>
                                                  <div className="sherah-input-icon">
                                                    <input
                                                      className="sherah-wc__form-input"
                                                      type="url"
                                                      placeholder="Dribbble profile Link"
                                                    />
                                                    <div className="sherah-form-icon sherah-color1">
                                                      <i className="fa-brands fa-dribbble" />
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="col-lg-6 col-12">
                                                <div className="sherah__item-form--group  mg-top-form-20">
                                                  <label className="sherah-wc__form-label">
                                                    Linkedin *
                                                  </label>
                                                  <div className="sherah-input-icon">
                                                    <input
                                                      className="sherah-wc__form-input"
                                                      type="url"
                                                      placeholder="Linkdin profile link"
                                                    />
                                                    <div className="sherah-form-icon sherah-color1">
                                                      <i className="fa-brands fa-linkedin" />
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="col-lg-6 col-12">
                                                <div className="sherah__item-form--group  mg-top-form-20">
                                                  <label className="sherah-wc__form-label">
                                                    Behance *
                                                  </label>
                                                  <div className="sherah-input-icon">
                                                    <input
                                                      className="sherah-wc__form-input"
                                                      type="url"
                                                      placeholder="Behance profile link"
                                                    />
                                                    <div className="sherah-form-icon sherah-color1">
                                                      <i className="fa-brands fa-behance" />
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="row mg-top-30">
                                              <div className="sherah__item-form--group">
                                                <button
                                                  type="submit"
                                                  className="sherah-btn sherah-btn__primary"
                                                >
                                                  Save Now
                                                </button>
                                              </div>
                                            </div>
                                          </form>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    className="tab-pane fade"
                                    id="id7"
                                    role="tabpanel"
                                  >
                                    <div className="sherah-ptabs__page sherah__item-group sherah-default-bg sherah-border">
                                      <h4 className="sherah__item-group sherah-default-bg sherah-border__title">
                                        Terms and Conditions
                                      </h4>
                                      <h3 className="sherah-ptabs__page-title">
                                        1. Definitions
                                      </h3>
                                      <p>
                                        What you do own when you buy an NFT are
                                        the keys to a non-fungible – perhaps
                                        unique – token. That token is yours to
                                        trade or hold or display in
                                        Decentraland. But the digital file
                                        associated with an NFT is just as easy
                                        to copy and paste and download as any
                                        other – the Finally, players lose their
                                        NFTs sometimes according to the rules
                                        and regulations of the NFT game.
                                      </p>
                                      <h3 className="sherah-ptabs__page-title">
                                        2. Acceptance
                                      </h3>
                                      <p>
                                        Amet minim mollit non deserunt ullamco
                                        est sit aliqua dolor do amet sint. Velit
                                        officia consequat duis enim velit
                                        mollit. Exercitation veniam consequat
                                        sunt nostrud amet.Capacity. You confirm
                                        that you have the legal capacity to
                                        receive and hold and make use of the NFT
                                        under French jurisdiction and any other
                                        relevant jurisdiction.Acceptance. By
                                        participating in the Sale, You accept
                                        and agree to these Terms and Conditions
                                        without any condition or restriction.If
                                        You do not agree to this Contract, You
                                        shall not participate in the Sale made
                                        by the Company Exercitation veniam
                                        consequat sunt nostrud amet.Capacity.
                                        You confirm that you have the legal
                                        capacity to receive and hold find to
                                        end.Contract, You shall not participate
                                        in the Sale made by the Company
                                        Exercitation venia
                                      </p>
                                      <blockquote>
                                        In reality, the most important aspect of
                                        a great dashboard is the part that gets
                                        the least amount of attention: The
                                        underlying data. More than any other
                                        aspect, the data will make or break a
                                        dashboard.Within this definition,
                                        successful administration appears to
                                        rest on three basic skills, which we
                                        will call technical, and conceptual.
                                      </blockquote>
                                      <h3 className="sherah-ptabs__page-title">
                                        3. The Sale
                                      </h3>
                                      <p>
                                        The Company offers NFTs featuring the
                                        Betonyou universe. The holders of one or
                                        more NFTs will be able to win cryptos
                                        while playing video games. In the
                                        future, the Company plans to develop its
                                        own games and Metaverse around the
                                        Betonyou universe (“Project”).
                                      </p>
                                      <p>
                                        To release the NFTs and fund the
                                        project, the Company offers NFTs from a
                                        dedicated website("Sale"). The web
                                        address of this website will be given at
                                        the time of the mint. The NFT
                                        acquisition does not confer any rights
                                        on the Company or in the future
                                        development.
                                      </p>
                                      <h3 className="sherah-ptabs__page-title">
                                        4. Purchaser’s obligations
                                      </h3>
                                      <p>
                                        To the fullest extent permitted by
                                        applicable law, You undertake to
                                        indemnify, defend and hold harmless the
                                        Company from and against all claims,
                                        demands, actions, damages, losses, costs
                                        and expenses (including attorneys’ fees)
                                        that arise from or relate to (i) your
                                        Subscription or use of the NFTs; (ii)
                                        your responsibilities or obligations
                                        under this Contract; and (iii) your
                                        breach of this Contract.
                                      </p>
                                      <p>
                                        Company undertakes to act with the care
                                        normally expected from a professional in
                                        his field and to comply with the best
                                        practice in force. The best endeavor
                                        obligation only binds the Company.
                                      </p>
                                    </div>
                                  </div>
                                </div>
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
}

export default ProfileInfo;
