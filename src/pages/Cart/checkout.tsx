import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../api/axios.config";
import { useCart } from "../../contexts/CartContext";
import {
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaMoneyCheckAlt,
  FaBoxOpen,
  FaAngleDown,
} from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import "./Checkout.css";

const Checkout = () => {
  const { clearCart } = useCart();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        if (decoded?.id) setUserId(decoded.id);
      } catch (err) {
        console.error("Lỗi khi giải mã token:", err);
      }
    }
  }, []);

  useEffect(() => {
    const selected = JSON.parse(
      localStorage.getItem("selectedCheckoutItems") || "[]"
    );
    setSelectedItems(selected);
  }, []);

  const totalPrice = selectedItems.reduce(
    (acc, item) =>
      acc + (item.price || item.variantId?.price || 0) * item.quantity,
    0
  );

  const handleSubmit = async () => {
    if (!fullName || !phone || !address) {
      toast.error("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    if (!userId) {
      toast.error("Không tìm thấy người dùng.");
      return;
    }

    const payload = {
      userId,
      shippingInfo: { fullName, phone, address },
      paymentMethod,
      totalAmount: totalPrice,
      items: selectedItems.map((item) => ({
        productId: item.productId?._id || item.productId,
        variantId: item.variantId?._id || item.variantId,
        quantity: item.quantity,
        price: item.price || item.variantId?.price || 0,
        name: item.name || item.productId?.title || "Sản phẩm",
        image:
          item.image ||
          item.variantId?.imageUrl?.[0] ||
          item.productId?.imageUrl?.[0] ||
          "/placeholder.jpg",
      })),
    };

    try {
      setLoading(true);
      const res = await axios.post("/orders", payload);
      const orderId = res.data._id;

      if (paymentMethod === "VNPay") {
        const paymentRes = await axios.get("/payment/create_payment", {
          params: { amount: totalPrice, orderId },
        });
        const paymentUrl = paymentRes.data.paymentUrl;
        window.location.href = paymentUrl;
        return;
      }

      toast.success("Đặt hàng thành công!");
      clearCart();
      localStorage.removeItem("selectedCheckoutItems");
      navigate(`/orders/${orderId}`);
    } catch (err: any) {
      console.error("Lỗi khi đặt hàng:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Lỗi khi đặt hàng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <h2 className="checkout-title">
        <FaBoxOpen style={{ marginRight: 8 }} /> Xác nhận đơn hàng
      </h2>

      <div className="checkout-content">
        {/* Bên trái: Form thông tin */}
        <div className="checkout-left">
          <div className="checkout-form">
            <h3>Thông tin giao hàng</h3>

            <div className="input-group">
              <FaUser />
              <input
                type="text"
                placeholder="Họ tên người nhận"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="input-group">
              <FaPhone />
              <input
                type="text"
                placeholder="Số điện thoại"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="input-group">
              <FaMapMarkerAlt />
              <textarea
                placeholder="Địa chỉ cụ thể"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="input-group select-wrapper">
              <FaMoneyCheckAlt className="icon" />
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="COD">Thanh toán khi nhận hàng</option>
                <option value="VNPay">Thanh toán VNPay</option>
                <option value="Stripe">Thanh toán Stripe</option>
                <option value="Momo">Thanh toán Momo</option>
              </select>
              <FaAngleDown className="select-arrow" />
            </div>
          </div>
        </div>

        {/* Bên phải: Danh sách sản phẩm và nút đặt hàng */}
        <div className="checkout-right">
          <h3>Sản phẩm</h3>
          <div className="cart-items">
            {selectedItems.length > 0 ? (
              selectedItems.map((item: any) => {
                const name = item.name || item.productId?.title || "Sản phẩm";
                const image =
                  item.image ||
                  item.variantId?.imageUrl?.[0] ||
                  item.productId?.imageUrl?.[0] ||
                  "/placeholder.jpg";
                const price = item.price || item.variantId?.price || 0;

                return (
                  <div
                    className="cart-item"
                    key={item._id || item.variantId?._id}
                  >
                    <img
                      src={image}
                      alt={name}
                      className="cart-item-image"
                    />
                    <div>
                      <p>{name}</p>
                      <small>
                        {item.quantity} x {price.toLocaleString("vi-VN")}₫
                      </small>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>Không có sản phẩm được chọn.</p>
            )}
          </div>

          <div className="total-price">
            <strong>Tổng tiền: </strong>
            <span>{totalPrice.toLocaleString("vi-VN")}₫</span>
          </div>

          <button
            className="checkout-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Đặt hàng"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;