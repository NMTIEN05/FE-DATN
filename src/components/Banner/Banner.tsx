import React from 'react';
import { useBannerSync } from '../../hooks/useBannerSync';
import BannerSlider from './BannerSlider';

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
  const { banners, loading, error } = useBannerSync();

  return (
    <div className="w-full mb-8">
      <div className="grid grid-cols-12 gap-4">
        {/* Banner chính */}
        <div className="col-span-12 md:col-span-7">
          <BannerSlider
            banners={banners}
            loading={loading}
            error={error}
            height={500}
            autoplay={true}
            showPagination={true}
            showNavigation={true}
          />
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
