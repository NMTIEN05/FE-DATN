import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaSearch,
  FaPhoneAlt,
  FaShoppingCart,
  FaUserCircle,
  FaBars,
  FaTimes,
  FaHome,
  FaMobileAlt,
  FaLaptop,
  FaHeadphones,
  FaInfoCircle,
  FaClipboardList,
  FaChevronDown,
  FaSignOutAlt,
  FaUserLock,
  FaHeart
} from 'react-icons/fa';
import { IoLogoApple } from 'react-icons/io';
import { SiSamsung, SiXiaomi, SiOppo } from 'react-icons/si';
import { TagFilled } from '@ant-design/icons';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const navigate = useNavigate();
  const fixedHeaderHeight = '56px';

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    
    // Lấy số lượng sản phẩm yêu thích từ localStorage hoặc API
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavoritesCount(favorites.length);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <header className="z-50">
      {/* Header fixed */}
      <div className="fixed top-0 left-0 w-full bg-blue-100 z-40 flex items-center" style={{ height: fixedHeaderHeight }}>
        <div className="container mx-auto px-10 flex items-center justify-between flex-wrap gap-y-2">
          <div className="block md:hidden order-1">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-700 text-2xl">
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          <div className="order-2 md:order-1 flex items-center">
            <Link to="/" className="text-2xl font-extrabold text-gray-800">
              E<span className="text-blue-600">Shop</span>
            </Link>
          </div>

          <div className="hidden md:flex flex-grow justify-center relative order-2 items-center">
            <div className="w-full max-w-xl relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-4 pr-12 py-1 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600">
                <FaSearch />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-sm order-3 ml-auto">
            <Link to="/contact" className="flex items-center text-gray-700 hover:text-blue-600 px-2 group">
              <FaPhoneAlt className="mr-2" />
              <span className="hidden lg:block">Liên hệ</span>
            </Link>
            <Link to="/orders" className="flex items-center text-gray-700 hover:text-blue-600 px-2 group">
              <FaClipboardList className="mr-2" />
              <span className="hidden lg:block">Đơn hàng</span>
            </Link>
            <Link to="/favorites" className="flex items-center text-gray-700 hover:text-blue-600 relative px-2 group">
              <FaHeart className="mr-2" />
              <span className="hidden lg:block">Yêu thích</span>
              {favoritesCount > 0 && (
                <span className="absolute -top-1 right-0 bg-red-500 text-white text-[0.6rem] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </Link>
            <Link to="/cart" className="flex items-center text-gray-700 hover:text-blue-600 relative px-2 group">
              <FaShoppingCart className="mr-2" />
              <span className="hidden lg:block">Giỏ hàng</span>
              <span className="absolute -top-1 right-0 bg-red-500 text-white text-[0.6rem] font-bold rounded-full h-4 w-4 flex items-center justify-center">3</span>
            </Link>

            {isLoggedIn ? (
              <div className="relative px-2">
                <button
                  onClick={() => setIsAccountOpen(!isAccountOpen)}
                  className="flex items-center text-gray-700 hover:text-blue-600 gap-1"
                >
                  <FaUserCircle />
                  <span className="hidden lg:block">Tài khoản</span>
                  <FaChevronDown className={`text-xs mt-[1px] transform transition-transform ${isAccountOpen ? 'rotate-180' : ''}`} />
                </button>

                {isAccountOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden text-sm">
                    <Link to="/account" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600" onClick={() => setIsAccountOpen(false)}>
                      <div className="flex items-center gap-2">
                        <FaUserCircle /> Tài khoản
                      </div>
                    </Link>
                    <Link to="/favorites" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600" onClick={() => setIsAccountOpen(false)}>
                      <div className="flex items-center gap-2">
                        <FaHeart /> Sản phẩm yêu thích
                      </div>
                    </Link>
                    <Link to="/change-password" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600" onClick={() => setIsAccountOpen(false)}>
                      <div className="flex items-center gap-2">
                        <FaUserLock /> Đổi mật khẩu
                      </div>
                    </Link>
                    <button onClick={() => { handleLogout(); setIsAccountOpen(false); }} className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50">
                      <div className="flex items-center gap-2">
                        <FaSignOutAlt /> Đăng xuất
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-2 px-2">
                <Link to="/login" className="text-blue-600 font-medium hover:underline">Đăng nhập</Link>
                <Link to="/register" className="text-blue-600 font-medium hover:underline">Đăng ký</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-30 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="fixed top-0 left-0 w-80 h-full bg-white z-40 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <Link to="/" className="text-2xl font-extrabold text-gray-800" onClick={() => setIsMobileMenuOpen(false)}>
                  E<span className="text-blue-600">Shop</span>
                </Link>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 text-2xl">
                  <FaTimes />
                </button>
              </div>
              {/* Search bar for mobile */}
              <div className="mt-4 relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600">
                  <FaSearch />
                </button>
              </div>
            </div>
            
            <nav className="flex flex-col p-4 space-y-2">
              <Link to="/" className="flex items-center text-gray-800 hover:text-blue-600 py-2" onClick={() => setIsMobileMenuOpen(false)}>
                <FaHome className="mr-3" /> Trang chủ
              </Link>
              <Link to="/dien-thoai" className="flex items-center text-gray-800 hover:text-blue-600 py-2" onClick={() => setIsMobileMenuOpen(false)}>
                <FaMobileAlt className="mr-3" /> Điện thoại
              </Link>
              <Link to="/laptops" className="flex items-center text-gray-800 hover:text-blue-600 py-2" onClick={() => setIsMobileMenuOpen(false)}>
                <FaLaptop className="mr-3" /> Laptop
              </Link>
              <Link to="/phu-kien" className="flex items-center text-gray-800 hover:text-blue-600 py-2" onClick={() => setIsMobileMenuOpen(false)}>
                <FaHeadphones className="mr-3" /> mã giảm giá
              </Link>
              <Link to="/favorites" className="flex items-center text-gray-800 hover:text-blue-600 py-2" onClick={() => setIsMobileMenuOpen(false)}>
                <FaHeart className="mr-3" /> 
                Sản phẩm yêu thích 
                {favoritesCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {favoritesCount}
                  </span>
                )}
              </Link>
              <Link to="/cart" className="flex items-center text-gray-800 hover:text-blue-600 py-2" onClick={() => setIsMobileMenuOpen(false)}>
                <FaShoppingCart className="mr-3" /> Giỏ hàng
              </Link>
              <Link to="/orders" className="flex items-center text-gray-800 hover:text-blue-600 py-2" onClick={() => setIsMobileMenuOpen(false)}>
                <FaClipboardList className="mr-3" /> Đơn hàng
              </Link>
              <Link to="/contact" className="flex items-center text-gray-800 hover:text-blue-600 py-2" onClick={() => setIsMobileMenuOpen(false)}>
                <FaPhoneAlt className="mr-3" /> Liên hệ
              </Link>
              <Link to="/gioi-thieu" className="flex items-center text-gray-800 hover:text-blue-600 py-2" onClick={() => setIsMobileMenuOpen(false)}>
                <FaInfoCircle className="mr-3" /> Về chúng tôi
              </Link>
              
              {/* Brands section for mobile */}
              <div className="pt-2 border-t">
                <p className="text-gray-600 font-medium mb-2">Thương hiệu</p>
                <Link to="/thuong-hieu/apple" className="flex items-center text-gray-700 hover:text-blue-600 py-2 pl-4" onClick={() => setIsMobileMenuOpen(false)}>
                  <IoLogoApple className="mr-3 text-xl" /> Apple
                </Link>
                <Link to="/thuong-hieu/samsung" className="flex items-center text-gray-700 hover:text-blue-600 py-2 pl-4" onClick={() => setIsMobileMenuOpen(false)}>
                  <SiSamsung className="mr-3 text-xl" /> Samsung
                </Link>
                <Link to="/thuong-hieu/xiaomi" className="flex items-center text-gray-700 hover:text-blue-600 py-2 pl-4" onClick={() => setIsMobileMenuOpen(false)}>
                  <SiXiaomi className="mr-3 text-xl" /> Xiaomi
                </Link>
                <Link to="/thuong-hieu/oppo" className="flex items-center text-gray-700 hover:text-blue-600 py-2 pl-4" onClick={() => setIsMobileMenuOpen(false)}>
                  <SiOppo className="mr-3 text-xl" /> OPPO
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <div className="bg-blue-100 pb-2 md:pb-0">
        <nav className="hidden md:flex items-center justify-center text-sm font-medium" style={{ marginTop: fixedHeaderHeight, height: '40px' }}>
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center text-gray-800 hover:text-blue-600 px-3 py-1">
              <FaHome className="mr-2" /> Trang chủ
            </Link>
            <Link to="/dien-thoai" className="flex items-center text-gray-800 hover:text-blue-600 px-3 py-1">
              <FaMobileAlt className="mr-2" /> Điện thoại
            </Link>
            <Link to="/laptops" className="flex items-center text-gray-800 hover:text-blue-600 px-3 py-1">
              <FaLaptop className="mr-2" /> Laptop
            </Link>
            <div className="relative group">
              <Link to="/thuong-hieu" className="flex items-center text-gray-800 hover:text-blue-600 px-3 py-1">
                <span className="mr-2 text-lg">🛍️</span>
                <span>Thương hiệu</span>
                <FaChevronDown className="ml-1 text-xs group-hover:rotate-180 transition-transform" />
              </Link>
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10 overflow-hidden">
                <Link to="/thuong-hieu/apple" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700">
                  <IoLogoApple className="mr-2 text-xl" /> Apple
                </Link>
                <Link to="/thuong-hieu/samsung" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700">
                  <SiSamsung className="mr-2 text-xl" /> Samsung
                </Link>
                <Link to="/thuong-hieu/xiaomi" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700">
                  <SiXiaomi className="mr-2 text-xl" /> Xiaomi
                </Link>
                <Link to="/thuong-hieu/oppo" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700">
                  <SiOppo className="mr-2 text-xl" /> OPPO
                </Link>
              </div>
            </div>
            <Link to="/phu-kien" className="flex items-center text-gray-800 hover:text-blue-600 px-3 py-1">
              <TagFilled className="mr-2" /> mã giảm giá
            </Link>
            <Link to="/gioi-thieu" className="flex items-center text-gray-800 hover:text-blue-600 px-3 py-1">
              <FaInfoCircle className="mr-2" /> Về chúng tôi
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;