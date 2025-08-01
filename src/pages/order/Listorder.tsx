import React, { useEffect, useState } from "react";
import axios from "axios";

interface Attribute {
  attributeId: { name: string };
  attributeValueId: { value: string };
}

interface Variant {
  _id: string;
  name: string;
  capacity?: string;
  imageUrl: string[];
  attributes?: Attribute[];
}

interface Product {
  _id: string;
  name: string;
  capacity: string;
}

interface OrderItem {
  _id: string;
  productId: Product;
  variantId: Variant;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  productId: Product;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  returnRequest?: {
    reason?: string;
    status?: string;
    requestedAt?: string;
  };
}

const statusLabels: Record<string, string> = {
  pending: "Chờ xác nhận",
  processing: "Đang xử lý",
  ready_to_ship: "Chờ giao hàng",
  shipped: "Đang giao",
  delivered: "Đã giao",
  return_requested: "Yêu cầu trả hàng",
  returned: "Đã hoàn trả",
  rejected: "Từ chối hoàn trả",
  cancelled: "Đã huỷ",
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "processing":
      return "bg-blue-100 text-blue-800";
    case "ready_to_ship":
      return "bg-indigo-100 text-indigo-800";
    case "shipped":
      return "bg-purple-100 text-purple-800";
    case "delivered":
      return "bg-emerald-100 text-emerald-800";
    case "return_requested":
      return "bg-orange-100 text-orange-800";
    case "returned":
      return "bg-teal-100 text-teal-800";
    case "rejected":
      return "bg-pink-100 text-pink-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:8888/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 99999, page },
      });
      setOrders(res.data.data);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("❌ Lỗi lấy đơn hàng:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const handleCancelOrder = async (orderId: string) => {
    const reason = prompt("Vui lòng nhập lý do huỷ đơn hàng:");
    if (!reason || reason.trim() === "") {
      alert("Lý do không được để trống");
      return;
    }

    try {
      await axios.patch(
        `http://localhost:8888/api/orders/${orderId}/cancel`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (err) {
      alert("Lỗi khi huỷ đơn hàng");
    }
  };

  const handleReturnRequest = async (orderId: string) => {
    const reason = prompt("Vui lòng nhập lý do trả hàng:");
    if (!reason || reason.trim() === "") {
      alert("Lý do không được để trống");
      return;
    }

    try {
      await axios.post(
        `http://localhost:8888/api/orders/${orderId}/return-request`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Đã gửi yêu cầu trả hàng thành công");
      fetchOrders();
    } catch (err: any) {
      alert(err.response?.data?.message || "Không thể gửi yêu cầu trả hàng.");
      console.error(err);
    }
  };

  const handlePayment = async (orderId: string, amount: number) => {
    try {
      const res = await axios.get("http://localhost:8888/api/payment/create_payment", {
        params: { orderId, amount },
      });
      window.location.href = res.data.paymentUrl;
    } catch (err) {
      alert("Không thể tạo lại thanh toán.");
    }
  };

  const handleViewDetails = (id: string) => {
    window.location.href = `/orders/${id}`;
  };

  const filteredOrders =
    selectedStatus === "all"
      ? orders
      : orders.filter((order) => order.status === selectedStatus);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Quản Lý Đơn Hàng</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex flex-wrap border-b">
            {[{ label: "Tất cả", value: "all" }, ...Object.entries(statusLabels).map(([value, label]) => ({ label, value }))].map((s, i) => (
              <button
                key={i}
                onClick={() => setSelectedStatus(s.value)}
                className={`px-4 py-3 text-sm font-medium ${selectedStatus === s.value
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                  }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow p-6">
              {order.items.map((item) => {
                const variant = item.variantId;
                const product = item.productId;
                const color = variant?.attributes?.find((a) =>
                  a.attributeId?.name?.toLowerCase().includes("màu")
                )?.attributeValueId?.value || "Không rõ";

                return (
                  <div key={item._id} className="flex gap-4 items-start p-4 bg-gray-50 rounded mb-4">
                    <img
                      src={variant?.imageUrl?.[0] || "/placeholder.jpg"}
                      className="w-16 h-16 object-cover rounded"
                      alt="product"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium">{variant?.name}</p>
                        <div className="text-xs text-gray-500 text-right">
                          {new Date(order.createdAt).toLocaleString("vi-VN")}
                          <div className={`mt-1 px-2 py-0.5 rounded-full inline-block ${getStatusStyle(order.status)}`}>
                            {statusLabels[order.status] || order.status}
                          </div>
                          {/* ✅ Hiện lý do từ chối nếu bị rejected */}
                          {["rejected", "return_requested"].includes(order.status) &&
                            order.returnRequest?.reason && (
                              <div className="text-red-600 text-xs mt-1">
                                <strong>
                                  {order.status === "rejected"
                                    ? "Lý do từ chối:"
                                    : "Lý do yêu cầu trả hàng:"}
                                </strong>{" "}
                                {order.returnRequest.reason}
                              </div>
                            )}

                        </div>
                      </div>
                      <p className="text-xs text-gray-600">SL: x{item.quantity}</p>
                      <p className="text-xs text-gray-500">Dung lượng: {product?.capacity}</p>
                      <p className="text-xs text-gray-500">Màu: {color}</p>
                      <p>Giá: {item.price?.toLocaleString("vi-VN") || "N/A"}₫</p>
                      <p>
                        Tổng: {(item.price * item.quantity)?.toLocaleString("vi-VN")}₫
                      </p>
                    </div>
                  </div>
                );
              })}

              <div className="text-right font-bold text-red-600 text-lg mt-2">
                Tổng đơn: {order.totalAmount.toLocaleString("vi-VN")}₫
              </div>

              <div className="mt-2 text-right space-x-2">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  onClick={() => handleViewDetails(order._id)}
                >
                  Xem chi tiết
                </button>

                {order.paymentStatus === "unpaid" &&
                  order.paymentMethod === "VNPay" &&
                  order.status !== "cancelled" && (
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={() => handlePayment(order._id, order.totalAmount)}
                    >
                      Thanh toán
                    </button>
                  )}

                {["pending", "processing", "ready_to_ship"].includes(order.status) && (
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => handleCancelOrder(order._id)}
                  >
                    Huỷ đơn
                  </button>
                )}

                {order.status === "delivered" && (
                  <button
                    className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                    onClick={() => handleReturnRequest(order._id)}
                  >
                    Yêu cầu trả hàng
                  </button>
                )}
              </div>
            </div>
          ))}

          {filteredOrders.length === 0 && (
            <p className="text-center text-gray-500">Không có đơn hàng nào.</p>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded ${page === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
