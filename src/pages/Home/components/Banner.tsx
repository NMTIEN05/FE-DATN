
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
        console.error('Error fetching banners:', err);
        // Fallback to default banners if API fails
        setBanners([
          {
            id: '1',
            image: 'https://i.pinimg.com/736x/5a/7e/90/5a7e903fa4d36808abddba1d331a4a34.jpg',
            link: '#',
            title: 'iPhone 15 Pro Max',
          },
          {
            id: '2',
            image: 'https://i.pinimg.com/736x/0b/a9/43/0ba943ea32ac6f8450ad1cae3de07b18.jpg',
            link: '#',
            title: 'Samsung S24 Ultra',
          },
          {
            id: '3',
            image: 'https://i.pinimg.com/736x/33/3f/b1/333fb13a2a0e48edc138b24b18af9b28.jpg',
            link: '#',
            title: 'Xiaomi 14 Ultra',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  if (loading) {
    return (
      <div className="w-full mb-8 flex items-center justify-center h-[500px] bg-gray-100 rounded-xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Đang tải banner...</p>
        </div>
      </div>
    );
  }

  if (!banners.length) {
    return (
      <div className="w-full mb-8 flex items-center justify-center h-[500px] bg-gray-100 rounded-xl">
        <div className="text-center">
          <p className="text-lg text-gray-600">Không có banner nào!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mb-8">
      <div className="h-[500px] rounded-xl shadow overflow-hidden">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          loop
          className="h-full"
        >
          {banners.map((banner) => (
            <SwiperSlide key={banner.id}>
              <a href={banner.link || '#'}>
                <img
                  src={banner.image}
                  alt={banner.title || ''}
                  className="w-full h-full object-cover block"
                />
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default BannerSection;
