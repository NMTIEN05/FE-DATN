import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';
import { FaTrash, FaMinus, FaPlus, FaTruck, FaCreditCard, FaShieldAlt } from 'react-icons/fa';
import { useCart } from '../../contexts/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();

  const handleContinueShopping = () => {
    navigate('/products');
  };

  const handleCheckout = () => {
    navigate('/shipping');
  };

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title">Giỏ hàng của bạn</h1>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            {items.length > 0 ? (
              <>
                {items.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="item-details">
                      <h3>{item.name}</h3>
                      <div className="item-meta">
                        <span>Màu: {item.color}</span>
                        <span>Bộ nhớ: {item.storage}</span>
                      </div>
                      <div className="item-price">
                        {item.price.toLocaleString('vi-VN')}₫
                      </div>
                    </div>
                    <div className="item-quantity">
                      <button
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity === 1}
                      >
                        <FaMinus />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <FaPlus />
                      </button>
                    </div>
                    <div className="item-total">
                      {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}

                {/* Cart Features */}
                <div className="cart-features">
                  <div className="feature">
                    <FaTruck className="feature-icon" />
                    <div className="feature-text">
                      <h4>Miễn phí vận chuyển</h4>
                      <p>Cho đơn hàng từ 500.000₫</p>
                    </div>
                  </div>
                  <div className="feature">
                    <FaCreditCard className="feature-icon" />
                    <div className="feature-text">
                      <h4>Thanh toán an toàn</h4>
                      <p>Bảo mật thông tin</p>
                    </div>
                  </div>
                  <div className="feature">
                    <FaShieldAlt className="feature-icon" />
                    <div className="feature-text">
                      <h4>Bảo hành 12 tháng</h4>
                      <p>Đổi trả miễn phí</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="empty-cart">
                <h2>Giỏ hàng trống</h2>
                <p>Hãy thêm sản phẩm vào giỏ hàng của bạn</p>
                <button 
                  className="btn btn-primary"
                  onClick={handleContinueShopping}
                >
                  Tiếp tục mua sắm
                </button>
              </div>
            )}
          </div>

          {/* Cart Summary */}
          {items.length > 0 && (
            <div className="cart-summary">
              <h2>Tổng giỏ hàng</h2>
              <div className="summary-row">
                <span>Tạm tính ({totalItems} sản phẩm)</span>
                <span>{totalPrice.toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="summary-row">
                <span>Phí vận chuyển</span>
                <span>Miễn phí</span>
              </div>
              <div className="summary-row total">
                <span>Tổng cộng</span>
                <span>{totalPrice.toLocaleString('vi-VN')}₫</span>
              </div>
              <button 
                className="btn btn-primary checkout-btn"
                onClick={handleCheckout}
              >
                Tiến hành thanh toán
              </button>
              <div className="summary-footer">
                <p>Chúng tôi chấp nhận thanh toán</p>
                <div className="payment-methods">
                  {/* Add payment method icons here */}
                  <img src="https://via.placeholder.com/50" alt="Visa" />
                  <img src="https://via.placeholder.com/50" alt="Mastercard" />
                  <img src="https://via.placeholder.com/50" alt="PayPal" />
                  <img src="https://via.placeholder.com/50" alt="Momo" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart; 