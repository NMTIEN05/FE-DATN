import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Banner {
  _id: string;
  title?: string;
  image: string;
  description?: string;
  link?: string;
  isActive: boolean;
  order: number;
}

interface BannerSliderProps {
  banners: Banner[];
  loading?: boolean;
  error?: string | null;
  height?: number;
  autoplay?: boolean;
  showPagination?: boolean;
  showNavigation?: boolean;
}

const BannerSlider: React.FC<BannerSliderProps> = ({
  banners,
  loading = false,
  error = null,
  height = 400,
  autoplay = true,
  showPagination = true,
  showNavigation = true,
}) => {
  const swiperRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSlideChange = (swiper: any) => {
    setActiveIndex(swiper.realIndex);
  };

  if (loading) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-100 rounded-lg"
        style={{ height }}
      >
        <div className="text-gray-500">Đang tải banner...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="flex items-center justify-center bg-red-50 rounded-lg"
        style={{ height }}
      >
        <div className="text-red-500">Lỗi: {error}</div>
      </div>
    );
  }

  if (!banners || banners.length === 0) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-100 rounded-lg"
        style={{ height }}
      >
        <div className="text-gray-500">Không có banner nào</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div 
        className="flex flex-col overflow-hidden rounded-xl shadow"
        style={{ height }}
      >
        <div className="flex-1">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            navigation={showNavigation}
            pagination={showPagination ? { clickable: true } : false}
            autoplay={autoplay ? { delay: 3000 } : false}
            loop
            onSlideChange={handleSlideChange}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            className="h-full"
          >
            {banners.map((banner) => (
              <SwiperSlide key={banner._id}>
                <a href={banner.link || '#'} target="_blank" rel="noopener noreferrer">
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
        
        {/* Banner titles navigation */}
        {banners.length > 1 && (
          <div className="h-[50px] bg-gray-50 px-4 py-2 border-t border-gray-200 relative">
            <div className="grid grid-cols-5 text-center h-full items-center">
              {banners.map((banner, index) => (
                <button
                  key={banner._id}
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
                width: `${100 / banners.length}%`,
                transform: `translateX(${activeIndex * 100}%)`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerSlider; 