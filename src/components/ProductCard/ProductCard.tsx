import React from 'react';
import './ProductCard.css';
import { useNavigate } from 'react-router-dom';
import WishlistButton from '../common/WishlistButton';

interface ProductCardProps {
  name: string;
  image: string;
  price: string;
  slug?: string;
  productId?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, image, price, slug, productId }) => {
  const navigate = useNavigate();

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (slug) navigate(`/products/${slug}`);
  };

  return (
    <div className="product-card">
      <div className="product-image" style={{ position: 'relative' }}>
        <img src={image} alt={name} />
        <div style={{ position: 'absolute', top: 8, right: 8 }}>
          <WishlistButton productId={productId} />
        </div>
      </div>

      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        <div className="product-price">
          <span className="current-price">{price}</span>
        </div>
        <button className="buy-now-btn" onClick={handleBuyNow}>
          Mua ngay
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
