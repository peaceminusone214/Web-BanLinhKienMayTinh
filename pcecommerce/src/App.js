import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import About from './pages/Main/About';
import Computer from './pages/Main/Computer';
import Contact from './pages/Main/Contact';
import Home from './pages/Main/Home';
import Laptop from './pages/Main/Laptop';
import Product from './pages/Main/Product';
import Cart from './pages/Main/Cart'; //Giỏ hàng
import News from './pages/Main/News'; // Tin tức

import Tech from './pages/Main/Tech';
import Game from "./pages/Main/Game";
import SanPham from "./pages/Main/SanPham";
import Tips from "./pages/Main/Tips";
import Software from "./pages/Main/Software";

import Header from './components/Header';
import Footer from './components/Footer';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import Chatmessages from './pages/Dashboard/chat-messages';
import Createaccount from './pages/Dashboard/create-account';
import Customerlist from './pages/Dashboard/customer-list';
import Customers from './pages/Dashboard/customers';
import Faq from './pages/Dashboard/faq';
import History from './pages/Dashboard/history';
import Invoiceprint from './pages/Dashboard/invoice-print';
import Languages from './pages/Dashboard/languages';
import Login from './pages/Dashboard/login';
import Notifications from './pages/Dashboard/notifications';
import Orderdetails from './pages/Dashboard/order-details';
import Orderlist from './pages/Dashboard/order-list';
import Productlist from './pages/Dashboard/product-list';
import Products from './pages/Dashboard/products';
import Profileinfo from './pages/Dashboard/profile-info';
import Termsconditions from './pages/Dashboard/terms-conditions';
import Uploadproduct from './pages/Dashboard/upload-product';
import Vendorlist from './pages/Dashboard/vendor-list';
import Vendorprofile from './pages/Dashboard/vendor-profile';
import Vendor from './pages/Dashboard/vendor';
import Wishlist from './pages/Dashboard/wishlist';
import AdminMenu from './components/AdminMenu';
import AdminHeader from './components/AdminHeader';

function App() {
  const location = useLocation();
  
  // Check if the current route is part of the admin section or the login route
  const isAdminPath = location.pathname.startsWith('/admin');
  const isLoginPage = location.pathname === '/login';

  return (
    <div>
      {/* Conditionally render Header and Footer based on the route */}
      {!isAdminPath && !isLoginPage && <Header />}
      {isAdminPath && <AdminMenu />}
      {isAdminPath && <AdminHeader />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/computer" element={<Computer />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/laptop" element={<Laptop />} />
        <Route path="/products" element={<Product />} />

        <Route path="/cart" element={<Cart />} />
        <Route path="/news" element={<News />} />
        <Route path="News/tech" element={<Tech />} />
        <Route path="News/game" element={<Game />} />
        <Route path="News/san-pham" element={<SanPham />} />
        <Route path="News/tips" element={<Tips />} />
        <Route path="News/software" element={<Software />} />

        
        <Route path="/login" element={<Login />} />
        
        {/* Admin Routes (including sub-routes) */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/chat" element={<Chatmessages />} />
        <Route path="/admin/createaccount" element={<Createaccount />} />
        <Route path="/admin/customerlist" element={<Customerlist />} />
        <Route path="/admin/customers" element={<Customers />} />
        <Route path="/admin/faq" element={<Faq />} />
        <Route path="/admin/history" element={<History />} />
        <Route path="/admin/invoiceprint" element={<Invoiceprint />} />
        <Route path="/admin/languages" element={<Languages />} />
        <Route path="/admin/notifications" element={<Notifications />} />
        <Route path="/admin/orderdetails" element={<Orderdetails />} />
        <Route path="/admin/orderlist" element={<Orderlist />} />
        <Route path="/admin/productlist" element={<Productlist />} />
        <Route path="/admin/products" element={<Products />} />
        <Route path="/admin/profileinfo" element={<Profileinfo />} />
        <Route path="/admin/termsconditions" element={<Termsconditions />} />
        <Route path="/admin/uploadproduct" element={<Uploadproduct />} />
        <Route path="/admin/vendorlist" element={<Vendorlist />} />
        <Route path="/admin/vendorprofile" element={<Vendorprofile />} />
        <Route path="/admin/vendor" element={<Vendor />} />
        <Route path="/admin/wishlist" element={<Wishlist />} />
      </Routes>

      {/* Conditionally render Footer based on the route */}
      {!isAdminPath && !isLoginPage && <Footer />}
    </div>
  );
}

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
      <Home/>
    </BrowserRouter>
  );
}

export default AppWrapper;
