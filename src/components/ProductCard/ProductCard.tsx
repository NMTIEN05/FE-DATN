import React from 'react';
import './ProductCard.css';

interface ProductCardProps {
  name: string;
  image: string;
  price: string;
  slug?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, image, price, slug }) => {
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
      </div>
    </div>
  );
};

export default ProductCard; 