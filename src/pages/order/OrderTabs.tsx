import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from '../../api/axios.config';
import './OrderTabs.css';

const ORDER_TABS = [
  { key: 'pending', label: 'Chờ xác nhận' },
  { key: 'processing', label: 'Đang xử lý' },
  { key: 'ready_to_ship', label: 'Chờ lấy hàng' },
  { key: 'shipped', label: 'Chờ giao hàng' },
  { key: 'delivered', label: 'Đã giao' },
  { key: 'return_requested', label: 'Yêu cầu trả hàng' },
  { key: 'returned', label: 'Đã hoàn trả' },
  { key: 'cancelled', label: 'Đã hủy' },
];

const statusColors: Record<string, string> = {
  pending: 'text-yellow-600',
  processing: 'text-blue-600',
  ready_to_ship: 'text-purple-600',
  shipped: 'text-blue-500',
  delivered: 'text-green-600',
  return_requested: 'text-orange-600',
  returned: 'text-gray-600',
  cancelled: 'text-red-600',
};

const OrderTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pending');

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders', activeTab],
    queryFn: async () => {
      const res = await axios.get(`/orders/my-orders?status=${activeTab}`);
      return res.data;
    }
  });

  return (
    <div className="order-tabs-container">
      <div className="order-tabs">
        {ORDER_TABS.map(tab => (
          <button
            key={tab.key}
            className={`order-tab${activeTab === tab.key ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="order-list">
        {isLoading ? (
          <div>Đang tải...</div>
        ) : orders.length === 0 ? (
          <div className="empty-orders">
            <img src="/empty-orders.png" alt="empty" style={{width: 120, margin: '32px auto 16px'}} />
            <div>Bạn chưa có đơn hàng nào ở trạng thái này</div>
          </div>
        ) : (
          orders.map((order: any) => (
            <div key={order._id} className="order-item">
              <div className="order-header">
                <span className="order-id">Mã đơn: {order._id}</span>
                <span className={`order-status ${statusColors[order.status]}`}>{ORDER_TABS.find(t => t.key === order.status)?.label || order.status}</span>
              </div>
              <div className="order-info">
                <span>Ngày tạo: {new Date(order.createdAt).toLocaleString('vi-VN')}</span>
                <span>Tổng tiền: <b>{order.totalAmount.toLocaleString('vi-VN')}₫</b></span>
              </div>
              {/* Hiển thị danh sách sản phẩm trong đơn hàng */}
              <div className="order-products">
                {order.items && order.items.length > 0 ? order.items.map((item: any) => {
                  const product = item.productId;
                  const variant = item.variantId;
                  const name = variant?.name || product?.title || 'Sản phẩm';
                  const image = (variant?.imageUrl && variant.imageUrl[0]) || (product?.imageUrl && product.imageUrl[0]) || '/placeholder.jpg';
                  return (
                    <div key={item._id} className="order-product">
                      <img src={image} alt={name} className="order-product-img" />
                      <div>
                        <div>{name}</div>
                        <div>{item.quantity} x {item.price.toLocaleString('vi-VN')}₫</div>
                      </div>
                    </div>
                  );
                }) : <div>Không có sản phẩm</div>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderTabs; 