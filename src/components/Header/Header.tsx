import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  FaClipboardList
} from 'react-icons/fa';
import { IoLogoApple } from 'react-icons/io';
import { SiSamsung, SiXiaomi, SiOppo } from 'react-icons/si';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBrandsDropdownOpen, setIsBrandsDropdownOpen] = useState(false);

  // Chiều cao ước tính của phần trên header (fixed)
  // Dựa trên font-size, padding, và nội dung, khoảng 56px là hợp lý cho py-2
  const fixedHeaderHeight = '56px'; 

  return (
    <header className="z-50">
      {/* PHẦN TRÊN HEADER (SẼ LUÔN DÍNH Ở ĐẦU TRANG) */}
      {/* Sử dụng height cố định và flex để căn chỉnh nội dung */}
      <div 
        className="fixed top-0 left-0 w-full bg-blue-100 z-40  flex items-center" 
        style={{ height: fixedHeaderHeight }} // Đặt chiều cao cố định cho phần fixed
      >
        <div className="container mx-auto px-6 flex items-center justify-between flex-wrap gap-y-2">
          {/* Nút bật/tắt Mobile Menu (chỉ hiển thị trên mobile) */}
          <div className="block md:hidden order-1">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 text-2xl focus:outline-none"
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {/* Logo */}
          <div className="order-2 md:order-1 text-center md:text-left md:flex-none flex items-center">
            <Link to="/" className="text-2xl font-extrabold text-gray-800">
              E<span className="text-blue-600">Shop</span>
            </Link>
          </div>

          {/* Thanh tìm kiếm (chỉ hiển thị trên desktop) */}
          <div className="hidden md:flex flex-grow justify-center relative order-2 items-center">
            <div className="w-full max-w-xl relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-4 pr-12 py-1 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 ease-in-out text-sm"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors duration-200"
              >
                <FaSearch className="text-lg" />
              </button>
            </div>
          </div>

          {/* Chức năng người dùng (Liên hệ, Đơn hàng, Giỏ hàng, Tài khoản) */}
          <div className="flex items-center space-x-3 text-sm order-3 ml-auto md:flex-none">
            <Link to="/contact" className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-200 px-2 rounded-md">
              <FaPhoneAlt className="mr-2 text-base" />
              <span className="hidden lg:block">Liên hệ</span>
            </Link>
            <Link to="/orders" className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-200 px-2 rounded-md">
              <FaClipboardList className="mr-2 text-base" />
              <span className="hidden lg:block">Đơn hàng</span>
            </Link>
            <Link to="/cart" className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-200 relative px-2 rounded-md">
              <FaShoppingCart className="mr-2 text-base" />
              <span className="hidden lg:block">Giỏ hàng</span>
              <span className="absolute -top-1 right-0 bg-red-500 text-white text-[0.6rem] font-bold rounded-full h-4 w-4 flex items-center justify-center">3</span>
            </Link>
            <Link to="/account" className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-200 px-2 rounded-md">
              <FaUserCircle className="mr-2 text-base" />
              <span className="hidden lg:block">Tài khoản</span>
            </Link>
          </div>
        </div>
      </div>

      {/* PHẦN MENU ĐIỀU HƯỚNG DƯỚI (SẼ CUỘN ĐI CÙNG NỘI DUNG TRANG) */}
      <div className="bg-blue-100 pb-2 md:pb-0">
        {/* Bỏ border-t và dùng mt-[fixedHeaderHeight] để tạo khoảng trống */}
        <nav 
          className="hidden md:flex items-center justify-center text-sm font-medium" 
          style={{ marginTop: fixedHeaderHeight, height: '40px' }} // Đặt margin-top và chiều cao cố định
        >
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center text-gray-800 hover:text-blue-600 transition-colors duration-200 py-1 px-3 rounded-md">
              <FaHome className="mr-2 text-lg" />
              <span>Trang chủ</span>
            </Link>
            <Link to="/dien-thoai" className="flex items-center text-gray-800 hover:text-blue-600 transition-colors duration-200 py-1 px-3 rounded-md">
              <FaMobileAlt className="mr-2 text-lg" />
              <span>Điện thoại</span>
            </Link>
            <Link to="/laptops" className="flex items-center text-gray-800 hover:text-blue-600 transition-colors duration-200 py-1 px-3 rounded-md">
              <FaLaptop className="mr-2 text-lg" />
              <span>Laptop</span>
            </Link>

            {/* Dropdown Thương hiệu */}
            <div className="relative group">
              <Link to="/thuong-hieu" className="flex items-center text-gray-800 hover:text-blue-600 transition-colors duration-200 py-1 px-3 rounded-md cursor-pointer">
                <span className="mr-2 text-lg">🛍️</span>
                <span>Thương hiệu</span>
              </Link>
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10 overflow-hidden">
                <Link to="/thuong-hieu/apple" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 border-b border-gray-100 last:border-b-0">
                  <IoLogoApple className="mr-2 text-xl" />
                  <span>Apple</span>
                </Link>
                <Link to="/thuong-hieu/samsung" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 border-b border-gray-100 last:border-b-0">
                  <SiSamsung className="mr-2 text-xl" />
                  <span>Samsung</span>
                </Link>
                <Link to="/thuong-hieu/xiaomi" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 border-b border-gray-100 last:border-b-0">
                  <SiXiaomi className="mr-2 text-xl" />
                  <span>Xiaomi</span>
                </Link>
                <Link to="/thuong-hieu/oppo" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200">
                  <SiOppo className="mr-2 text-xl" />
                  <span>OPPO</span>
                </Link>
              </div>
            </div>

            <Link to="/phu-kien" className="flex items-center text-gray-800 hover:text-blue-600 transition-colors duration-200 py-1 px-3 rounded-md">
              <FaHeadphones className="mr-2 text-lg" />
              <span>Phụ kiện</span>
            </Link>
            <Link to="/gioi-thieu" className="flex items-center text-gray-800 hover:text-blue-600 transition-colors duration-200 py-1 px-3 rounded-md">
              <FaInfoCircle className="mr-2 text-lg" />
              <span>Về chúng tôi</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* Mobile Menu (hiển thị khi mở) */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-0 left-0 w-full h-full bg-blue-100 shadow-lg py-3 z-50 overflow-y-auto">
          <div className="container mx-auto px-4 py-3 flex flex-col items-center text-gray-800 text-base font-medium space-y-2">
            <div className="w-full flex justify-end">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-700 text-3xl focus:outline-none"
              >
                <FaTimes />
              </button>
            </div>
            {/* Thanh tìm kiếm bên trong mobile menu */}
            <div className="w-full flex justify-center mb-2 px-4">
              <div className="relative w-full max-w-sm">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 text-sm"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
                >
                  <FaSearch className="text-lg" />
                </button>
              </div>
            </div>

            {/* Các mục menu mobile */}
            <Link to="/" className="w-full flex items-center hover:text-blue-600 transition-colors duration-200 py-2" onClick={() => setIsMobileMenuOpen(false)}>
              <FaHome className="mr-3 text-xl" /> Trang chủ
            </Link>
            <Link to="/dien-thoai" className="w-full flex items-center hover:text-blue-600 transition-colors duration-200 py-2" onClick={() => setIsMobileMenuOpen(false)}>
              <FaMobileAlt className="mr-3 text-xl" /> Điện thoại
            </Link>
            <Link to="/laptops" className="w-full flex items-center hover:text-blue-600 transition-colors duration-200 py-2" onClick={() => setIsMobileMenuOpen(false)}>
              <FaLaptop className="mr-3 text-xl" /> Laptop
            </Link>

            {/* Mobile Brands Dropdown Toggle */}
            <div className="w-full">
              <button
                onClick={() => setIsBrandsDropdownOpen(!isBrandsDropdownOpen)}
                className="w-full flex items-center text-gray-800 hover:text-blue-600 transition-colors duration-200 py-2"
              >
                <span className="mr-3 text-xl">🛍️</span> Thương hiệu
                <i className={`ml-auto bi ${isBrandsDropdownOpen ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
              </button>
              {isBrandsDropdownOpen && (
                <div className="pl-6 w-full space-y-2 pt-2 border-l border-gray-200 ml-4">
                  <Link to="/thuong-hieu/apple" className="flex items-center text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 py-1" onClick={() => setIsMobileMenuOpen(false)}>
                    <IoLogoApple className="mr-2 text-lg" /> Apple
                  </Link>
                  <Link to="/thuong-hieu/samsung" className="flex items-center text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 py-1" onClick={() => setIsMobileMenuOpen(false)}>
                    <SiSamsung className="mr-2 text-lg" /> Samsung
                  </Link>
                  <Link to="/thuong-hieu/xiaomi" className="flex items-center text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 py-1" onClick={() => setIsMobileMenuOpen(false)}>
                    <SiXiaomi className="mr-2 text-lg" /> Xiaomi
                  </Link>
                  <Link to="/thuong-hieu/oppo" className="flex items-center text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 py-1" onClick={() => setIsMobileMenuOpen(false)}>
                    <SiOppo className="mr-2 text-lg" /> OPPO
                  </Link>
                </div>
              )}
            </div>

            <Link to="/phu-kien" className="w-full flex items-center hover:text-blue-600 transition-colors duration-200 py-2" onClick={() => setIsMobileMenuOpen(false)}>
              <FaHeadphones className="mr-3 text-xl" /> Phụ kiện
            </Link>
            <Link to="/gioi-thieu" className="w-full flex items-center hover:text-blue-600 transition-colors duration-200 py-2" onClick={() => setIsMobileMenuOpen(false)}>
              <FaInfoCircle className="mr-3 text-xl" /> Về chúng tôi
            </Link>
            <Link to="/orders" className="w-full flex items-center hover:text-blue-600 transition-colors duration-200 py-2" onClick={() => setIsMobileMenuOpen(false)}>
              <FaClipboardList className="mr-3 text-xl" /> Đơn hàng
            </Link>
            <Link to="/contact" className="w-full flex items-center hover:text-blue-600 transition-colors duration-200 py-2" onClick={() => setIsMobileMenuOpen(false)}>
              <FaPhoneAlt className="mr-3 text-xl" /> Liên hệ
            </Link>
            <Link to="/account" className="w-full flex items-center hover:text-blue-600 transition-colors duration-200 py-2" onClick={() => setIsMobileMenuOpen(false)}>
              <FaUserCircle className="mr-3 text-xl" /> Tài khoản
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;