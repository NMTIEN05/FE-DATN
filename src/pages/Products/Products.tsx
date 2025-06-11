import React, { useState } from 'react';
import './Products.css';
import { FaFilter, FaSearch, FaStar, FaHeart, FaShoppingCart, FaSort } from 'react-icons/fa';

const Products = () => {
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

  // Sample products data
  const products = Array(12).fill(null).map((_, index) => ({
    id: index + 1,
    name: 'iPhone 15 Pro Max',
    image: 'https://via.placeholder.com/300',
    price: 27990000,
    oldPrice: 29990000,
    rating: 4.5,
    reviews: 150,
    isNew: index < 3,
    discount: 10,
  }));

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
              {products.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    <img src={product.image} alt={product.name} />
                    {product.isNew && <span className="badge badge-new">Mới</span>}
                    {product.discount > 0 && (
                      <span className="badge badge-discount">-{product.discount}%</span>
                    )}
                    <div className="product-actions">
                      <button className="action-btn">
                        <FaHeart />
                      </button>
                      <button className="action-btn">
                        <FaShoppingCart />
                      </button>
                    </div>
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <div className="product-rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={`star-icon ${star <= product.rating ? 'active' : ''}`}
                        />
                      ))}
                      <span>({product.reviews})</span>
                    </div>
                    <div className="product-price">
                      <span className="price">
                        {product.price.toLocaleString('vi-VN')}₫
                      </span>
                      {product.oldPrice && (
                        <span className="price-old">
                          {product.oldPrice.toLocaleString('vi-VN')}₫
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="pagination">
              <button className="btn btn-outline" disabled>
                Trước
              </button>
              <div className="page-numbers">
                <button className="btn btn-primary">1</button>
                <button className="btn btn-outline">2</button>
                <button className="btn btn-outline">3</button>
                <span>...</span>
                <button className="btn btn-outline">10</button>
              </div>
              <button className="btn btn-outline">
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