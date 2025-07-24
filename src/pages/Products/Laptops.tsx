import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "../../api/axios.config";
import ProductCard from "../../components/ProductCard/ProductCard";
import "./Products.css";
import { FaFilter, FaSearch, FaSort } from "react-icons/fa";
import { debounce } from "lodash";

interface Product {
    id: number;
    name: string;
    slug: string;
    image_url: string;
    base_price: number;
    category_id: number;
    brand: string;
}

interface Category {
    id: number;
    name: string;
    brand: string;
}

const LAPTOP_CATEGORY_ID = 10;

const Laptops = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<number | null>(
        LAPTOP_CATEGORY_ID
    );
    const [selectedBrand, setSelectedBrand] = useState("all");
    const [priceRange, setPriceRange] = useState([0, 100000000]);
    const [sortBy, setSortBy] = useState("popular");

    const sortOptions = [
        { value: "popular", label: "Phổ biến" },
        { value: "newest", label: "Mới nhất" },
        { value: "price-asc", label: "Giá tăng dần" },
        { value: "price-desc", label: "Giá giảm dần" },
    ];

    // Lấy danh sách danh mục laptop
    const { data: categories = [] } = useQuery<Category[]>({
        queryKey: ["categories"],
        queryFn: async () => {
            try {
                const response = await axios.get("/categories");
                // Chỉ lấy danh mục laptop
                return response.data.filter(
                    (cat: Category) => cat.id === LAPTOP_CATEGORY_ID
                );
            } catch (error) {
                return [];
            }
        },
    });

    // Lấy danh sách thương hiệu từ danh mục laptop
    const brands = [...new Set(categories.map((cat) => cat.brand))];

    // Lấy danh sách sản phẩm laptop với bộ lọc
    const { data: products, isLoading } = useQuery<Product[]>({
        queryKey: [
            "laptops",
            selectedCategory,
            selectedBrand,
            sortBy,
            searchTerm,
            priceRange,
        ],
        queryFn: async () => {
            let url = "/products?";
            const params = new URLSearchParams();

            params.append("category_id", LAPTOP_CATEGORY_ID.toString());
            if (selectedBrand !== "all") {
                params.append("brand", selectedBrand);
            }
            if (searchTerm) {
                params.append("q", searchTerm);
            }
            params.append("price_min", priceRange[0].toString());
            params.append("price_max", priceRange[1].toString());
            switch (sortBy) {
                case "newest":
                    params.append("_sort", "created_at");
                    params.append("_order", "desc");
                    break;
                case "price-asc":
                    params.append("_sort", "base_price");
                    params.append("_order", "asc");
                    break;
                case "price-desc":
                    params.append("_sort", "base_price");
                    params.append("_order", "desc");
                    break;
            }
            const response = await axios.get(url + params.toString());
            return response.data;
        },
    });

    // Debounce search input
    const debouncedSearch = debounce((term: string) => {
        setSearchTerm(term);
    }, 500);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        debouncedSearch(e.target.value);
    };

    const handleProductClick = (slug: string) => {
        navigate(`/products/${slug}`);
    };

    const handleClearFilters = () => {
        setSelectedCategory(LAPTOP_CATEGORY_ID);
        setSelectedBrand("all");
        setPriceRange([0, 100000000]);
        setSortBy("popular");
        setSearchTerm("");
    };

    if (isLoading) return <div>Đang tải...</div>;

    return (
        <div className="laptops-page products-page">
            {/* Page Header */}
            <div className="page-header">
                <div className="container">
                    <h1>Laptop</h1>
                    <div className="breadcrumb">
                        <a href="/">Trang chủ</a>
                        <span>/</span>
                        <span>Laptop</span>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="products-layout">
                    {/* Filters Sidebar */}
                    <aside className="filters">
                        <div className="filter-header">
                            <h3>
                                <FaFilter /> Bộ lọc
                            </h3>
                            <button
                                className="btn btn-text"
                                onClick={handleClearFilters}
                            >
                                Xóa bộ lọc
                            </button>
                        </div>

                        <div className="filter-section">
                            <h4>Danh mục</h4>
                            <div className="filter-options">
                                <label className="filter-option">
                                    <input
                                        type="radio"
                                        name="category"
                                        checked={
                                            selectedCategory ===
                                            LAPTOP_CATEGORY_ID
                                        }
                                        onChange={() =>
                                            setSelectedCategory(
                                                LAPTOP_CATEGORY_ID
                                            )
                                        }
                                    />
                                    <span>Tất cả</span>
                                </label>
                                {categories?.map((category) => (
                                    <label
                                        key={category.id}
                                        className="filter-option"
                                    >
                                        <input
                                            type="radio"
                                            name="category"
                                            checked={
                                                selectedCategory === category.id
                                            }
                                            onChange={() =>
                                                setSelectedCategory(category.id)
                                            }
                                        />
                                        <span>{category.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="filter-section">
                            <h4>Thương hiệu</h4>
                            <div className="filter-options">
                                <label className="filter-option">
                                    <input
                                        type="radio"
                                        name="brand"
                                        checked={selectedBrand === "all"}
                                        onChange={() => setSelectedBrand("all")}
                                    />
                                    <span>Tất cả</span>
                                </label>
                                {brands.map((brand) => (
                                    <label
                                        key={brand}
                                        className="filter-option"
                                    >
                                        <input
                                            type="radio"
                                            name="brand"
                                            checked={selectedBrand === brand}
                                            onChange={() =>
                                                setSelectedBrand(brand)
                                            }
                                        />
                                        <span>{brand}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Price filter (có thể thêm slider hoặc input nếu muốn) */}
                        <div className="filter-section">
                            <h4>Khoảng giá</h4>
                            <div className="filter-options">
                                <input
                                    type="number"
                                    min={0}
                                    max={priceRange[1]}
                                    value={priceRange[0]}
                                    onChange={(e) =>
                                        setPriceRange([
                                            Number(e.target.value),
                                            priceRange[1],
                                        ])
                                    }
                                    placeholder="Từ"
                                    className="price-input"
                                />
                                <span> - </span>
                                <input
                                    type="number"
                                    min={priceRange[0]}
                                    value={priceRange[1]}
                                    onChange={(e) =>
                                        setPriceRange([
                                            priceRange[0],
                                            Number(e.target.value),
                                        ])
                                    }
                                    placeholder="Đến"
                                    className="price-input"
                                />
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <section className="products-content">
                        <div className="products-toolbar">
                            <div className="search-box">
                                <FaSearch />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm laptop..."
                                    onChange={handleSearchChange}
                                />
                            </div>
                            <div className="sort-box">
                                <FaSort />
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    {sortOptions.map((opt) => (
                                        <option
                                            key={opt.value}
                                            value={opt.value}
                                        >
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="products-grid">
                            {products && products.length > 0 ? (
                                products.map((product) => (
                                    <div
                                        key={product.id}
                                        onClick={() =>
                                            handleProductClick(product.slug)
                                        }
                                    >
                                        <ProductCard
                                            name={product.name}
                                            image={product.image_url}
                                            price={
                                                product.base_price.toLocaleString(
                                                    "vi-VN"
                                                ) + "₫"
                                            }
                                            slug={product.slug}
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="no-products">
                                    Không có sản phẩm laptop nào.
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Laptops;
