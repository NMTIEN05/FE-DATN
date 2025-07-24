import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Products.css";
import { FaChevronDown, FaChevronUp, FaTimes, FaFilter } from "react-icons/fa";
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
    brands?: string[];
    priceRange?: string | null;
    sortBy?: string;
}

const fetchProducts = async (
    params: ProductQueryParams
): Promise<IProduct[]> => {
    const queryParams = new URLSearchParams();

    if (params.brands && params.brands.length > 0) {
        queryParams.append("brands", params.brands.join(","));
    }
    if (params.priceRange) queryParams.append("priceRange", params.priceRange);
    if (params.sortBy) queryParams.append("sort", params.sortBy);

    const res = await axios.get(`/product?${queryParams.toString()}`);
    return res.data.data;
};

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

const Products = () => {
    const navigate = useNavigate();
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState("popular");
    const [openFilter, setOpenFilter] = useState<string | null>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [activeFiltersCount, setActiveFiltersCount] = useState(0);
    const [isFilterApplied, setIsFilterApplied] = useState(false);

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

    // Update active filters count whenever filters change
    useEffect(() => {
        let count = selectedBrands.length;
        if (priceRange) count += 1;
        setActiveFiltersCount(count);
    }, [selectedBrands, priceRange]);

    const sortOptions = [
        { value: "popular", label: "Nổi bật" },
        { value: "newest", label: "Mới nhất" },
        { value: "price-asc", label: "Giá tăng dần" },
        { value: "price-desc", label: "Giá giảm dần" },
    ];

    const priceRanges = [
        { label: "Dưới 5 triệu", value: "0-5000000" },
        { label: "5 - 10 triệu", value: "5000000-10000000" },
        { label: "10 - 15 triệu", value: "10000000-15000000" },
        { label: "15 - 20 triệu", value: "15000000-20000000" },
        { label: "Trên 20 triệu", value: "20000000-999999999" },
    ];

    const { data: categories = defaultCategories } = useQuery<Category[]>({
        queryKey: ["categories"],
        queryFn: async () => {
            try {
                const res = await axios.get("/categories");
                return res.data.data;
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
        queryKey: ["products", selectedBrands, priceRange, sortBy],
        queryFn: () =>
            fetchProducts({
                brands: selectedBrands,
                priceRange,
                sortBy,
            }),
    });

    const brands = [...new Set(categories.map((cat) => cat.brand))];

    const handleClearFilters = () => {
        setSelectedBrands([]);
        setPriceRange(null);
        setSortBy("popular");
        setIsFilterApplied(false);
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

    const handlePriceRangeChange = (range: string) => {
        setPriceRange(range === priceRange ? null : range);
    };

    const applyFilters = () => {
        setIsFilterApplied(true);
        setOpenFilter(null);
    };

    const hasActiveFilters = selectedBrands.length > 0 || priceRange;
    const noProductsFound = isFilterApplied && products?.length === 0;

    return (
        <div className="mobile-store-page">
            <div className="quick-filter-bar">
                <h2>Thương Hiệu:</h2>
                {brands.slice(0, 8).map((brand) => (
                    <button
                        key={`quick-${brand}`}
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
                    <FaFilter className="filter-icon" />
                    <span>Bộ lọc</span>
                    {openFilter === "main" ? (
                        <FaChevronUp className="filter-arrow" />
                    ) : (
                        <FaChevronDown className="filter-arrow" />
                    )}
                    {activeFiltersCount > 0 && (
                        <span className="filter-badge">
                            {activeFiltersCount}
                        </span>
                    )}
                </div>

                <div className="sort-options">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="sort-select"
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
                                                key={`brand-${brand}`}
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
                                                key={`brand2-${brand}`}
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
                                            key={range.value}
                                            className="price-option"
                                        >
                                            <input
                                                type="radio"
                                                name="price"
                                                className="styled-radio"
                                                checked={
                                                    priceRange === range.value
                                                }
                                                onChange={() =>
                                                    handlePriceRangeChange(
                                                        range.value
                                                    )
                                                }
                                            />
                                            <span className="radiomark"></span>
                                            {range.label}
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
                        <button className="apply-btn" onClick={applyFilters}>
                            Áp dụng
                        </button>
                    </div>
                </div>
            )}

            {hasActiveFilters && (
                <div className="active-filters">
                    <div className="active-filters-container">
                        {selectedBrands.map((brand) => (
                            <span
                                key={`active-${brand}`}
                                className="active-filter-tag"
                            >
                                {brand}
                                <button
                                    onClick={() => toggleBrand(brand)}
                                    className="remove-filter"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                        {priceRange && (
                            <span className="active-filter-tag">
                                {
                                    priceRanges.find(
                                        (r) => r.value === priceRange
                                    )?.label
                                }
                                <button
                                    onClick={() => setPriceRange(null)}
                                    className="remove-filter"
                                >
                                    ×
                                </button>
                            </span>
                        )}
                        <button
                            className="clear-all-filters"
                            onClick={handleClearFilters}
                        >
                            Xóa tất cả
                        </button>
                    </div>
                </div>
            )}

            <div className="products-container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {isLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                        {[...Array(5)].map((_, index) => (
                            <div
                                key={`skeleton-${index}`}
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
                ) : noProductsFound ? (
                    <div className="no-products-found">
                        <div className="no-products-content">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/7486/7486744.png"
                                alt="No products found"
                                className="no-products-image"
                            />
                            <h3>Không tìm thấy sản phẩm phù hợp</h3>
                            <p>
                                Không có sản phẩm nào phù hợp với bộ lọc hiện
                                tại. Vui lòng thử lại với tiêu chí khác.
                            </p>
                            <button
                                className="reset-filters-btn"
                                onClick={handleClearFilters}
                            >
                                Xóa bộ lọc
                            </button>
                        </div>
                    </div>
                ) : (
                    <ProductList
                        products={products || []}
                        onProductClick={(productId) =>
                            navigate(`/product/${productId}`)
                        }
                    />
                )}
            </div>
        </div>
    );
};

export default Products;
