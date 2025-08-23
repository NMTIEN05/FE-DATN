import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaRegHeart, FaHeart, FaEye, FaShoppingCart } from "react-icons/fa";
import {
    WishlistItem,
    wishlistService,
} from "../../Services/wishlist/wishlist.service";

interface Product {
    _id: string;
    title: string;
    priceDefault: number;
    imageUrl: string[];
    salePrice?: number;
    discountPercent?: number;
}

const FlashSaleSection: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [favMap, setFavMap] = useState<Record<string, boolean>>({});

    useEffect(() => {
        // Lấy dữ liệu flash sale
        const fetchFlashSale = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:8888/api/flashsale"
                );
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

        // Lấy wishlist
        (async () => {
            try {
                const list = await wishlistService.getAll();
                const map: Record<string, boolean> = {};
                list.forEach((it: WishlistItem) => {
                    const pid = String(it.product?._id ?? it.product);
                    map[pid] = true;
                });
                setFavMap(map);
            } catch (err) {
                console.log("Không lấy được wishlist");
            }
        })();
    }, []);

    const toggleFavorite = async (productId: string) => {
        const liked = !!favMap[productId];
        try {
            if (!liked) {
                await wishlistService.add(productId);
                setFavMap((prev) => ({ ...prev, [productId]: true }));
            } else {
                await wishlistService.remove(productId);
                setFavMap((prev) => ({ ...prev, [productId]: false }));
            }
        } catch (e: any) {
            alert(e?.response?.data?.message || "Có lỗi xảy ra");
        }
    };

    return (
        <section className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex justify-between items-center mb-6">
                <h2 className="uppercase text-xl font-semibold tracking-wide border border-gray-700 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 w-[220px] h-11 flex items-center justify-center text-white rounded-lg shadow-md transform -rotate-1 skew-x-3">
                    🔥 FLASH SALE
                </h2>
                <div className="text-red-500 font-semibold text-lg">
                    ⏰ Kết thúc sau: 00:59:59
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-8">
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
                    const isFav = !!favMap[product._id];

                    return (
                        <div
                            key={product._id}
                            onClick={() =>
                                (window.location.href = `/product/${product._id}`)
                            }
                            className="group rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden relative bg-white border border-gray-100"
                        >
                            {/* Badges */}
                            <div className="absolute top-3 left-3 z-10 flex flex-row gap-2 flex-wrap">
                                <span className="text-xs font-semibold px-2 py-0.5 rounded border border-green-600 text-green-600">
                                    Trả góp 0%
                                </span>
                                {isFreeShip && (
                                    <span className="text-xs font-semibold px-2 py-0.5 rounded border border-blue-600 text-blue-600">
                                        Free Ship
                                    </span>
                                )}
                            </div>

                            {/* Favorite */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFavorite(product._id);
                                }}
                                className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform duration-200 z-10"
                                title="Yêu thích"
                            >
                                {isFav ? (
                                    <FaHeart className="text-red-500 text-lg" />
                                ) : (
                                    <FaRegHeart className="text-gray-400 text-lg group-hover:text-red-500 transition-colors" />
                                )}
                            </button>

                            {/* Image */}
                            <div className="relative w-full aspect-[4/5] bg-gray-50 flex items-center justify-center overflow-hidden">
                                <img
                                    src={image}
                                    alt={product.title}
                                    className="max-h-[80%] max-w-[80%] object-contain transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <div className="flex space-x-3">
                                        <button className="bg-white p-2 rounded-full shadow hover:bg-gray-100 transition-transform transform hover:scale-110">
                                            <FaEye className="text-gray-600 text-sm" />
                                        </button>
                                        <button className="bg-blue-600 p-2 rounded-full shadow hover:bg-blue-700 transition-transform transform hover:scale-110">
                                            <FaShoppingCart className="text-white text-sm" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3
                                    className="text-sm font-medium text-gray-800 line-clamp-2"
                                    title={product.title}
                                >
                                    {product.title}
                                </h3>

                                {/* Giá & giảm */}
                                <div className="flex flex-col mt-1">
                                    <div className="flex items-baseline space-x-2">
                                        <span className="text-gray-400 line-through text-sm">
                                            {originalPrice.toLocaleString(
                                                "vi-VN"
                                            )}{" "}
                                            ₫
                                        </span>
                                        <span className="text-blue-600 font-semibold text-lg">
                                            {salePrice.toLocaleString("vi-VN")}₫
                                        </span>
                                    </div>
                                    <span
                                        className={`mt-1 text-xs font-medium px-2 py-[2px] rounded border w-fit ${
                                            salePrice > 20000000
                                                ? "border-red-300 text-red-500 bg-red-50"
                                                : "border-green-300 text-green-600 bg-green-50"
                                        }`}
                                    >
                                        Giảm {discount}% trực tiếp
                                    </span>
                                </div>

                                {/* Rating */}
                                <div className="flex items-center mt-2">
                                    <div className="flex text-yellow-400 text-sm">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i}>
                                                {i < 4 ? "★" : "☆"}
                                            </span>
                                        ))}
                                    </div>
                                    <span className="text-gray-500 text-xs ml-2">
                                        (24 đánh giá)
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default FlashSaleSection;
