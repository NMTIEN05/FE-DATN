import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Products.css";
import { FaChevronDown, FaChevronUp, FaTimes, FaFilter } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { IProduct } from "../../../types/product";
import axios from "axios";
import ProductList from "../ProductList";

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
  if (params.sortBy) queryParams.append("sort", params.sortBy);

  queryParams.append("limit", "9999"); // ✅ fix here

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
    queryKey: ["products", selectedCategoryIds, priceRange, sortBy],
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
    <div className="mobile-store-page">



  <div className="quick-filter-bar">
    <h2>Mức giá</h2>
    <div className="price-options flex gap-4 flex-wrap">
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

  <div className="quick-filter-bar">
    <h2>Giá mong muốn</h2>
    <div className="custom-price-inputs flex gap-4">
      <input
        type="number"
        placeholder="Từ (VNĐ)"
        value={customMinPrice}
        onChange={(e) => setCustomMinPrice(e.target.value)}
      />
      <input
        type="number"
        placeholder="Đến (VNĐ)"
        value={customMaxPrice}
        onChange={(e) => setCustomMaxPrice(e.target.value)}
      />
      <button className="apply-btn" onClick={applyFilters}>Áp dụng</button>
    </div>
  </div>

  
</div>

  );
};

export default Products;
