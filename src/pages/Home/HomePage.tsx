import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';
import { useProducts } from '../../hooks/useProducts';
import { useQuery } from '@tanstack/react-query';
import axios from '../../api/axios.config';
import './HomePage.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentBanner, setCurrentBanner] = useState(0);
  
  // Lấy sản phẩm nổi bật
  const { data: productsData, isLoading: isLoadingProducts } = useProducts({
    limit: 10,
    page: 1,
    sort: 'featured-desc'  // Sắp xếp theo featured để lấy sản phẩm nổi bật
  });

  // Lấy tin tức
  const { data: newsData, isLoading: isLoadingNews } = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      const response = await axios.get('/news');
      return response.data;
    }
  });

  // Lấy banners
  const { data: bannersData } = useQuery({
    queryKey: ['banners'],
    queryFn: async () => {
      const response = await axios.get('/banners?position=home_slider&status=active');
      return response.data;
    }
  });

  // Auto slide banners
  useEffect(() => {
    if (bannersData && bannersData.length > 0) {
      const timer = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % bannersData.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [bannersData]);

  const nextBanner = () => {
    if (bannersData) {
      setCurrentBanner((prev) => (prev + 1) % bannersData.length);
    }
  };

  const prevBanner = () => {
    if (bannersData) {
      setCurrentBanner((prev) => (prev - 1 + bannersData.length) % bannersData.length);
    }
  };

  if (isLoadingProducts || isLoadingNews) {
    return <div>Đang tải...</div>;
  }

  return (
    <main>
      {/* Banner Section */}
      <div className="banner-max">
        {bannersData && bannersData.length > 0 && (
          <div className="slide active">
            <img 
              src={bannersData[currentBanner].image} 
              alt={bannersData[currentBanner].title}
              style={{ width: '100%', height: 'auto', maxHeight: '480px', objectFit: 'cover' }}
            />
          </div>
        )}
        <button className="prev" onClick={prevBanner}>&#10094;</button>
        <button className="next" onClick={nextBanner}>&#10095;</button>
      </div>

      {/* Hot Sale Section */}
      <div className="main-top">
        <div className="hot-sale-header">
          <h1>Hot Sale Cuối Tuần</h1>
          <p>Ưu đãi cực sốc - Mua ngay kẻo lỡ!</p>
        </div>

        <div className="countdown">
          Kết thúc sau:
          <span className="time-box" id="hours">48</span>
          <span className="separator">:</span>
          <span className="time-box" id="minutes">00</span>
          <span className="separator">:</span>
          <span className="time-box" id="seconds">00</span>
        </div>

        <div className="product-row">
          <div className="slider-container">
            <div className="container-product">
              {productsData?.products.map((product: any) => (
                <div key={product.id} onClick={() => navigate(`/products/${product.id}`)}>
                  <ProductCard 
                    name={product.name}
                    image={product.image}
                    oldPrice={product.price.toLocaleString('vi-VN') + '₫'}
                    salePrice={product.sale_price?.toLocaleString('vi-VN') + '₫'}
                    promoAmount="200.000₫"
                  />
                </div>
              ))}
            </div>
            <div className="button-see">
              <button className="showAllBtn" onClick={() => navigate('/products')}>
                Xem tất cả <i className="bi bi-chevron-down"></i>
              </button>
              <button className="collapseBtn" style={{ display: 'none' }}>
                Thu gọn <i className="bi bi-chevron-up"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Price Filter Section */}
      <div className="main-filer">
        <div className="filter-container">
          <h2>Giá bạn mong muốn</h2>
          <div className="price-filter">
            <div className="price-btn active" onClick={() => navigate('/products?price=0-2000000')}>Dưới 2 triệu</div>
            <div className="price-btn" onClick={() => navigate('/products?price=2000000-4000000')}>2 - 4 triệu</div>
            <div className="price-btn" onClick={() => navigate('/products?price=4000000-7000000')}>4 - 7 triệu</div>
            <div className="price-btn" onClick={() => navigate('/products?price=7000000-13000000')}>7 - 13 triệu</div>
            <div className="price-btn" onClick={() => navigate('/products?price=13000000-20000000')}>13 - 20 triệu</div>
            <div className="price-btn" onClick={() => navigate('/products?price=20000000-999999999')}>Trên 20 triệu</div>
          </div>
        </div>
      </div>

      {/* Tech News Section */}
      <div className="main-button">
        <h2>Tin Công Nghệ Mới Nhất</h2>
        <div className="blog-grid">
          {newsData?.slice(0, 3).map((item: any) => (
            <div key={item.id} className="blog-card" onClick={() => navigate(`/news/${item.id}`)}>
              <div className="blog-image">
                <img src={item.image} alt={item.title} />
                <span className="blog-date">
                  {new Date(item.created_at).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <div className="blog-info">
                <h3 className="blog-title">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
        <div className="button-see">
          <button className="showAllBtn" onClick={() => navigate('/news')}>Xem tất cả tin tức</button>
        </div>
      </div>

      {/* Chat Icons */}
      <div className="chat-icons">
        <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="chat-icon whatsapp">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/2560px-WhatsApp.svg.png" alt="WhatsApp" />
        </a>
        <a href="https://m.me/yourusername" target="_blank" rel="noopener noreferrer" className="chat-icon messenger">
          <img src="https://giaiphapzalo.com/wp-content/uploads/2021/10/logo-transperant.png" alt="Messenger" />
        </a>
        <div className="chat-icon chat" onClick={() => navigate('/contact')}>
          <i className="bi bi-chat-dots"></i>
        </div>
      </div>
    </main>
  );
};

export default HomePage; 