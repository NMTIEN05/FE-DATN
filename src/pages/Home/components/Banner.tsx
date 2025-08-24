  import React, { useEffect, useRef, useState } from "react";
  import { Swiper, SwiperSlide } from "swiper/react";
  import { Navigation, Pagination, Autoplay } from "swiper/modules";
  import {
    FaMobileAlt, FaTags, FaEnvelope, FaStore, FaBuilding, FaRegNewspaper,
    FaSyncAlt, FaBolt, FaHome, FaChevronRight
  } from "react-icons/fa";
  import { Link } from "react-router-dom";
  import "swiper/css";
  import "swiper/css/navigation";
  import "swiper/css/pagination";
  import { useBannerSync } from "../../../hooks/useBannerSync";

  interface BannerSectionProps {
    selectedMenu: string;
    setSelectedMenu: React.Dispatch<React.SetStateAction<string>>;
  }

  /* ẢNH FALLBACK LẤY TRÊN UNSPLASH */
  const fallbackBanners = [
    {
      id: 1,
      title: "TGDD – Khuyến mãi",
      link: "#",
      image: "https://cdn.tgdd.vn/Files/2023/06/02/1532644/thegioididong-dac-biet-tgdd-3123123123-3-020623-160223-800-resize.jpg"
    },
    {
      id: 2,
      title: "Apple – iPhone 16",
      link: "#",
      image: "https://www.apple.com/v/iphone-16/f/images/meta/iphone-16_overview__fcivqu9d5t6q_og.png"
    },
    {
      id: 3,
      title: "Tecno – Pova 7",
      link: "#",
      image: "https://cdn-media.sforum.vn/storage/app/media/trannghia/Ecovacs/Tecno-Pova-7-Series-ra-mat-1.jpg"
    },
      {
      id: 3,
      title: "Tecno – Pova 7",
      link: "#",
      image: "https://www.oppo.com/content/dam/oppo_com/en/mkt/newsroom/press/2024/11/Launch-Event-Announcement-Poster.webp"
    }
  ];




  const leftMenu = [
    { id: 0, name: "Trang chủ", icon: <FaHome />, link: "/" },
    { id: 1, name: "Điện thoại", icon: <FaMobileAlt />, link: "#" },
    { id: 2, name: "Hãng điện thoại", icon: <FaBuilding />, link: "/dien-thoai" },
    { id: 3, name: "Mã giảm giá", icon: <FaTags />, link: "/vouchers" },
    { id: 4, name: "Liên hệ với chúng tôi", icon: <FaEnvelope />, link: "#" },
    { id: 5, name: "Thông tin cửa hàng", icon: <FaStore />, link: "#" },
    { id: 6, name: "Tin công nghệ", icon: <FaRegNewspaper />, link: "#" },
    { id: 7, name: "Thu cũ đổi mới", icon: <FaSyncAlt />, link: "#" },
    { id: 8, name: "Sản phẩm đang sale", icon: <FaBolt />, link: "#" },
  ];

  const API = import.meta.env.VITE_API_URL || "http://localhost:8888";
  const toAbs = (url: string) => (url?.startsWith("http") ? url : `${API}${url}`);

  const BannerSection: React.FC<BannerSectionProps> = ({ selectedMenu, setSelectedMenu }) => {
    const swiperRef = useRef<any>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const { banners: apiBanners } = useBannerSync();
    const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);

    useEffect(() => {
      if (selectedMenu !== "Điện thoại") return;
      (async () => {
        try {
          const res = await fetch(`${API}/api/category?limit=1000`);
          const data = await res.json();
          setCategories(data.data || []);
        } catch {}
      })();
    }, [selectedMenu]);

    const mapped = (apiBanners?.length ? apiBanners : fallbackBanners).map((b: any) => ({
      ...b,
      image: toAbs(b.image),
    }));
    const heroList = mapped;
    const sideList = (mapped.length > 1 ? mapped.slice(1, 4) : []).map((b) => ({ ...b }));

    const handleSlideChange = (swiper: any) => setActiveIndex(swiper.realIndex);

    return (
      <div className="w-full mb-8">
        <div className="grid grid-cols-12 gap-4">
          {/* Menu bên trái */}
          <div className="hidden md:block md:col-span-2">
            <div className="h-[420px] bg-white rounded-xl shadow p-2 overflow-auto">
              <ul className="space-y-2">
                {leftMenu.map((item) => (
                  <li key={item.id}>
                    <Link
                      to={item.link}
                      onClick={() => setSelectedMenu(item.name)}
                      className={`w-full block group text-sm px-3 py-2 rounded 
                        ${selectedMenu === item.name ? "bg-blue-100 text-blue-600 font-medium" : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"} transition`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-base">{item.icon}</span>
                          <span>{item.name}</span>
                        </div>
                        {(item.name === "Hãng điện thoại" || item.name === "Điện thoại") && (
                          <FaChevronRight className="text-gray-400 group-hover:text-blue-500 text-xs" />
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Banner chính */}
          <div className="col-span-12 md:col-span-7">
            <div className="h-[420px] flex flex-col overflow-hidden rounded-xl shadow bg-white">
              {selectedMenu === "Điện thoại" ? (
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
                  <button onClick={() => setSelectedMenu("")} className="mt-4 text-blue-600 text-sm hover:underline">
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
                      {heroList.map((banner, i) => (
                        <SwiperSlide key={banner._id || banner.id || i}>
                          <a href={banner.link || "#"}>
                            <img
                              src={banner.image}
                              referrerPolicy="no-referrer"
                              alt={banner.title || "Banner"}
                              className="w-full h-full object-cover block"
                              loading="eager"
                              onError={(e) => {
                                console.error("Hero image error:", e.currentTarget.src);
                                e.currentTarget.src = "https://placehold.co/1200x420?text=Banner";
                              }}
                            />
                          </a>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                  <div className="h-[70px] bg-gray-50 px-4 py-3 border-t border-gray-200 relative">
                    <div className="grid grid-cols-5 text-center h-full items-center">
                      {heroList.map((banner, index) => (
                        <button
                          key={banner._id || banner.id || index}
                          onClick={() => swiperRef.current?.slideToLoop(index)}
                          className={`font-medium text-[13px] md:text-sm transition relative ${
                            activeIndex === index ? "text-red-600 font-semibold" : "text-gray-800 hover:text-red-500"
                          }`}
                        >
                          {banner.title || `Banner ${index + 1}`}
                        </button>
                      ))}
                    </div>
                    <div
                      className="absolute bottom-0 left-0 h-[3px] bg-red-500 rounded-t-full transition-all duration-300"
                      style={{ width: "20%", transform: `translateX(${activeIndex * 100}%)` }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Banner bên phải */}
          <div className="col-span-12 md:col-span-3">
            <div className="h-[420px] flex flex-col gap-3">
              {(sideList.length ? sideList : fallbackSide).map((banner: any, i: number) => (
                <a key={banner._id || banner.id || i} href={banner.link || "#"} className="flex-1 overflow-hidden rounded-xl shadow">
                  <img
                    src={toAbs(banner.image)}
                    referrerPolicy="no-referrer"
                    alt="Side Banner"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      console.error("Side image error:", e.currentTarget.src);
                      e.currentTarget.src = "https://placehold.co/380x160?text=Side+Banner";
                    }}
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