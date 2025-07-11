import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { FaTrash } from 'react-icons/fa';
import './Cart.css';

const Cart: React.FC = () => {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (itemId: string, type: 'increase' | 'decrease', current: number) => {
    const newQuantity = type === 'increase' ? current + 1 : Math.max(current - 1, 1);
    updateQuantity(itemId, newQuantity);
  };

  return (
    <div className="cart-page">
      <h2>🛒 Giỏ hàng của bạn</h2>

      {items.length === 0 ? (
        <p className="empty-cart">Giỏ hàng của bạn đang trống.</p>
      ) : (
        <>
          {items.map((item) => {
            const product = (item as any).productId;
            const variant = (item as any).variantId;

            const name = item.name || product?.title || 'Sản phẩm';
            const image =
              item.image ||
              variant?.imageUrl?.[0] ||
              product?.imageUrl?.[0] ||
              '/placeholder.jpg';

            const price = item.price || variant?.price || 0;

            const color =
              item.color ||
              variant?.attributes?.find((a: any) =>
                a.attributeId?.name?.toLowerCase().includes('màu')
              )?.attributeValueId?.value;

            const storage =
              item.storage ||
              variant?.attributes?.find((a: any) =>
                a.attributeId?.name?.toLowerCase().includes('dung lượng')
              )?.attributeValueId?.value;

            return (
              <div key={item._id} className="cart-item">
                <img src={image} alt={name} className="cart-item-image" />

                <div className="item-details">
                  <h3>{name}</h3>
                  {color && <p>Màu: {color}</p>}
                  {storage && <p>Dung lượng: {storage}</p>}
                  <p className="item-price">{price.toLocaleString('vi-VN')}₫</p>
                </div>

                <div className="item-actions">
                  <div className="quantity-control">
                    <button onClick={() => handleQuantityChange(item._id!, 'decrease', item.quantity)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item._id!, 'increase', item.quantity)}>+</button>
                  </div>
                  <button className="remove-btn" onClick={() => removeFromCart(item._id!)}>
                    <FaTrash />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="cart-summary">
            <h3>Tổng cộng: <span>{totalPrice.toLocaleString('vi-VN')}₫</span></h3>
            <button className="checkout-btn" onClick={() => navigate('/checkout')}>
              Thanh toán ngay
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
