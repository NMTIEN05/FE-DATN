import React from 'react';
import './Promotion.css';

interface PromotionProps {
  promotions: {
    id: number;
    code: string;
    discount: string;
    description: string;
    expiry: string;
  }[];
}

const Promotion: React.FC<PromotionProps> = ({ promotions }) => {
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert('Đã sao chép mã giảm giá!');
  };

  return (
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
  );
};

export default Promotion; 