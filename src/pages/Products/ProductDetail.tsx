import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeftOutlined,
  StarFilled,
  StarOutlined,
  CarOutlined,
  SafetyCertificateOutlined,
  ReloadOutlined,
  ShoppingCartOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import axios from "axios";
import "./ProductDetail.css";
import { useNavigate } from "react-router-dom";

const formatPrice = (price: number) =>
  price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const ProductDetaill = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [group, setGroup] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:8888/api/product/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Lỗi khi fetch sản phẩm:", err);
      }
    };
    fetchProduct();
  }, [id]);
const navigate = useNavigate();

const handleBuyNow = async () => {
  try {
    const variant = product.variants?.[selectedColor];
    if (!variant) return;

    const token = localStorage.getItem("token");
    if (!token) return alert("Bạn cần đăng nhập để mua hàng");

    // Lưu sản phẩm vào localStorage để trang Checkout đọc được
    const selectedItem = {
      productId: product._id,
      variantId: variant._id,
      quantity: 1,
      price: variant.price,
      name: product.title,
      image: variant.imageUrl?.[0],
    };
    localStorage.setItem("selectedCheckoutItems", JSON.stringify([selectedItem]));

    // (Tùy chọn) Gọi API thêm vào giỏ nếu bạn vẫn muốn giữ chức năng này
    await axios.post(
      "http://localhost:8888/api/cart/add",
      {
        productId: product._id,
        variantId: variant._id,
        quantity: 1,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    navigate("/checkout");
  } catch (error) {
    console.error("Lỗi mua ngay:", error);
    alert("Mua ngay thất bại");
  }
};

  useEffect(() => {
    const fetchGroup = async () => {
      if (product?.groupId?._id) {
        try {
          const { data } = await axios.get(
            `http://localhost:8888/api/product/group/${product.groupId._id}`
          );
          setGroup(data);
        } catch (error) {
          console.error("Lỗi khi fetch group:", error);
        }
      }
    };
    fetchGroup();
  }, [product]);

  const handleAddToCart = async () => {
    try {
      const variant = product.variants?.[selectedColor];
      if (!variant) return;

      const token = localStorage.getItem("token");
      if (!token) return alert("Bạn cần đăng nhập để thêm vào giỏ hàng");

      await axios.post(
        "http://localhost:8888/api/cart/add",
        {
          productId: product._id,
          variantId: variant._id,
          quantity: 1,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Đã thêm vào giỏ hàng");
    } catch (error) {
      console.error("Lỗi thêm giỏ hàng:", error);
      alert("Thêm vào giỏ hàng thất bại");
    }
  };

  if (!product) return <div className="p-10 text-center text-gray-500">Loading...</div>;

  const variant = product.variants?.[selectedColor];

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-10">
    

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Ảnh */}
        <div className="bg-white p-4 rounded-xl shadow-md">
          <div className="w-full overflow-hidden border rounded-lg">
            <img
              src={variant?.imageUrl?.[selectedImage]}
              className="w-full max-h-[400px] object-contain hover:scale-105 transition-transform duration-300"
              alt="Ảnh sản phẩm"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {variant?.imageUrl?.map((img: string, i: number) => (
              <img
                key={i}
                src={img}
                onClick={() => setSelectedImage(i)}
                className={`w-16 h-16 object-cover rounded border-2 cursor-pointer transition duration-200 ${
                  selectedImage === i
                    ? "border-blue-600 shadow-md"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Thông tin */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900 leading-snug">
            {product.title}
          </h1>

          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) =>
              i < 4 ? (
                <StarFilled key={i} className="text-yellow-400 text-lg" />
              ) : (
                <StarOutlined key={i} className="text-gray-300 text-lg" />
              )
            )}
            <span className="text-sm text-gray-600 ml-2">(214 đánh giá)</span>
          </div>

         {/* Giá sản phẩm chính */}
<div className="flex items-center gap-3 mt-1">
  {variant?.oldPrice && variant.oldPrice > variant.price ? (
    <>
      <span className="line-through text-gray-400 text-lg">
        {formatPrice(variant.oldPrice)}
      </span>
      <span className="text-red-600 text-3xl font-bold">
        {formatPrice(variant.price)}
      </span>
      <span className="bg-red-100 text-red-600 px-2 py-1 text-sm rounded-full font-medium">
        Giảm {Math.round(((variant.oldPrice - variant.price) / variant.oldPrice) * 100)}%
      </span>
    </>
  ) : (
    <span className="text-red-600 text-3xl font-bold">
      {formatPrice(variant.price)}
    </span>
  )}
</div>


          {/* Group capacity */}
          {group.length > 1 && (
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Dung lượng/phiên bản:</h3>
              <div className="flex flex-wrap gap-3">
                {group.map((item) => (
                  <Link
                    key={item._id}
                    to={`/product/${item._id}`}
                    className={`px-4 py-2 rounded-full text-sm border font-medium transition ${
                      item._id === product._id
                        ? "bg-blue-600 text-white border-blue-600 scale-105"
                        : "bg-white border-gray-300 text-gray-700 hover:border-blue-400"
                    }`}
                  >
                    {item.capacity}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Biến thể màu */}
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Chọn màu:</h3>
            <div className="flex flex-wrap gap-4">
              {product.variants.map((v: any, idx: number) => (
                <div
                  key={idx}
                  onClick={() => setSelectedColor(idx)}
                  className={`flex items-center justify-between w-64 border rounded-xl p-2 cursor-pointer transition relative group gap-2 ${
                    selectedColor === idx
                      ? "border-[#0066cc] bg-[#f0f8ff] shadow-lg scale-105"
                      : "border-gray-300 hover:border-[#999] hover:shadow bg-white"
                  }`}
                >
                  <img
                    src={v.imageUrl?.[0]}
                    alt={v.attributes?.[0]?.attributeValueId?.value || "Màu"}
                    className="w-14 h-14 object-contain rounded border"
                  />
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-gray-800">
                      {v.attributes?.[0]?.attributeValueId?.value || v.name}
                    </div>
                    {v.oldPrice && v.oldPrice > v.price && (
                      <div className="text-xs text-gray-400 line-through">
                        {formatPrice(v.oldPrice)}
                      </div>
                    )}
                    <div className="text-sm text-red-600 font-semibold">
                       {formatPrice(v.price)}
</div>

                  </div>
                  {selectedColor === idx && (
                    <CheckOutlined className="absolute top-2 right-2 text-[#0066cc] bg-white rounded-full" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-6">
            <Button
              type="primary"
              icon={<ShoppingCartOutlined />}
              onClick={handleAddToCart}
              className="h-12 px-6 text-base bg-[#0066cc] hover:bg-blue-700 border-none shadow rounded-xl"
            >
              Thêm vào giỏ hàng
            </Button>
 <Button
        type="default"
  onClick={handleBuyNow}
  className="h-12 px-6 text-base bg-[#004a99] text-white border-none hover:opacity-90 shadow rounded-xl"
>
  Mua ngay
</Button>

          </div>

          <div className="grid grid-cols-3 gap-4 mt-8 text-sm text-center text-gray-700">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <CarOutlined className="text-blue-500 text-2xl" />
              <p className="mt-2">Miễn phí vận chuyển</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <SafetyCertificateOutlined className="text-blue-500 text-2xl" />
              <p className="mt-2">Bảo hành 12 tháng</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <ReloadOutlined className="text-blue-500 text-2xl" />
              <p className="mt-2">Đổi trả 7 ngày</p>
            </div>
          </div>
        </div>
        
      </div>  
    </div>
  );
};

export default ProductDetaill;
