import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import About from "./pages/Main/About";
import Home from "./pages/Main/Home";
import Product from "./pages/Main/Product";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/Dashboard/login";
import Createaccount from "./pages/Dashboard/create-account";
import ProtectedRoute from "./components/ProtectedRoute";
import Cart from './pages/Main/Cart';
import News from './pages/Main/News';
import Tech from './pages/Main/Tech';
import BuildPC from './pages/Main/BuildPC';
import Game from './pages/Main/Game';
import SanPham from './pages/Main/SanPham';
import Tips from './pages/Main/Tips';
import Software from './pages/Main/Software';
import Checkout from './pages/Main/CheckOut';
import ProfileInfo from './pages/Main/Profile-info';
import Contact from './pages/Main/Contact';

function App() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");
  const isLoginPage = location.pathname === "/login";

  return (
    <div>
      {/* Conditionally render Header and Footer based on the route */}
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
        <Route path="/buildpc" element={<BuildPC/>} />
        <Route path="News/tech" element={<Tech />} />
        <Route path="News/game" element={<Game />} />
        <Route path="News/san-pham" element={<SanPham />} />
        <Route path="News/tips" element={<Tips />} />
        <Route path="News/software" element={<Software />} /> 
        <Route path="/checkout" element={<Checkout />} /> 
        <Route path="/contact" element={<Contact />} /> 

        {/* Admin Routes (protected) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/*" element={<ProtectedRoute />} />
        </Route>
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
    </BrowserRouter>
  );
}

export default AppWrapper;
