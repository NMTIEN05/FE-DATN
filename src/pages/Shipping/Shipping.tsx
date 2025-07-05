import React, { useState } from 'react';
import './Shipping.css';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import {
  FaTruck,
  FaMapMarkerAlt,
  FaCreditCard,
  FaMoneyBill,
  FaShieldAlt,
  FaClock,
  FaCheckCircle,
} from 'react-icons/fa';

const Shipping = () => {
  const navigate = useNavigate();
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const [selectedPayment, setSelectedPayment] = useState('cod');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Xử lý đặt hàng thành công
    clearCart();
    navigate('/');
    // Có thể thêm thông báo đặt hàng thành công
  };

  // Nếu không có sản phẩm trong giỏ hàng, chuyển về trang giỏ hàng
  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="shipping-page">
      <div className="container">
        <h1 className="page-title">Thông tin giao hàng</h1>

        <div className="shipping-layout">
          {/* Shipping Form */}
          <div className="shipping-form">
            <form onSubmit={handleSubmit}>
              {/* Personal Information */}
              <div className="form-section">
                <h2>Thông tin cá nhân</h2>
                <div className="form-group">
                  <label htmlFor="name">Họ và tên</label>
                  <input type="text" id="name" placeholder="Nhập họ và tên của bạn" required />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" placeholder="Nhập email của bạn" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Số điện thoại</label>
                    <input type="tel" id="phone" placeholder="Nhập số điện thoại của bạn" required />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="form-section">
                <h2>Địa chỉ giao hàng</h2>
                <div className="form-group">
                  <label htmlFor="address">Địa chỉ</label>
                  <input type="text" id="address" placeholder="Nhập địa chỉ của bạn" required />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">Tỉnh/Thành phố</label>
                    <select id="city" required>
                      <option value="">Chọn tỉnh/thành phố</option>
                      <option value="hcm">TP. Hồ Chí Minh</option>
                      <option value="hn">Hà Nội</option>
                      {/* Add more cities */}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="district">Quận/Huyện</label>
                    <select id="district" required>
                      <option value="">Chọn quận/huyện</option>
                      {/* Add districts */}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="ward">Phường/Xã</label>
                  <select id="ward" required>
                    <option value="">Chọn phường/xã</option>
                    {/* Add wards */}
                  </select>
                </div>
              </div>

              {/* Payment Method */}
              <div className="form-section">
                <h2>Phương thức thanh toán</h2>
                <div className="payment-methods">
                  <label className="payment-method">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={selectedPayment === 'cod'}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                    />
                    <div className="method-content">
                      <FaMoneyBill className="method-icon" />
                      <div className="method-info">
                        <h3>Thanh toán khi nhận hàng (COD)</h3>
                        <p>Thanh toán bằng tiền mặt khi nhận hàng</p>
                      </div>
                    </div>
                  </label>

                  <label className="payment-method">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={selectedPayment === 'card'}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                    />
                    <div className="method-content">
                      <FaCreditCard className="method-icon" />
                      <div className="method-info">
                        <h3>Thanh toán bằng thẻ</h3>
                        <p>Thanh toán an toàn với thẻ tín dụng/ghi nợ</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <button type="submit" className="btn btn-primary submit-btn">
                Xác nhận đặt hàng
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <h2>Đơn hàng của bạn</h2>

            {/* Order Items */}
            <div className="order-items">
              {items.map((item) => (
                <div key={item.id} className="order-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p>{item.color} - {item.storage}</p>
                    <div className="item-price">
                      <span>{item.price.toLocaleString('vi-VN')}₫</span>
                      <span className="quantity">x{item.quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Total */}
            <div className="order-total">
              <div className="total-row">
                <span>Tạm tính ({totalItems} sản phẩm)</span>
                <span>{totalPrice.toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="total-row">
                <span>Phí vận chuyển</span>
                <span>Miễn phí</span>
              </div>
              <div className="total-row final">
                <span>Tổng cộng</span>
                <span>{totalPrice.toLocaleString('vi-VN')}₫</span>
              </div>
            </div>

            {/* Shipping Features */}
            <div className="shipping-features">
              <div className="feature">
                <FaTruck className="feature-icon" />
                <span>Giao hàng miễn phí</span>
              </div>
              <div className="feature">
                <FaClock className="feature-icon" />
                <span>Giao hàng trong 24h</span>
              </div>
              <div className="feature">
                <FaShieldAlt className="feature-icon" />
                <span>Bảo hành 12 tháng</span>
              </div>
              <div className="feature">
                <FaCheckCircle className="feature-icon" />
                <span>Đổi trả trong 15 ngày</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping; 