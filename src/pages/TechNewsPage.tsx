import React from "react";
import { FaRegNewspaper, FaTag } from "react-icons/fa";

const TechNewsPage: React.FC = () => {
    const fakeNews = [
        {
            id: 1,
            title: "iPhone 16 ra mắt với nhiều nâng cấp đáng chú ý",
            img: "https://tse4.mm.bing.net/th/id/OIP.k3TuNv4HqHqNNkxeUFMLewHaE8?pid=Api&P=0&h=180",
            date: "20/08/2025",
            desc: "Apple vừa chính thức giới thiệu iPhone 16 với chip A19 Bionic, camera cải tiến và thời lượng pin vượt trội.",
            tag: "Apple",
        },
        {
            id: 2,
            title: "Samsung Galaxy S25 Ultra lộ thiết kế mới",
            img: "https://tse4.mm.bing.net/th/id/OIP.AGrz7njeDmxaoKywkVB4wwHaHa?pid=Api&P=0&h=180",
            date: "18/08/2025",
            desc: "Hình ảnh rò rỉ cho thấy Galaxy S25 Ultra sẽ có cụm camera mới cùng viền siêu mỏng.",
            tag: "Samsung",
        },
        {
            id: 3,
            title: "Xu hướng điện thoại gập 2025 bùng nổ",
            img: "https://tse3.mm.bing.net/th/id/OIP.t_Bh43CYhNSe6Y1KGyqWKQHaEK?pid=Api&P=0&h=180",
            date: "15/08/2025",
            desc: "Điện thoại gập tiếp tục trở thành tâm điểm khi nhiều hãng công nghệ đồng loạt tung ra sản phẩm mới.",
            tag: "Xu hướng",
        },
    ];

    return (
        <div className="max-w-7xl mx-auto py-12 px-6">
            {/* Tiêu đề */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
                <h1 className="text-3xl font-bold text-blue-600 flex items-center gap-3">
                    <FaRegNewspaper className="text-4xl" /> Tin công nghệ
                </h1>
                {/* Filter */}
                <div className="flex gap-3 mt-4 md:mt-0">
                    <button className="px-4 py-2 text-sm rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition">
                        Tất cả
                    </button>
                    <button className="px-4 py-2 text-sm rounded-xl border hover:bg-gray-100 transition">
                        Apple
                    </button>
                    <button className="px-4 py-2 text-sm rounded-xl border hover:bg-gray-100 transition">
                        Samsung
                    </button>
                    <button className="px-4 py-2 text-sm rounded-xl border hover:bg-gray-100 transition">
                        Xu hướng
                    </button>
                </div>
            </div>

            {/* Grid tin tức */}
            <div className="grid md:grid-cols-3 gap-8">
                {fakeNews.map((news) => (
                    <div
                        key={news.id}
                        className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition duration-300 overflow-hidden group flex flex-col"
                    >
                        {/* Ảnh */}
                        <div className="relative">
                            <img
                                src={news.img}
                                alt={news.title}
                                className="w-full h-52 object-cover group-hover:scale-105 transition duration-300"
                            />
                            <span className="absolute top-2 left-2 bg-pink-600 text-white text-xs px-2 py-1 rounded-md shadow flex items-center gap-1">
                                <FaTag /> {news.tag}
                            </span>
                            <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-md shadow">
                                {news.date}
                            </span>
                        </div>

                        {/* Nội dung */}
                        <div className="p-5 flex flex-col flex-1">
                            <h2 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition">
                                {news.title}
                            </h2>
                            <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                                {news.desc}
                            </p>
                            <a
                                href="#"
                                className="inline-block mt-auto px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition self-start"
                            >
                                Xem chi tiết →
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TechNewsPage;
