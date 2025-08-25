import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaHeart, FaRegHeart, FaEye, FaShoppingCart } from "react-icons/fa";

interface Product {
    _id: string;
    title: string;
    priceDefault: number;
    imageUrl: string[];
    isFavorite?: boolean;
    salePrice?: number;
    discountPercent?: number;
    rating?: number; // số sao trung bình
    reviewCount?: number; // số lượt đánh giá
}

const AllSalesPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllSales = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:8888/api/flashsale"
                );
                const flashSalesData = res.data?.data || [];

                const productsWithSale = flashSalesData.map((fs: any) => ({
                    ...fs.product,
                    salePrice: fs.salePrice,
                    discountPercent: fs.discountPercent,
                    rating: fs.product?.rating || 4, // giả định dữ liệu trả về
                    reviewCount: fs.product?.reviewCount || 24,
                }));

                setProducts(productsWithSale);
            } catch (err) {
                console.error("Lỗi lấy tất cả flash sale:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllSales();
    }, []);

    if (loading) {
        return <p className="text-center mt-10 text-lg">Đang tải dữ liệu...</p>;
    }

    return (
        <section className="container mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-red-600 mb-6">
                Tất cả sản phẩm Flash Sale
            </h1>
            {products.length === 0 ? (
                <p>Không có sản phẩm nào.</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                    {products.map((product) => {
                        const image = Array.isArray(product.imageUrl)
                            ? product.imageUrl[0]
                            : "/placeholder-image.jpg";
                        const originalPrice = product.priceDefault ?? 0;
                        const discount = product.discountPercent ?? 0;
                        const salePrice =
                            product.salePrice ??
                            Math.round(originalPrice * (1 - discount / 100));
                        const isFreeShip = salePrice > 10000000;

                        return (
                            <div
                                key={product._id}
                                onClick={() =>
                                    (window.location.href = `/product/${product._id}`)
                                }
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
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        console.log(
                                            `Toggle favorite for ${product.title}`
                                        );
                                    }}
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
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                                className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-transform transform hover:scale-110"
                                                title="Xem nhanh"
                                            >
                                                <FaEye className="text-gray-600 text-sm" />
                                            </button>
                                            <button
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                                className="bg-blue-600 p-3 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-110"
                                                title="Thêm vào giỏ hàng"
                                            >
                                                <FaShoppingCart className="text-white text-sm" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3
                                        className="text-sm font-medium text-gray-800 line-clamp-2"
                                        title={product.title}
                                    >
                                        {product.title}
                                    </h3>
                                    <div className="flex flex-col mt-2">
                                        <div className="flex items-baseline space-x-2">
                                            <span className="text-gray-400 line-through text-sm">
                                                {originalPrice.toLocaleString(
                                                    "vi-VN"
                                                )}
                                                ₫
                                            </span>
                                            <span className="text-red-600 font-bold text-lg">
                                                {salePrice.toLocaleString(
                                                    "vi-VN"
                                                )}
                                                ₫
                                            </span>
                                        </div>
                                        <span
                                            className={`mt-1 text-xs font-medium px-2 py-[2px] rounded-full w-fit 
                          ${
                              salePrice > 20000000
                                  ? "bg-red-100 text-red-600"
                                  : "bg-green-100 text-green-600"
                          }`}
                                        >
                                            Giảm {discount}% trực tiếp
                                        </span>
                                    </div>
                                    {/* Đánh giá */}
                                    <div className="flex items-center mt-2">
                                        <div className="flex text-yellow-400 text-sm">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i}>
                                                    {i < (product.rating || 0)
                                                        ? "★"
                                                        : "☆"}
                                                </span>
                                            ))}
                                        </div>
                                        <span className="text-gray-500 text-xs ml-2">
                                            ({product.reviewCount || 0} đánh
                                            giá)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
};

export default AllSalesPage;
