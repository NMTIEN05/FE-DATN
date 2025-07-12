// src/components/Home/BannerSection.tsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const banners = [
  {
    id: 1,
    image: 'https://i.pinimg.com/736x/5a/7e/90/5a7e903fa4d36808abddba1d331a4a34.jpg',
    link: '#',
    title: 'iPhone 15 Pro Max',
  },
  {
    id: 2,
    image: 'https://i.pinimg.com/736x/0b/a9/43/0ba943ea32ac6f8450ad1cae3de07b18.jpg',
    link: '#',
    title: 'Samsung S24 Ultra',
  },
  {
    id: 3,
    image: 'https://i.pinimg.com/736x/33/3f/b1/333fb13a2a0e48edc138b24b18af9b28.jpg',
    link: '#',
    title: 'Xiaomi 14 Ultra',
  },
];

const BannerSection: React.FC = () => {
  return (
    <div style={{ width: '100%', borderRadius: 8, overflow: 'hidden', marginBottom: 32 }}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        style={{ borderRadius: 8 }}
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <a href={banner.link}>
              <img
                src={banner.image}
                alt={banner.title}
                style={{ width: '100%', height: 'auto', objectFit: 'cover', display: 'block' }}
              />
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BannerSection;
