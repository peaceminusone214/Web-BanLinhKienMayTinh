import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminDashboard from "../pages/Dashboard/AdminDashboard";
import Chatmessages from "../pages/Dashboard/chat-messages";
import Faq from "../pages/Dashboard/faq";
import History from "../pages/Dashboard/history";
import Invoiceprint from "../pages/Dashboard/invoice-print";
import Languages from "../pages/Dashboard/languages";
import Notifications from "../pages/Dashboard/notifications";
import Orderdetails from "../pages/Dashboard/order-details";
import Ordersdetails from "../pages/Dashboard/orders-details";
import Orderlist from "../pages/Dashboard/order-list";
import Orderslist from "../pages/Dashboard/orders-list";
import Productlist from "../pages/Dashboard/product-list";
import Productslist from "../pages/Dashboard/products-list";
import Products from "../pages/Dashboard/products";
import ProfileinfoAdmin from "../pages/Dashboard/profile-info";
import Termsconditions from "../pages/Dashboard/terms-conditions";
import Uploadproduct from "../pages/Dashboard/upload-product";
import Vendorlist from "../pages/Dashboard/vendor-list";
import Vendorprofile from "../pages/Dashboard/vendor-profile";
import Vendor from "../pages/Dashboard/vendor";
import Wishlist from "../pages/Dashboard/wishlist";
import Discount from "../pages/Dashboard/discount-management"
import AdminMenu from "./AdminMenu";
import AdminHeader from "./AdminHeader";

import CustomerList from "../pages/Dashboard/CustomersListManagement";
import CustomerDetail from "../pages/Dashboard/CustomersDetail";

import Uploaddiscount from "../pages/Dashboard/upload-discount";
import NewsManagement from "../pages/Dashboard/news-management";
import AddNews from "../pages/Dashboard/add-news";

const ProtectedRoute = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/session`, {
          method: "GET",
          credentials: "include", // Đảm bảo gửi cookie session
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

  if (!user) {
    return <Navigate to="/login" />;
  }

  const { roles } = user;
  const isAdmin = roles.includes("admin");
  const isEmployee = roles.includes("employee");

  if (isAdmin) {
    return (
      <div>
        <AdminMenu />
        <AdminHeader />
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/chat" element={<Chatmessages />} />

          <Route path="/admin/faq" element={<Faq />} />
          <Route path="/admin/history" element={<History />} />
          <Route path="/admin/invoiceprint" element={<Invoiceprint />} />
          <Route path="/admin/languages" element={<Languages />} />
          <Route path="/admin/notifications" element={<Notifications />} />
          <Route path="/admin/orderdetails" element={<Orderdetails />} />
          <Route path="/admin/ordersdetails/:id" element={<Ordersdetails />} />
          <Route path="/admin/orderlist" element={<Orderlist />} />
          <Route path="/admin/orderslist" element={<Orderslist />} />
          <Route path="/admin/productlist" element={<Productlist />} />
          <Route path="/admin/productslist" element={<Productslist />} />
          <Route path="/admin/products" element={<Products />} />
          <Route path="/admin/profileinfo" element={<ProfileinfoAdmin />} />
          <Route path="/admin/termsconditions" element={<Termsconditions />} />
          <Route path="/admin/uploadproduct" element={<Uploadproduct />} />
          <Route path="/admin/uploaddiscount" element={<Uploaddiscount />} />
          <Route path="/admin/vendorlist" element={<Vendorlist />} />
          <Route path="/admin/vendorprofile" element={<Vendorprofile />} />
          <Route path="/admin/vendor" element={<Vendor />} />
          <Route path="/admin/wishlist" element={<Wishlist />} />
          <Route path="/admin/discount" element={<Discount />} />
          <Route path="/admin/customers-list" element={<CustomerList />} />
          <Route path="/admin/customer/:userId" element={<CustomerDetail />} />
          <Route path="/admin/news-management" element={<NewsManagement />} />
          <Route path="/admin/add-news" element={<AddNews />} />
        </Routes>
      </div>
    );
  }

  if (isEmployee) {
    return (
      <div>
        <AdminMenu />
        <AdminHeader />
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/productlist" element={<Productlist />} />
          <Route path="/admin/products" element={<Products />} />
          <Route path="/admin/profileinfo" element={<ProfileinfoAdmin />} />
        </Routes>
      </div>
    );
  }

  return <Navigate to="/" />;
};

export default ProtectedRoute;
