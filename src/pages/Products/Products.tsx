import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Products.css";
import { FaChevronDown, FaChevronUp, FaTimes, FaFilter } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import axios from "../../api/axios.config";
import ProductList from "./ProductList";
import { IProduct } from "../../types/product";

interface Category {
  _id: string;
  name: string;
}

interface ProductQueryParams {
  categoryIds?: string[];
  minPrice?: string | null;
  maxPrice?: string | null;
  sortBy?: string;
}

const fetchProducts = async (params: ProductQueryParams): Promise<IProduct[]> => {
  const queryParams = new URLSearchParams();

  if (params.categoryIds?.length) {
    queryParams.append("categoryIds", params.categoryIds.join(","));
  }

  if (params.minPrice) queryParams.append("minPrice", params.minPrice);
  if (params.maxPrice) queryParams.append("maxPrice", params.maxPrice);
  // if (params.sortBy) queryParams.append("sortBy", params.sortBy); // ✅ quan trọng
  if (params.sortBy) queryParams.append("sortBy", params.sortBy);

  queryParams.append("limit", "9999");

  const res = await axios.get(`/product?${queryParams.toString()}`);
  return res.data.data;
};



const Products = () => {
  const navigate = useNavigate();

  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string | null>(null);
  const [customMinPrice, setCustomMinPrice] = useState("");
  const [customMaxPrice, setCustomMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const res = await axios.get("/category?limit=9999");
        return res.data.data;
      } catch {
        return [];
      }
    },
  });

