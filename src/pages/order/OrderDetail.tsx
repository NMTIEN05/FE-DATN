import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from '../../api/axios.config';
import { Button, Modal, Form, Input, message } from 'antd';
import { toast } from 'react-toastify';

const statusLabels: Record<string, string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  shipping: 'Đang giao hàng',
  delivered: 'Đã giao hàng',
  cancelled: 'Đã hủy',
  processing: 'Đang xử lý',
};

const statusClasses: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipping: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  processing: 'bg-orange-100 text-orange-800',
};

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`/orders/${id}`);
      setOrder(res.data);
    } catch (err) {
      console.error('Lỗi khi tải đơn hàng:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    Modal.confirm({
      title: 'Xác nhận huỷ đơn hàng',
      content: 'Bạn có chắc muốn huỷ đơn hàng này không? Hành động này không thể hoàn tác.',
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await axios.put(`/orders/${id}/cancel`);
          message.success('Đã huỷ đơn hàng thành công');
          fetchOrder(); // reload
        } catch (err) {
          toast.error('Lỗi khi huỷ đơn hàng');
          console.error('Lỗi khi huỷ đơn hàng:', err);
        }
      },
    });
  };

  const getImage = (img: any) => {
    if (Array.isArray(img) && img.length > 0) return img[0];
    if (typeof img === 'string' && img.trim() !== '') return img;
    return 'https://via.placeholder.com/150?text=No+Image';
  };

  const showEditModal = () => {
    form.setFieldsValue(order?.shippingInfo);
    setIsModalOpen(true);
  };

  const handleUpdateShipping = async () => {
    try {
      const values = await form.validateFields();
      await axios.put(`/orders/${id}/shipping-info`, values);
      message.success('Cập nhật thông tin giao hàng thành công');
      setIsModalOpen(false);
      fetchOrder();
    } catch (err) {
      message.error('Cập nhật thất bại');
    }
  };

  if (loading) return <div className="p-10 text-center">Đang tải...</div>;
  if (!order) return <div className="p-10 text-center text-red-500">Không tìm thấy đơn hàng</div>;

  const {
    _id,
    shippingInfo,
    paymentMethod,
    status,
    paymentStatus,
    totalAmount,
    items,
  } = order;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Chi tiết đơn hàng <span className="text-blue-600">#{_id.slice(-8).toUpperCase()}</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-10 gap-6">
        {/* Trái - 80% */}
        <div className="col-span-10 md:col-span-8 space-y-6">
          {/* Box Thông tin giao hàng */}
          <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 space-y-2 relative">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold text-gray-700">Thông tin giao hàng</h2>
              <Button type="primary" ghost onClick={showEditModal}>Chỉnh sửa</Button>
            </div>
            <p><b>👤 Họ tên:</b> {shippingInfo?.fullName}</p>
            <p><b>📞 SĐT:</b> {shippingInfo?.phone}</p>
            <p><b>📍 Địa chỉ:</b> {shippingInfo?.address}</p>
            <p><b>💳 Thanh toán:</b> {paymentMethod === 'cod' ? 'COD' : paymentMethod}</p>
          </div>

          {/* Box Sản phẩm */}
          <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">Sản phẩm trong đơn</h2>
           {items.map((item: any, idx: number) => {
  const variant = item.variantId;
  const product = item.productId;

  console.log("🧩 Variant:", variant);
  console.log("🎨 Attributes:", variant?.attributes);

  const image = getImage(variant?.imageUrl);
  const name = variant?.name || 'Không rõ';
  const price = variant?.price || 0;

  const capacity = product?.capacity || variant?.capacity || "Không rõ";
  const color = variant?.attributes?.find((a: any) =>
    a.attributeId?.name?.toLowerCase().includes("màu")
  )?.attributeValueId?.value || "Không rõ";

  return (
    <Link
      to={`/product/${product?._id}`}
      key={idx}
      className="flex gap-4 border-b pb-4 rounded-lg cursor-pointer"
    >
      <img src={image} alt={name} className="w-20 h-20 object-cover rounded-lg border" />
      <div className="flex-1 flex flex-col justify-between">
        <p className="text-gray-800 font-semibold text-base">{name}</p>
        <div className="flex justify-between text-sm text-gray-600 mt-1">
          <div>
            <p>Dung lượng: {capacity}</p>
            <p>Màu: {color}</p>
            <p>Số lượng: {item.quantity}</p>
          </div>
          <div className="text-right whitespace-nowrap">
            <p className="font-bold text-gray-800">
              {(price * item.quantity).toLocaleString('vi-VN')}₫
            </p>
            <p className="text-sm text-gray-500">
              {price.toLocaleString('vi-VN')}₫ / món
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
})}

          </div>
        </div>

        {/* Phải - 20% */}
        <div className="col-span-10 md:col-span-2 h-fit bg-white shadow-md rounded-xl p-4 border border-gray-200 space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">Tóm tắt</h2>
          <p><b>Trạng thái:</b></p>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusClasses[status]}`}>{statusLabels[status]}</span>

          <p><b>Thanh toán:</b></p>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
          </span>

          <p><b>Tổng tiền:</b></p>
          <span className="text-blue-700 font-bold text-base">{totalAmount.toLocaleString('vi-VN')}₫</span>

          {!['cancelled', 'delivered', 'shipping'].includes(status) && (
            <Button danger type="primary" block onClick={handleCancelOrder}>
              Hủy đơn hàng
            </Button>
          )}
        </div>
      </div>

      {/* Modal chỉnh sửa thông tin giao hàng */}
      <Modal
        title="Chỉnh sửa thông tin giao hàng"
        open={isModalOpen}
        onOk={handleUpdateShipping}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="fullName" label="Họ tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập SĐT' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OrderDetail;