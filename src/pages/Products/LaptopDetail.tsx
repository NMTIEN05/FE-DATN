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
    cpu: string;
    ram: string;
    storage: string;
    screen: string;
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

const LaptopDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedStorage, setSelectedStorage] = useState<string>('');
  const detailRef = useRef<HTMLDivElement>(null);

  // Lấy thông tin sản phẩm laptop
  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ['laptop', slug],
    queryFn: async () => {
      const res = await axios.get(`/products?slug=${slug}&category_id=10`);
      return res.data[0];
    },
    enabled: !!slug
  });

  // Lấy variants của laptop
  const { data: variants } = useQuery<Variant[]>({
    queryKey: ['laptop-variants', product?.id],
    queryFn: async () => {
      if (!product?.id) throw new Error('Product ID not found');
      const response = await axios.get(`/product_variants?product_id=${product.id}`);
      return response.data;
    },
    enabled: !!product?.id
  });

  // Lấy các màu sắc và cấu hình có sẵn
  const availableColors = [...new Set(variants?.map(v => v.color) || [])];
  const availableStorage = [...new Set(variants?.map(v => v.storage) || [])];

  // Tìm variant theo storage (bất kỳ màu nào) để lấy giá
  const currentStorageVariant = variants?.find(
    v => v.storage === selectedStorage
  );

  // Tìm variant theo màu để lấy ảnh
  const currentColorVariant = variants?.find(
    v => v.color === selectedColor && v.storage === selectedStorage
  ) || variants?.find(v => v.color === selectedColor) || variants?.[0];

  // Xử lý chọn màu
  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  // Xử lý chọn cấu hình
  const handleStorageSelect = (storage: string) => {
    setSelectedStorage(storage);
  };

  const handleAddToCart = () => {
    if (!product || !currentStorageVariant) {
      toast.error('Vui lòng chọn cấu hình laptop');
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      image: currentColorVariant?.image_url || product.image_url,
      price: currentStorageVariant.price,
      quantity: 1,
      color: selectedColor,
      storage: selectedStorage
    });
    toast.success('Đã thêm laptop vào giỏ hàng');
  };

  const handleBuyNow = () => {
    if (!product || !currentStorageVariant) {
      toast.error('Vui lòng chọn cấu hình laptop');
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      image: currentColorVariant?.image_url || product.image_url,
      price: currentStorageVariant.price,
      quantity: 1,
      color: selectedColor,
      storage: selectedStorage
    });
    navigate('/cart');
  };

  useEffect(() => {
    // Set giá trị mặc định cho màu và cấu hình khi variants được tải
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
  if (!product) return <div>Không tìm thấy laptop</div>;

  return (
    <div className="product-detail" ref={detailRef}>
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
          <p className="subtitle">{product.specs?.cpu || 'Laptop hiệu năng cao cho công việc và giải trí'}</p>
          <div className="price">
            {(currentStorageVariant?.price || product.base_price).toLocaleString('vi-VN')}₫
          </div>

          {availableStorage.length > 0 && (
            <div className="variants">
              <h3>Lựa chọn cấu hình</h3>
              <div className="storage-options">
                {availableStorage.map(storage => (
                  <button
                    key={storage}
                    className={selectedStorage === storage ? 'active' : ''}
                    onClick={() => handleStorageSelect(storage)}
                  >
                    {storage}
                  </button>
                ))}
              </div>
            </div>
          )}

          {availableColors.length > 0 && (
            <div className="variants">
              <h3>Lựa chọn màu sắc</h3>
              <div className="color-options">
                {availableColors.map(color => (
                  <button
                    key={color}
                    className={selectedColor === color ? 'active' : ''}
                    onClick={() => handleColorSelect(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="actions">
            <button className="btn btn-primary" onClick={handleAddToCart}>Thêm vào giỏ hàng</button>
            <button className="btn btn-outline" onClick={handleBuyNow}>Mua ngay</button>
            <button className="btn btn-text" onClick={() => navigate(-1)}>Quay lại</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaptopDetail; 