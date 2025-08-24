import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "../../api/axios.config";
import { Button, Modal, Form, Input, message, Radio } from "antd";
import { toast } from "react-toastify";
import ReturnModal from "./compudent/ReturnModal";
import { CreditCardOutlined, EnvironmentOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons";

type OrderStatus =
  | "pending"            // Chờ xác nhận
  | "confirmed"          // Đã xác nhận (Admin/Shop)
  | "processing"         // Đang xử lý
  | "ready_to_ship"      // Chờ giao hàng
  | "shipped"            // Đang giao hàng (Shipper)
  | "delivered"          // Shipper đã giao
  | "received"           // Khách xác nhận đã nhận hàng
  | "delivery_failed"    // Giao không thành công
  | "return_requested"   // Yêu cầu trả hàng
  | "returned"           // Đã hoàn trả
  | "cancelled"          // Đã hủy (User/Admin)
  | "rejected";          // Admin từ chối đơn



// Định nghĩa interface ReturnRequest bị thiếu
interface ReturnRequest {
  status?: "pending" | "rejected" | "approved";
  reason?: string;
}

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
  shipperId?: ShipperInfo | null;
  cancelReason?: string;
    returnRequest?: ReturnRequest;
      deliveryFailedReason?: string; // Đã thêm dòng này để khắc phục lỗi
  returnReason?: string; // Thêm dòng này
    createdAt?: string; // Đã thêm dòng này để khắc phục lỗi
    

}

const statusLabels: Record<OrderStatus, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  processing: "Đang xử lý",
  ready_to_ship: "Chờ giao hàng",
  shipped: "Đang giao hàng",
  delivered: "Shipper đã giao",
  received: "Khách đã nhận hàng",
  delivery_failed: "Giao hàng không thành công",
  return_requested: "Yêu cầu trả hàng",
  returned: "Đã hoàn trả",
  cancelled: "Đã hủy",
  rejected: "Admin từ chối hoàn đơn",
};

const statusClasses: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-orange-100 text-orange-800",
  ready_to_ship: "bg-purple-100 text-purple-800",
  shipped: "bg-purple-200 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  received: "bg-green-200 text-green-800",
  delivery_failed: "bg-red-200 text-red-800",
  return_requested: "bg-orange-200 text-orange-800",
  returned: "bg-teal-100 text-teal-800",
  cancelled: "bg-red-100 text-red-800",
  rejected: "bg-pink-100 text-pink-800",
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
// const [showReviewModal, setShowReviewModal] = useState(false);
  const [returningOrderId, setReturningOrderId] = useState<string | null>(null);
    const [showReturnModal, setShowReturnModal] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [form] = Form.useForm<ShippingInfo>();
