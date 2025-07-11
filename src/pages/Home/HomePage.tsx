import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import ProductCard from '../../components/ProductCard/ProductCard';
import { useProducts } from '../../hooks/useProducts';
import { useQuery } from '@tanstack/react-query';
import axios from '../../api/axios.config';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './HomePage.css';

const banners = [
  {
    id: 1,
    image: 'https://i.pinimg.com/736x/5a/7e/90/5a7e903fa4d36808abddba1d331a4a34.jpg',
    link: 'https://i.pinimg.com/736x/ac/a6/cd/aca6cdbfd7bacf9da83fec4d6230dae8.jpg',
    title: 'iPhone 15 Pro Max'
  },
  {
    id: 2,
    image: 'https://i.pinimg.com/736x/0b/a9/43/0ba943ea32ac6f8450ad1cae3de07b18.jpg',
    link: '/products/samsung-s24-ultra',
    title: 'Samsung S24 Ultra'
  },
  {
    id: 3,
    image: 'https://i.pinimg.com/736x/33/3f/b1/333fb13a2a0e48edc138b24b18af9b28.jpg',
    link: '/products/xiaomi-14-ultra',
    title: 'Xiaomi 14 Ultra'
  }
];

const promotions = [
  {
    id: 1,
    code: 'WELCOME2024',
    discount: 'Giảm 500.000₫',
    description: 'Áp dụng cho đơn hàng từ 5.000.000₫',
    expiry: '31/03/2024'
  },
  {
    id: 2,
    code: 'NEWPHONE',
    discount: 'Giảm 1.000.000₫',
    description: 'Áp dụng cho iPhone 15 Series',
    expiry: '31/03/2024'
  },
  {
    id: 3,
    code: 'SAMSUNG24',
    discount: 'Giảm 2.000.000₫',
    description: 'Áp dụng cho Samsung S24 Series',
    expiry: '31/03/2024'
  }
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // Sản phẩm nổi bật
  const { data: productsData, isLoading: isLoadingProducts } = useProducts({ limit: 10, page: 1 });

  // Sản phẩm iPhone
  const { data: iphoneProductsData, isLoading: isLoadingIphoneProducts } = useProducts({ limit: 20, page: 1 });
  const iphoneList = iphoneProductsData?.products.filter((product: any) =>
    product?.name?.toLowerCase?.().includes('iphone')
  );

  // Sản phẩm Samsung
  const { data: samsungProductsData, isLoading: isLoadingSamsungProducts } = useProducts({ limit: 20, page: 1 });
  const samsungList = samsungProductsData?.products.filter((product: any) =>
    product?.name?.toLowerCase?.().includes('samsung')
  );

  // Blog
  const { data: blogPosts, isLoading: isLoadingBlog } = useQuery({
    queryKey: ['blog_posts'],
    queryFn: async () => {
      const response = await axios.get('/blog_posts?status=published');
      return response.data;
    }
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert('Đã sao chép mã giảm giá!');
  };

  if (
    isLoadingProducts ||
    isLoadingIphoneProducts ||
    isLoadingSamsungProducts ||
    isLoadingBlog
  ) {
    return <div>Đang tải...</div>;
  }

  return (
    <main className="home-page">
      {/* Banner */}
      <div className="banner-container">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={true}
          className="main-banner"
        >
          {banners.map((banner) => (
            <SwiperSlide key={banner.id}>
              <a href={banner.link} className="banner-link">
                <img src={banner.image} alt={banner.title} className="banner-image" />
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Promotions */}
      <div className="promotions-container">
        <h2 className="promotions-title">
          <span className="highlight">Mã giảm giá</span> hôm nay
        </h2>
        <div className="promotions-grid">
          {promotions.map((promo) => (
            <div key={promo.id} className="promotion-card">
              <div className="promotion-content">
                <div className="promotion-header">
                  <div className="discount">{promo.discount}</div>
                  <div className="code" onClick={() => handleCopyCode(promo.code)}>
                    {promo.code}
                    <span className="copy-hint">Nhấn để sao chép</span>
                  </div>
                </div>
                <p className="description">{promo.description}</p>
                <div className="expiry">HSD: {promo.expiry}</div>
              </div>
              <div className="promotion-border-dashed"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Sản phẩm nổi bật */}
      <div className="products-section">
        <div className="section-header">
          <h2 className="section-title">
            <span className="highlight">Sản phẩm</span> nổi bật
          </h2>
          <a href="/products" className="view-all">Xem tất cả</a>
        </div>
        <div className="products-grid">
          {productsData?.products?.map((product: any) => (
            <div key={product._id} onClick={() => navigate(`/products/${product.slug}`)}>
              <ProductCard
                name={product.title}
                image={product.imageUrl?.[0]}
                price={product.priceDefault?.toLocaleString('vi-VN') + '₫'}
                slug={product.slug}
              />
            </div>
          ))}
        </div>
      </div>

      {/* iPhone bán chạy */}
      <div className="products-section">
        <div className="section-header">
          <h2 className="section-title">
            <span className="highlight">iPhone</span> bán chạy
          </h2>
          <a href="/products?brand=Apple" className="view-all">Xem tất cả</a>
        </div>
        <div className="products-grid">
          {iphoneList?.length === 0 && <div>Không có sản phẩm iPhone nào.</div>}
          {iphoneList?.map((product: any) => (
            <div key={product.id} onClick={() => navigate(`/products/${product.slug}`)}>
              <ProductCard
                name={product.name}
                image={product.image_url}
                price={product.base_price?.toLocaleString('vi-VN') + '₫'}
                slug={product.slug}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Samsung bán chạy */}
      <div className="products-section">
        <div className="section-header">
          <h2 className="section-title">
            <span className="highlight">Samsung</span> bán chạy
          </h2>
          <a href="/products?brand=Samsung" className="view-all">Xem tất cả</a>
        </div>
        <div className="products-grid">
          {samsungList?.length === 0 && <div>Không có sản phẩm Samsung nào.</div>}
          {samsungList?.map((product: any) => (
            <div key={product.id} onClick={() => navigate(`/products/${product.slug}`)}>
              <ProductCard
                name={product.name}
                image={product.image_url}
                price={product.base_price?.toLocaleString('vi-VN') + '₫'}
                slug={product.slug}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Lọc theo giá */}
      <div className="filter-section">
        <h2 className="section-title">Giá bạn mong muốn</h2>
        <div className="price-filter">
          <div className="price-btn active" onClick={() => navigate('/products?price=0-2000000')}>Dưới 2 triệu</div>
          <div className="price-btn" onClick={() => navigate('/products?price=2000000-4000000')}>2 - 4 triệu</div>
          <div className="price-btn" onClick={() => navigate('/products?price=4000000-7000000')}>4 - 7 triệu</div>
          <div className="price-btn" onClick={() => navigate('/products?price=7000000-13000000')}>7 - 13 triệu</div>
          <div className="price-btn" onClick={() => navigate('/products?price=13000000-20000000')}>13 - 20 triệu</div>
          <div className="price-btn" onClick={() => navigate('/products?price=20000000-999999999')}>Trên 20 triệu</div>
        </div>
      </div>

      {/* Tin tức công nghệ */}
      <div className="blog-section">
        <div className="section-header">
          <h2 className="section-title">
            <span className="highlight">Tin tức</span> công nghệ
          </h2>
          <button onClick={() => navigate('/blog')} className="view-all">Xem tất cả</button>
        </div>
        <div className="blog-grid">
          {Array.isArray(blogPosts) && blogPosts.map((post: any) => (
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
      </div>

      {/* Chat Support */}
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
