import React from 'react';
import './ProductCard.css';

interface ProductCardProps {
  name: string;
  image: string;
  oldPrice: string;
  salePrice: string;
  promoAmount: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, image, oldPrice, salePrice, promoAmount }) => {
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={image} alt={name} />
        <div className="sale-tag">SALE</div>
      </div>
      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        <div className="product-price">
          <div className="old-price">{oldPrice}</div>
          <div className="sale-price">{salePrice}</div>
        </div>
        <div className="promotion">
          <div className="vnpay-promo">
            <img
              className="vnpay-logo"
              src="https://tse2.mm.bing.net/th?id=OIP.pn3RUm1xk1HiAxWIgC6CIwHaHa&pid=Api&P=0&h=180"
              alt="VNPAY"
            />
            <span className="vnpay-text">Giảm thêm {promoAmount}</span>
          </div>
          <p>Áp dụng khi thanh toán qua VNPAY</p>
        </div>
        <div className="installment">
          <span>Trả góp 0%</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 