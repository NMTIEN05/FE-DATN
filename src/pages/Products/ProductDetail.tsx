import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from '../../api/axios.config';
import './ProductDetail.css';

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  // Lấy thông tin sản phẩm theo slug
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const response = await axios.get(`/products?slug=${slug}`);
      return response.data[0];
    }
  });

  // Lấy variants của sản phẩm
  const { data: variants } = useQuery({
    queryKey: ['product-variants', product?.id],
    queryFn: async () => {
      const response = await axios.get(`/product_variants?product_id=${product.id}`);
      return response.data;
    },
    enabled: !!product?.id
  });

  // Lấy hình ảnh sản phẩm
  const { data: images } = useQuery({
    queryKey: ['product-images', product?.id],
    queryFn: async () => {
      const response = await axios.get(`/product_images?product_id=${product.id}`);
      return response.data;
    },
    enabled: !!product?.id
  });

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (!product) {
    return <div>Không tìm thấy sản phẩm</div>;
  }

  return (
    <div className="product-detail">
      <div className="product-images">
        <img 
          src={product.image_url} 
          alt={product.name} 
          className="main-image"
        />
        <div className="image-gallery">
          {images?.map((img: any) => (
            <img 
              key={img.id} 
              src={img.image_url} 
              alt={product.name} 
              className="thumbnail"
            />
          ))}
        </div>
      </div>

      <div className="product-info">
        <h1>{product.name}</h1>
        <p className="description">{product.description}</p>
        <div className="price">
          {product.base_price.toLocaleString('vi-VN')}₫
        </div>

        {variants && variants.length > 0 && (
          <div className="variants">
            <h3>Lựa chọn phiên bản</h3>
            <div className="variant-options">
              {variants.map((variant: any) => (
                <div key={variant.id} className="variant-item">
                  <span className="storage">{variant.storage}</span>
                  <span className="color">{variant.color}</span>
                  <span className="price">
                    {variant.price.toLocaleString('vi-VN')}₫
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button className="add-to-cart">
          Thêm vào giỏ hàng
        </button>
      </div>
    </div>
  );
};

export default ProductDetail; 