const token = localStorage.getItem("token") || "";
// Đặt hàm này ở đầu file hoặc trong một file helper chung
const formatDate = (dateString:any) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};
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
const handleConfirmReceived = async (orderId: string) => {
  try {
    await axios.patch(
      `http://localhost:8888/api/orders/${orderId}/confirm-received`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success(" Xác nhận đã nhận hàng thành công");
    fetchOrder(); // Refresh lại danh sách
  } catch (err: any) {
    toast.error(err.response?.data?.message || " Lỗi xác nhận đã nhận hàng");
  }
};

  useEffect(() => {
    if (id) fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCancelOrder = () => setIsCancelModalOpen(true);

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

  if (loading) return <div className="p-10 text-center">Đang tải...</div>;
  if (!order)
    return (
      <div className="p-10 text-center text-red-500">Không tìm thấy đơn hàng</div>
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

  const safeStatus: OrderStatus = (status as OrderStatus) || "pending";
 const canCancel = ![
  "cancelled",
  "delivered",
  "received",        // <- thêm dòng này
  "shipped",
  "return_requested",
  "rejected",
   "delivery_failed", 
].includes(safeStatus);


  return (
    <div className="max-w-6xl mx-auto px-4 py-10  ">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Chi tiết đơn hàng{" "}
        <span className="text-blue-600">
          #{(_id || "").slice(-8).toUpperCase()}
        </span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* LEFT */}
        <div className="col-span-12 md:col-span-9 space-y-6">
          {/* Shipping Card */}
<div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-200 space-y-5 relative">
  {/* Header chính - Thông tin giao hàng */}
  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
    <h2 className="text-2xl font-bold text-gray-800">Thông tin giao hàng</h2>
    {(safeStatus === "pending" || safeStatus === "processing") && (
      <Button type="primary" ghost onClick={showEditModal}>
        Chỉnh sửa
      </Button>
    )}
  </div>

  {/* Nội dung thông tin giao hàng */}
  <div className="space-y-3 pt-2">
    <p className="text-gray-700 text-base flex items-center gap-2">
      <UserOutlined className="text-lg text-gray-600" />
      <b className="font-semibold text-gray-900">Họ tên:</b>{" "}
      {shippingInfo?.fullName || "—"}
    </p>
    <p className="text-gray-700 text-base flex items-center gap-2">
      <PhoneOutlined className="text-lg text-gray-600" />
      <b className="font-semibold text-gray-900">SĐT:</b> {shippingInfo?.phone || "—"}
    </p>
    <p className="text-gray-700 text-base flex items-center gap-2">
      <EnvironmentOutlined className="text-lg text-gray-600" />
      <b className="font-semibold text-gray-900">Địa chỉ:</b>{" "}
      {shippingInfo?.address || "—"}
    </p>
  </div>
  
  {/* Đường phân cách */}
  <div className="border-t border-gray-200 my-4"></div>

{/* Container chứa thông tin Đơn hàng và Shipper (2 cột) */}
<div className="flex flex-col md:flex-row justify-between gap-8">
  {/* Cột 1: Thông tin Shipper */}
  {shipperId ? (
    <div className="flex-1">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Thông tin Shipper</h3>
      <div className="space-y-3">
        <p className="text-gray-700 text-base flex items-center gap-2">
          <UserOutlined className="text-lg text-gray-600" />
          <b className="font-semibold text-gray-900">Họ tên:</b>{" "}
          {shipperId.full_name || shipperId.username || "—"}
        </p>
        <p className="text-gray-700 text-base flex items-center gap-2">
          <PhoneOutlined className="text-lg text-gray-600" />
          <b className="font-semibold text-gray-900">SĐT:</b>{" "}
          {shipperId.phone || "—"}
        </p>
      </div>
    </div>
  ) : (
    <div className="flex-1">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Thông tin Shipper</h3>
      <p className="text-gray-500 italic">Chưa có thông tin Shipper</p>
    </div>
  )}

  {/* Dấu gạch chia ở giữa (cho desktop) */}
  <div className="hidden md:block border-l border-gray-300"></div>

  {/* Cột 2: Thông tin đơn hàng */}
  <div className="flex-1">
    <h3 className="text-xl font-bold text-gray-800 mb-4">Thông tin đơn hàng</h3>
   <div className="space-y-3 text-gray-700">
  <div className="flex justify-between">
    <span className="font-semibold text-gray-900">Mã đơn hàng:</span>
    <span className="font-medium text-gray-700">{order._id}</span>
  </div>
  <div className="flex justify-between">
    <span className="font-semibold text-gray-900">Ngày đặt:</span>
    <span className="font-medium text-gray-700">
      {formatDate(order.createdAt)}
    </span>
  </div>
  <div className="flex justify-between">
    <span className="font-semibold text-gray-900">Thanh toán:</span>
    <span className="font-medium text-gray-700">
      {order.paymentMethod || "—"}
    </span>
  </div>
</div>
  </div>
</div>
</div>
          {/* Items */}
          <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
              Sản phẩm trong đơn
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
                    to={product?._id ? `/product/${product._id}` : "#"}
                    key={`${product?._id || idx}-${idx}`}
                    className="flex gap-4 border-b pb-4 rounded-lg cursor-pointer hover:bg-gray-50"
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
                            {formatVND(unitPrice * (item.quantity || 0))}
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

            <hr className="my-4" />
          </div>
        </div>

       {/* RIGHT */}
<div className="col-span-12 md:col-span-3 h-fit bg-white shadow-md rounded-xl p-4 border border-gray-200 space-y-4">
  <h2 className="text-lg font-semibold text-gray-700">Tóm tắt</h2>

  {/* Trạng thái */}
  <div>
    <p className="mb-1"><b>Trạng thái đơn hàng:</b></p>
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold ${
        statusClasses[safeStatus] || "bg-gray-100 text-gray-700"
      }`}
    >
      {statusLabels[safeStatus] || safeStatus}
    </span>
  </div>

  {/* Lý do hủy */}
  {order.cancelReason && (
    <div>
      <p className="mb-1"><b>Lý do hủy:</b></p>
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
        {order.cancelReason}
      </span>
    </div>
  )}

  {/* Lý do trả hàng / từ chối */}
  {order.returnRequest && order.returnRequest.status && (
    <div>
      <p className="mb-1">
        <b>
          {order.returnRequest.status === "rejected"
            ? "Lý do từ chối hoàn trả:"
            : "Lý do yêu cầu trả hàng:"}
        </b>
      </p>
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          order.returnRequest.status === "rejected"
            ? "bg-pink-100 text-pink-800"
            : "bg-orange-100 text-orange-800"
        }`}
      >
        {order.returnRequest.reason || "—"}
      </span>
    </div>
  )}
  {order.status === "delivery_failed" && order.deliveryFailedReason && (
  <div className="mt-2 p-3 rounded-lg bg-red-50 border border-red-200">
    <p className="text-sm text-red-600 font-medium">
      Lý do giao hàng thất bại: {order.deliveryFailedReason}
    </p>
  </div>
)}

{/* Nút xác nhận đã nhận và yêu cầu trả hàng */}
{(safeStatus === "delivered" || safeStatus === "received") && (
  <div className="space-y-2">
    {/* Nút xác nhận đã nhận */}
    {safeStatus === "delivered" && (
      <Button
        type="primary"
        block
        onClick={() => handleConfirmReceived(order._id)}
      >
        Đã nhận hàng
      </Button>
    )}
  </div>
)}

{/* Hiển thị lý do trả hàng ngay sau nút */}
{order.returnReason && (
  <div className="mt-2">
    <p className="mb-1"><b>Lý do trả hàng:</b></p>
    <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
      {order.returnReason}
    </span>
  </div>
)}

{/* Modal yêu cầu trả hàng */}
{showReturnModal && order?._id && (
  <Modal
    title="Yêu cầu trả hàng"
    open={showReturnModal}
    onCancel={() => setShowReturnModal(false)}
    onOk={async () => {
      const reasonToSend =
        selectedReason === "Khác" ? customReason.trim() : selectedReason;
      if (!reasonToSend) {
        message.warning("Vui lòng chọn hoặc nhập lý do trả hàng.");
        return;
      }
      try {
        await axios.post(
          `/orders/${order._id}/request-return`,
          { reason: reasonToSend },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Yêu cầu trả hàng đã được gửi thành công");

        // Cập nhật luôn lý do trả hàng trên UI mà không reload
        setOrder(prev => prev ? { ...prev, returnReason: reasonToSend, status: "return_requested" } : prev);

        setShowReturnModal(false);
        setSelectedReason("");
        setCustomReason("");
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Lỗi khi gửi yêu cầu trả hàng");
      }
    }}
    okText="Gửi yêu cầu"
    cancelText="Hủy"
  >
    <p>Vui lòng chọn lý do bạn muốn trả hàng:</p>
    <Radio.Group
      onChange={(e) => setSelectedReason(e.target.value)}
      value={selectedReason}
      className="flex flex-col gap-2 mt-2"
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
)}



{showReturnModal && returningOrderId && (
  <ReturnModal
    orderId={returningOrderId}
    open={showReturnModal}
    onClose={() => {
      setShowReturnModal(false);
      setReturningOrderId(null);
    }}
    onSuccess={fetchOrder} // reload lại đơn hàng sau khi yêu cầu trả hàng thành công
  />
)}




  {/* Thanh toán */}
  <div>
    <p className="mb-1"><b>Trạng thái thanh toán:</b></p>
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        paymentStatus === "paid"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
    </span>
  </div>

  {/* Tổng tiền */}
  <div>
    <p className="mb-1"><b>Tổng tiền:</b></p>
    <div className="space-y-1 text-sm">
      <div className="flex justify-between text-gray-600">
        <span>Giá gốc:</span>
        <span>{formatVND(Number(totalAmount || 0) + Number(discount || 0))}</span>
      </div>
      {Number(discount) > 0 && (
        <div className="flex justify-between text-red-600">
          <span>Mã giảm giá:</span>
          <span>-{formatVND(Number(discount))}</span>
        </div>
      )}
      <div className="flex justify-between text-base font-bold text-blue-700 border-t pt-2 mt-2">
        <span>Tổng tiền:</span>
        <span>{formatVND(Number(totalAmount || 0))}</span>
      </div>
    </div>
  </div>

  {/* Nút hủy */}
{/* Nút Hủy hoặc Yêu cầu trả hàng */}
<div className="mt-4">
  {safeStatus === "received" && !order.returnReason ? (
    <Button
      type="primary"
      block
      style={{ backgroundColor: "#10B981", borderColor: "#10B981", color: "#fff" }}
      onClick={() => setReturningOrderId(order._id)}
    >
      Yêu cầu trả hàng
    </Button>
  ) : canCancel ? (
    <Button danger type="primary" block onClick={handleCancelOrder}>
      Hủy đơn hàng
    </Button>
  ) : null}

  {/* Modal ReturnModal */}
  {returningOrderId && (
    <ReturnModal
      orderId={returningOrderId}
      open={!!returningOrderId}
      onClose={() => setReturningOrderId(null)}
      onSuccess={fetchOrder} // reload lại đơn hàng sau khi gửi yêu cầu trả hàng
    />
  )}
</div>


</div>


      </div>

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