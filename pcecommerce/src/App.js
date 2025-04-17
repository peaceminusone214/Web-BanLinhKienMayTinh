import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import About from "./pages/Main/About";
import Home from "./pages/Main/Home";
import Product from "./pages/Main/Product";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/Dashboard/Login";
import Createaccount from "./pages/Dashboard/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Cart from "./pages/Main/Cart";
import News from "./pages/Main/News";
import Tech from "./pages/Main/Tech";
import BuildPC from "./pages/Main/BuildPC";
import Game from "./pages/Main/Game";
import TinSanPham from "./pages/Main/TinSanPham";
import Tips from "./pages/Main/Tips";
import Software from "./pages/Main/Software";
import Checkout from "./pages/Main/CheckOut";
import ProfileInfo from "./pages/Main/ProfileInfos";
import Contact from "./pages/Main/Contact";
import NewsDetail from "./components/NewsDetails";
import OrderSuccess from "./pages/Main/OrderSuccess";
import SearchResultsPage from "./pages/Main/SearchResultsPage";
import CategoryPage from "./pages/Main/CategoryPage";
import MultiCategoryPage from "./pages/Main/MultiCategoryPage";
import CompareResult from "./pages/Main/ComparetionResulf";
import FloatingChat from "../src/pages/Main/ChatBox/FloatingChat";

// Component chính App
function App() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");
  const isLoginPage = location.pathname === "/login";

  return (
    <div>
      {/* Hiển thị Header và Footer nếu không phải trang admin hoặc login */}
      {!isAdminPath && !isLoginPage && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Createaccount />} />
        <Route path="/info" element={<ProfileInfo />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/news" element={<News />} />
        <Route path="/tech" element={<Tech />} />
        <Route path="/buildpc" element={<BuildPC />} />
        <Route path="News/tech" element={<Tech />} />
        <Route path="News/game" element={<Game />} />
        <Route path="News/san-pham" element={<TinSanPham />} />
        <Route path="News/tips" element={<Tips />} />
        <Route path="News/software" element={<Software />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/NewsDetail/:id" element={<NewsDetail />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/categories/:slugs" element={<MultiCategoryPage />} />
        <Route path="/search-results" element={<SearchResultsPage />} />
        <Route path="/compare-results" element={<CompareResult />} />
        <Route path="/order-success" element={<OrderSuccess />} />

        {/* Admin Routes (protected) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/*" element={<ProtectedRoute />} />
        </Route>
      </Routes>

      {/* Hiển thị Footer nếu không phải trang admin hoặc login */}
      {!isAdminPath && !isLoginPage && <Footer />}
    </div>
  );
}

// Bọc App với BrowserRouter + ẩn FloatingChat trong admin
function FloatingChatWrapper() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");

  return !isAdminPath ? <FloatingChat /> : null;
}

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
      <FloatingChatWrapper />
    </BrowserRouter>
  );
}

export default AppWrapper;
