import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaHeart, FaRegHeart, FaEye, FaShoppingCart } from "react-icons/fa";
import { FieldTimeOutlined } from "@ant-design/icons";

interface Product {
  _id: string;
  title: string;
  priceDefault: number;
  imageUrl: string[];
  isFavorite?: boolean;
  salePrice?: number;
  discountPercent?: number;
}

const FlashSaleSection: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [timeLeft, setTimeLeft] = useState("00:59:59");

  useEffect(() => {
    const fetchFlashSale = async () => {
      try {
        const res = await axios.get("http://localhost:8888/api/flashsale");
        const flashSalesData = res.data?.data || [];
        
        const productsWithSale = flashSalesData.map((fs: any) => ({
          ...fs.product,
          salePrice: fs.salePrice,
          discountPercent: fs.discountPercent,
        }));
        
        setProducts(productsWithSale);
      } catch (err) {
        console.error("Lỗi lấy flash sale:", err);
      }
    };

    fetchFlashSale();

    const endTime = Date.now() + 60 * 60 * 1000;
    const timer = setInterval(() => {
      const now = Date.now();
      const difference = endTime - now;
      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft("00:00:00");
      } else {
        const hours = String(Math.floor(difference / (1000 * 60 * 60))).padStart(2, '0');
        const minutes = String(Math.floor((difference / 1000 / 60) % 60)).padStart(2, '0');
        const seconds = String(Math.floor((difference / 1000) % 60)).padStart(2, '0');
        setTimeLeft(`${hours}:${minutes}:${seconds}`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="flash-sale-section bg-red-500 py-10 rounded-lg shadow-inner">
      <div className="section-header container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center mb-6">
        <h2 className="section-title text-3xl font-bold text-red-600">
          🔥 <span className="text-red-800">Flash</span> Sale
        </h2>
        <div className="countdown flex items-center space-x-2 text-red-600 font-bold text-xl bg-red-200 px-4 py-2 rounded-full">
          <span className="animate-pulse"><FieldTimeOutlined /></span>
          <span>Kết thúc sau: {timeLeft}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.map((product) => {
          const image = Array.isArray(product.imageUrl)
            ? product.imageUrl[0]
            : "/placeholder-image.jpg";
          const originalPrice = product.priceDefault ?? 0;
          const discount = product.discountPercent ?? 0;
          const salePrice = product.salePrice ?? Math.round(originalPrice * (1 - discount / 100));
          const isFreeShip = salePrice > 10000000;

          const handleFavoriteClick = (e: React.MouseEvent) => {
            e.stopPropagation();
            console.log(`Toggle favorite for ${product.title}`);
          };

          const handleQuickView = (e: React.MouseEvent) => {
            e.stopPropagation();
            console.log(`Quick view: ${product.title}`);
          };

          const handleAddToCart = (e: React.MouseEvent) => {
            e.stopPropagation();
            console.log(`Add to cart: ${product.title}`);
          };

          return (
            <div
              key={product._id}
              onClick={() => (window.location.href = `/product/${product._id}`)}
              className="group rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden relative bg-white border border-gray-100 transform hover:-translate-y-1"
            >
              <div className="absolute top-3 left-3 z-10 flex flex-row gap-2 flex-wrap">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                  Trả góp 0%
                </span>
                {isFreeShip && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    Free Ship
                  </span>
                )}
              </div>
              <button
                onClick={handleFavoriteClick}
                className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform duration-200 z-10"
                title="Yêu thích"
              >
                {product.isFavorite ? (
                  <FaHeart className="text-red-500 text-lg" />
                ) : (
                  <FaRegHeart className="text-gray-400 text-lg group-hover:text-red-500 transition-colors" />
                )}
              </button>
              <div className="relative w-full aspect-[4/5] bg-gray-50 flex items-center justify-center overflow-hidden">
                <img
                  src={image}
                  alt={product.title}
                  className="max-h-[80%] max-w-[80%] object-contain transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-3">
                    <button
                      onClick={handleQuickView}
                      className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-transform transform hover:scale-110"
                      title="Xem nhanh"
                    >
                      <FaEye className="text-gray-600 text-sm" />
                    </button>
                    <button
                      onClick={handleAddToCart}
                      className="bg-blue-600 p-3 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-110"
                      title="Thêm vào giỏ hàng"
                    >
                      <FaShoppingCart className="text-white text-sm" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-800 line-clamp-2" title={product.title}>
                  {product.title}
                </h3>
                <div className="flex flex-col mt-2">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-gray-400 line-through text-sm">
                      {originalPrice.toLocaleString("vi-VN")}₫
                    </span>
                    <span className="text-red-600 font-bold text-lg">
                      {salePrice.toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                  <span
                    className={`mt-1 text-xs font-medium px-2 py-[2px] rounded-full w-fit 
                    ${salePrice > 20000000 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}
                  >
                    Giảm {discount}% trực tiếp
                  </span>
                </div>
                <div className="flex items-center mt-2">
                  <div className="flex text-yellow-400 text-sm">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>{i < 4 ? "★" : "☆"}</span>
                    ))}
                  </div>
                  <span className="text-gray-500 text-xs ml-2">(24 đánh giá)</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Vị trí mới của nút "Xem tất cả" */}
      <div className="text-center mt-8">
        <a
          href="/all-sales"
          className=" text-white font-bold py-3 px-8 "
        >
          Xem tất cả sản phẩm sale →
        </a>
      </div>
    </section>
  );
};

export default FlashSaleSection;