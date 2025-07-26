// src/components/Home/BannerSection.tsx
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import axios from '../../../api/axios.config';

interface BannerType {
  id?: string;
  _id?: string;
  image: string;
  link?: string;
  title?: string;
  description?: string;
}

const BannerSection: React.FC = () => {
  const [banners, setBanners] = useState<BannerType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get('/banners');
        // Nếu backend trả về { data: [...] }
        const data = res.data.data || res.data;
        setBanners(data.map((b: any) => ({
          ...b,
          image: b.image?.startsWith('http') ? b.image : `http://localhost:8888${b.image}`,
          id: b._id || b.id,
        })));
      } catch (err) {
        setBanners([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  if (loading) return <div>Đang tải banner...</div>;
  if (!banners.length) return <div>Không có banner nào!</div>;

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
            <a href={banner.link || '#'}>
              <img
                src={banner.image}
                alt={banner.title || ''}
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
