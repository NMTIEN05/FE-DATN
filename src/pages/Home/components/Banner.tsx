import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import {
  FaMobileAlt, FaTags, FaEnvelope, FaStore, FaBuilding, FaRegNewspaper,
  FaSyncAlt, FaBolt, FaHome, FaChevronRight
} from 'react-icons/fa';


import { useBannerSync } from '../../../hooks/useBannerSync';

import { Link } from 'react-router-dom';




interface BannerSectionProps {
  selectedMenu: string;
  setSelectedMenu: React.Dispatch<React.SetStateAction<string>>;
}

const banners = [
  { id: 1, image: 'https://cdn.tgdd.vn/2023/03/banner/banner1.png', link: '#', title: 'GALAXY Z7 SERIES' },
  { id: 2, image: 'https://cdn.tgdd.vn/2023/03/banner/banner2.png', link: '#', title: 'IPHONE 16 PRO MAX' },
  { id: 3, image: 'https://cdn.tgdd.vn/2023/03/banner/banner3.png', link: '#', title: 'OPPO RENO14' },
  { id: 4, image: 'https://i.pinimg.com/736x/b5/ae/5d/b5ae5db87627e4b1bb47a1c40946fcf6.jpg', link: '#', title: 'XIAOMI' },
  { id: 5, image: 'https://cdn.tgdd.vn/2023/03/banner/banner4.png', link: '#', title: 'TECNO POVA 7' },
];

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

const phoneBrands = [
  'iPhone', 'Samsung', 'OPPO', 'Xiaomi', 'Realme', 'Vivo',
  'Nokia', 'Asus', 'Masstel', 'Itel'
];

const BannerSection: React.FC<BannerSectionProps> = ({ selectedMenu, setSelectedMenu }) => {
  const swiperRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { banners: apiBanners, loading, error } = useBannerSync();

  const handleSlideChange = (swiper: any) => {
    setActiveIndex(swiper.realIndex);
  };
const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);

useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:8888/api/category?limit=1000');
      const data = await res.json();
      setCategories(data.data || []);
    } catch (error) {
      console.error('❌ Lỗi khi lấy danh mục:', error);
    }
  };

  if (selectedMenu === 'Điện thoại') {
    fetchCategories();
  }
}, [selectedMenu]);
  // Sử dụng API banners nếu có, nếu không thì dùng banners mặc định
  const displayBanners = apiBanners.length > 0 ? apiBanners : banners;

  return (
    <div className="w-full mb-8">
      <div className="grid grid-cols-12 gap-4">
        {/* Menu trái */}
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

        {/* Banner hoặc Mega Menu */}
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
            <SwiperSlide key={banner._id || banner.id}>
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
      </div>
      <div className="h-[70px] bg-gray-50 px-4 py-3 border-t border-gray-200 relative">
        <div className="grid grid-cols-5 text-center h-full items-center">
          {displayBanners.map((banner, index) => (
            <button
              key={banner._id || banner.id}
              onClick={() => swiperRef.current?.slideToLoop(index)}
              className={`font-medium text-[13px] md:text-sm transition relative ${
                activeIndex === index
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
            width: '20%',
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        />
      </div>
    </>
  )}
</div>

        </div>

        {/* Banner phải */}
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
