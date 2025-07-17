import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios.config';
import { toast } from 'react-toastify';
import './Checkout.css';

const Checkout: React.FC = () => {
  const { items, totalPrice, clearCart } = useCart();
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!shippingAddress || !fullName || !phone) {
      toast.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    try {
      const payload = {
        shippingAddress: `${fullName} - ${phone} - ${shippingAddress}`,
        paymentMethod,
        totalAmount: totalPrice,
        // ❌ Không gửi items vì BE không chấp nhận field này
      };

      const res = await axios.post('/orders', payload);
      toast.success('✅ Đặt hàng thành công!');
      clearCart();
      navigate(`/orders/${res.data._id}`);
    } catch (err: any) {
      console.error('Lỗi gửi đơn hàng:', err.response?.data);
      toast.error(err.response?.data?.message || '❌ Lỗi đặt hàng');
    }
  };

  return (
    <div className="checkout-page">
      <h2>Xác nhận đơn hàng</h2>

      <div className="checkout-content">
        <div className="checkout-left">
          <div className="checkout-form">
            <h3>Thông tin giao hàng</h3>
            <input
              type="text"
              placeholder="Họ tên người nhận"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Số điện thoại"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <textarea
              placeholder="Địa chỉ cụ thể"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
            />

            <h3>Phương thức thanh toán</h3>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="COD">Thanh toán khi nhận hàng</option>
              <option value="VNPay">VNPay</option>
              <option value="Stripe">Stripe</option>
              <option value="Momo">Momo</option>
            </select>
          </div>
        </div>

        <div className="checkout-right">
          <h3>Sản phẩm</h3>
          <div className="cart-items">
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

              return (
                <div className="cart-item" key={item._id}>
                  <img src={image} alt={name} className="cart-item-image" />
                  <div>
                    <p>{name}</p>
                    <small>
                      {item.quantity} x {price.toLocaleString('vi-VN')}₫
                    </small>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="total-price">
            <strong>Tổng tiền: </strong>
            <span>{totalPrice.toLocaleString('vi-VN')}₫</span>
          </div>

          <button className="checkout-btn" onClick={handleSubmit}>
            Đặt hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
