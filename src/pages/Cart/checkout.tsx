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
  FaCity,
  FaMap,
  FaMapSigns,
  FaHome,
  FaTicketAlt,
} from "react-icons/fa";
import "./Checkout.css";
import { jwtDecode } from "jwt-decode";
import { CheckoutFormValues, validateCheckout } from "../../utils/checkoutValidation";
import AddressForm from "./compudent/AddressSelector";
import { Input, Modal } from "antd";
import VoucherInput from "./compudent/VoucherInput";

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
  const [errors, setErrors] = useState<Partial<CheckoutFormValues>>({}); // 🆕 thêm state errors

  const [voucherCode, setVoucherCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
// const [address, setAddress] = useState("");   // Giá trị gộp
const [city, setCity] = useState("");
const [district, setDistrict] = useState("");
const [ward, setWard] = useState("");
const [cuthe, setCuthe] = useState("");


const handleAddressChange = (value: string, type: 'city' | 'district' | 'ward' | 'cuthe') => {
  let newCity = city;
  let newDistrict = district;
  let newWard = ward;
  let newCuthe = cuthe;

  if (type === 'city') newCity = value;
  if (type === 'district') newDistrict = value;
  if (type === 'ward') newWard = value;
  if (type === 'cuthe') newCuthe = value;

  setCity(newCity);
  setDistrict(newDistrict);
  setWard(newWard);
  setCuthe(newCuthe);

  setAddress(`${newCuthe}, ${newWard}, ${newDistrict}, ${newCity}`);
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

const handleApplyVoucher = async (code: string) => {
  if (!code) return;

  try {
    const res = await axios.post("/vouchers/apply", {
      code,
      total: totalPrice,
      categoryIds,
    });
    setDiscount(res.data.discount);
    toast.success(res.data.message || "Áp dụng mã thành công!");
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Không áp dụng được mã");
    setDiscount(0);
  }
};



  const handleSubmit = async () => {
     const formValues: CheckoutFormValues = {
    fullName,
    phone,
    city,
    district,
    ward,
    cuthe,
    paymentMethod,
  };
const validationErrors = validateCheckout(formValues);
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    toast.error("Vui lòng kiểm tra lại thông tin");
    return;
  }
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

  Modal.confirm({
   title: " Xác nhận mua hàng",
    centered: true,          // modal sẽ hiển thị chính giữa màn hình
    width: 450,   
    // height:400,           // độ rộng modal (mặc định 520)
    okText: "Có, mua ngay",
    cancelText: "Huỷ",
     content: (
    <div style={{ height: 300, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <p style={{ fontSize: 18, fontWeight: 300 }}>Bạn có chắc muốn mua các sản phẩm này không?</p>
     
    </div>
  ),

    onOk: async () => {  try {
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
    }}
  });




  



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
        <div className="flex items-center gap-3">
          <FaUser className="text-gray-400 text-2xl flex-shrink-0" />
          <Input
            placeholder="Nhập họ tên"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            size="large"
            className={`${errors.fullName ? "border-red-500" : ""}`}
          />
        </div>
        {errors.fullName && (
          <span className="text-red-500 text-xs mt-1">{errors.fullName}</span>
        )}
      </div>

      {/* Số điện thoại */}
      <div className="flex flex-col w-full mt-4">
        <span className="mb-2 text-gray-700 font-medium">Số điện thoại</span>
        <div className="flex items-center gap-3">
          <FaPhone className="text-gray-400 text-2xl flex-shrink-0" />
          <Input
            placeholder="Nhập số điện thoại"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            size="large"
            className={`${errors.phone ? "border-red-500" : ""}`}
          />
        </div>
        {errors.phone && (
          <span className="text-red-500 text-xs mt-1">{errors.phone}</span>
        )}
      </div>

    {/* Địa chỉ */}
 <AddressForm
  city={city}
  district={district}
  ward={ward}
  cuthe={cuthe}
  errors={errors}
  onChange={handleAddressChange}
/>


    {/* Phương thức thanh toán */}
    <div className="mt-5">

      <span className="block mb-2 text-gray-700 font-medium">Phương thức thanh toán</span>
    <div className="flex flex-row items-stretch gap-2 mt-5">
      {/* Ô chọn COD */}
      <label
        className={`
          flex flex-1 items-center gap-2 p-3 rounded-lg cursor-pointer transition-all duration-300
          ${paymentMethod === "COD"
            ? "border-2 border-blue-500 bg-blue-50 shadow-sm"
            : "border border-gray-300 bg-white hover:border-blue-400"}
        `}
      >
        <input
          type="radio"
          name="paymentMethod"
          value="COD"
          checked={paymentMethod === "COD"}
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
          ${paymentMethod === "VNPay"
            ? "border-2 border-blue-500 bg-blue-50 shadow-sm"
            : "border border-gray-300 bg-white hover:border-blue-400"}
        `}
      >
        <input
          type="radio"
          name="paymentMethod"
          value="VNPay"
          checked={paymentMethod === "VNPay"}
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
    {errors.paymentMethod && (
      <p className="text-red-500 text-sm mt-2">{errors.paymentMethod}</p>
    )}
  </div>
</div>
</div>



    {/* Bên phải - Sản phẩm, voucher, tổng tiền */}
    <div className="checkout-right">
 <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
  Sản phẩm
</h2>


  <div className="cart-items">
  {selectedItems.length > 0 ? (
    selectedItems.map((item: any) => {
      const name =
        item.name || item.productTitle || item.productId?.title || "Sản phẩm";

      const variant = item.variant || item.variantId || {};
      const variantAttributes = variant.attributes || [];

      // Lấy Màu: ưu tiên variant, fallback item.color
      const colorAttr = variantAttributes.find(
        (attr: any) =>
          attr.attributeId?.attributeCode === "color" ||
          attr.attributeId?.name?.toLowerCase().includes("màu")
      );
      const color = colorAttr?.attributeValueId?.value || item.color;

      // Lấy Dung lượng / Storage: ưu tiên variant, fallback product.capacity
      const storageAttr = variantAttributes.find(
        (attr: any) =>
          attr.attributeId?.attributeCode === "storage" ||
          attr.attributeId?.name?.toLowerCase().includes("dung lượng") ||
          attr.attributeId?.name?.toLowerCase().includes("capacity")
      );
      const storage =
        storageAttr?.attributeValueId?.value ||
        item.product?.capacity ||
        item.productId?.capacity;

      const image =
        item.image ||
        variant?.imageUrl?.[0] ||
        item.product?.imageUrl?.[0] ||
        item.productId?.imageUrl?.[0] ||
        "/placeholder.jpg";

      const price = item.price || variant?.price || 0;

      console.log("Cart Item:", item);
      console.log("Variant Attributes:", variantAttributes);
      console.log("Color:", color);
      console.log("Storage:", storage);

      return (
        <div
          key={item._id || item.variantId?._id}
          className="flex items-center gap-4 border border-gray-200 p-4 rounded-lg bg-white shadow-sm mb-4"
        >
          <img
            src={image}
            alt={name}
            className="w-24 h-24 object-cover rounded-md flex-shrink-0"
          />
          <div className="flex-1">
            <p className="text-base font-semibold text-gray-800">{name}</p>

            {color && (
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">Màu:</span> {color}
              </p>
            )}

            {storage && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Dung lượng:</span> {storage}
              </p>
            )}

            <p className="text-sm font-bold text-blue-600 mt-2">
              <span className="font-normal text-gray-600">{item.quantity} x</span>{" "}
              {price.toLocaleString("vi-VN")}₫
            </p>
          </div>
        </div>
      );
    })
  ) : (
    <p>Không có sản phẩm được chọn.</p>
  )}
</div>




      {/* Mã giảm giá */}
  <div className="flex items-center gap-3">
  {/* Icon voucher */}
<FaTicketAlt className="text-xl text-gray-500" />
  
  {/* Voucher Input */}
  <VoucherInput
    onApply={(code) => {
      setVoucherCode(code); 
      if (!code) {
        setDiscount(0); // reset giảm giá nếu xoá
      } else {
        handleApplyVoucher(code); 
      }
    }}
  />
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
    <div className="flex justify-between text-green-600">
      <span className="font-medium">Giảm giá:</span>
      <span>-{discount.toLocaleString("vi-VN")}₫</span>
    </div>
  )}

  {/* Thành tiền luôn hiển thị */}
  <div className="flex justify-between text-base font-semibold border-t pt-2 mt-2">
    <span>Thành tiền:</span>
    <span className="text-red-600">
      {finalTotal.toLocaleString("vi-VN")}₫
    </span>
  </div>
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