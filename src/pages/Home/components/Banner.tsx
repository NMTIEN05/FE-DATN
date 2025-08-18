import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import {
  FaMobileAlt, FaTags, FaEnvelope, FaStore, FaBuilding, FaRegNewspaper,
  FaSyncAlt, FaBolt, FaHome, FaChevronRight
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { useBannerSync } from '../../../hooks/useBannerSync';

interface BannerSectionProps {
  selectedMenu: string;
  setSelectedMenu: React.Dispatch<React.SetStateAction<string>>;
}

// Side banners (giu tam co dinh; neu muon dong, tach API rieng position=side)
const sideBanners = [
  { id: 101, image: 'https://cdn.tgdd.vn/2023/03/banner/380x160-1.png', link: '#' },
  { id: 102, image: 'https://cdn.tgdd.vn/2023/03/banner/380x160-2.png', link: '#' },
  { id: 103, image: 'https://cdn.tgdd.vn/2023/03/banner/380x160-3.png', link: '#' },
];

const leftMenu = [
  { id: 0, name: 'Trang chủ', icon: <FaHome />, link: '/' },
  { id: 1, name: 'Điện thoại', icon: <FaMobileAlt />, link: '#' },
  { id: 2, name: 'Hãng điện thoại', icon: <FaBuilding />, link: '/dien-thoai' },
  { id: 3, name: 'Mã giảm giá', icon: <FaTags />, link: '/vouchers' },
  { id: 4, name: 'Liên hệ với chúng tôi', icon: <FaEnvelope />, link: '#' },
  { id: 5, name: 'Thông tin cửa hàng', icon: <FaStore />, link: '#' },
  { id: 6, name: 'Tin công nghệ', icon: <FaRegNewspaper />, link: '#' },
  { id: 7, name: 'Thu cũ đổi mới', icon: <FaSyncAlt />, link: '#' },
  { id: 8, name: 'Sản phẩm đang sale', icon: <FaBolt />, link: '#' },
];

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8888';

const BannerSection: React.FC<BannerSectionProps> = ({ selectedMenu, setSelectedMenu }) => {
  const swiperRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { banners: apiBanners, loading, error } = useBannerSync();
  const displayBanners = apiBanners; // chi dung du lieu API

  const handleSlideChange = (swiper: any) => setActiveIndex(swiper.realIndex);

  // Categories (mega menu "Dien thoai")
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/category?limit=1000`);
        const data = await res.json();
        setCategories(data?.data || []);
      } catch (e) {
        console.error('❌ Loi khi lay danh muc:', e);
      }
    };
    if (selectedMenu === 'Điện thoại') fetchCategories();
  }, [selectedMenu]);

  return (
    <div className="w-full mb-8">
      <div className="grid grid-cols-12 gap-4">
        {/* Menu trai */}
        <div className="hidden md:block md:col-span-2">
          <div className="h-[420px] bg-white rounded-xl shadow p-2 overflow-auto">
            <ul className="space-y-2">
              {leftMenu.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.link}
                    onClick={() => setSelectedMenu(item.name)}
                    className={`w-full block group text-sm px-3 py-2 rounded 
                      ${selectedMenu === item.name
                        ? 'bg-blue-100 text-blue-600 font-medium'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'}
                      transition`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-base">{item.icon}</span>
                        <span>{item.name}</span>
                      </div>
                      {(item.name === 'Hãng điện thoại' || item.name === 'Điện thoại') && (
                        <FaChevronRight className="text-gray-400 group-hover:text-blue-500 text-xs" />
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Banner chinh hoac Mega Menu */}
        <div className="col-span-12 md:col-span-7">
          <div className="h-[420px] flex flex-col overflow-hidden rounded-xl shadow bg-white">
            {selectedMenu === 'Điện thoại' ? (
              <div className="flex-1 p-4 overflow-auto">
                <h3 className="text-base font-semibold mb-3">Danh mục điện thoại</h3>

                {categories.length === 0 ? (
                  <p className="text-sm text-gray-500">Đang tải danh mục...</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map((cate) => (
                      <a
                        key={cate._id}
                        href={`/products?category=${cate._id}`}
                        className="block px-3 py-2 bg-gray-100 hover:bg-blue-100 rounded text-sm"
                      >
                        {cate.name}
                      </a>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => setSelectedMenu('')}
                  className="mt-4 text-blue-600 text-sm hover:underline"
                >
                  ← Quay lại
                </button>
              </div>
            ) : (
              <>
                <div className="h-[350px]">
                  {loading ? (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                      Đang tải banner...
                    </div>
                  ) : error ? (
                    <div className="w-full h-full flex items-center justify-center text-red-500 text-sm">
                      {error}
                    </div>
                  ) : displayBanners.length === 0 ? (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                      Chưa có banner nào đang hoạt động
                    </div>
                  ) : (
                    <Swiper
                      modules={[Navigation, Pagination, Autoplay]}
                      spaceBetween={0}
                      slidesPerView={1}
                      navigation
                      pagination={{ clickable: true }}
                      autoplay={{ delay: 3000 }}
                      loop
                      onSlideChange={handleSlideChange}
                      onSwiper={(swiper) => (swiperRef.current = swiper)}
                      className="h-full"
                    >
                      {displayBanners.map((banner) => (
                        <SwiperSlide key={banner._id}>
                          <a href={banner.link || '#'}>
                            <img
                              src={banner.image}
                              alt={banner.title || 'Banner'}
                              className="w-full h-full object-cover block"
                            />
                          </a>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  )}
                </div>

                {displayBanners.length > 0 && (
                  <div className="h-[70px] bg-gray-50 px-4 py-3 border-t border-gray-200 relative">
                    <div className="grid grid-cols-5 text-center h-full items-center">
                      {displayBanners.map((banner, index) => (
                        <button
                          key={banner._id}
                          onClick={() => swiperRef.current?.slideToLoop(index)}
                          className={`font-medium text-[13px] md:text-sm transition relative ${activeIndex === index
                              ? 'text-red-600 font-semibold'
                              : 'text-gray-800 hover:text-red-500'
                            }`}
                        >
                          {banner.title || `Banner ${index + 1}`}
                        </button>
                      ))}
                    </div>
                    <div
                      className="absolute bottom-0 left-0 h-[3px] bg-red-500 rounded-t-full transition-all duration-300"
                      style={{
                        width: `${100 / Math.max(displayBanners.length, 1)}%`,
                        transform: `translateX(${activeIndex * 100}%)`,
                      }}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Banner phai */}
        <div className="col-span-12 md:col-span-3">
          <div className="h-[420px] flex flex-col gap-3">
            {sideBanners.map((banner) => (
              <a
                key={banner.id}
                href={banner.link}
                className="flex-1 overflow-hidden rounded-xl shadow"
              >
                <img
                  src={banner.image}
                  alt="Side Banner"
                  className="w-full h-full object-cover"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerSection;
