import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from '../../api/axios.config';
import { useCart } from '../../contexts/CartContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ProductDetail.css';

interface Product {
  id: number;
  name: string;
  description: string;
  base_price: number;
  image_url: string;
  category_id: number;
  slug: string;
  specs?: {
    chip: string;
    screen: string;
    ram: string;
    battery: string;
  };
}

interface Variant {
  id: number;
  storage: string;
  color: string;
  price: number;
  image_url: string;
}

interface RelatedProductCard extends Product {
  variants: Variant[];
}

const ProductDetail: React.FC = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedStorage, setSelectedStorage] = useState<string>('');
  const productDetailRef = useRef<HTMLDivElement>(null);

  // Lấy thông tin sản phẩm theo slug
  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ['product', slug],
    queryFn: async () => {
      const response = await axios.get(`/products?slug=${slug}`);
      return response.data[0];
    }
  });

  // Lấy variants của sản phẩm
  const { data: variants } = useQuery<Variant[]>({
    queryKey: ['product-variants', product?.id],
    queryFn: async () => {
      if (!product?.id) throw new Error('Product ID not found');
      const response = await axios.get(`/product_variants?product_id=${product.id}`);
      return response.data;
    },
    enabled: !!product?.id
  });

  // Lấy sản phẩm liên quan và variants của chúng
  const { data: relatedProducts } = useQuery<RelatedProductCard[]>({
    queryKey: ['related-products', product?.category_id],
    queryFn: async () => {
      if (!product?.category_id) throw new Error('Category ID not found');
      const response = await axios.get(`/products?category_id=${product.category_id}&id_ne=${product.id}&_limit=4`);
      const products = response.data;

      const productsWithVariants = await Promise.all(
        products.map(async (prod: Product) => {
          const variantsResponse = await axios.get(`/product_variants?product_id=${prod.id}`);
          return {
            ...prod,
            variants: variantsResponse.data
          };
        })
      );

      return productsWithVariants;
    },
    enabled: !!product?.category_id
  });

  // Lấy ra các màu sắc và dung lượng có sẵn
  const availableColors = [...new Set(variants?.map(v => v.color) || [])];
  const availableStorage = [...new Set(variants?.map(v => v.storage) || [])];

  // Tìm variant được chọn dựa trên màu và dung lượng
  const currentVariant = variants?.find(
    v => v.color === selectedColor && v.storage === selectedStorage
  );

  // Tìm variant theo màu để lấy ảnh
  const currentColorVariant = variants?.find(
    v => v.color === selectedColor
  ); 

  // Xử lý khi chọn màu
  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    if (!selectedStorage && availableStorage.length > 0) {
      setSelectedStorage(availableStorage[0]);
    }
  };

  // Xử lý khi chọn dung lượng
  const handleStorageSelect = (storage: string) => {
    setSelectedStorage(storage);
    if (!selectedColor && availableColors.length > 0) {
      setSelectedColor(availableColors[0]);
    }
  };

  const handleProductClick = (productSlug: string) => {
    navigate(`/products/${productSlug}`);
    // Scroll to top khi chọn sản phẩm mới
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = () => {
    if (!product || !currentVariant) {
      toast.error('Vui lòng chọn phiên bản và màu sắc sản phẩm');
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      image: currentColorVariant?.image_url || product.image_url,
      price: currentVariant.price,
      quantity: 1,
      color: selectedColor,
      storage: selectedStorage
    });
    toast.success('Đã thêm sản phẩm vào giỏ hàng');
  };

  const handleBuyNow = () => {
    if (!product || !currentVariant) {
      toast.error('Vui lòng chọn phiên bản và màu sắc sản phẩm');
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      image: currentColorVariant?.image_url || product.image_url,
      price: currentVariant.price,
      quantity: 1,
      color: selectedColor,
      storage: selectedStorage
    });
    navigate('/cart');
  };

  useEffect(() => {
    // Set giá trị mặc định cho màu và dung lượng khi variants được tải
    if (variants && variants.length > 0) {
      if (!selectedStorage && availableStorage.length > 0) {
        setSelectedStorage(availableStorage[0]);
      }
      if (!selectedColor && availableColors.length > 0) {
        setSelectedColor(availableColors[0]);
      }
    }
  }, [variants]);

  if (isLoading) return <div>Đang tải...</div>;
  if (!product) return <div>Không tìm thấy sản phẩm</div>;

  return (
    <div className="product-detail" ref={productDetailRef}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="product-content">
        <div className="product-images">
          <img 
            src={currentColorVariant?.image_url || product.image_url} 
            alt={product.name} 
            className="main-image"
          />
        </div>

        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="subtitle">{product.specs?.chip || 'iPhone 15 Pro Max với chip A17 Pro mạnh mẽ'}</p>
          
          <div className="price">
            {(currentVariant?.price || product.base_price).toLocaleString('vi-VN')}₫
          </div>

          {availableStorage.length > 0 && (
            <div className="variants">
              <h3>Lựa chọn phiên bản</h3>
              <div className="storage-options">
                {availableStorage.map(storage => (
                  <button
                    key={storage}
                    className={`storage-option ${selectedStorage === storage ? 'active' : ''}`}
                    onClick={() => handleStorageSelect(storage)}
                  >
                    {storage}
                  </button>
                ))}
              </div>
            </div>
          )}

          {availableColors.length > 0 && (
            <div className="color-options">
              <h3>Màu sắc</h3>
              <div className="color-buttons">
                {availableColors.map(color => (
                  <button
                    key={color}
                    className={`color-button ${selectedColor === color ? 'active' : ''}`}
                    onClick={() => handleColorSelect(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button 
            className={`add-to-cart ${(!selectedColor || !selectedStorage) ? 'disabled' : ''}`}
            onClick={handleAddToCart}
            disabled={!selectedColor || !selectedStorage}
          >
            Thêm vào giỏ hàng
          </button>
          <button 
            className={`buy-now-btn ${(!selectedColor || !selectedStorage) ? 'disabled' : ''}`}
            onClick={handleBuyNow}
            disabled={!selectedColor || !selectedStorage}
          >
            Mua ngay
          </button>

          {product.specs && (
            <div className="product-specs">
              <h3>Thông số kỹ thuật</h3>
              <div className="specs-list">
                <div className="spec-item">
                  <span className="spec-label">Chip:</span>
                  <span className="spec-value">{product.specs.chip}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Màn hình:</span>
                  <span className="spec-value">{product.specs.screen}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">RAM:</span>
                  <span className="spec-value">{product.specs.ram}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Pin:</span>
                  <span className="spec-value">{product.specs.battery}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {relatedProducts && relatedProducts.length > 0 && (
        <div className="related-products">
          <h2>Sản phẩm liên quan</h2>
          <div className="related-products-grid">
            {relatedProducts.map(relatedProduct => {
              const availableColors = [...new Set(relatedProduct.variants?.map(v => v.color) || [])];
              const availableStorage = [...new Set(relatedProduct.variants?.map(v => v.storage) || [])];
              
              return (
                <div key={relatedProduct.id} className="related-product-card" onClick={() => handleProductClick(relatedProduct.slug)}>
                  <img src={relatedProduct.image_url} alt={relatedProduct.name} />
                  <h3>{relatedProduct.name}</h3>
                  <p className="price">{relatedProduct.base_price.toLocaleString('vi-VN')}₫</p>
                  
                  {availableStorage.length > 0 && (
                    <div className="related-product-variants">
                      <div className="storage-chips">
                        {availableStorage.map(storage => (
                          <span key={storage} className="chip">
                            {storage}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {availableColors.length > 0 && (
                    <div className="related-product-colors">
                      <div className="color-chips">
                        {availableColors.map(color => (
                          <span key={color} className="chip">
                            {color}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail; 