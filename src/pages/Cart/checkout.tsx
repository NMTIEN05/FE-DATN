import React, { useState, useEffect } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios.config';
import { toast } from 'react-toastify';
import {
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaMoneyCheckAlt,
  FaBoxOpen,
  FaAngleDown,
} from 'react-icons/fa';
import './Checkout.css';

const Checkout: React.FC = () => {
  const { clearCart } = useCart();
  const { user, isLoggedIn } = useAuth();
  const [currentUser, setCurrentUser] = useState<any>(user);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Load selected items
  useEffect(() => {
    const selected = JSON.parse(localStorage.getItem('selectedCheckoutItems') || '[]');
    setSelectedItems(selected);
  }, []);

  // ✅ Tự động lấy lại user nếu không có
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token && !user) {
          const res = await axios.get('/user/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCurrentUser(res.data);
        } else {
          setCurrentUser(user);
        }
      } catch (err) {
        toast.error('Không thể lấy thông tin người dùng');
      }
    };
    fetchUser();
  }, [user]);

  // ✅ Tính tổng tiền an toàn
  const totalPrice = Array.isArray(selectedItems)
    ? selectedItems.reduce(
        (acc, item) => acc + (item.price || item.variantId?.price || 0) * item.quantity,
        0
      )
    : 0;

  const handleSubmit = async () => {
    if (!fullName || !phone || !address) {
      toast.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (!isLoggedIn || !currentUser?._id) {
      toast.error('Không tìm thấy người dùng');
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.error('Bạn chưa đăng nhập');
      return;
    }

    const payload = {
      userId: currentUser._id,
      shippingInfo: { fullName, phone, address },
      paymentMethod,
      totalAmount: totalPrice,
      items: selectedItems.map((item: any) => ({
        productId: item.productId?._id || item.productId,
        variantId: item.variantId?._id || item.variantId,
        quantity: item.quantity,
        price: item.price || item.variantId?.price || 0,
        name: item.name || item.productId?.title || 'Sản phẩm',
        image:
          item.image ||
          item.variantId?.imageUrl?.[0] ||
          item.productId?.imageUrl?.[0] ||
          '',
      })),
    };

    try {
      setLoading(true);
      const orderRes = await axios.post('/order', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const orderId = orderRes.data._id;

      if (paymentMethod === 'VNPay') {
        const paymentRes = await axios.get('/payment/create_payment', {
          params: { amount: totalPrice, orderId },
        });

        const paymentUrl = paymentRes.data.paymentUrl;
        window.location.href = paymentUrl;
        return;
      }

      toast.success('✅ Đặt hàng thành công!');
      clearCart();
      localStorage.removeItem('selectedCheckoutItems');
      navigate(`/orders/${orderId}`);
    } catch (err: any) {
      console.error('❌ Lỗi gửi đơn hàng:', err.response?.data || err);
      toast.error(err.response?.data?.message || '❌ Lỗi đặt hàng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <h2 className="checkout-title">
        <FaBoxOpen style={{ marginRight: 8 }} /> Xác nhận đơn hàng
      </h2>
      <div className="checkout-content">
        <div className="checkout-left">
          <div className="checkout-form">
            <h3>Thông tin giao hàng</h3>

            <div className="input-group">
              <FaUser />
              <input
                type="text"
                placeholder="Họ tên người nhận"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="input-group">
              <FaPhone />
              <input
                type="text"
                placeholder="Số điện thoại"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="input-group">
              <FaMapMarkerAlt />
              <textarea
                placeholder="Địa chỉ cụ thể"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="input-group select-wrapper">
              <FaMoneyCheckAlt className="icon" />
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="COD">Thanh toán khi nhận hàng</option>
                <option value="VNPay">Thanh toán VNPay</option>
                <option value="Stripe">Thanh toán Stripe</option>
                <option value="Momo">Thanh toán Momo</option>
              </select>
              <FaAngleDown className="select-arrow" />
            </div>
          </div>
        </div>

        <div className="checkout-right">
          <h3>Sản phẩm</h3>
          <div className="cart-items">
            {selectedItems?.length > 0 ? (
              selectedItems.map((item: any) => {
                const name = item.name || item.productId?.title || 'Sản phẩm';
                const image =
                  item.image ||
                  item.variantId?.imageUrl?.[0] ||
                  item.productId?.imageUrl?.[0] ||
                  '/placeholder.jpg';
                const price = item.price || item.variantId?.price || 0;

                return (
                  <div className="cart-item" key={item._id || item.variantId?._id}>
                    <img src={image} alt={name} className="cart-item-image" />
                    <div>
                      <p>{name}</p>
                      <small>
                        {item.quantity} x {price.toLocaleString('vi-VN')}₫
                      </small>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>Không có sản phẩm được chọn.</p>
            )}
          </div>

          <div className="total-price">
            <strong>Tổng tiền: </strong>
            <span>{totalPrice.toLocaleString('vi-VN')}₫</span>
          </div>

          <button className="checkout-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đặt hàng'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
