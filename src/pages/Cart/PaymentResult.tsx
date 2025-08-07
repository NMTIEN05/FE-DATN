import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../../contexts/CartContext";

const PaymentResult = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  useEffect(() => {
    const status = params.get("status");
    const orderId = params.get("orderId");

    if (status === "success") {
      toast.success("✅ Thanh toán thành công");
      clearCart();
      setTimeout(() => {
        navigate(`/orders/${orderId}`);
      }, 3000);
    } else if (status === "failed") {
      toast.error("❌ Thanh toán thất bại");
      setTimeout(() => navigate("/cart"), 3000);
    } else if (status === "not_found") {
      toast.error("❌ Không tìm thấy đơn hàng");
      setTimeout(() => navigate("/cart"), 3000);
    } else if (status === "invalid_signature") {
      toast.error("⚠️ Sai chữ ký");
      setTimeout(() => navigate("/cart"), 3000);
    } else {
      toast.info("⏳ Đang xác minh thanh toán...");
      setTimeout(() => navigate("/cart"), 3000);
    }

    console.log("🔁 Kết quả thanh toán:", status);
    console.log("📦 Mã đơn hàng:", orderId);
  }, [params]);

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>Đang xác nhận thanh toán từ VNPay...</h2>
      <p>Vui lòng chờ trong giây lát...</p>
    </div>
  );
};

export default PaymentResult;
