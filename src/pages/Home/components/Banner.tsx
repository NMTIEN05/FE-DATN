import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const banners = [
    {
        id: 1,
        image: "https://i.pinimg.com/736x/5a/7e/90/5a7e903fa4d36808abddba1d331a4a34.jpg",
        link: "#",
        title: "iPhone 15 Pro Max",
    },
    {
        id: 2,
        image: "https://i.pinimg.com/736x/0b/a9/43/0ba943ea32ac6f8450ad1cae3de07b18.jpg",
        link: "#",
        title: "Samsung S24 Ultra",
    },
    {
        id: 3,
        image: "https://i.pinimg.com/736x/33/3f/b1/333fb13a2a0e48edc138b24b18af9b28.jpg",
        link: "#",
        title: "Xiaomi 14 Ultra",
    },
    {
        id: 4,
        image: "https://tse4.mm.bing.net/th/id/OIP.FfEr-bhU6d4W4UWUfvWUcQHaD3?pid=Api&P=0&h=180",
        link: "#",
        title: "OPPO Find X7",
    },
];

const sideBanners = [
    {
        id: 101,
        image: "https://tse2.mm.bing.net/th/id/OIP.f52eNUCSFAz90D9EIxLNOQHaEK?pid=Api&P=0&h=180",
        link: "#",
    },
    {
        id: 102,
        image: "https://tse2.mm.bing.net/th/id/OIP.gdsgQE21zgKSpJzhbI4uWAHaC0?pid=Api&P=0&h=180",
        link: "#",
    },
    {
        id: 103,
        image: "https://tse1.mm.bing.net/th/id/OIP.tdigLWLbfjUppcXuXiU5GAHaCO?pid=Api&P=0&h=180",
        link: "#",
    },
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
                {/* BÊN TRÁI (9/12) */}
                <div className="col-span-12 md:col-span-9">
                    <div className="h-[500px] flex flex-col overflow-hidden rounded-xl shadow">
                        {/* Ảnh banner */}
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
                                onSwiper={(swiper) =>
                                    (swiperRef.current = swiper)
                                }
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

                        {/* Dòng tiêu đề banner */}
                        <div className="h-[50px] bg-gray-50 px-4 py-2 border-t border-gray-200 relative">
                            <div className="grid grid-cols-4 text-center h-full items-center">
                                {banners.map((banner, index) => (
                                    <button
                                        key={banner.id}
                                        onClick={() =>
                                            swiperRef.current?.slideToLoop(
                                                index
                                            )
                                        }
                                        className="py-2 font-medium text-sm sm:text-base text-gray-800 transition duration-150 relative"
                                    >
                                        {banner.title}
                                    </button>
                                ))}
                            </div>

                            {/* Thanh gạch đỏ active */}
                            <div
                                className="absolute bottom-0 left-0 h-[3px] bg-red-500 rounded-t-full transition-all duration-300"
                                style={{
                                    width: "25%",
                                    transform: `translateX(${
                                        activeIndex * 100
                                    }%)`,
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* BÊN PHẢI (3/12) */}
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
            </div>
        </div>
    );
};

export default BannerSection;
