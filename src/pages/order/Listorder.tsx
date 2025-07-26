import React, { useEffect, useState } from "react";
import axios from "axios";

interface Attribute {
  attributeId: {
    name: string;
  };
  attributeValueId: {
    value: string;
  };
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
}

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:8888/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        console.log("✅ Orders fetched:", res.data.data);
        setOrders(res.data.data);
      } catch (error) {
        console.error("❌ Lỗi khi lấy đơn hàng:", error);
      }
    };
    fetchOrders();
  }, []);

useEffect(() => {
  if (orders.length) {
    console.log("🧾 Full Orders data:");
    console.dir(orders, { depth: null });

    // ✅ Log sâu từng order item để kiểm tra attributes
    orders.forEach((order, i) => {
      console.log(`📦 Order ${i + 1}: ID ${order._id}`);
      order.items.forEach((item, j) => {
        console.log(`🧩 Item ${j + 1} - Variant name: ${item.variantId?.name}`);
        console.log(`🧾 Product name: ${item.productId?.name}`);
        console.log("🎨 Attributes:", item.variantId?.attributes);

        item.variantId?.attributes?.forEach((attr, k) => {
          console.log(
            `  🔹 Attribute ${k + 1}:`,
            attr.attributeId?.name,
            "-",
            attr.attributeValueId?.value
          );
        });
      });
    });
  }
}, [orders]);


  const getStatusStyle = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "ready_to_ship": return "bg-indigo-100 text-indigo-800";
      case "shipped": return "bg-purple-100 text-purple-800";
      case "delivered": return "bg-emerald-100 text-emerald-800";
      case "return_requested": return "bg-orange-100 text-orange-800";
      case "returned": return "bg-teal-100 text-teal-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const canCancel = (status: string) => {
    return ["pending", "processing", "ready_to_ship"].includes(status);
  };

  const handleCancelOrder = async (orderId: string) => {
    const confirm = window.confirm("Bạn có chắc muốn huỷ đơn này?");
    if (!confirm) return;
    try {
      await axios.patch(`http://localhost:8888/api/orders/${orderId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: "cancelled" } : o))
      );
    } catch (error) {
      console.error("❌ Huỷ đơn thất bại:", error);
    }
  };

  const handleReturnRequest = async (orderId: string) => {
    if (!window.confirm("Bạn có chắc muốn yêu cầu trả hàng?")) return;
    try {
      await axios.patch(
        `http://localhost:8888/api/orders/${orderId}/request-return`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: "return_requested" } : o))
      );
      alert("Đã gửi yêu cầu trả hàng.");
    } catch (error) {
      console.error("❌ Lỗi khi yêu cầu trả hàng:", error);
      alert("Không thể gửi yêu cầu trả hàng.");
    }
  };

  const handlePayment = async (orderId: string, amount: number) => {
    try {
      const res = await axios.get("http://localhost:8888/api/payment/create_payment", {
        params: { orderId, amount },
      });

      const paymentUrl = res.data.paymentUrl;
      if (!paymentUrl) {
        alert("Không tạo được link thanh toán.");
        return;
      }
      window.location.href = paymentUrl;
    } catch (err: any) {
      console.error("❌ Lỗi tạo thanh toán:", err.response?.data || err);
      alert("Không thể tạo lại thanh toán.");
    }
  };

  const handleViewDetails = (orderId: string) => {
    window.location.href = `/orders/${orderId}`;
  };

  const statuses = [
    { label: "Tất cả", value: "all" },
    { label: "Chờ xác nhận", value: "pending" },
    { label: "Đang xử lý", value: "processing" },
    { label: "Chờ giao hàng", value: "ready_to_ship" },
    { label: "Đang giao", value: "shipped" },
    { label: "Đã giao", value: "delivered" },
    { label: "Yêu cầu trả hàng", value: "return_requested" },
    { label: "Đã hoàn trả", value: "returned" },
    { label: "Đã huỷ", value: "cancelled" },
  ];

  const filteredOrders =
    selectedStatus === "all"
      ? orders
      : orders.filter((order) => order.status === selectedStatus);

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
            {statuses.map((s, index) => (
              <button
                key={index}
                onClick={() => setSelectedStatus(s.value)}
                className={`px-4 py-3 text-sm font-medium ${
                  selectedStatus === s.value
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

                const capacity = product?.capacity;
                const color =
                  variant?.attributes?.find((a) =>
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
                          {new Date(order.createdAt).toLocaleTimeString("vi-VN")}{" "}
                          {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                          <div
                            className={`text-xs mt-1 px-2 py-0.5 rounded-full inline-block ${getStatusStyle(order.status)}`}
                          >
                            {order.status}
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-gray-600">SL: x{item.quantity}</p>
                      {capacity && (
                        <p className="text-xs text-gray-500">Dung lượng: {capacity}</p>
                      )}
                      {color && (
                        <p className="text-xs text-gray-500">Màu: {color}</p>
                      )}

                      <p className="text-sm font-medium">
                        Giá SP: {item.price.toLocaleString("vi-VN")}₫
                      </p>
                      <p className="text-sm font-medium">
                        Tổng: {(item.price * item.quantity).toLocaleString("vi-VN")}₫
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

                {canCancel(order.status) && (
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => handleCancelOrder(order._id)}
                  >
                    Huỷ đơn
                  </button>
                )}
              </div>

              {order.status === "delivered" && (
                <button
                  className="mt-2 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                  onClick={() => handleReturnRequest(order._id)}
                >
                  Yêu cầu trả hàng
                </button>
              )}
            </div>
          ))}

          {filteredOrders.length === 0 && (
            <p className="text-center text-gray-500">Không có đơn hàng nào.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
