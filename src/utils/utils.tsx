// Interfaces for data types
export interface Attribute {
  attributeId: { name: string };
  attributeValueId: { value: string };
}

export interface Variant {
  _id: string;
  name: string;
  capacity?: string;
  imageUrl: string[];
  attributes?: Attribute[];
}

export interface Product {
  _id: string;
  name: string;
  capacity: string;
}

export interface OrderItem {
  _id: string;
  productId: Product;
  variantId: Variant;
  quantity: number;
  price: number;
}

export interface Order {
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

// Utility constants and functions
export const statusLabels: Record<string, string> = {
  pending: "Chờ xác nhận",
  processing: "Đang xử lý",
  ready_to_ship: "Chờ giao hàng",
  shipped: "Đang giao",
  delivered: "Đã giao",
  return_requested: "Yêu cầu trả hàng",
  returned: "Đã hoàn trả",
  rejected: "Từ chối hoàn trả",
  delivery_failed: "Giao hàng thất bại",
  cancelled: "Đã huỷ",
};

export const getStatusStyle = (status: string) => {
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
    case "delivery_failed":
      return "bg-red-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};