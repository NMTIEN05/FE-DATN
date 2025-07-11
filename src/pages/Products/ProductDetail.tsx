// ✅ UPDATED: ProductDetail.tsx - gọi đúng API addToCart thật từ context
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from '../../api/axios.config';
import { useCart } from '../../contexts/CartContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ProductDetail.css';

interface Product {
  _id: string;
  title: string;
  slug: string;
  imageUrl: string[] | string;
  description: string;
  priceDefault: number;
  categoryId: { _id: string; name: string };
}

interface RawVariant {
  _id: string;
  name: string;
  price: number;
  imageUrl: string[] | string;
  stock: number;
}

interface ProcessedVariant extends RawVariant {
  color: string;
  storage: string;
  image_url: string;
}

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [selectedColor, setSelectedColor] = useState('');
  const [selectedStorage, setSelectedStorage] = useState('');

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ['product', slug],
    queryFn: async () => {
      const res = await axios.get(`/products/slug/${slug}`);
      return res.data;
    },
    enabled: !!slug,
  });

  const { data: variantsRaw } = useQuery<RawVariant[]>({
    queryKey: ['variants', product?._id],
    queryFn: async () => {
      const res = await axios.get(`/products/${product?._id}/variant`);
      return res.data;
    },
    enabled: !!product?._id,
  });

  const processedVariants: ProcessedVariant[] =
    variantsRaw?.map((v) => {
      const colorMatch = v.name.match(/(đen|trắng|đỏ|xanh|vàng|tím|gold|silver|blue|black|red)/i);
      const storageMatch = v.name.match(/(128GB|256GB|512GB|64GB|1TB)/i);
      const color = colorMatch ? colorMatch[0] : 'Không rõ';
      const storage = storageMatch ? storageMatch[0] : 'Không rõ';
      return {
        ...v,
        color,
        storage,
        image_url: Array.isArray(v.imageUrl) ? v.imageUrl[0] : v.imageUrl,
      };
    }) || [];

  const availableColors = [...new Set(processedVariants.map((v) => v.color))];
  const availableStorage = [...new Set(processedVariants.map((v) => v.storage))];

  const currentVariant = processedVariants.find(
    (v) => v.color === selectedColor && v.storage === selectedStorage
  );

  const currentColorVariant = processedVariants.find((v) => v.color === selectedColor);

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    if (!selectedStorage && availableStorage.length > 0) {
      setSelectedStorage(availableStorage[0]);
    }
  };

  const handleStorageSelect = (storage: string) => {
    setSelectedStorage(storage);
    if (!selectedColor && availableColors.length > 0) {
      setSelectedColor(availableColors[0]);
    }
  };

  const handleAddToCart = async () => {
    if (!product || !currentVariant) {
      toast.error('Vui lòng chọn màu sắc và phiên bản');
      return;
    }
    if (currentVariant.stock === 0) {
      toast.error('Sản phẩm này đã hết hàng');
      return;
    }
    try {
      await addToCart({
        productId: product._id,
        variantId: currentVariant._id,
        name: product.title,
        price: currentVariant.price,
        quantity: 1,
        image: currentColorVariant?.image_url || '',
        color: selectedColor,
        storage: selectedStorage,
      });
      toast.success('Đã thêm vào giỏ hàng');
    } catch (err) {
      toast.error('Lỗi khi thêm vào giỏ');
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/cart');
  };

  useEffect(() => {
    if (processedVariants.length > 0) {
      if (!selectedStorage) setSelectedStorage(availableStorage[0]);
      if (!selectedColor) setSelectedColor(availableColors[0]);
    }
  }, [variantsRaw]);

  if (isLoading) return <div>Đang tải sản phẩm...</div>;
  if (!product) return <div>Không tìm thấy sản phẩm</div>;

  return (
    <div className="product-detail">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="product-content">
        <div className="product-images">
          <img
            src={
              currentColorVariant?.image_url ||
              (Array.isArray(product.imageUrl) ? product.imageUrl[0] : product.imageUrl)
            }
            alt={product.title}
            className="main-image"
          />
        </div>

        <div className="product-info">
          <h1>{product.title}</h1>
          <p className="subtitle">{product.description}</p>

          <div className="price">
            {(currentVariant?.price || product.priceDefault || 0).toLocaleString('vi-VN')}₫
          </div>

          {currentVariant && (
            <div
              className={`product-stock ${
                currentVariant?.stock === 0
                  ? 'out-of-stock'
                  : currentVariant?.stock <= 5
                  ? 'low-stock'
                  : 'in-stock'
              }`}
            >
              <span className="product-stock-icon">📦</span>
              {currentVariant?.stock === 0
                ? 'Hết hàng'
                : `Còn ${currentVariant?.stock} sản phẩm`}
            </div>
          )}

          {availableStorage.length > 0 && (
            <>
              <h4>Phiên bản</h4>
              <div className="storage-options">
                {availableStorage.map((s) => (
                  <button
                    key={s}
                    className={`storage-option ${s === selectedStorage ? 'active' : ''}`}
                    onClick={() => handleStorageSelect(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}

          {availableColors.length > 0 && (
            <>
              <h4>Màu sắc</h4>
              <div className="color-options">
                {availableColors.map((c) => (
                  <button
                    key={c}
                    className={`color-option ${c === selectedColor ? 'active' : ''}`}
                    onClick={() => handleColorSelect(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </>
          )}

          <button
            className="add-to-cart"
            disabled={!selectedColor || !selectedStorage || currentVariant?.stock === 0}
            onClick={handleAddToCart}
          >
            {currentVariant?.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
          </button>

          <button
            className="buy-now-btn"
            disabled={!selectedColor || !selectedStorage || currentVariant?.stock === 0}
            onClick={handleBuyNow}
          >
            Mua ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
