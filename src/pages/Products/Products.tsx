import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Products.css";
import { FaChevronDown, FaChevronUp, FaTimes, FaSearch } from "react-icons/fa";
import { debounce } from "lodash";
import { useQuery } from "@tanstack/react-query";
import axios from "../../api/axios.config";
import ProductList from "./ProductList";
import { IProduct } from "../../types/product";

interface Category {
    id: number;
    name: string;
    brand: string;
}

interface ProductQueryParams {
    searchTerm?: string;
    brands?: string[];
    priceRange?: string | null;
    sortBy?: string;
}

const fetchProducts = async (
    params: ProductQueryParams
): Promise<IProduct[]> => {
    const queryParams = new URLSearchParams();

    if (params.searchTerm) queryParams.append("search", params.searchTerm);
    if (params.brands && params.brands.length > 0) {
        queryParams.append("brands", params.brands.join(","));
    }
    if (params.priceRange) queryParams.append("priceRange", params.priceRange);
    if (params.sortBy) queryParams.append("sort", params.sortBy);

    const res = await axios.get(`/product?${queryParams.toString()}`);
    return res.data.data;
};

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

    useEffect(() => {
        const loadImage = (src: string) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.src = src;
                img.onload = resolve;
                img.onerror = resolve;
            });
        };

        Promise.all(bannerPairs.flat().map(loadImage)).then(() => {
            setIsTransitioning(false);
        });

        const interval = setInterval(() => {
            setIsTransitioning(true);
            requestAnimationFrame(() => {
                setCurrentSlide((prev) => (prev + 1) % bannerPairs.length);
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

    const {
        data: products,
        isLoading,
        isError,
    } = useQuery<IProduct[], Error>({
        queryKey: ["products", searchTerm, selectedBrands, priceRange, sortBy],
        queryFn: () =>
            fetchProducts({
                searchTerm,
                brands: selectedBrands,
                priceRange,
                sortBy,
            }),
    });

    const brands = [...new Set(categories.map((cat) => cat.brand))];
    const priceRanges = [
        "Dưới 5 triệu",
        "5 - 10 triệu",
        "10 - 15 triệu",
        "15 - 20 triệu",
        "Trên 20 triệu",
    ];

    const debouncedSearch = debounce((term: string) => {
        setSearchTerm(term);
    }, 500);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        debouncedSearch(e.target.value);
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

    return (
        <div className="mobile-store-page">
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
                    <span className="breadcrumb-item active">Sản Phẩm</span>
                </div>
            </div>

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

            {/* Phần hiển thị sản phẩm */}
            <div className="products-container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {isLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                        {[...Array(5)].map((_, index) => (
                            <div
                                key={index}
                                className="rounded-lg overflow-hidden bg-gray-100 p-4 animate-pulse"
                            >
                                <div className="bg-gray-200 rounded-lg h-56 mb-4"></div>
                                <div className="bg-gray-200 h-5 rounded mb-2"></div>
                                <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                            </div>
                        ))}
                    </div>
                ) : isError ? (
                    <div className="text-center py-12 bg-red-50 rounded-lg">
                        <p className="text-red-600">
                            Đã xảy ra lỗi khi tải sản phẩm. Vui lòng thử lại
                            sau.
                        </p>
                    </div>
                ) : (
                    <ProductList products={products || []} />
                )}
            </div>
        </div>
    );
};

export default Products;
