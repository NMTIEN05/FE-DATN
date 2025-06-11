import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Products.css';
import { FaFilter, FaSearch, FaSort } from 'react-icons/fa';

const Products = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 50000000]);
  const [sortBy, setSortBy] = useState('popular');

  const categories = ['Tất cả', 'iPhone', 'Samsung', 'Oppo', 'Xiaomi', 'Realme'];
  const brands = ['Tất cả', 'Apple', 'Samsung', 'Oppo', 'Xiaomi', 'Realme', 'Vivo', 'Nokia'];
  const sortOptions = [
    { value: 'popular', label: 'Phổ biến' },
    { value: 'newest', label: 'Mới nhất' },
    { value: 'price-asc', label: 'Giá tăng dần' },
    { value: 'price-desc', label: 'Giá giảm dần' },
  ];

  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    category_id: undefined as string | undefined,
    sort: undefined as string | undefined
  });

  const { data, isLoading, error } = useProducts(filters);

  const handleProductClick = (slug: string) => {
    navigate(`/products/${slug}`);
  };

  if (isLoading) return <div>Đang tải...</div>;
  if (error) return <div>Có lỗi xảy ra: {(error as Error).message}</div>;

  return (
    <div className="products-page">
      {/* Page Header */}
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
          {/* Filters Sidebar */}
          <aside className="filters">
            <div className="filter-header">
              <h3>
                <FaFilter /> Bộ lọc
              </h3>
              <button className="btn btn-text">Xóa bộ lọc</button>
            </div>

            <div className="filter-section">
              <h4>Danh mục</h4>
              <div className="filter-options">
                {categories.map((category) => (
                  <label key={category} className="filter-option">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === category.toLowerCase()}
                      onChange={() => setSelectedCategory(category.toLowerCase())}
                    />
                    <span>{category}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h4>Thương hiệu</h4>
              <div className="filter-options">
                {brands.map((brand) => (
                  <label key={brand} className="filter-option">
                    <input
                      type="radio"
                      name="brand"
                      checked={selectedBrand === brand.toLowerCase()}
                      onChange={() => setSelectedBrand(brand.toLowerCase())}
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

          {/* Products Content */}
          <main className="products-content">
            {/* Toolbar */}
            <div className="products-toolbar">
              <div className="search-box">
                <FaSearch />
                <input type="text" placeholder="Tìm kiếm sản phẩm..." />
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

            {/* Products Grid */}
            <div className="products-grid">
              {data?.products.map((product: any) => (
                <div key={product.id} onClick={() => handleProductClick(product.slug)}>
                  <ProductCard 
                    name={product.name}
                    image={product.image_url}
                    price={product.base_price.toLocaleString('vi-VN') + '₫'}
                    slug={product.slug}
                  />
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="pagination">
              <button 
                disabled={filters.page === 1}
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}>
                Trước
              </button>
              <span>Trang {filters.page}</span>
              <button 
                disabled={!data?.products || data.products.length < filters.limit}
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}>
                Sau
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products; 