import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Products.css';
import { FaFilter, FaSearch, FaSort } from 'react-icons/fa';
import { debounce } from 'lodash';
import { useProducts } from '../../hooks/useProducts';
import { useQuery } from '@tanstack/react-query';
import axios from '../../api/axios.config';

interface Category {
  id: number;
  name: string;
  brand: string;
}

const Products = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 50000000]);
  const [sortBy, setSortBy] = useState('popular');

  const sortOptions = [
    { value: 'popular', label: 'Phổ biến' },
    { value: 'newest', label: 'Mới nhất' },
    { value: 'price-asc', label: 'Giá tăng dần' },
    { value: 'price-desc', label: 'Giá giảm dần' },
  ];

  const defaultCategories: Category[] = [
    { id: 1, name: 'iPhone', brand: 'Apple' },
    { id: 2, name: 'Samsung Galaxy', brand: 'Samsung' },
    { id: 3, name: 'OPPO', brand: 'OPPO' },
    { id: 4, name: 'Xiaomi', brand: 'Xiaomi' },
    { id: 5, name: 'Vivo', brand: 'Vivo' },
    { id: 6, name: 'Huawei', brand: 'Huawei' },
    { id: 7, name: 'Realme', brand: 'Realme' },
    { id: 8, name: 'Nokia', brand: 'Nokia' },
    { id: 9, name: 'OnePlus', brand: 'OnePlus' },
    { id: 10, name: 'POCO', brand: 'Xiaomi' },
  ];

  // Lấy danh mục
  const { data: categories = defaultCategories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const res = await axios.get('/categories');
        return res.data;
      } catch {
        return defaultCategories;
      }
    },
  });

  const brands = [...new Set(categories.map((cat) => cat.brand))];

  const {
    products = [],
    total,
    isLoading,
  } = useProducts({
    category_id: selectedCategory?.toString(),
    brand: selectedBrand !== 'all' ? selectedBrand : undefined,
    search: searchTerm,
    price_min: priceRange[0],
    price_max: priceRange[1],
    sort: sortBy,
  });

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
    setSelectedCategory(null);
    setSelectedBrand('all');
    setPriceRange([0, 50000000]);
    setSortBy('popular');
    setSearchTerm('');
  };

  if (isLoading) return <div className="loading">Đang tải sản phẩm...</div>;

  return (
    <div className="products-page">
      <div className="page-header">
        <div className="container">
          <h1>Điện thoại</h1>
          <div className="breadcrumb">
            <a href="/">Trang chủ</a>
            <span>/</span>
            <span>Điện thoại</span>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="products-layout">
          {/* Bộ lọc */}
          <aside className="filters">
            <div className="filter-header">
              <h3><FaFilter /> Bộ lọc</h3>
              <button className="btn btn-text" onClick={handleClearFilters}>Xóa bộ lọc</button>
            </div>

            <div className="filter-section">
              <h4>Danh mục</h4>
              <div className="filter-options">
                <label className="filter-option">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === null}
                    onChange={() => setSelectedCategory(null)}
                  />
                  <span>Tất cả</span>
                </label>
                {categories.map((category) => (
                  <label key={category.id} className="filter-option">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === category.id}
                      onChange={() => setSelectedCategory(category.id)}
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
                    checked={selectedBrand === 'all'}
                    onChange={() => setSelectedBrand('all')}
                  />
                  <span>Tất cả</span>
                </label>
                {brands.map((brand) => (
                  <label key={brand} className="filter-option">
                    <input
                      type="radio"
                      name="brand"
                      checked={selectedBrand === brand}
                      onChange={() => setSelectedBrand(brand)}
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h4>Giá</h4>
              <div className="price-range">
                <input
                  type="range"
                  min="0"
                  max="50000000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                />
                <div className="price-inputs">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    placeholder="Từ"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    placeholder="Đến"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Sản phẩm */}
          <main className="products-content">
            <div className="products-toolbar">
              <div className="search-box">
                <FaSearch />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  onChange={handleSearchChange}
                />
              </div>

              <div className="sort-box">
                <FaSort />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="products-grid">
              {products.map((product) => (
                <div key={product.id} onClick={() => handleProductClick(product.slug)}>
                  <ProductCard
                    name={product.name}
                    image={product.image_url}
                    price={product.base_price.toLocaleString('vi-VN') + '₫'}
                    slug={product.slug}
                  />
                </div>
              ))}
              {products.length === 0 && (
                <div className="no-products">
                  Không tìm thấy sản phẩm nào phù hợp với bộ lọc
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;
