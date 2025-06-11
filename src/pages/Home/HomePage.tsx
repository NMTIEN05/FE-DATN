import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';
import './HomePage.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  
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

  const news = [
    {
      id: 1,
      title: 'So sánh iPhone 15 Pro Max vs Samsung S24 Ultra: Chọn siêu phẩm nào?',
      image: 'https://cdn.tgdd.vn/Files/2024/01/19/1583927/samsung-galaxy-s24-ultra-vs-iphone-15-pro-max-2-180124-022914.jpg',
      date: '19/03/2024'
    },
    {
      id: 2,
      title: 'OPPO Find X7 Ultra ra mắt: Camera đỉnh cao, sạc siêu nhanh',
      image: 'https://cdn.tgdd.vn/Files/2024/01/09/1582751/oppofindx7ultratongquan-090124-090310.jpg',
      date: '18/03/2024'
    },
    {
      id: 3,
      title: 'Xiaomi 14 Ultra về Việt Nam: Đối thủ đáng gờm trong phân khúc cao cấp',
      image: 'https://cdn.tgdd.vn/Files/2024/02/25/1587981/xiaomi14ultratongquan-250224-101426.jpg',
      date: '17/03/2024'
    }
  ];

  return (
    <main>
      {/* Banner Section */}
      <div className="banner-max">
        <div className="slide active">
          <img src="https://tse3.mm.bing.net/th?id=OIP.uWNPCIkfXZN39BeGHwtI9QHaEK&pid=Api&P=0&h=180" alt="Banner 1" />
        </div>
        <button className="prev" onClick={() => {}}>&#10094;</button>
        <button className="next" onClick={() => {}}>&#10095;</button>
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
              {products.map((product, index) => (
                <div key={index} onClick={() => navigate(`/products/${index + 1}`)}>
                  <ProductCard {...product} />
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
          {news.map((item) => (
            <div key={item.id} className="blog-card" onClick={() => navigate(`/news/${item.id}`)}>
              <div className="blog-image">
                <img src={item.image} alt={item.title} />
                <span className="blog-date">{item.date}</span>
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