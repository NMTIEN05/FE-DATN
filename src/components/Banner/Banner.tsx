import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const banners = [
  {
    id: 1,
    image: 'https://cdn.tgdd.vn/2023/03/banner/banner1.png',
    link: '#',
    title: 'iPhone 15 Pro Max',
  },
  {
    id: 2,
    image: 'https://cdn.tgdd.vn/2023/03/banner/banner2.png',
    link: '#',
    title: 'Samsung S24 Ultra',
  },
  {
    id: 3,
    image: 'https://cdn.tgdd.vn/2023/03/banner/banner3.png',
    link: '#',
    title: 'Xiaomi 14 Ultra',
  },
  {
    id: 4,
    image: 'https://i.pinimg.com/736x/b5/ae/5d/b5ae5db87627e4b1bb47a1c40946fcf6.jpg',
    link: '#',
    title: 'OPPO Find X7',
  },
];

const sideBanners = [
  {
    id: 101,
    image: 'https://cdn.tgdd.vn/2023/03/banner/380x160-1.png',
    link: '#',
  },
  {
    id: 102,
    image: 'https://cdn.tgdd.vn/2023/03/banner/380x160-2.png',
    link: '#',
  },
  {
    id: 103,
    image: 'https://cdn.tgdd.vn/2023/03/banner/380x160-3.png',
    link: '#',
  },
];

const rightMenu = [
  { id: 1, name: 'iPhone', link: '#' },
  { id: 2, name: 'Samsung', link: '#' },
  { id: 3, name: 'Xiaomi', link: '#' },
  { id: 4, name: 'OPPO', link: '#' },
  { id: 5, name: 'Realme', link: '#' },
  { id: 6, name: 'Nokia', link: '#' },
];

const BannerSection: React.FC = () => {
  const swiperRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSlideChange = (swiper: any) => {
    setActiveIndex(swiper.realIndex);
  };

  return (
    <div className="w-full mb-8">
      <div className="grid grid-cols-12 gap-4">
        {/* Banner chính */}
        <div className="col-span-12 md:col-span-7">
          <div className="h-[500px] flex flex-col overflow-hidden rounded-xl shadow">
            <div className="h-[450px]">
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
                {banners.map((banner) => (
                  <SwiperSlide key={banner.id}>
                    <a href={banner.link}>
                      <img
                        src={banner.image}
                        alt={banner.title}
                        className="w-full h-full object-cover block"
                      />
                    </a>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div className="h-[50px] bg-gray-50 px-4 py-2 border-t border-gray-200 relative">
              <div className="grid grid-cols-4 text-center h-full items-center">
                {banners.map((banner, index) => (
                  <button
                    key={banner.id}
                    onClick={() => swiperRef.current?.slideToLoop(index)}
                    className="py-2 font-medium text-sm sm:text-base text-gray-800 transition duration-150 relative"
                  >
                    {banner.title}
                  </button>
                ))}
              </div>
              <div
                className="absolute bottom-0 left-0 h-[3px] bg-red-500 rounded-t-full transition-all duration-300"
                style={{
                  width: '25%',
                  transform: `translateX(${activeIndex * 100}%)`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Side banners */}
        <div className="col-span-12 md:col-span-3">
          <div className="h-[500px] flex flex-col gap-3">
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

        {/* Menu bên phải */}
        <div className="col-span-12 md:col-span-2">
          <div className="h-[500px] bg-white rounded-xl shadow p-4 overflow-auto">
            <h3 className="text-lg font-semibold mb-4">Danh mục</h3>
            <ul className="space-y-2">
              {rightMenu.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.link}
                    className="text-sm text-gray-700 hover:text-blue-600 transition"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerSection;
