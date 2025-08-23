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
  FaCreditCard,
  FaMoneyBillWave,
} from "react-icons/fa";
import "./Checkout.css";
import { jwtDecode } from "jwt-decode";

const Checkout = () => {
  const navigate = useNavigate();
  const { fetchCart } = useCart();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);

  const [voucherCode, setVoucherCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
// const [address, setAddress] = useState("");   // Giá trị gộp
const [city, setCity] = useState("");
const [district, setDistrict] = useState("");
const [ward, setWard] = useState("");
const [cuthe, setCuthe] = useState("");


const handleAddressChange = (value: string, type: 'city' | 'district' | 'ward'|'cuthe') => {
  if (type === 'city') setCity(value);
  if (type === 'district') setDistrict(value);
  if (type === 'ward') setWard(value);
  if (type === 'cuthe') setCuthe(value);

  // Gộp thành 1 chuỗi để lưu vào `address`
  setAddress(`${cuthe},${ward}, ${district}, ${city}`);
};
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

  useEffect(() => {
    setFinalTotal(totalPrice - discount);
  }, [totalPrice, discount]);
const categoryIds = [
  ...new Set(
    selectedItems
      .map((item) => item.productId?.categoryId || item.categoryId)
      .filter(Boolean)
  ),
];

const handleApplyVoucher = async () => {
  if (!voucherCode) {
    toast.warn("Vui lòng nhập mã giảm giá.");
    return;
  }
  try {
    const res = await axios.post("/vouchers/apply", {
      code: voucherCode,
      total: totalPrice,
      categoryIds, // 🆕 Gửi thêm categoryIds để backend kiểm tra
    });
    setDiscount(res.data.discount);
    toast.success(res.data.message || "Áp dụng mã thành công!");
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Không áp dụng được mã");
    setDiscount(0);
  }
};


  const handleSubmit = async () => {
    if (!fullName || !phone || !address) {
      toast.error("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    if (!userId) {
      toast.error("Không tìm thấy người dùng.");
      return;
    }

    const itemsToCheckout = selectedItems.map((item) => ({
      variantId: item.variantId?._id || item.variantId,
      quantity: item.quantity,
       price: item.price || item.variantId?.price || 0
    }));

    const payload = {
      shippingInfo: { fullName, phone, address },
      paymentMethod,
      totalAmount: finalTotal,
      itemsToCheckout,
      voucherCode,
    };

    try {
      setLoading(true);
      const res = await axios.post("/orders", payload);
      const orderId = res.data._id;

      if (paymentMethod === "VNPay") {
        const paymentRes = await axios.get("/payment/create_payment", {
          params: { amount: finalTotal, orderId },
        });
        window.location.href = paymentRes.data.paymentUrl;
        return;
      }

      toast.success("Đặt hàng thành công!");
      await fetchCart();
      localStorage.removeItem("selectedCheckoutItems");
      navigate(`/orders/${orderId}`);
    } catch (err: any) {
      console.error( err.response?.data || err);
      toast.error(err.response?.data?.message );
     
      navigate("/cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-[60px]" >
      <h2 className="flex items-center justify-center text-2xl font-semibold mb-6 text-gray-900">
  <FaBoxOpen className="w-7 h-7 mr-2 text-blue-600" />
  Xác nhận đơn hàng
</h2>

  <div className="checkout-page ">
  

  <div className="checkout-content">
    {/* Bên trái - Form thông tin giao hàng */}
    <div className="checkout-left">
      <div className="checkout-form">
<h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
  Thông tin giao hàng
</h3>

{/* Họ tên người nhận */}
<div className="flex flex-col w-full mt-4">
  <span className="mb-2 text-gray-700 font-medium">Họ tên người nhận</span>
  <div className="flex items-center bg-white border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-500 p-3">
    <FaUser className="text-gray-400 text-xl mr-3" />
    <input
      type="text"
      placeholder="Nhập họ tên"
      value={fullName}
      onChange={(e) => setFullName(e.target.value)}
      className="flex-1 outline-none placeholder-gray-400 text-gray-800"
    />
  </div>
</div>

{/* Số điện thoại */}
<div className="flex flex-col w-full mt-4">
  <span className="mb-2 text-gray-700 font-medium">Số điện thoại</span>
  <div className="flex items-center bg-white border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-500 p-3">
    <FaPhone className="text-gray-400 text-xl mr-3" />
    <input
      type="text"
      placeholder="Nhập số điện thoại"
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
      className="flex-1 outline-none placeholder-gray-400 text-gray-800"
    />
  </div>
</div>

{/* Địa chỉ */}
<div className="flex flex-col w-full mt-4">
  <span className="mb-2 text-gray-700 font-medium">Địa chỉ</span>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* TP */}
    <div className="flex items-center bg-white border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
      <FaMapMarkerAlt className="text-gray-400 text-xl ml-3" />
      <input
        type="text"
        placeholder="TP"
        value={city}
        onChange={(e) => handleAddressChange(e.target.value, 'city')}
        className="flex-1 outline-none placeholder-gray-400 text-gray-800 py-2 px-3"
      />
    </div>

    {/* Quận/Huyện */}
    <div className="flex items-center bg-white border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
      <input
        type="text"
        placeholder="Quận/Huyện"
        value={district}
        onChange={(e) => handleAddressChange(e.target.value, 'district')}
        className="flex-1 outline-none placeholder-gray-400 text-gray-800 py-2 px-3"
      />
    </div>

    {/* Phường/Xã */}
    <div className="flex items-center bg-white border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
      <input
        type="text"
        placeholder="Phường/Xã"
        value={ward}
        onChange={(e) => handleAddressChange(e.target.value, 'ward')}
        className="flex-1 outline-none placeholder-gray-400 text-gray-800 py-2 px-3"
      />
    </div>

    {/* Số nhà / Đường */}
    <div className="flex items-center bg-white border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
      <input
        type="text"
        placeholder="Số nhà / Đường"
        value={cuthe}
        onChange={(e) => handleAddressChange(e.target.value, 'cuthe')}
        className="flex-1 outline-none placeholder-gray-400 text-gray-800 py-2 px-3"
      />
    </div>
  </div>
</div>


       <div className="flex flex-row items-stretch gap-2 mt-5 ">
      {/* Ô chọn COD */}
      <label
        className={`
          flex flex-1 items-center gap-2 p-3 rounded-lg cursor-pointer transition-all duration-300
          ${paymentMethod === 'COD' ? 'border-2 border-blue-500 bg-blue-50 shadow-sm' : 'border border-gray-300 bg-white hover:border-blue-400'}
        `}
      >
        <input
          type="radio"
          name="paymentMethod"
          value="COD"
          checked={paymentMethod === 'COD'}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="hidden"
        />
        <div className="flex-shrink-0">
          <FaMoneyBillWave className="text-2xl text-gray-700" />
        </div>
        <div className="flex-grow">
          <h3 className="font-semibold text-sm text-gray-800">Thanh toán khi nhận hàng</h3>
          <p className="text-xs text-gray-500">Thanh toán tiền mặt.</p>
        </div>
      </label>

      {/* Ô chọn VNPay */}
      <label
        className={`
          flex flex-1 items-center gap-2 p-3 rounded-lg cursor-pointer transition-all duration-300
          ${paymentMethod === 'VNPay' ? 'border-2 border-blue-500 bg-blue-50 shadow-sm' : 'border border-gray-300 bg-white hover:border-blue-400'}
        `}
      >
        <input
          type="radio"
          name="paymentMethod"
          value="VNPay"
          checked={paymentMethod === 'VNPay'}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="hidden"
        />
        <div className="flex-shrink-0">
          <img 
    src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-VNPAY-QR-350x65.png" 
    alt="VNPAY" 
    className="w-16 h-auto"
  />
        </div>
        <div className="flex-grow">
          <h3 className="font-semibold text-sm text-gray-800">Thanh toán VNPay</h3>
          <p className="text-xs text-gray-500">Thanh toán an toàn.</p>
        </div>
      </label>
    </div>
      </div>
    </div>

    {/* Bên phải - Sản phẩm, voucher, tổng tiền */}
    <div className="checkout-right">
      <h2 className="flex items-center justify-center text-2xl font-semibold mb-6 text-gray-900">
  <FaBoxOpen className="w-7 h-7 mr-2 text-blue-600" />
 Sản phẩm 
</h2>

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

      {/* Mã giảm giá */}
      <div className="flex w-full max-w-md mb-3 mt-3">
        <input
          type="text"
          value={voucherCode}
          onChange={(e) => setVoucherCode(e.target.value)}
          placeholder="Nhập mã giảm giá"
          className="flex-1 px-4 py-3 text-sm text-gray-700 border border-blue-500 rounded-l-lg focus:outline-none"
        />
        <button
          onClick={handleApplyVoucher}
          className="ml-3 px-6 py-3 bg-blue-600 text-white rounded-r-lg text-sm font-medium hover:bg-blue-700"
        >
          Áp dụng
        </button>
      </div>

      {/* Tổng tiền */}
      <div className="total-prices w-full mt-4 text-sm space-y-3 p-4 bg-gray-100 rounded-md">
        <div className="flex justify-between">
          <span className="font-medium">Tạm tính:</span>
          <span>{totalPrice.toLocaleString("vi-VN")}₫</span>
        </div>
        <div className="flex justify-between">
    <span className="font-medium">Phí vận chuyển:</span>
    <span>0₫</span>
  </div>


        {discount > 0 && (
          <>
            <div className="flex justify-between text-green-600">
              <span className="font-medium">Giảm giá:</span>
              <span>-{discount.toLocaleString("vi-VN")}₫</span>
            </div>
            


            <div className="flex justify-between text-base font-semibold border-t pt-2 mt-2">
              <span>Thành tiền:</span>
              <span>{finalTotal.toLocaleString("vi-VN")}₫</span>
            </div>
          </>
        )}
      </div>

      <button
        className="checkout-btn mt-4"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Đang xử lý..." : "Đặt hàng"}
      </button>
    </div>
  </div>
</div>

</div>
  );
};

export default Checkout;