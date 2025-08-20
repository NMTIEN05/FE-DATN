import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "../../api/axios.config";
import { Button, Modal, Form, Input, message, Radio } from "antd";
import { toast } from "react-toastify";

type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipping"
  | "delivered"
  | "return_requested"
  | "rejected"
  | "returned"
  |"ready_to_ship"
  | "cancelled";

type PaymentStatus = "paid" | "unpaid";
type PaymentMethod = "cod" | "momo" | "vnpay" | string;

interface AttributeValue {
  value?: string;
}

interface AttributeItem {
  attributeId?: { name?: string };
  attributeValueId?: AttributeValue;
}

interface Variant {
  _id?: string;
  name?: string;
  price?: number;
  imageUrl?: string[] | string;
  capacity?: string;
  attributes?: AttributeItem[];
}

interface Product {
  _id?: string;
  title?: string;
  capacity?: string;
}

interface OrderItem {
  productId?: Product;
  variantId?: Variant;
  quantity: number;
}

interface ShipperInfo {
  full_name?: string;
  username?: string;
  phone?: string;
}

interface ShippingInfo {
  fullName?: string;
  phone?: string;
  address?: string;
}

interface Order {
  _id: string;
  shippingInfo?: ShippingInfo;
  paymentMethod?: PaymentMethod;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  discount?: number;
  items: OrderItem[];
   cancelReason?: string; // thêm optional
  shipperId?: ShipperInfo | null;
}

const statusLabels: Record<string, string> = {
  pending: "Chờ xác nhận",           // user vừa đặt
  processing: "Đang xử lý",          // admin/nhân viên xác nhận
  ready_to_ship: "Chờ giao hàng",    // đã đóng gói xong
  shipped: "Đang giao hàng",         // shipper đang giao
  delivered: "Shipper đã giao",      // shipper báo đã giao
  received: "Đã nhận hàng",    // khách xác nhận đã nhận
  delivery_failed: "Giao không thành công",
  return_requested: "Yêu cầu trả hàng",
  returned: "Đã hoàn trả",
  cancelled: "Đã hủy",
  rejected: "Admin từ chối trả hàng",
};

const statusClasses: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",       // Vàng nhạt → chờ xác nhận
  processing: "bg-blue-100 text-blue-800",        // Xanh dương → đang xử lý
  ready_to_ship: "bg-cyan-100 text-cyan-800",     // Xanh ngọc → chờ giao hàng
  shipped: "bg-purple-100 text-purple-800",       // Tím → đang giao
  delivered: "bg-green-100 text-green-800",       // Xanh lá → giao thành công
  received: "bg-emerald-100 text-emerald-800",    // Xanh ngọc đậm → khách xác nhận
  delivery_failed: "bg-gray-200 text-gray-700",   // Xám → giao thất bại
  return_requested: "bg-orange-100 text-orange-800", // Cam → yêu cầu trả hàng
  returned: "bg-teal-100 text-teal-800",          // Xanh ngọc → đã hoàn trả
  cancelled: "bg-red-100 text-red-800",           // Đỏ → đã hủy
  rejected: "bg-pink-100 text-pink-800",          // Hồng → bị từ chối
};



const predefinedReasons = [
  "Tôi muốn thay đổi địa chỉ/số điện thoại",
  "Tôi muốn thay đổi sản phẩm",
  "Tôi tìm thấy giá tốt hơn ở nơi khác",
  "Thời gian giao hàng quá lâu",
  "Tôi đặt nhầm",
  "Khác",
];

const formatVND = (n: number | undefined | null) =>
  (Number(n) || 0).toLocaleString("vi-VN") + "₫";

