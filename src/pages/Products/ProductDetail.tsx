import { useEffect, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
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
import DescriptionCard from "./compudent/Mota";

const formatPrice = (price: number) =>
  Number(price || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const isObjectId = (s: string) => /^[a-f\d]{24}$/i.test(s);

// ====== Fallback endpoints cho comments (khớp ReviewProduct) ======
const COMMENT_BASES = [
  "http://localhost:8888/api/comments",
  "http://localhost:8888/api/comments/comments",
] as const;

async function fetchProductByParam(param: string) {
  if (isObjectId(param)) {
    const { data } = await axios.get(`/product/${param}`);
    return data?.data ?? data;
  }
  try {
    const { data } = await axios.get(`/product/slug/${param}`);
    return data?.data ?? data;
  } catch {
    const { data } = await axios.get(`/product?slug=${encodeURIComponent(param)}`);
    return Array.isArray(data?.data) ? data.data[0] : data?.data ?? data;
  }
}

// Đọc toàn bộ comments theo productId (dùng fetch để không phụ thuộc axios baseURL)
async function fetchCommentsByProductId(productId: string) {
  let lastErr: any;
  for (const base of COMMENT_BASES) {
    try {
      const res = await fetch(`${base}/${productId}`);
      if (!res.ok) {
        lastErr = new Error(`HTTP ${res.status}`);
        continue;
      }
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

// Component hiển thị sao (không dùng hook)
const StarsRow: React.FC<{ value: number }> = ({ value }) => {
  const rounded = Math.round(value || 0);
  return (
    <>
      {[1, 2, 3, 4, 5].map((i) =>
        i <= rounded ? (
          <StarFilled key={i} className="text-yellow-400 text-lg" />
        ) : (
          <StarOutlined key={i} className="text-gray-300 text-lg" />
        )
      )}
    </>
  );
};

const ProductDetail = () => {
  const { id: param = "" } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [group, setGroup] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [loading, setLoading] = useState(true);

  const [flashSale, setFlashSale] = useState<any>(null);


  // === summary rating từ comments ===
  const [ratingAvg, setRatingAvg] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -120 : 120, behavior: "smooth" });
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const p = await fetchProductByParam(param);
        setProduct(p || null);
        setSelectedColor(0);
        setSelectedImage(0);
      } catch (e) {
        console.error("Lỗi lấy sản phẩm:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [param]);

  useEffect(() => {
    const gid = product?.groupId?._id || product?.groupId;
    if (!gid) return;
    (async () => {
      try {
        const { data } = await axios.get(`/product/group/${gid}`);
        setGroup(data?.data ?? data ?? []);
      } catch (e) {
        console.error("Lỗi lấy group:", e);
      }
    })();
  }, [product]);

  // Lấy comments -> tính average + count mỗi khi có product._id
  useEffect(() => {
    (async () => {
      try {
        if (!product?._id) {
          setRatingAvg(0);
          setRatingCount(0);
          return;
        }
        const comments = await fetchCommentsByProductId(product._id);
        const valid = comments.filter(
          (c: any) => Number(c?.rating) >= 1 && Number(c?.rating) <= 5
        );
        const count = valid.length;
        const avg = count
          ? valid.reduce((a: number, c: any) => a + Number(c.rating || 0), 0) / count
          : 0;
        setRatingAvg(avg);
        setRatingCount(count);
      } catch (e) {
        console.error("Lỗi lấy đánh giá:", e);
        setRatingAvg(0);
        setRatingCount(0);
      }
    })();
  }, [product?._id]);

  const variant = product?.variants?.[selectedColor];

  useEffect(() => {
    if (!product?._id || !variant?._id) return;

    (async () => {
      try {
        const { data } = await axios.get(`/flashsale/product/${product._id}`);
        setFlashSale(data?.data ?? null);
      } catch (e) {
        console.log("Không có flash sale cho sp này");
      }
    })();
  }, [product, variant]);

const getVariantPrice = (v: any) => {
  if (!v) return 0;
  if (
    flashSale &&
    flashSale.variant?._id === v._id &&
    flashSale.soldQuantity < flashSale.quantity
  ) {
    return flashSale.salePrice;
  }
  return v.price;
};


  const getVariantStockText = (v: any) => {
    if (!v) return "";
    if (v.stock === 0) return "Hết hàng";
    if (v.stock <= 5) return `Chỉ còn ${v.stock} sản phẩm`;
    return `Còn ${v.stock} sản phẩm`;
  };

const handleAddToCart = async () => {
  try {
    if (!variant || variant.stock === 0) {
      return alert("Sản phẩm đã hết hàng");
    }

    const token = localStorage.getItem("token");
    if (!token) return alert("Bạn cần đăng nhập để thêm vào giỏ hàng");

    // ===== Kiểm tra flash sale còn hiệu lực =====
    const now = new Date().getTime();
    const isFlashSaleActive =
      flashSale &&
      flashSale.variant?._id === variant._id &&
      flashSale.soldQuantity < flashSale.quantity && // vẫn còn sản phẩm trong flash sale
      now >= new Date(flashSale.startTime).getTime() &&
      now <= new Date(flashSale.endTime).getTime();

    // Giá thực tế áp dụng
    const priceToUse = isFlashSaleActive ? flashSale.salePrice : variant.price;

    // Gửi request đến backend, bắt buộc gửi giá đúng
    const res = await axios.post(
      "/cart/add",
      {
        productId: product._id,
        variantId: variant._id,
        quantity: 1,
        price: priceToUse,       // ✅ giá frontend quyết định
        flashSale: isFlashSaleActive, // optional: backend có thể lưu cờ
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const addedItem = res.data;

    message.success(
      `Đã thêm ${addedItem.quantity} sản phẩm vào giỏ với giá ${priceToUse.toLocaleString(
        "vi-VN",
        { style: "currency", currency: "VND" }
      )}`
    );
  } catch (error) {
    console.error("Lỗi thêm giỏ:", error);
    alert("Thêm vào giỏ hàng thất bại, vui lòng thử lại");
  }
};





const handleBuyNow = async () => {
  try {
    if (!variant || variant.stock === 0) return alert("Sản phẩm đã hết hàng");

    const token = localStorage.getItem("token");
    if (!token) return alert("Bạn cần đăng nhập để mua hàng");

    // 👉 Chọn giá đúng (ưu tiên flash sale nếu còn hiệu lực và đúng variant)
    const isFlashSaleActive =
      flashSale &&
      flashSale.variant?._id === variant._id &&
      flashSale.quantity > 0 &&
      new Date().getTime() >= new Date(flashSale.startTime).getTime() &&
      new Date().getTime() <= new Date(flashSale.endTime).getTime();

    const selectedItem = {
      productId: product._id,
      variantId: variant._id,
      quantity: 1,
      price: isFlashSaleActive ? flashSale.salePrice : variant.price, // ✅ sửa ở đây
      name: product.title,
      image: Array.isArray(variant.imageUrl) ? variant.imageUrl[0] : variant.imageUrl,
      flashSale: isFlashSaleActive ? true : false, // thêm cờ flash sale (nếu cần)
      discountPercent: isFlashSaleActive ? flashSale.discountPercent : 0,
    };

    // Thêm vào giỏ
    await axios.post(
      "/cart/add",
      { productId: product._id, variantId: variant._id, quantity: 1 },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Lưu tạm để dùng ở /checkout
    localStorage.setItem("selectedCheckoutItems", JSON.stringify([selectedItem]));

    navigate("/checkout");
  } catch (error) {
    console.error("❌ Lỗi khi mua ngay:", error);
    alert("Mua ngay thất bại, vui lòng thử lại.");
  }
};


  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-10">
        <div className="text-center text-gray-600">Loading...</div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="aspect-square bg-gray-100 rounded-xl animate-pulse" />
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-10">
        <h1 className="text-red-600 text-lg font-semibold">
          Không tìm thấy sản phẩm hoặc đường dẫn không hợp lệ.
        </h1>
      </div>
    );
  }

  const title = product.title ?? product.name ?? "Sản phẩm";

  // Ảnh chính: dùng selectedImage nếu có
  const imgs = Array.isArray(variant?.imageUrl)
    ? variant.imageUrl
    : variant?.imageUrl
    ? [variant.imageUrl]
    : [];
  const cover = imgs[selectedImage] ?? imgs[0];

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ảnh sản phẩm */}
        <div className="space-y-4">
          <div className="w-full aspect-square bg-white border rounded-xl shadow-md flex items-center justify-center overflow-hidden">
            {cover ? (
              <img
                src={cover}
                alt={title}
                className="max-h-[420px] object-contain transition-transform duration-300 hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gray-50" />
            )}
          </div>

          {/* Thumbnails */}
          {imgs.length > 0 && (
            <div className="relative">
              <button
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full z-10"
              >
                <ChevronLeft size={20} />
              </button>

              <div ref={scrollRef} className="flex gap-3 overflow-x-auto px-8 no-scrollbar">
                <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-lg border border-red-500 flex flex-col items-center justify-center text-[10px] text-gray-700">
                  <Star className="w-5 h-5 text-red-500 mb-1" />
                  <span className="text-center leading-tight">
                    Tính năng<br />nổi bật
                  </span>
                </div>

                {imgs.map((img:any, i:any) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-lg overflow-hidden border ${
                      selectedImage === i ? "border-red-500 shadow-md" : "border-gray-300"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              <button
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full z-10"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Thông tin */}
        <div className="space-y-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h1>

          {/* Sao + lượt đánh giá (đồng bộ từ comments) */}
          <div className="flex items-center gap-1">
            <StarsRow value={ratingAvg} />
            <span className="text-sm text-gray-600 ml-2">
              ({ratingCount} đánh giá)
            </span>
          </div>

          {/* Giá */}
        {/* Giá */}
<div className="flex flex-wrap items-center gap-3 mt-1">
  {flashSale &&
  flashSale.variant?._id === variant?._id &&
  flashSale.soldQuantity < flashSale.quantity ? (
    <>
      <span className="line-through text-gray-400 text-lg">
        {formatPrice(variant.price)}
      </span>
      <span className="text-red-600 text-2xl sm:text-3xl font-bold">
        {formatPrice(flashSale.salePrice)}
      </span>
      <span className="bg-red-100 text-red-600 px-2 py-1 text-sm rounded-full font-medium">
        Giảm {flashSale.discountPercent}%
      </span>
    </>
  ) : (
    <span className="text-red-600 text-2xl sm:text-3xl font-bold">
      {formatPrice(variant?.price ?? product?.priceDefault ?? 0)}
    </span>
  )}
</div>


          {/* Phiên bản (group) */}
          {group.length > 1 && (
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Dung lượng/phiên bản:</h3>
              <div className="flex flex-wrap gap-2">
                {group.map((item) => (
                  <Link
                    key={item._id}
                    to={`/product/${item._id}`}
                    className={`px-3 py-1.5 rounded-full text-sm border ${
                      item._id === product._id
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white border-gray-300 text-gray-700 hover:border-blue-400"
                    }`}
                  >
                    {item.capacity ?? item.title ?? "Phiên bản"}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Biến thể / màu sắc */}
          {Array.isArray(product.variants) && product.variants.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Chọn màu:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.variants.map((v: any, idx: number) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedColor(idx)}
                    className={`flex items-center gap-2 border rounded-xl p-2 cursor-pointer transition ${
                      selectedColor === idx
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 bg-white hover:border-gray-400"
                    } ${v.stock === 0 ? "opacity-60" : ""}`}
                  >
                    <img
                      src={Array.isArray(v.imageUrl) ? v.imageUrl[0] : v.imageUrl}
                      alt={v.attributes?.[0]?.attributeValueId?.value || "Màu"}
                      className="w-14 h-14 object-contain rounded"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {v.attributes?.[0]?.attributeValueId?.value || v.name || "Tuỳ chọn"}
                      </div>

                      {/* Giá đúng flash sale */}
                      <div className="text-sm text-red-600 font-semibold">
                        {formatPrice(getVariantPrice(v))}
                      </div>

                      {/* Stock */}
                      <div className="text-xs text-gray-500 mt-1">{getVariantStockText(v)}</div>
                    </div>
                    {selectedColor === idx && <CheckOutlined className="text-blue-500" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nút mua */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Button
              type="primary"
              icon={<ShoppingCartOutlined />}
              onClick={handleAddToCart}
              className="h-12 w-full sm:w-auto px-6 text-base bg-[#0066cc] hover:bg-blue-700 border-none"
              disabled={variant?.stock === 0}
            >
              Thêm vào giỏ hàng
            </Button>
            <Button
              type="default"
              onClick={handleBuyNow}
              className="h-12 w-full sm:w-auto px-6 text-base bg-[#004a99] text-white border-none hover:opacity-90"
              disabled={variant?.stock === 0}
            >
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
       <DescriptionCard
        short={product.shortDescription}
        full={product.description}
      />
    </div>
  );
};

export default ProductDetail;