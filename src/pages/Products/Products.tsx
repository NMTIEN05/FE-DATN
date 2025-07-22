import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";
import "./Products.css";
import { FaChevronDown, FaChevronUp, FaTimes, FaSearch } from "react-icons/fa";
import { debounce } from "lodash";
import { useProducts } from "../../hooks/useProducts";
import { useQuery } from "@tanstack/react-query";
import axios from "../../api/axios.config";

interface Category {
    id: number;
    name: string;
    brand: string;
}

const Products = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState("popular");
    const [openFilter, setOpenFilter] = useState<string | null>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const bannerPairs = [
        [
            "https://tse2.mm.bing.net/th/id/OIP.l7z_OFzBRA5ASKCczIXioQHaEK?pid=Api&P=0&h=180",
            "https://tse3.mm.bing.net/th/id/OIP.wczkqVUy4x2pwkq88iziowHaCQ?pid=Api&P=0&h=180",
        ],
        [
            "https://tse2.mm.bing.net/th/id/OIP.f52eNUCSFAz90D9EIxLNOQHaEK?pid=Api&P=0&h=180",
            "https://tse1.mm.bing.net/th/id/OIP.tdigLWLbfjUppcXuXiU5GAHaCO?pid=Api&P=0&h=180",
        ],
        [
            "https://tse3.mm.bing.net/th/id/OIP.vFIMkG4svA-WcIkOdKXYuAHaC0?pid=Api&P=0&h=180",
            "https://tse2.mm.bing.net/th/id/OIP.MCxtIZkvOX1O6vMpIz9uSgHaD3?pid=Api&P=0&h=180",
        ],
        [
            "https://tse3.mm.bing.net/th/id/OIP.tbOSq1QTyI2t-jJdOidiKQHaDt?pid=Api&P=0&h=180",
            "https://tse1.mm.bing.net/th/id/OIP.xkwoJdnVFLi2Ib9RIZ0ewQHaCX?pid=Api&P=0&h=180",
        ],
    ];
    const featuredProducts = [
        {
            _id: "featured1",
            name: "iPhone 15 Pro Max",
            image_url:
                "https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg",
            base_price: 33990000,
            specs: ['6.7"', "A17 Pro", "256GB"],
        },
        {
            _id: "featured2",
            name: "Samsung Galaxy S23 Ultra",
            image_url:
                "https://cdn.tgdd.vn/Products/Images/42/249948/samsung-galaxy-s23-ultra-600x600.jpg",
            base_price: 30990000,
            specs: ['6.8"', "Snapdragon 8 Gen 2", "256GB"],
        },
        {
            _id: "featured3",
            name: "Xiaomi 14 Pro",
            image_url:
                "https://cdn.tgdd.vn/Products/Images/42/328269/xiaomi-14-pro-black-thumb-600x600.jpg",
            base_price: 23990000,
            specs: ['6.73"', "Snapdragon 8 Gen 3", "512GB"],
        },
        {
            _id: "featured4",
            name: "OPPO Find X5 Pro",
            image_url:
                "https://cdn.tgdd.vn/Products/Images/42/250622/oppo-find-x5-pro-trang-thumb-600x600.jpg",
            base_price: 21990000,
            specs: ['6.7"', "Snapdragon 8 Gen 1", "256GB"],
        },
        {
            _id: "featured5",
            name: "Vivo X90 Pro",
            image_url:
                "https://cdn.tgdd.vn/Products/Images/42/303925/vivo-x90-pro-den-thumb-600x600.jpg",
            base_price: 26990000,
            specs: ['6.78"', "Dimensity 9200", "256GB"],
        },
        {
            _id: "featured1",
            name: "iPhone 15 Pro Max",
            image_url:
                "https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg",
            base_price: 33990000,
            specs: ['6.7"', "A17 Pro", "256GB"],
        },
        {
            _id: "featured2",
            name: "Samsung Galaxy S23 Ultra",
            image_url:
                "https://cdn.tgdd.vn/Products/Images/42/249948/samsung-galaxy-s23-ultra-600x600.jpg",
            base_price: 30990000,
            specs: ['6.8"', "Snapdragon 8 Gen 2", "256GB"],
        },
        {
            _id: "featured3",
            name: "Xiaomi 14 Pro",
            image_url:
                "https://cdn.tgdd.vn/Products/Images/42/328269/xiaomi-14-pro-black-thumb-600x600.jpg",
            base_price: 23990000,
            specs: ['6.73"', "Snapdragon 8 Gen 3", "512GB"],
        },
        {
            _id: "featured4",
            name: "OPPO Find X5 Pro",
            image_url:
                "https://cdn.tgdd.vn/Products/Images/42/250622/oppo-find-x5-pro-trang-thumb-600x600.jpg",
            base_price: 21990000,
            specs: ['6.7"', "Snapdragon 8 Gen 1", "256GB"],
        },
        {
            _id: "featured5",
            name: "Vivo X90 Pro",
            image_url:
                "https://cdn.tgdd.vn/Products/Images/42/303925/vivo-x90-pro-den-thumb-600x600.jpg",
            base_price: 26990000,
            specs: ['6.78"', "Dimensity 9200", "256GB"],
        },
        {
            _id: "featured1",
            name: "iPhone 15 Pro Max",
            image_url:
                "https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg",
            base_price: 33990000,
            specs: ['6.7"', "A17 Pro", "256GB"],
        },
        {
            _id: "featured2",
            name: "Samsung Galaxy S23 Ultra",
            image_url:
                "https://cdn.tgdd.vn/Products/Images/42/249948/samsung-galaxy-s23-ultra-600x600.jpg",
            base_price: 30990000,
            specs: ['6.8"', "Snapdragon 8 Gen 2", "256GB"],
        },
        {
            _id: "featured3",
            name: "Xiaomi 14 Pro",
            image_url:
                "https://cdn.tgdd.vn/Products/Images/42/328269/xiaomi-14-pro-black-thumb-600x600.jpg",
            base_price: 23990000,
            specs: ['6.73"', "Snapdragon 8 Gen 3", "512GB"],
        },
        {
            _id: "featured4",
            name: "OPPO Find X5 Pro",
            image_url:
                "https://cdn.tgdd.vn/Products/Images/42/250622/oppo-find-x5-pro-trang-thumb-600x600.jpg",
            base_price: 21990000,
            specs: ['6.7"', "Snapdragon 8 Gen 1", "256GB"],
        },
        {
            _id: "featured5",
            name: "Vivo X90 Pro",
            image_url:
                "https://cdn.tgdd.vn/Products/Images/42/303925/vivo-x90-pro-den-thumb-600x600.jpg",
            base_price: 26990000,
            specs: ['6.78"', "Dimensity 9200", "256GB"],
        },
    ];

    useEffect(() => {
        // Preload images với callback
        const loadImage = (src: string) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.src = src;
                img.onload = resolve;
                img.onerror = resolve;
            });
        };

        // Tải tất cả ảnh trước khi hiển thị slider
        Promise.all(bannerPairs.flat().map(loadImage)).then(() => {
            setIsTransitioning(false);
        });

        const interval = setInterval(() => {
            setIsTransitioning(true);
            // Sử dụng requestAnimationFrame để đồng bộ với trình duyệt
            requestAnimationFrame(() => {
                setCurrentSlide((prev) => (prev + 1) % bannerPairs.length);
                // Thêm delay nhỏ trước khi kết thúc transition
                setTimeout(() => setIsTransitioning(false), 50);
            });
        }, 5000);

        return () => clearInterval(interval);
    }, [bannerPairs.length]);

    const goToSlide = (index: number) => {
        setIsTransitioning(true);
        requestAnimationFrame(() => {
            setCurrentSlide(index);
            setTimeout(() => setIsTransitioning(false), 50);
        });
    };

    const nextSlide = () => {
        setIsTransitioning(true);
        requestAnimationFrame(() => {
            setCurrentSlide((prev) => (prev + 1) % bannerPairs.length);
            setTimeout(() => setIsTransitioning(false), 50);
        });
    };

    const prevSlide = () => {
        setIsTransitioning(true);
        requestAnimationFrame(() => {
            setCurrentSlide(
                (prev) => (prev - 1 + bannerPairs.length) % bannerPairs.length
            );
            setTimeout(() => setIsTransitioning(false), 50);
        });
    };

    const sortOptions = [
        { value: "popular", label: "Nổi bật" },
        { value: "newest", label: "Mới nhất" },
        { value: "price-asc", label: "Giá tăng dần" },
        { value: "price-desc", label: "Giá giảm dần" },
    ];

    const defaultCategories: Category[] = [
        { id: 1, name: "iPhone", brand: "Apple" },
        { id: 2, name: "Galaxy Z Fold", brand: "Samsung" },
        { id: 3, name: "Galaxy Z Flip", brand: "Samsung" },
        { id: 4, name: "OPPO", brand: "OPPO" },
        { id: 5, name: "Xiaomi", brand: "Xiaomi" },
        { id: 6, name: "Vivo", brand: "Vivo" },
        { id: 7, name: "Realme", brand: "Realme" },
        { id: 8, name: "HONOR", brand: "HONOR" },
        { id: 9, name: "NOKIA", brand: "NOKIA" },
        { id: 10, name: "Pin >5000mAh", brand: "Battery" },
    ];

    const { data: categories = defaultCategories } = useQuery<Category[]>({
        queryKey: ["categories"],
        queryFn: async () => {
            try {
                const res = await axios.get("/categories");
                return res.data;
            } catch {
                return defaultCategories;
            }
        },
    });

    const brands = [...new Set(categories.map((cat) => cat.brand))];
    const priceRanges = [
        "Dưới 5 triệu",
        "5 - 10 triệu",
        "10 - 15 triệu",
        "15 - 20 triệu",
        "Trên 20 triệu",
    ];

    const { products = [], isLoading } = useProducts({
        brand: selectedBrands.length > 0 ? selectedBrands.join(",") : undefined,
        search: searchTerm,
        sort: sortBy,
    });

    const debouncedSearch = debounce((term: string) => {
        setSearchTerm(term);
    }, 500);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        debouncedSearch(e.target.value);
    };

    const handleProductClick = (id: string) => {
        navigate(`/products/${id}`);
    };

    const handleClearFilters = () => {
        setSelectedBrands([]);
        setPriceRange(null);
        setSortBy("popular");
        setSearchTerm("");
    };

    const toggleFilter = (filterName: string) => {
        setOpenFilter(openFilter === filterName ? null : filterName);
    };

    const toggleBrand = (brand: string) => {
        setSelectedBrands((prev) =>
            prev.includes(brand)
                ? prev.filter((b) => b !== brand)
                : [...prev, brand]
        );
    };

    if (isLoading) return <div className="loading">Đang tải sản phẩm...</div>;

    return (
        <div className="mobile-store-page">
            {/* Thêm breadcrumb và tổng số sản phẩm */}
            <div className="breadcrumb-container">
                <div className="breadcrumb">
                    <span
                        className="breadcrumb-item"
                        onClick={() => navigate("/")}
                        style={{ cursor: "pointer" }}
                    >
                        Trang chủ
                    </span>
                    <span className="breadcrumb-separator">›</span>
                    <span className="breadcrumb-item active">
                        {products.length} Sản Phẩm
                    </span>
                </div>
            </div>
            {/* Banner slider với 2 ảnh mỗi slide */}
            <div className="banner-slider">
                <div
                    className="slider-container"
                    style={{
                        transform: `translate3d(-${currentSlide * 100}%, 0, 0)`,
                        transition: isTransitioning
                            ? "transform 0.5s cubic-bezier(0.22, 0.61, 0.36, 1)"
                            : "none",
                    }}
                    key={`slider-${currentSlide}`}
                >
                    {bannerPairs.map((pair, index) => (
                        <div key={index} className="slide">
                            <div className="banner-pair">
                                <img
                                    src={pair[0]}
                                    alt={`Banner ${index + 1}-1`}
                                    className="banner-image"
                                    style={{ transform: "translateZ(0)" }}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                            "https://via.placeholder.com/600x200?text=Banner+Error";
                                    }}
                                />
                                <img
                                    src={pair[1]}
                                    alt={`Banner ${index + 1}-2`}
                                    className="banner-image"
                                    style={{ transform: "translateZ(0)" }}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                            "https://via.placeholder.com/600x200?text=Banner+Error";
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <button className="slider-nav prev" onClick={prevSlide}>
                    &lt;
                </button>
                <button className="slider-nav next" onClick={nextSlide}>
                    &gt;
                </button>

                <div className="slider-dots">
                    {bannerPairs.map((_, index) => (
                        <button
                            key={index}
                            className={`dot ${
                                index === currentSlide ? "active" : ""
                            }`}
                            onClick={() => goToSlide(index)}
                        />
                    ))}
                </div>
            </div>

            {/* Phần còn lại giữ nguyên */}
            <div className="quick-filter-bar">
                <h2>Thương Hiệu:</h2>
                {brands.slice(0, 8).map((brand) => (
                    <button
                        key={brand}
                        className={`brand-tag ${
                            selectedBrands.includes(brand) ? "active" : ""
                        }`}
                        onClick={() => toggleBrand(brand)}
                    >
                        {brand}
                    </button>
                ))}
            </div>

            <div className="filter-sort-container">
                <div
                    className="filter-section"
                    onClick={() => toggleFilter("main")}
                >
                    <span>Lọc</span>
                    {openFilter === "main" ? (
                        <FaChevronUp />
                    ) : (
                        <FaChevronDown />
                    )}
                </div>

                <div className="sort-options">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        {sortOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {openFilter === "main" && (
                <div className="detailed-filters">
                    <div className="filter-columns">
                        <div className="filter-column">
                            <div className="filter-group">
                                <h4>Hãng sản xuất</h4>
                                <div className="brand-options">
                                    {brands
                                        .slice(0, Math.ceil(brands.length / 2))
                                        .map((brand) => (
                                            <label
                                                key={brand}
                                                className="brand-option"
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="styled-checkbox"
                                                    checked={selectedBrands.includes(
                                                        brand
                                                    )}
                                                    onChange={() =>
                                                        toggleBrand(brand)
                                                    }
                                                />
                                                <span className="checkmark"></span>
                                                {brand}
                                            </label>
                                        ))}
                                </div>
                            </div>
                        </div>

                        <div className="filter-column">
                            <div className="filter-group">
                                <h4>Hãng sản xuất (tiếp)</h4>
                                <div className="brand-options">
                                    {brands
                                        .slice(Math.ceil(brands.length / 2))
                                        .map((brand) => (
                                            <label
                                                key={brand}
                                                className="brand-option"
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="styled-checkbox"
                                                    checked={selectedBrands.includes(
                                                        brand
                                                    )}
                                                    onChange={() =>
                                                        toggleBrand(brand)
                                                    }
                                                />
                                                <span className="checkmark"></span>
                                                {brand}
                                            </label>
                                        ))}
                                </div>
                            </div>

                            <div className="filter-group">
                                <h4>Mức giá</h4>
                                <div className="price-options">
                                    {priceRanges.map((range) => (
                                        <label
                                            key={range}
                                            className="price-option"
                                        >
                                            <input
                                                type="radio"
                                                name="price"
                                                className="styled-radio"
                                                checked={priceRange === range}
                                                onChange={() =>
                                                    setPriceRange(range)
                                                }
                                            />
                                            <span className="radiomark"></span>
                                            {range}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="filter-actions">
                        <button
                            className="reset-btn"
                            onClick={handleClearFilters}
                        >
                            <FaTimes /> Xóa bộ lọc
                        </button>
                        <button
                            className="apply-btn"
                            onClick={() => setOpenFilter(null)}
                        >
                            Áp dụng
                        </button>
                    </div>
                </div>
            )}

            <div className="promo-tags">
                <span className="promo-tag">Giảm giá</span>
                <span className="promo-tag">Mới nhất</span>
                <span className="promo-tag">Sản phẩm bán chạy</span>
            </div>

            {/* Hàng sản phẩm nổi bật */}
            <div className="featured-section">
                <h2 className="section-title">Sản phẩm nổi bật</h2>
                <div className="featured-products">
                    {featuredProducts.map((product) => (
                        <div
                            key={product._id}
                            className="featured-product-card"
                            onClick={() => handleProductClick(product._id)}
                        >
                            <img
                                src={product.image_url}
                                alt={product.name}
                                className="featured-product-image"
                            />
                            <h3 className="featured-product-name">
                                {product.name}
                            </h3>
                            <div className="product-specs">
                                {product.specs.map((spec, index) => (
                                    <span key={index}>{spec}</span>
                                ))}
                            </div>
                            <div className="featured-product-price">
                                {product.base_price.toLocaleString("vi-VN")}₫
                            </div>
                            <button className="buy-now-btn">Mua ngay</button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="product-grid">
                {products.map((product) => (
                    <div
                        key={product._id}
                        className="product-card"
                        onClick={() => handleProductClick(product._id)}
                    >
                        <div className="product-badge">Giảm giá</div>
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className="product-image"
                        />
                        <h3 className="product-name">{product.name}</h3>
                        <div className="product-price">
                            {product.base_price.toLocaleString("vi-VN")}₫
                        </div>
                        <div className="product-promos">
                            <div className="promo-item">0% LÃI SUẤT</div>
                            <div className="promo-item">Tặng PMH 500K</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Products;
