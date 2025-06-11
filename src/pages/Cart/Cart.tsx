import React, { useState } from 'react';
import './Cart.css';
import { FaTrash, FaMinus, FaPlus, FaTruck, FaCreditCard, FaShieldAlt } from 'react-icons/fa';

const Cart = () => {
  // Sample cart items data
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'iPhone 15 Pro Max',
      image: 'https://via.placeholder.com/100',
      price: 27990000,
      quantity: 1,
      color: 'Titan Tự nhiên',
      storage: '256GB',
    },
    {
      id: 2,
      name: 'Samsung Galaxy S24 Ultra',
      image: 'https://via.placeholder.com/100',
      price: 25990000,
      quantity: 1,
      color: 'Titan Đen',
      storage: '256GB',
    },
  ]);

  const updateQuantity = (id: number, change: number) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title">Giỏ hàng của bạn</h1>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            {cartItems.length > 0 ? (
              <>
                {cartItems.map((item) => (
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
                        onClick={() => updateQuantity(item.id, -1)}
                        disabled={item.quantity === 1}
                      >
                        <FaMinus />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <FaPlus />
                      </button>
                    </div>
                    <div className="item-total">
                      {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => removeItem(item.id)}
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
                <button className="btn btn-primary">Tiếp tục mua sắm</button>
              </div>
            )}
          </div>

          {/* Cart Summary */}
          {cartItems.length > 0 && (
            <div className="cart-summary">
              <h2>Tổng giỏ hàng</h2>
              <div className="summary-row">
                <span>Tạm tính</span>
                <span>{subtotal.toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="summary-row">
                <span>Phí vận chuyển</span>
                <span>{shipping === 0 ? 'Miễn phí' : shipping.toLocaleString('vi-VN') + '₫'}</span>
              </div>
              <div className="summary-row total">
                <span>Tổng cộng</span>
                <span>{total.toLocaleString('vi-VN')}₫</span>
              </div>
              <button className="btn btn-primary checkout-btn">
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