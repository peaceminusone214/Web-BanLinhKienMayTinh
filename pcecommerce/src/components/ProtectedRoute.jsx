import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Chatmessages from "../pages/Dashboard/ChatMessages";
import Faq from "../pages/Dashboard/FAQ";
import History from "../pages/Dashboard/history";
import Invoiceprint from "../pages/Dashboard/invoice-print";
import Languages from "../pages/Dashboard/languages";
import Notifications from "../pages/Dashboard/notifications";
import Orderslist from "../pages/Dashboard/OrderManagement";
import Productslist from "../pages/Dashboard/ProductManagement";
import Products from "../pages/Dashboard/products";
import ProfileinfoAdmin from "../pages/Dashboard/AdminProfileInfos";
import Termsconditions from "../pages/Dashboard/terms-conditions";
import Uploadproduct from "../pages/Dashboard/UploadProduct";
import Vendorlist from "../pages/Dashboard/vendor-list";
import Vendorprofile from "../pages/Dashboard/vendor-profile";
import Vendor from "../pages/Dashboard/vendor";
import Wishlist from "../pages/Dashboard/wishlist";
import Discount from "../pages/Dashboard/DiscountManagement";
import Warehouse from "../pages/Dashboard/DeletedProductManagement";
import DeletedOrderslist from "../pages/Dashboard/DeletedOrderManagement";
import AdminMenu from "./admin-components/AdminMenu";
import AdminHeader from "./admin-components/AdminHeader";
import CustomerList from "../pages/Dashboard/CustomerManagement";
import CustomerDetail from "../pages/Dashboard/CustomersDetail";
import Uploaddiscount from "../pages/Dashboard/UploadDiscount";
import NewsManagement from "./news-management";
import AddNews from "./AddNews";
import NewsDetail from "./NewsDetails";
import AdminComments from "./AdminComments";
import AdminCommentDetail from "./AdminCommentDetails";
import Statistics from "../pages/Dashboard/Statistics";
import NoPermission from "./NoPermission";
import Buildslist from "../pages/Dashboard/BuildManagement";
import StaffManagement from "../pages/Dashboard/StaffManagement";

const ProtectedRoute = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuClass, setMenuClass] = useState("sherah-smenu");

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/session`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" />;

  const { roles } = user;
  const isAdmin = roles.includes("admin");
  const isCashier = roles.includes("cashier");
  const isProductManager = roles.includes("productManagement");

  return (
    <div>
      <AdminMenu menuClass={menuClass} setMenuClass={setMenuClass} />
      <AdminHeader menuClass={menuClass} setMenuClass={setMenuClass} />
      <Routes>
        {isAdmin && (
          <>
            <Route path="/admin/chat" element={<Chatmessages />} />
            <Route path="/admin/faq" element={<Faq />} />
            <Route path="/admin/history" element={<History />} />
            <Route path="/admin/invoiceprint" element={<Invoiceprint />} />
            <Route path="/admin/languages" element={<Languages />} />
            <Route path="/admin/notifications" element={<Notifications />} />
            <Route path="/admin/orderslist" element={<Orderslist />} />
            <Route path="/admin/productslist" element={<Productslist />} />
            <Route path="/admin/products" element={<Products />} />
            <Route path="/admin/profileinfo" element={<ProfileinfoAdmin />} />
            <Route
              path="/admin/termsconditions"
              element={<Termsconditions />}
            />
            <Route path="/admin/uploadproduct" element={<Uploadproduct />} />
            <Route path="/admin/uploaddiscount" element={<Uploaddiscount />} />
            <Route path="/admin/vendorlist" element={<Vendorlist />} />
            <Route path="/admin/vendorprofile" element={<Vendorprofile />} />
            <Route path="/admin/vendor" element={<Vendor />} />
            <Route path="/admin/wishlist" element={<Wishlist />} />
            <Route path="/admin/discount" element={<Discount />} />
            <Route path="/admin/customers-list" element={<CustomerList />} />
            <Route
              path="/admin/customer/:userId"
              element={<CustomerDetail />}
            />
            <Route path="/admin/news-management" element={<NewsManagement />} />
            <Route path="/admin/add-news" element={<AddNews />} />
            <Route path="/admin/news-detail" element={<NewsDetail />} />
            <Route path="/admin/admin-comments" element={<AdminComments />} />
            <Route
              path="/admin/admin-comments-detail/:id"
              element={<AdminCommentDetail />}
            />
            <Route path="/admin/warehouse" element={<Warehouse />} />
            <Route
              path="/admin/deletedorders"
              element={<DeletedOrderslist />}
            />
            <Route path="/admin/buildslist" element={<Buildslist />} />
            <Route path="/admin/staffmanagement" element={<StaffManagement />} />
            <Route path="/admin" element={<Statistics />} />
          </>
        )}

        {isCashier && (
          <>
            <Route path="/admin/orderslist" element={<Orderslist />} />
            <Route
              path="/admin/deletedorders"
              element={<DeletedOrderslist />}
            />
            <Route path="/admin/profileinfo" element={<ProfileinfoAdmin />} />
          </>
        )}

        {isProductManager && (
          <>
            <Route path="/admin/products" element={<Products />} />
            <Route path="/admin/uploadproduct" element={<Uploadproduct />} />
            <Route path="/admin/productslist" element={<Productslist />} />
            <Route path="/admin/profileinfo" element={<ProfileinfoAdmin />} />
            <Route path="/admin/warehouse" element={<Warehouse />} />
            <Route path="/admin/buildslist" element={<Buildslist />} />
          </>
        )}

        {/* Nếu không có quyền truy cập và không thuộc vai trò nào phù hợp */}
        <Route path="*" element={<NoPermission />} />
      </Routes>
    </div>
  );
};

export default ProtectedRoute;
