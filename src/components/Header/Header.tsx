import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import { FaSearch, FaPhone, FaShoppingCart, FaTruck, FaUser, FaHome, FaMobile } from 'react-icons/fa';
import { IoLogoApple } from 'react-icons/io';
import { SiSamsung, SiXiaomi, SiOppo } from 'react-icons/si';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        {/* Top header with search and functions */}
        <div className="header-top">
          <Link to="/" className="logo">
            logo
          </Link>

          <div className="search-box">
            <input type="text" placeholder="Tìm kiếm..." />
            <button type="button">
              <FaSearch />
            </button>
          </div>

          <div className="header-functions">
            <Link to="/contact" className="function-item">
              <FaPhone />
              <span>Liên hệ</span>
            </Link>
            <Link to="/cart" className="function-item">
              <FaShoppingCart />
              <span>Giỏ hàng</span>
            </Link>
            <Link to="/shipping" className="function-item">
              <FaTruck />
              <span>Giao hàng</span>
            </Link>
            <Link to="/account" className="function-item">
              <FaUser />
              <span>Tài khoản</span>
            </Link>
          </div>
        </div>

        {/* Navigation menu */}
        <nav className="header-nav">
          <Link to="/" className="nav-item">
            <FaHome />
            <span>Trang chủ</span>
          </Link>
          <Link to="/products" className="nav-item">
            <FaMobile />
            <span>Sản phẩm</span>
          </Link>
          <Link to="/services" className="nav-item">
            <FaPhone />
            <span>Dịch vụ</span>
          </Link>
          <div className="dropdown">
            <Link to="/phones" className="nav-item">
              <FaMobile />
              <span>Điện thoại</span>
            </Link>
            <div className="dropdown-menu">
              <Link to="/phones/iphone" className="dropdown-item">
                <IoLogoApple />
                <span>iPhone</span>
              </Link>
              <Link to="/phones/samsung" className="dropdown-item">
                <SiSamsung />
                <span>Samsung</span>
              </Link>
              <Link to="/phones/oppo" className="dropdown-item">
                <SiOppo />
                <span>OPPO</span>
              </Link>
              <Link to="/phones/xiaomi" className="dropdown-item">
                <SiXiaomi />
                <span>Xiaomi</span>
              </Link>
              <Link to="/phones/realme" className="dropdown-item">
                <FaMobile />
                <span>Realme</span>
              </Link>
            </div>
          </div>
          <Link to="/other" className="nav-item">
            <span>Khác</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header; 