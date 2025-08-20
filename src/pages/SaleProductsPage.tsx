import React, { useEffect, useState } from "react";
import { FaBolt } from "react-icons/fa";

interface Product {
    id: number;
    name: string;
    image: string;
    price: number;
    salePrice: number;
}

const SaleProductsPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        // Call API lấy sản phẩm đang sale (demo dữ liệu cứng)
        const fakeProducts: Product[] = [
            {
                id: 1,
                name: "iPhone 16 Pro Max",
                image: "https://tse2.mm.bing.net/th/id/OIP.DKiE4QADZyd_7GhblbWhNgHaHa?pid=Api&P=0&h=180",
                price: 42690000,
                salePrice: 31990000,
            },
            {
                id: 2,
                name: "Samsung Galaxy Z Flip7 FE 5G 16GB",
                image: "https://tse2.mm.bing.net/th/id/OIP.S8BvVjXhPlvtpcuGzdApaAHaHa?pid=Api&P=0&h=180",
                price: 25000000,
                salePrice: 22000000,
            },
            {
                id: 3,
                name: "Oppo Find X7 Ultra",
                image: "https://tse4.mm.bing.net/th/id/OIP.PEsiaBmXyVlUpti0h7isfwHaEK?pid=Api&P=0&h=180",
                price: 16900000,
                salePrice: 15990000,
            },
        ];
        setProducts(fakeProducts);
    }, []);

    return (
        <div className="max-w-6xl mx-auto py-10 px-6">
            <h1 className="text-3xl font-bold text-red-600 flex items-center gap-2 mb-8">
                <FaBolt /> Sản phẩm đang Sale
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => {
                    const discount =
                        product.price > 0
                            ? Math.round(
                                  ((product.price - product.salePrice) /
                                      product.price) *
                                      100
                              )
                            : 0;

                    const saving = product.price - product.salePrice;

                    return (
                        <div
                            key={product.id}
                            className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 relative"
                        >
                            {/* Nhãn giảm giá */}
                            {discount > 0 && (
                                <span className="absolute top-2 left-2 bg-gradient-to-r from-red-600 to-orange-500 text-white text-sm font-bold px-3 py-1 rounded-md shadow-md">
                                    Giảm {discount}%
                                </span>
                            )}

                            {/* Ảnh sản phẩm */}
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-48 object-cover rounded-lg mb-4"
                            />

                            {/* Tên sản phẩm */}
                            <h2 className="text-lg font-semibold text-gray-800 truncate">
                                {product.name}
                            </h2>

                            {/* Giá */}
                            <div className="mt-2">
                                <p className="text-red-600 font-bold text-lg">
                                    {product.salePrice.toLocaleString()}₫
                                </p>
                                <p className="text-gray-500 text-sm line-through">
                                    {product.price.toLocaleString()}₫
                                </p>
                                {/* Hiển thị số tiền tiết kiệm */}
                                {saving > 0 && (
                                    <p className="text-green-600 text-sm font-medium">
                                        Tiết kiệm {saving.toLocaleString()}₫
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SaleProductsPage;