const {
  data: products,
  isLoading,
  isError,
} = useQuery<IProduct[], Error>({
  queryKey: ["products", selectedCategoryIds, priceRange, sortBy, customMinPrice, customMaxPrice],
  queryFn: () =>
    fetchProducts({
      categoryIds: selectedCategoryIds,
      minPrice: priceRange?.split("-")[0] || null,
      maxPrice: priceRange?.split("-")[1] || null,
      sortBy,
    }),
});


  const bannerPairs = [
    [
      "https://tse2.mm.bing.net/th/id/OIP.l7z_OFzBRA5ASKCczIXioQHaEK?pid=Api&P=0&h=180",
      "https://tse3.mm.bing.net/th/id/OIP.wczkqVUy4x2pwkq88iziowHaCQ?pid=Api&P=0&h=180",
    ],
    [
      "https://tse2.mm.bing.net/th/id/OIP.f52eNUCSFAz90D9EIxLNOQHaEK?pid=Api&P=0&h=180",
      "https://tse1.mm.bing.net/th/id/OIP.tdigLWLbfjUppcXuXiU5GAHaCO?pid=Api&P=0&h=180",
    ],
  ];

  useEffect(() => {
    const loadImage = (src: string) =>
      new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = resolve;
      });

    Promise.all(bannerPairs.flat().map(loadImage)).then(() =>
      setIsTransitioning(false)
    );

    const interval = setInterval(() => {
      setIsTransitioning(true);
      requestAnimationFrame(() => {
        setCurrentSlide((prev) => (prev + 1) % bannerPairs.length);
        setTimeout(() => setIsTransitioning(false), 50);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [bannerPairs.length]);

  useEffect(() => {
    let count = selectedCategoryIds.length;
    if (priceRange) count += 1;
    setActiveFiltersCount(count);
  }, [selectedCategoryIds, priceRange]);

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

  const toggleFilter = (filterName: string) => {
    setOpenFilter(openFilter === filterName ? null : filterName);
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleClearFilters = () => {
    setSelectedCategoryIds([]);
    setPriceRange(null);
    setCustomMinPrice("");
    setCustomMaxPrice("");
    setSortBy("popular");
    setIsFilterApplied(false);
  };

  const handlePriceRangeChange = (range: string) => {
    setPriceRange(range === priceRange ? null : range);
    setCustomMinPrice("");
    setCustomMaxPrice("");
  };

  const applyFilters = () => {
    if (customMinPrice || customMaxPrice) {
      const min = customMinPrice || "0";
      const max = customMaxPrice || "999999999";
      setPriceRange(`${min}-${max}`);
    }
    setIsFilterApplied(true);
    setOpenFilter(null);
  };

  const hasActiveFilters = selectedCategoryIds.length > 0 || priceRange;
  const noProductsFound = isFilterApplied && products?.length === 0;

  return (
    <div className="mobile-store-page mb-10 ">
      <div className="quick-filter-bar">
        <h2>Thương Hiệu:</h2>
        {categories.map((cat) => (
          <button
            key={cat._id}
            className={`brand-tag ${
              selectedCategoryIds.includes(cat._id) ? "active" : ""
            }`}
            onClick={() => toggleCategory(cat._id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="filter-sort-container">
        <div className="filter-section" onClick={() => toggleFilter("main")}>
          <FaFilter className="filter-icon" />
          <span>Bộ lọc</span>
          {openFilter === "main" ? (
            <FaChevronUp className="filter-arrow" />
          ) : (
            <FaChevronDown className="filter-arrow" />
          )}
          {activeFiltersCount > 0 && (
            <span className="filter-badge">{activeFiltersCount}</span>
          )}
        </div>

        <div className="sort-options">
  <select
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
    className="sort-select border border-gray-300 rounded-md px-3 py-2"
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
                  {categories
                   
                    .map((cat) => (
                      <label key={cat._id} className="brand-option">
                        <input
                          type="checkbox"
                          className="styled-checkbox"
                          checked={selectedCategoryIds.includes(cat._id)}
                          onChange={() => toggleCategory(cat._id)}
                        />
                        <span className="checkmark"></span>
                        {cat.name}
                      </label>
                    ))}
                </div>
              </div>
            </div>

            <div className="filter-column">
              

              <div className="filter-group">
                <h4>Mức giá</h4>
                <div className="price-options">
                  {priceRanges.map((range) => (
                    <label key={range.value} className="price-option">
                      <input
                        type="radio"
                        name="price"
                        className="styled-radio"
                        checked={priceRange === range.value}
                        onChange={() => handlePriceRangeChange(range.value)}
                      />
                      <span className="radiomark"></span>
                      {range.label}
                    </label>
                  ))}
                  
                </div>
              </div>
              
            </div>
           <div className="grid grid-cols-2 gap-2 mt-4">
 <div className="flex items-center gap-4">
  <h2 className="whitespace-nowrap text-sm font-medium">Nhập giá mong muốn</h2>

  {/* Input Từ */}
  <div className="relative w-48">
    <input
      type="text"
      inputMode="numeric"
      placeholder="Từ"
      value={customMinPrice ? Number(customMinPrice).toLocaleString("vi-VN") : ""}
      onChange={(e) => {
        const raw = e.target.value.replace(/[^0-9]/g, "");
        setCustomMinPrice(raw);
      }}
      className="w-[200px] text-center px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500">VNĐ</span>
  </div>

  {/* ➡ Chữ ĐẾN */}
  <span className="text-sm text-gray-500">đến</span>

  {/* Input Đến */}
  <div className="relative w-48">
    <input
      type="text"
      inputMode="numeric"
      placeholder="Đến"
      value={customMaxPrice ? Number(customMaxPrice).toLocaleString("vi-VN") : ""}
      onChange={(e) => {
        const raw = e.target.value.replace(/[^0-9]/g, "");
        setCustomMaxPrice(raw);
      }}
      className="w-[200px] text-center px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500">VNĐ</span>
  </div>
</div>





            </div>
 

          </div>

          <div className="filter-actions">
            <button className="reset-btn" onClick={handleClearFilters}>
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
            {categories
              .filter((cat) => selectedCategoryIds.includes(cat._id))
              .map((cat) => (
                <span key={cat._id} className="active-filter-tag">
                  {cat.name}
                  <button
                    onClick={() => toggleCategory(cat._id)}
                    className="remove-filter"
                  >
                    ×
                  </button>
                </span>
              ))}
            {priceRange && (
              <span className="active-filter-tag">
                {priceRange}
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
              Đã xảy ra lỗi khi tải sản phẩm. Vui lòng thử lại sau.
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
                Không có sản phẩm nào phù hợp với bộ lọc hiện tại. Vui lòng thử
                lại với tiêu chí khác.
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
            onProductClick={(productId) => navigate(`/product/${productId}`)}
          />
        )}
      </div>
    </div>
  );
};

export default Products;