const getFirstImage = (img?: string[] | string) => {
  if (Array.isArray(img) && img.length > 0) return img[0];
  if (typeof img === "string" && img.trim() !== "") return img;
  return "https://via.placeholder.com/150?text=No+Image";
};

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [form] = Form.useForm<ShippingInfo>();

  const fetchOrder = async () => {
    if (!id) return;
    try {
      const res = await axios.get(`/orders/${id}`);
      setOrder(res.data as Order);
    } catch (err) {
      console.error("Lỗi khi tải đơn hàng:", err);
      toast.error("Không tải được đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCancelOrder = () => {
    setIsCancelModalOpen(true);
  };

  const confirmCancelOrder = async () => {
    const reasonToSend =
      selectedReason === "Khác" ? customReason.trim() : selectedReason;

    if (!reasonToSend) {
      message.warning("Vui lòng chọn hoặc nhập lý do hủy đơn hàng.");
      return;
    }

    try {
      await axios.put(`/orders/${id}/cancel`, { reason: reasonToSend });
      message.success("Đã huỷ đơn hàng thành công");
      setIsCancelModalOpen(false);
      setSelectedReason("");
      setCustomReason("");
      fetchOrder();
    } catch (err) {
      toast.error("Lỗi khi huỷ đơn hàng");
      console.error("Lỗi khi huỷ đơn hàng:", err);
    }
  };

  const showEditModal = () => {
    if (order?.shippingInfo) {
      form.setFieldsValue(order.shippingInfo);
    }
    setIsModalOpen(true);
  };

  const handleUpdateShipping = async () => {
    try {
      const values = await form.validateFields();
      await axios.put(`/orders/${id}/shipping-info`, values);
      message.success("Cập nhật thông tin giao hàng thành công");
      setIsModalOpen(false);
      fetchOrder();
    } catch (err) {
      message.error("Cập nhật thất bại");
    }
  };

  if (loading)
    return <div className="p-10 text-center">Đang tải...</div>;
  if (!order)
    return (
      <div className="p-10 text-center text-red-500">
        Không tìm thấy đơn hàng
      </div>
    );

  const {
    _id,
    shippingInfo,
    paymentMethod,
    status,
    paymentStatus,
    totalAmount,
    items,
    shipperId,
    discount = 0,
  } = order;

const canCancel = ["pending", "confirmed", "processing"].includes(status);


  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Chi tiết đơn hàng{" "}
        <span className="text-blue-600">
          #{_id?.slice(-8)?.toUpperCase()}
        </span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
  {/* LEFT */}
  <div className="col-span-12 md:col-span-9 space-y-6">
    {/* Shipping Card */}
    <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 space-y-3 relative">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold text-gray-800">
          🚚 Thông tin giao hàng
        </h2>
        <Button type="primary" ghost size="middle" onClick={showEditModal}>
          Chỉnh sửa
        </Button>
      </div>

      <div className="space-y-2 text-gray-700">
        <p>
          <b>👤 Họ tên:</b> {shippingInfo?.fullName || "—"}
        </p>
        <p>
          <b>📞 SĐT:</b> {shippingInfo?.phone || "—"}
        </p>
        <p>
          <b>📍 Địa chỉ:</b> {shippingInfo?.address || "—"}
        </p>
        <p>
          <b>💳 Thanh toán:</b>{" "}
          {paymentMethod === "cod" ? "COD" : paymentMethod || "—"}
        </p>
      </div>

      {/* Shipper */}
      {shipperId ? (
        <div className="mt-4 pt-4 border-t space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">
            🚴 Thông tin Shipper
          </h3>
          <p>
            <b>👤 Họ tên:</b>{" "}
            {shipperId.full_name || shipperId.username || "—"}
          </p>
          <p>
            <b>📞 SĐT:</b> {shipperId.phone || "—"}
          </p>
        </div>
      ) : (
        <p className="mt-4 text-gray-500 italic">Chưa có thông tin Shipper</p>
      )}
    </div>

    {/* Items */}
    <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 border-b pb-3">
        📦 Sản phẩm trong đơn
      </h2>

      {Array.isArray(items) && items.length > 0 ? (
        items.map((item, idx) => {
          const variant = item.variantId || {};
          const product = item.productId || {};
          const image = getFirstImage(variant.imageUrl);
          const name = variant.name || product.title || "Không rõ";
          const unitPrice = Number(variant.price) || 0;

          const capacity =
            product.capacity || (variant as Variant).capacity || "Không rõ";
          const color =
            variant.attributes?.find((a) =>
              a.attributeId?.name?.toLowerCase().includes("màu")
            )?.attributeValueId?.value || "Không rõ";

          return (
            <Link
              to={`/product/${product?._id || ""}`}
              key={`${product?._id || idx}-${idx}`}
              className="flex gap-4 border-b pb-4 hover:bg-gray-50 rounded-lg transition"
            >
              <img
                src={image}
                alt={name}
                className="w-20 h-20 object-cover rounded-lg border"
              />
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
                      {formatVND(unitPrice * item.quantity)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatVND(unitPrice)} / món
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })
      ) : (
        <div className="text-gray-500">Không có sản phẩm.</div>
      )}
    </div>
  </div>

  {/* RIGHT */}
  <div className="col-span-12 md:col-span-3 h-fit bg-white shadow-lg rounded-2xl p-5 border border-gray-100 space-y-6">
  {/* Header */}
  <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
    🧾 Tóm tắt đơn hàng
  </h2>

  {/* Trạng thái */}
  <div className="space-y-2">
    <p className="text-sm font-medium text-gray-600">Trạng thái đơn hàng</p>
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${statusClasses[status]}`}
    >
      {statusLabels[status]}
    </span>

    {/* Lý do hủy */}
    {status === "cancelled" && order?.cancelReason && (
      <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm leading-relaxed">
        <b>Lý do hủy:</b> {order.cancelReason}
      </div>
    )}

    {/* Trạng thái trả hàng */}
    {order?.returnRequest?.status === "pending" && (
      <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm leading-relaxed">
        ⏳ Yêu cầu trả hàng đang chờ duyệt
      </div>
    )}
    {order?.returnRequest?.status === "approved" && (
      <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm leading-relaxed">
        ✅ Yêu cầu trả hàng đã được chấp nhận
      </div>
    )}
    {order?.returnRequest?.status === "rejected" && order?.returnRequest?.reason && (
      <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm leading-relaxed">
        <b>Yêu cầu trả hàng bị từ chối:</b> {order.returnRequest.reason}
      </div>
    )}
  </div>

  {/* Thanh toán */}
  <div className="space-y-2">
    <p className="text-sm font-medium text-gray-600">Trạng thái thanh toán</p>
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
        paymentStatus === "paid"
          ? "bg-green-100 text-green-700"
          : "bg-orange-100 text-orange-700"
      }`}
    >
      {paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
    </span>
  </div>

  {/* Tổng tiền */}
  <div className="space-y-2">
    <p className="text-sm font-medium text-gray-600">Chi phí</p>
    <div className="space-y-2 text-sm">
      <div className="flex justify-between text-gray-600">
        <span>Giá gốc:</span>
        <span>{formatVND((totalAmount || 0) + (discount || 0))}</span>
      </div>

      {(discount || 0) > 0 && (
        <div className="flex justify-between text-red-600">
          <span>Giảm giá:</span>
          <span>-{formatVND(discount)}</span>
        </div>
      )}

      <div className="flex justify-between text-base font-bold text-blue-700 border-t pt-3">
        <span>Tổng tiền:</span>
        <span>{formatVND(totalAmount)}</span>
      </div>
    </div>
  </div>

  {/* Nút Hủy */}
  {canCancel && (
    <Button
      danger
      type="primary"
      block
      size="large"
      className="rounded-lg shadow-md hover:shadow-lg transition"
      onClick={handleCancelOrder}
    >
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
        destroyOnClose
      >
        <Form<ShippingInfo> layout="vertical" form={form}>
          <Form.Item
            name="fullName"
            label="Họ tên"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: "Vui lòng nhập SĐT" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal lý do hủy đơn hàng */}
      <Modal
        title="Lý do hủy đơn hàng"
        open={isCancelModalOpen}
        onOk={confirmCancelOrder}
        onCancel={() => setIsCancelModalOpen(false)}
        okText="Xác nhận hủy"
        cancelText="Thoát"
        destroyOnClose
      >
        <p className="mb-2">Vui lòng chọn lý do bạn muốn hủy đơn hàng:</p>
        <Radio.Group
          onChange={(e) => setSelectedReason(e.target.value)}
          value={selectedReason}
          className="flex flex-col gap-2"
        >
          {predefinedReasons.map((reason) => (
            <Radio key={reason} value={reason}>
              {reason}
            </Radio>
          ))}
        </Radio.Group>

        {selectedReason === "Khác" && (
          <Input.TextArea
            rows={4}
            className="mt-4"
            placeholder="Vui lòng nhập lý do cụ thể..."
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
          />
        )}
      </Modal>
    </div>
  );
};

export default OrderDetail;
