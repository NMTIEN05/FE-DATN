// src/components/Home/FlashSaleSection.tsx
import React from 'react';

const FlashSaleSection: React.FC = () => {
  const fixedTime = '00:59:59';

  const products = [
    {
      id: 1,
      name: 'iPhone 15 Pro Max',
      price: '29.990.000₫',
      image: 'https://res.cloudinary.com/demo/image/upload/iphone15.jpg',
    },
    {
      id: 2,
      name: 'Samsung S24 Ultra',
      price: '26.990.000₫',
      image: 'https://res.cloudinary.com/demo/image/upload/s24ultra.jpg',
    },
    {
      id: 3,
      name: 'Xiaomi 14 Ultra',
      price: '18.990.000₫',
      image: 'https://res.cloudinary.com/demo/image/upload/xiaomi14.jpg',
    },
    {
      id: 4,
      name: 'Oppo Find X8',
      price: '16.490.000₫',
      image: 'https://res.cloudinary.com/demo/image/upload/findx8.jpg',
    },
  ];

  return (
    <section
      className="flash-sale-section"
      style={{
        marginTop: 40,
        border: '2px solid red',
        backgroundColor: '#fff5f5',
        borderRadius: 8,
        padding: 20,
        width: '100%',
        height: 'auto',
        boxSizing: 'border-box',
      }}
    >
      <div
        className="section-header"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <h2 className="section-title" style={{ fontSize: 24 }}>
          🔥 <span className="highlight">Flash</span> Sale
        </h2>
        <div
          className="countdown"
          style={{ fontSize: 18, color: '#ff4d4f', fontWeight: 'bold' }}
        >
          ⏰ Kết thúc sau: {fixedTime}
        </div>
      </div>

      <div
        className="flash-sale-products"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          marginTop: 24,
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: 8,
              padding: 12,
              backgroundColor: '#fff',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: 280,
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 4 }}
            />
            <h3 style={{ marginTop: 10, fontSize: 16 }}>{product.name}</h3>
            <p style={{ color: '#ff4d4f', fontWeight: 'bold', marginTop: 4 }}>{product.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FlashSaleSection;
