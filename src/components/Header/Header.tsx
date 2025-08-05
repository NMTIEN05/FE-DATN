import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaSearch, FaPhoneAlt, FaShoppingCart, FaUserCircle, FaBars, FaTimes,
  FaClipboardList, FaChevronDown, FaSignOutAlt, FaUserLock, FaHeart,
  FaTag
} from 'react-icons/fa';
import axios from 'axios';
import './Header.css';
import logo from './img/Screenshot_2025-08-01_195447-removebg-preview.png';

interface HeaderProps {
  setSelectedMenu: (menu: string) => void;
}

const Header: React.FC<HeaderProps> = ({ setSelectedMenu }) => {
  const mainHeaderHeight = 75;
  const [scrollY, setScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsAccountOpen(false);
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
      <div
        className="fixed left-0 w-full bg-[#f85959] text-white z-40 flex items-center transition-all duration-300"
        style={{ height: mainHeaderHeight }}
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
              <img src={logo} alt="Logo" className="w-70 h-20" />
            </Link>
          </div>

          {/* ✅ Nút Danh mục bấm để mở menu "Điện thoại" */}
        

          <div className="hidden md:flex flex-grow justify-center relative order-3 items-center">
            <div className="w-full max-w-xl relative">
              <input
    type="text"
    placeholder="Tìm kiếm sản phẩm..."
    className="w-full pl-12 text-gray-700 pr-4 py-2 rounded-xl border border-gray-300 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
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
                      to="/vouchers/my"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setIsAccountOpen(false)}
                    >
                      <div className="flex items-center gap-2">
                        <FaTag /> Mã giảm giá của tôi 
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
