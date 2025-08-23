import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  StarFilled,
  StarOutlined,
  CarOutlined,
  SafetyCertificateOutlined,
  ReloadOutlined,
  ShoppingCartOutlined,
  CheckOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { Button, message } from "antd";
import axios from "../../api/axios.config";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import "./ProductDetail.css";

const formatPrice = (price: number) =>
  Number(price || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const FlashSaleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [flashSale, setFlashSale] = useState<any>(null);
  const [product, setProduct] = useState<any>(null);
  const [group, setGroup] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -120 : 120, behavior: "smooth" });
  };

  // Lấy flash sale theo id
  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/flashsale/${id}`);
        setFlashSale(data?.data);
        setProduct(data?.data?.product);
        setSelectedColor(0);
        setSelectedImage(0);
      } catch (e) {
        console.error("Lỗi lấy flash sale:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Lấy group sản phẩm nếu có
  useEffect(() => {
    const gid = product?.groupId?._id || product?.groupId;
    if (!gid) return;
    (async () => {
      try {
        const { data } = await axios.get(`/product/group/${gid}`);
        setGroup(data?.data ?? []);
      } catch (e) {
        console.error("Lỗi lấy group:", e);
      }
    })();
  }, [product]);

  const variant = product?.variants?.[selectedColor];

  const handleAddToCart = async () => {
    try {
      if (!variant || variant.stock === 0) return;
      const token = localStorage.getItem("token");
      if (!token) return alert("Bạn cần đăng nhập để thêm vào giỏ hàng");

      await axios.post(
        "/cart/add",
        { productId: product._id, variantId: variant._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      message.open({
        type: "success",
        content: "Đã thêm vào giỏ hàng!",
        icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
        duration: 2,
        style: { marginTop: "20vh", textAlign: "center", fontSize: 16 },
      });
    } catch (error) {
      console.error("Lỗi thêm giỏ:", error);
      alert("Thêm vào giỏ hàng thất bại");
    }
  };

  const handleBuyNow = async () => {
    try {
      if (!variant || variant.stock === 0) return alert("Sản phẩm đã hết hàng");
      const token = localStorage.getItem("token");
      if (!token) return alert("Bạn cần đăng nhập để mua hàng");

      const selectedItem = {
        productId: product._id,
        variantId: variant._id,
        quantity: 1,
        price: variant.price,
        name: product.title ?? product.name,
        image: variant.imageUrl?.[0],
      };

      await axios.post(
        "/cart/add",
        { productId: product._id, variantId: variant._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.setItem("selectedCheckoutItems", JSON.stringify([selectedItem]));
      navigate("/checkout");
    } catch (error) {
      console.error("Lỗi mua ngay:", error);
      alert("Mua ngay thất bại, vui lòng thử lại.");
    }
  };

  if (loading) return <p className="text-center text-gray-600 mt-10">Loading...</p>;
  if (!product) return <p className="text-red-600 mt-10 text-center">Không tìm thấy sản phẩm</p>;

  const title = product.title ?? product.name ?? "Sản phẩm";
  const cover = Array.isArray(variant?.imageUrl) ? variant.imageUrl[0] : variant?.imageUrl;

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ảnh */}
        <div className="space-y-4">
          <div className="w-full aspect-square bg-white border rounded-xl shadow-md flex items-center justify-center overflow-hidden">
            {cover ? (
              <img src={cover} alt={title} className="max-h-[420px] object-contain transition-transform duration-300 hover:scale-105" />
            ) : (
              <div className="w-full h-full bg-gray-50" />
            )}
          </div>

          {/* Thumbnails */}
          {Array.isArray(variant?.imageUrl) && variant.imageUrl.length > 0 && (
            <div className="relative">
              <button onClick={() => scroll("left")} className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full z-10">
                <ChevronLeft size={20} />
              </button>
              <div ref={scrollRef} className="flex gap-3 overflow-x-auto px-8 no-scrollbar">
                <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-lg border border-red-500 flex flex-col items-center justify-center text-[10px] text-gray-700">
                  <Star className="w-5 h-5 text-red-500 mb-1" />
                  <span className="text-center leading-tight">Flash Sale</span>
                </div>
                {variant.imageUrl.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-lg overflow-hidden border ${selectedImage === i ? "border-red-500 shadow-md" : "border-gray-300"}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              <button onClick={() => scroll("right")} className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full z-10">
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Thông tin */}
        <div className="space-y-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h1>

          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (i < 4 ? <StarFilled key={i} className="text-yellow-400 text-lg" /> : <StarOutlined key={i} className="text-gray-300 text-lg" />))}
            <span className="text-sm text-gray-600 ml-2">(0 đánh giá)</span>
          </div>

          {/* Giá */}
          <div className="flex flex-wrap items-center gap-3 mt-1">
            {flashSale && flashSale.variant === variant?._id ? (
              <>
                <span className="line-through text-gray-400 text-lg">{formatPrice(variant.price)}</span>
                <span className="text-red-600 text-2xl sm:text-3xl font-bold">{formatPrice(flashSale.salePrice)}</span>
                <span className="bg-red-100 text-red-600 px-2 py-1 text-sm rounded-full font-medium">Giảm {flashSale.discountPercent}%</span>
              </>
            ) : (
              <span className="text-red-600 text-2xl sm:text-3xl font-bold">{formatPrice(variant?.price ?? product?.priceDefault ?? 0)}</span>
            )}
          </div>

          {/* Group */}
          {group.length > 1 && (
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Dung lượng/phiên bản:</h3>
              <div className="flex flex-wrap gap-2">
                {group.map((item) => (
                  <Link
                    key={item._id}
                    to={`/flashsale/product/${item._id}`}
                    className={`px-3 py-1.5 rounded-full text-sm border ${item._id === product._id ? "bg-blue-600 text-white border-blue-600" : "bg-white border-gray-300 text-gray-700 hover:border-blue-400"}`}
                  >
                    {item.capacity ?? item.title ?? "Phiên bản"}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Nút mua */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Button type="primary" icon={<ShoppingCartOutlined />} onClick={handleAddToCart} className="h-12 w-full sm:w-auto px-6 text-base bg-[#0066cc] hover:bg-blue-700 border-none" disabled={variant?.stock === 0}>
              Thêm vào giỏ hàng
            </Button>
            <Button type="default" onClick={handleBuyNow} className="h-12 w-full sm:w-auto px-6 text-base bg-[#004a99] text-white border-none hover:opacity-90" disabled={variant?.stock === 0}>
              Mua ngay
            </Button>
          </div>

          {/* Chính sách */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 text-sm text-center">
            <div className="bg-gray-50 p-3 rounded-xl border">
              <CarOutlined className="text-blue-500 text-xl" />
              <p className="mt-2">Miễn phí vận chuyển</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl border">
              <SafetyCertificateOutlined className="text-blue-500 text-xl" />
              <p className="mt-2">Bảo hành 12 tháng</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl border">
              <ReloadOutlined className="text-blue-500 text-xl" />
              <p className="mt-2">Đổi trả 7 ngày</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashSaleDetail;
