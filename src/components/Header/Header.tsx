import React, { useState, useEffect, useRef } from 'react';
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
  FaClipboardList,
  FaChevronDown,
  FaSignOutAlt,
  FaUserLock,
  FaHeart
} from 'react-icons/fa';
import { IoLogoApple } from 'react-icons/io';
import { SiSamsung, SiXiaomi, SiOppo } from 'react-icons/si';
import { TagFilled } from '@ant-design/icons';
import axios from 'axios';
import './Header.css'; // CSS animation marquee

const Header = () => {
 
  const mainHeaderHeight = 75;  // Thanh đỏ

  const [scrollY, setScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hoverBrand, setHoverBrand] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Tự đóng dropdown khi click ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setHoverBrand(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProducts(search);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const fetchProducts = async (searchQuery: string) => {
    try {
      const res = await axios.get(`http://localhost:8888/api/product`, {
        params: { search: searchQuery },
      });
      setProducts(res.data.data);
    } catch (err) {
      console.error("Lỗi tìm sản phẩm:", err);
    }
  };

  const handleSearch = () => {
    if (search.trim()) {
      navigate(`/search?query=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavoritesCount(favorites.length);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div className='mb-20'>
     

      {/* Thanh đỏ chính */}
      <div
        className="fixed left-0 w-full bg-[#f85959] text-white z-40 flex items-center transition-all duration-300"
        style={{
          height: mainHeaderHeight,
          
        }}
      >
        <div className="container mx-auto px-10 flex items-center justify-between flex-wrap gap-y-2">

          <div className="block md:hidden order-1">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white-700 text-2xl"
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          <div className="order-2 md:order-1 flex items-center">
            <Link to="/" className="text-2xl font-extrabold ">
              E<span className="text-blue-600">Shop</span>
            </Link>
          </div>

          {/* Danh mục nằm giữa logo và search */}
          <div className="ml-10 hidden md:block order-2 relative" ref={menuRef}>
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="flex items-center text-yellow-600 hover:text-yellow-700 px-4 py-2 rounded-xl bg-[#ffc8c8] hover:bg-yellow-50 border border-yellow-200 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105"
            >
              <span className="mr-2 text-lg">📂</span>
              <span className="font-medium">Danh mục</span>
              <FaChevronDown className="ml-2 text-xs" />
            </button>

            {showDropdown && (
              <div
                className={`absolute left-0 mt-7 ${
                  hoverBrand ? "w-[620px]" : "w-[320px]"
                } bg-white border border-gray-200 rounded-xl shadow-2xl z-50 flex transition-all duration-300`}
                onMouseLeave={() => setHoverBrand(false)}
              >
                <div className="w-[300px] py-2 border-r border-gray-100">
                  <Link to="/" className="flex items-center px-5 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700">
                    <FaHome className="mr-3 " /> Trang chủ
                  </Link>
                  <Link to="/dien-thoai" className="flex items-center px-5 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700">
                    <FaMobileAlt className="mr-3 " /> Điện thoại
                  </Link>
                  <Link to="/laptops" className="flex items-center px-5 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700">
                    <FaLaptop className="mr-3 " /> Laptop
                  </Link>
                  <Link to="/phu-kien" className="flex items-center px-5 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700">
                    <TagFilled className="mr-3 " /> Mã giảm giá
                  </Link>

                  <div
                    className="flex items-center px-5 py-3  hover:bg-blue-50 hover:text-blue-700 cursor-pointer"
                    onMouseEnter={() => setHoverBrand(true)}
                    onClick={() => setHoverBrand((prev) => !prev)}
                  >
                    <span className="mr-3 text-lg">🛍️</span>
                    <span className="font-medium">Thương hiệu</span>
                  </div>
                </div>

                {hoverBrand && (
                  <div className="w-[300px] py-2 ml-2">
                    <Link to="/thuong-hieu/apple" className="flex items-center px-5 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700">
                      <IoLogoApple className="mr-3 text-xl" /> Apple
                    </Link>
                    <Link to="/thuong-hieu/samsung" className="flex items-center px-5 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700">
                      <SiSamsung className="mr-3 text-xl" /> Samsung
                    </Link>
                    <Link to="/thuong-hieu/xiaomi" className="flex items-center px-5 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700">
                      <SiXiaomi className="mr-3 text-xl " /> Xiaomi
                    </Link>
                    <Link to="/thuong-hieu/oppo" className="flex items-center px-5 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700">
                      <SiOppo className="mr-3 text-xl " /> OPPO
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="hidden md:flex flex-grow justify-center relative order-3 items-center">
            <div className="w-full max-w-xl relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-4 pr-12 py-1 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
                onClick={handleSearch}
              >
                <FaSearch />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-sm order-3 ml-auto">
            <Link to="/contact" className="flex items-center  hover:text-blue-600 px-2 group">
              <FaPhoneAlt className="mr-2" />
              <span className="hidden lg:block">Liên hệ</span>
            </Link>
            <Link to="/orders" className="flex items-center  hover:text-blue-600 px-2 group">
              <FaClipboardList className="mr-2" />
              <span className="hidden lg:block">Đơn hàng</span>
            </Link>
            <Link to="/favorites" className="flex items-center  hover:text-blue-600 relative px-2 group">
              <FaHeart className="mr-2" />
              <span className="hidden lg:block">Yêu thích</span>
              {favoritesCount > 0 && (
                <span className="absolute -top-1 right-0 bg-red-500 text-white text-[0.6rem] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </Link>
            <Link to="/cart" className="flex items-center  hover:text-blue-600 relative px-2 group">
              <FaShoppingCart className="mr-2" />
              <span className="hidden lg:block">Giỏ hàng</span>
              <span className="absolute -top-1 right-0 bg-red-500 text-white text-[0.6rem] font-bold rounded-full h-4 w-4 flex items-center justify-center">3</span>
            </Link>

            {isLoggedIn ? (
              <div className="relative px-2">
                <button
                  onClick={() => setIsAccountOpen(!isAccountOpen)}
                  className="flex items-center gap-1 hover:underline text-white"
                >
                  <FaUserCircle />
                  <span className="hidden lg:block">Tài khoản</span>
                  <FaChevronDown className={`text-xs mt-[1px] transform transition-transform ${isAccountOpen ? 'rotate-180' : ''}`} />
                </button>

                {isAccountOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-10 w-44 bg-white text-gray-800 border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden text-sm">
                    <Link
                      to="/account"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setIsAccountOpen(false)}
                    >
                      <div className="flex items-center gap-2">
                        <FaUserCircle /> Tài khoản
                      </div>
                    </Link>

                    <Link
                      to="/change-password"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setIsAccountOpen(false)}
                    >
                      <div className="flex items-center gap-2">
                        <FaUserLock /> Đổi mật khẩu
                      </div>
                    </Link>

                    <button
                      onClick={() => {
                        handleLogout();
                        setIsAccountOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50"
                    >
                      <div className="flex items-center gap-2">
                        <FaSignOutAlt /> Đăng xuất
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-2 px-2">
                <Link to="/login" className="text-white font-medium hover:underline">Đăng nhập</Link>
                <Link to="/register" className="text-white font-medium hover:underline">Đăng ký</Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Header;
