import React from 'react';
import './ProductCard.css';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  name: string;
  image: string;
  price: string;
  slug?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, image, price, slug }) => {
  const navigate = useNavigate();
  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (slug) navigate(`/products/${slug}`);
  };
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={image} alt={name} />
      </div>
      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        <div className="product-price">
          <span className="current-price">{price}</span>
        </div>
        <button className="buy-now-btn" onClick={handleBuyNow}>Mua ngay</button>
      </div>
    </div>
  );
};

export default ProductCard; 