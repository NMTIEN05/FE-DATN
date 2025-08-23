import React from "react";
import { FaSyncAlt, FaCheckCircle } from "react-icons/fa";

const ExchangePage: React.FC = () => {
    const exchangeProducts = [
        {
            id: 1,
            name: "iPhone 16 Pro Max",
            price: "10.000.000đ",
            img: "https://tse4.mm.bing.net/th/id/OIP.k3TuNv4HqHqNNkxeUFMLewHaE8?pid=Api&P=0&h=180",
        },
        {
            id: 2,
            name: "Samsung Galaxy S24 Ultra",
            price: "12.000.000đ",
            img: "https://tse4.mm.bing.net/th/id/OIP.AGrz7njeDmxaoKywkVB4wwHaHa?pid=Api&P=0&h=180",
        },
        {
            id: 3,
            name: "OPPO Find X7 Pro",
            price: "8.500.000đ",
            img: "https://tse3.mm.bing.net/th/id/OIP.t_Bh43CYhNSe6Y1KGyqWKQHaEK?pid=Api&P=0&h=180",
        },
    ];

    return (
        <div className="max-w-6xl mx-auto py-12 px-6">
            {/* Tiêu đề */}
            <h1 className="text-3xl font-bold text-blue-600 mb-10 flex items-center gap-3">
                <FaSyncAlt className="text-4xl" /> Thu cũ đổi mới
            </h1>

            {/* Quy trình */}
            <div className="bg-white shadow-md rounded-2xl p-6 mb-10">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    Quy trình đơn giản
                </h2>
                <ul className="space-y-3 text-gray-700">
                    <li className="flex items-center gap-2">
                        <FaCheckCircle className="text-green-500" /> Mang máy cũ
                        đến cửa hàng Hola Mobile
                    </li>
                    <li className="flex items-center gap-2">
                        <FaCheckCircle className="text-green-500" /> Kỹ thuật
                        viên thẩm định giá trị còn lại
                    </li>
                    <li className="flex items-center gap-2">
                        <FaCheckCircle className="text-green-500" /> Trừ trực
                        tiếp vào giá máy mới bạn chọn
                    </li>
                    <li className="flex items-center gap-2">
                        <FaCheckCircle className="text-green-500" /> Hoàn tất
                        giao dịch nhanh chóng, minh bạch
                    </li>
                </ul>
            </div>

            {/* Sản phẩm thu cũ đổi mới */}
            <div className="grid md:grid-cols-3 gap-8">
                {exchangeProducts.map((product) => (
                    <div
                        key={product.id}
                        className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden flex flex-col"
                    >
                        <img
                            src={product.img}
                            alt={product.name}
                            className="w-full h-56 object-cover"
                        />
                        <div className="p-5 flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="font-semibold text-lg mb-2">
                                    {product.name}
                                </h3>
                                <p className="text-gray-600 text-sm mb-4">
                                    Giá thu:{" "}
                                    <span className="font-bold text-red-500">
                                        {product.price}
                                    </span>
                                </p>
                            </div>
                            <button className="mt-auto w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition">
                                Đổi ngay
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExchangePage;
