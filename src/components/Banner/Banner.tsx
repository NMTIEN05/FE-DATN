import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./Banner.css";

interface BannerProps {
    banners: {
        id: number;
        image: string;
        link: string;
        title: string;
    }[];
}

const Banner: React.FC<BannerProps> = ({ banners }) => {
    return (
        <div className="banner-container">
            <div className="main-banner">
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={0}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    loop={true}
                >
                    {banners.map((banner) => (
                        <SwiperSlide key={banner.id}>
                            <a href={banner.link} className="banner-link">
                                <img
                                    src={banner.image}
                                    alt={banner.title}
                                    className="banner-image"
                                />
                            </a>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default Banner;
