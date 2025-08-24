import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../../contexts/CartContext";
import { LoadingOutlined } from "@ant-design/icons";
import { Typography, Spin } from "antd";

const PaymentResult = () => {
  const { Text } = Typography;

  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
 const antIcon = <LoadingOutlined style={{ fontSize: 48, color: "#1890ff" }} spin />; // icon xoay
  useEffect(() => {
    const status = params.get("status");
    const orderId = params.get("orderId");

    if (status === "success") {
      // toast.success("Thanh toán thành công");
      clearCart();
      setTimeout(() => {
        navigate(`/orders/${orderId}`);
      }, 3000);
    } else if (status === "failed") {
      toast.error(" Thanh toán thất bại");
      setTimeout(() => navigate("/cart"), 3000);
    } else if (status === "not_found") {
      toast.error(" Không tìm thấy đơn hàng");
      setTimeout(() => navigate("/cart"), 3000);
    } else if (status === "invalid_signature") {
      toast.error(" Sai chữ ký");
      setTimeout(() => navigate("/cart"), 3000);
    } else {
      toast.info(" Đang xác minh thanh toán...");
      setTimeout(() => navigate("/cart"), 3000);
    }

    // console.log("🔁 Kết quả thanh toán:", status);
    // console.log("📦 Mã đơn hàng:", orderId);
  }, [params]);

  return (
     <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(255,255,255,0.85)", // làm mờ background
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <Spin indicator={antIcon} />
      <Text style={{ marginTop: 16, fontSize: 20, color: "#1890ff", fontWeight: 500 }}>
        Đang xác nhận thanh toán từ VNPay...
      </Text>
      <Text type="secondary">Vui lòng chờ trong giây lát...</Text>
    </div>
  );
};

export default PaymentResult;
