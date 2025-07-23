import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../api/axios.config';
import './OrderDetail.css';

const statusColors: Record<string, string> = {
  pending: 'text-yellow-600',
  confirmed: 'text-blue-600',
  shipping: 'text-purple-600',
  delivered: 'text-green-600',
  cancelled: 'text-red-600',
};

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orderRes, itemRes] = await Promise.all([
          axios.get(`/orders/${id}`),
          axios.get(`/orderitem/order/${id}`)
        ]);
        setOrder(orderRes.data);
        setItems(itemRes.data);
      } catch (err) {
        console.error('❌ Lỗi khi tải chi tiết đơn hàng:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (loading) return <div>Đang tải đơn hàng...</div>;
  if (!order) return <div>Không tìm thấy đơn hàng</div>;

  const { shippingInfo, paymentMethod, status, totalAmount, createdAt } = order;

  return (
    <div className="order-detail-page">
      <h2>Chi tiết đơn hàng</h2>

      <div className="order-info">
        <p><strong>Mã đơn:</strong> {order._id}</p>
        <p><strong>Ngày tạo:</strong> {new Date(createdAt).toLocaleString('vi-VN')}</p>
        <p>
          <strong>Trạng thái:</strong>{' '}
          <span className={statusColors[status]}>{status}</span>
        </p>
        <p><strong>Phương thức thanh toán:</strong> {paymentMethod}</p>
        <p><strong>Người nhận:</strong> {shippingInfo?.fullName}</p>
        <p><strong>SĐT:</strong> {shippingInfo?.phone}</p>
        <p><strong>Địa chỉ:</strong> {shippingInfo?.address}</p>
      </div>

      <div className="order-items">
        <h3>Sản phẩm</h3>
        {items.length === 0 ? (
          <p>Không có sản phẩm</p>
        ) : (
          items.map((item, index) => {
            const variant =
              typeof item.variantId === 'object' && item.variantId !== null
                ? item.variantId
                : null;
            const product =
              typeof item.productId === 'object' && item.productId !== null
                ? item.productId
                : null;

            const name =
              variant?.name || product?.title || 'Sản phẩm không rõ';

            const getFirstImage = (imgField: any) => {
              if (!imgField) return null;
              if (Array.isArray(imgField) && imgField.length > 0) return imgField[0];
              if (typeof imgField === 'string') return imgField;
              return null;
            };

            const image =
              getFirstImage(variant?.imageUrl) ||
              getFirstImage(product?.imageUrl) ||
              '/placeholder.jpg';

            const price = item.price || variant?.price || 0;

            return (
              <div key={index} className="order-item">
                <img src={image} alt={name} className="order-item-image" />
                <div>
                  <p>{name}</p>
                  <small>
                    {item.quantity} x {price.toLocaleString('vi-VN')}₫
                  </small>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="order-total">
        <strong>Tổng cộng: </strong>
        <span>{totalAmount.toLocaleString('vi-VN')}₫</span>
      </div>
    </div>
  );
};

export default OrderDetail;