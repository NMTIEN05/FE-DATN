import React, { useState, useEffect } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios.config';
import { toast } from 'react-toastify';
import './Checkout.css';

const Checkout: React.FC = () => {
  const { items, totalPrice, clearCart } = useCart();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  // ✅ Lấy userId từ localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?._id) setUserId(user._id);
  }, []);

const handleSubmit = async () => {
  if (!fullName || !phone || !address) {
    toast.error('Vui lòng nhập đầy đủ thông tin');
    return;
  }

  if (!userId) {
    toast.error('Không tìm thấy người dùng');
    return;
  }

  const payload = {
    userId,
    shippingInfo: { fullName, phone, address },
    paymentMethod,
    totalAmount: totalPrice,
    items: items.map((item: any) => ({
      productId: item.productId?._id || item.productId,
      variantId: item.variantId?._id || item.variantId,
      quantity: item.quantity,
      price: item.price || item.variantId?.price || 0,
      name: item.name || item.productId?.title,
      image:
        item.image ||
        item.variantId?.imageUrl?.[0] ||
        item.productId?.imageUrl?.[0] ||
        '',
    })),
  };

  console.log('📦 Payload gửi lên:', payload);

  try {
    // 🟢 Tạo đơn hàng trước
    const orderRes = await axios.post('/orders', payload);
    const orderId = orderRes.data._id;

    if (paymentMethod === 'VNPay') {
      // 🟢 Gọi API tạo URL thanh toán với đúng orderId
      const paymentRes = await axios.get('/payment/create_payment', {
        params: {
          amount: totalPrice,
          orderId, // ✅ Bắt buộc phải có
        },
      });

      const paymentUrl = paymentRes.data.paymentUrl;

      // 🟢 Chuyển hướng sang trang thanh toán VNPay
      window.location.href = paymentUrl;
      return; // ❌ Không chạy tiếp nữa
    }

    // ✅ Nếu không phải VNPay thì xử lý đơn hàng luôn
    toast.success('✅ Đặt hàng thành công!');
    clearCart();
    navigate(`/orders/${orderId}`);
  } catch (err: any) {
    console.error('❌ Lỗi gửi đơn hàng:', err.response?.data || err);
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
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <h3>Phương thức thanh toán</h3>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="COD">Thanh toán khi nhận hàng</option>
              <option value="VNPay">Thanh toán VNPay</option>
              <option value="Stripe">Thanh toán Stripe</option>
              <option value="Momo">Thanh toán Momo</option>
            </select>
          </div>
        </div>

        <div className="checkout-right">
          <h3>Sản phẩm</h3>
          <div className="cart-items">
            {items.map((item: any) => {
              const name = item.name || item.productId?.title || 'Sản phẩm';
              const image =
                item.image ||
                item.variantId?.imageUrl?.[0] ||
                item.productId?.imageUrl?.[0] ||
                '/placeholder.jpg';
              const price = item.price || item.variantId?.price || 0;

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
