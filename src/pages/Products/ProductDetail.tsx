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
import ReviewProduct from "./ReviewProduct";

const formatPrice = (price: number) =>
  price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const ProductDetaill = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [product, setProduct] = useState<any>(null);
  const [group, setGroup] = useState<any[]>([]); // đảm bảo là array
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8888/api/product/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Lỗi khi fetch sản phẩm:", error);
      }
    };
    fetchProduct();
  }, [id]);

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

    const userToken = localStorage.getItem("token");
    if (!userToken) {
      return alert("Bạn cần đăng nhập để thêm vào giỏ hàng");
    }

    await axios.post(
      "http://localhost:8888/api/cart/add",
      {
        productId: product._id,
        variantId: variant._id,
        quantity: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    alert("Đã thêm vào giỏ hàng");
  } catch (error: any) {
    console.error("Lỗi thêm giỏ hàng:", error);
    alert("Thêm vào giỏ hàng thất bại");
  }
};

  return (
    <div className="min-h-screen mt-10 mb-10 p-4">
      <div className="mb-4">
        <Link to="/" className="flex items-center text-gray-600 hover:text-black">
          <ArrowLeftOutlined />
          <span className="ml-2">Quay lại</span>
        </Link>
      </div>

      {product && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Ảnh sản phẩm */}
          <div className="flex flex-col items-center bg-white rounded-lg shadow p-6">
            <div className="w-full max-w-2xl overflow-hidden rounded-lg flex justify-center items-center">
              <img
                src={product.variants?.[selectedColor]?.imageUrl?.[0]}
                alt="Ảnh sản phẩm"
                className="w-[60%] h-auto object-contain transition-all duration-300 transform hover:scale-105"
              />
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {product.variants?.[selectedColor]?.imageUrl?.map(
                (img: string, idx: number) => (
                  <img
                    key={idx}
                    src={img}
                    className="w-20 h-20 object-cover rounded-md border-2 cursor-pointer"
                    alt={`Thumbnail ${idx}`}
                    onClick={() => setSelectedImage(idx)}
                  />
                )
              )}
            </div>
          </div>

          {/* Thông tin sản phẩm */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-900">{product.title}</h1>

            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) =>
                i < 4 ? (
                  <StarFilled key={i} style={{ color: "#fadb14", fontSize: 20 }} />
                ) : (
                  <StarOutlined key={i} style={{ color: "#d9d9d9", fontSize: 20 }} />
                )
              )}
              <span className="text-gray-500 text-base">(214 đánh giá)</span>
            </div>

            <div className="text-3xl font-semibold text-red-600">
              {formatPrice(product.variants?.[selectedColor]?.price || 0)}
              {product.variants?.[selectedColor]?.oldPrice && (
                <span className="ml-3 line-through text-gray-400 text-lg">
                  {formatPrice(product.variants[selectedColor].oldPrice)}
                </span>
              )}
            </div>

            <div className="text-sm text-white inline-block bg-red-500 px-3 py-1 rounded">
              {product.variants?.[selectedColor]?.oldPrice && (
                <>
                  Giảm{" "}
                  {Math.round(
                    (1 -
                      product.variants[selectedColor].price /
                        product.variants[selectedColor].oldPrice) *
                      100
                  )}
                  %
                </>
              )}
            </div>
      {group.length > 0 && (
  <div className="mt-12">
    <h2 className="text-2xl font-bold mb-4 text-gray-800">Các phiên bản khác</h2>
    <div className="flex flex-wrap gap-3"> {/* Sử dụng flex-wrap để các item tự động xuống dòng */}
      {group.map((item) => (
        <Link
          key={item._id}
          to={`/product/${item._id}`}
          className={`
            px-5 py-2 rounded-full border-2 text-sm font-medium transition-all duration-200 ease-in-out
            shadow-sm hover:shadow-md
            flex items-center space-x-2
            ${item._id === product?._id
              ? "bg-blue-600 text-white border-blue-600 transform scale-105" // Nổi bật khi được chọn
              : "border-gray-300 hover:border-blue-400 text-gray-700 bg-white hover:bg-blue-50" // Trạng thái mặc định
            }
          `}
        >
          {/* Bạn có thể thêm một biểu tượng nhỏ nếu muốn, ví dụ: <svg>...</svg> */}
          <span className="truncate">
            {item.capacity}
          </span>
          {item._id === product?._id && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </Link>
      ))}
    </div>
  </div>
)}

            {/* Màu sắc */}
            <div className="space-y-2">
              <label className="text-base font-semibold text-gray-900">Màu sắc:</label>
              <div className="grid grid-cols-2 gap-4">
                {product.variants?.map((variant: any, idx: number) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedColor(idx)}
                    className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                      selectedColor === idx
                        ? "border-blue-500 bg-blue-50 shadow"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={variant.imageUrl?.[0]}
                      alt={variant.name}
                      className="w-16 h-16 object-cover rounded border"
                    />
                    <span className="ml-3 text-base font-medium text-gray-900 flex-1">
                      {variant.attributes?.[0]?.attributeValueId?.value || variant.name}
                    </span>
                    {selectedColor === idx && (
                      <CheckOutlined className="text-blue-500 text-lg" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Hành động */}
            <div className="flex flex-wrap gap-4 mt-6">
             <Button
  type="primary"
  icon={<ShoppingCartOutlined />}
  onClick={handleAddToCart}
  className="h-12 px-6 text-base bg-blue-600 hover:bg-blue-700 border-none shadow-md"
>
  Thêm vào giỏ hàng
</Button>


              <Button
                type="default"
                className="h-12 px-6 text-base bg-gradient-to-r from-red-500 to-red-600 text-white border-none hover:opacity-90 shadow-md"
              >
                Mua ngay
              </Button>
            </div>

            {/* Tính năng */}
            <div className="grid grid-cols-3 gap-6 mt-8 text-center">
              <div className="bg-gray-100 p-4 rounded-lg">
                <CarOutlined style={{ fontSize: 28, color: "#1890ff" }} />
                <p className="mt-2 text-sm font-medium">Miễn phí vận chuyển</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <SafetyCertificateOutlined style={{ fontSize: 28, color: "#1890ff" }} />
                <p className="mt-2 text-sm font-medium">Bảo hành 12 tháng</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <ReloadOutlined style={{ fontSize: 28, color: "#1890ff" }} />
                <p className="mt-2 text-sm font-medium">Đổi trả 7 ngày</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Các phiên bản khác cùng group */}


    
    </div>
    
  );
};

export default ProductDetaill;
