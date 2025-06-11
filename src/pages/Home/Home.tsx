import React from 'react';
import './Home.css';
import ProductCard from '../../components/ProductCard/ProductCard';
import { FaArrowRight, FaStar, FaShippingFast, FaHeadset, FaWallet, FaUndo } from 'react-icons/fa';

const Home = () => {
  const products = [
    {
      name: 'iPhone 15 Pro Max 256GB',
      image: '/placeholder/280/280',
      oldPrice: '33.990.000₫',
      salePrice: '29.990.000₫',
      promoAmount: '200.000₫'
    },
    {
      name: 'Samsung Galaxy S24 Ultra 256GB',
      image: '/placeholder/280/280',
      oldPrice: '31.990.000₫',
      salePrice: '26.990.000₫',
      promoAmount: '200.000₫'
    },
    // Add more products as needed
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Khám phá thế giới công nghệ</h1>
            <p>Điện thoại chính hãng với giá tốt nhất và dịch vụ hậu mãi tuyệt vời</p>
            <button className="btn btn-primary">
              Mua ngay <FaArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* Hot Sale Section */}
      <section className="hot-sale">
        <div className="container">
          <div className="hot-sale-header">
            <h2>Hot Sale Cuối Tuần</h2>
            <p>Ưu đãi cực sốc - Mua ngay kẻo lỡ!</p>
          </div>

          <div className="countdown">
            Kết thúc sau:
            <span className="time-box">48</span>
            <span className="separator">:</span>
            <span className="time-box">00</span>
            <span className="separator">:</span>
            <span className="time-box">00</span>
          </div>

          <div className="products-grid">
            {products.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </div>
          <button className="btn btn-outline">
            Xem tất cả <FaArrowRight />
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <FaShippingFast className="feature-icon" />
              <h3>Giao hàng nhanh</h3>
              <p>Miễn phí giao hàng cho đơn từ 500K</p>
            </div>
            <div className="feature-card">
              <FaHeadset className="feature-icon" />
              <h3>Hỗ trợ 24/7</h3>
              <p>Tư vấn nhiệt tình, giải đáp mọi thắc mắc</p>
            </div>
            <div className="feature-card">
              <FaWallet className="feature-icon" />
              <h3>Thanh toán an toàn</h3>
              <p>Nhiều phương thức thanh toán bảo mật</p>
            </div>
            <div className="feature-card">
              <FaUndo className="feature-icon" />
              <h3>Đổi trả dễ dàng</h3>
              <p>Đổi trả miễn phí trong 15 ngày</p>
            </div>
          </div>
        </div>
      </section>

      {/* Price Filter Section */}
      <section className="price-filter">
        <div className="container">
          <h2>Giá bạn mong muốn</h2>
          <div className="price-buttons">
            <button className="price-btn active">Dưới 2 triệu</button>
            <button className="price-btn">2 - 4 triệu</button>
            <button className="price-btn">4 - 7 triệu</button>
            <button className="price-btn">7 - 13 triệu</button>
            <button className="price-btn">13 - 20 triệu</button>
            <button className="price-btn">Trên 20 triệu</button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories">
        <div className="container">
          <div className="section-header">
            <h2>Danh mục sản phẩm</h2>
          </div>
          <div className="categories-grid">
            {['iPhone', 'Samsung', 'Oppo', 'Xiaomi', 'Realme'].map((category) => (
              <div key={category} className="category-card">
                <img src={`/placeholder/200/200`} alt={category} />
                <h3>{category}</h3>
                <p>Xem tất cả sản phẩm</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News & Reviews */}
      <section className="news">
        <div className="container">
          <div className="section-header">
            <h2>Tin tức & Đánh giá</h2>
            <button className="btn btn-outline">
              Xem tất cả <FaArrowRight />
            </button>
          </div>
          <div className="news-grid">
            {[1, 2, 3].map((item) => (
              <div key={item} className="news-card">
                <div className="news-image">
                  <img src="/placeholder/400/200" alt="News" />
                  <span className="news-date">15 Tháng 3, 2024</span>
                </div>
                <div className="news-content">
                  <h3>Đánh giá iPhone 15 Pro Max: Siêu phẩm đáng mong đợi</h3>
                  <p>
                    Khám phá những tính năng mới nhất và đánh giá chi tiết về siêu phẩm mới nhất từ Apple
                  </p>
                  <a href="#" className="read-more">
                    Đọc tiếp <FaArrowRight />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chat Icons */}
      <div className="chat-icons">
        <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="chat-icon whatsapp">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/2560px-WhatsApp.svg.png" alt="WhatsApp" />
        </a>
        <a href="https://m.me/yourusername" target="_blank" rel="noopener noreferrer" className="chat-icon messenger">
          <img src="https://giaiphapzalo.com/wp-content/uploads/2021/10/logo-transperant.png" alt="Messenger" />
        </a>
        <a href="#" className="chat-icon chat">
          <i className="bi bi-chat-dots"></i>
        </a>
      </div>
    </div>
  );
};

export default Home; 