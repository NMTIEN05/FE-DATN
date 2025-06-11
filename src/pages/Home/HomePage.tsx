import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';
import { useProducts } from '../../hooks/useProducts';
import { useQuery } from '@tanstack/react-query';
import axios from '../../api/axios.config';
import './HomePage.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  
  // Lấy sản phẩm
  const { data: productsData, isLoading: isLoadingProducts } = useProducts({
    limit: 10,
    page: 1
  });

  // Lấy bài viết blog
  const { data: blogPosts, isLoading: isLoadingBlog } = useQuery({
    queryKey: ['blog_posts'],
    queryFn: async () => {
      const response = await axios.get('/blog_posts?status=published');
      return response.data;
    }
  });

  if (isLoadingProducts || isLoadingBlog) {
    return <div>Đang tải...</div>;
  }

  return (
    <main>
      {/* Hot Sale Section */}
      <div className="main-top">
        <div className="hot-sale-header">
          <h1>Sản phẩm nổi bật</h1>
          <p>Các sản phẩm được yêu thích nhất</p>
        </div>

        <div className="product-row">
          <div className="slider-container">
            <div className="container-product">
              {productsData?.products.map((product: any) => (
                <div key={product.id} onClick={() => navigate(`/products/${product.slug}`)}>
                  <ProductCard 
                    name={product.name}
                    image={product.image_url}
                    price={product.base_price.toLocaleString('vi-VN') + '₫'}
                    slug={product.slug}
                  />
                </div>
              ))}
            </div>
            <div className="button-see">
              <button className="showAllBtn" onClick={() => navigate('/products')}>
                Xem tất cả <i className="bi bi-chevron-down"></i>
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

      {/* Blog Posts Section */}
      <div className="main-button">
        <h2>Tin Công Nghệ Mới Nhất</h2>
        <div className="blog-grid">
          {blogPosts?.slice(0, 3).map((post: any) => (
            <div key={post.id} className="blog-card" onClick={() => navigate(`/blog/${post.slug}`)}>
              <div className="blog-image">
                <img src={post.thumbnail_url} alt={post.title} />
                <span className="blog-date">
                  {new Date(post.published_at).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <div className="blog-info">
                <h3 className="blog-title">{post.title}</h3>
              </div>
            </div>
          ))}
        </div>
        <div className="button-see">
          <button className="showAllBtn" onClick={() => navigate('/blog')}>Xem tất cả tin tức</button>
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