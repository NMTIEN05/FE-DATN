import React from "react";
import {
    FaStore,
    FaMapMarkerAlt,
    FaPhone,
    FaClock,
    FaCheckCircle,
} from "react-icons/fa";

const StoreInfoPage: React.FC = () => {
    return (
        <div className="max-w-6xl mx-auto py-12 px-6">
            {/* Tiêu đề */}
            <h1 className="text-3xl font-bold text-blue-600 mb-8 flex items-center gap-3">
                <FaStore /> Thông tin cửa hàng
            </h1>

            {/* Giới thiệu */}
            <div className="bg-white shadow-md rounded-2xl p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                    Giới thiệu
                </h2>
                <p className="text-gray-700 leading-relaxed">
                    <strong>Hola phone</strong> là hệ thống bán lẻ điện thoại di
                    động, máy tính bảng, phụ kiện chính hãng với hơn{" "}
                    <strong>50 chi nhánh toàn quốc</strong>. Chúng tôi cam kết
                    mang đến sản phẩm chất lượng, giá cả cạnh tranh cùng dịch vụ
                    chăm sóc khách hàng tận tâm.
                </p>
            </div>

            {/* Thông tin liên hệ nhanh */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="p-6 bg-white shadow rounded-2xl flex items-start gap-4">
                    <FaMapMarkerAlt className="text-blue-500 text-2xl" />
                    <div>
                        <h3 className="font-semibold text-lg">Địa chỉ</h3>
                        <p className="text-gray-600">
                            123 Nguyễn Trãi, Thanh Xuân, Hà Nội
                        </p>
                    </div>
                </div>

                <div className="p-6 bg-white shadow rounded-2xl flex items-start gap-4">
                    <FaPhone className="text-blue-500 text-2xl" />
                    <div>
                        <h3 className="font-semibold text-lg">Hotline</h3>
                        <p className="text-gray-600">1900 9999</p>
                    </div>
                </div>

                <div className="p-6 bg-white shadow rounded-2xl flex items-start gap-4">
                    <FaClock className="text-blue-500 text-2xl" />
                    <div>
                        <h3 className="font-semibold text-lg">Giờ mở cửa</h3>
                        <p className="text-gray-600">
                            08:00 - 22:00 (Tất cả các ngày)
                        </p>
                    </div>
                </div>
            </div>

            {/* Cam kết dịch vụ */}
            <div className="bg-white shadow-md rounded-2xl p-6 mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                    Cam kết dịch vụ
                </h2>
                <ul className="space-y-3 text-gray-700">
                    <li className="flex items-center gap-3">
                        <FaCheckCircle className="text-green-500" /> 100% sản
                        phẩm chính hãng
                    </li>
                    <li className="flex items-center gap-3">
                        <FaCheckCircle className="text-green-500" /> Bảo hành
                        chính hãng toàn quốc
                    </li>
                    <li className="flex items-center gap-3">
                        <FaCheckCircle className="text-green-500" /> Giao hàng
                        nhanh chóng trong 2h
                    </li>
                    <li className="flex items-center gap-3">
                        <FaCheckCircle className="text-green-500" /> Hỗ trợ trả
                        góp 0% lãi suất
                    </li>
                </ul>
            </div>

            {/* Google Maps */}
            <div className="bg-white shadow-md rounded-2xl p-6">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                    Bản đồ
                </h2>
                <iframe
                    title="Google Maps"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.858427318404!2d105.800953!3d21.038132!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab4c86d2a6f1%3A0x2a36f7aefdd8f2a1!2zMTIzIE5ndXnhu4VuIFRyw6FpLCBUaGFuaCBYdcOibiwgSMOgIE7hu5lpIFRo4bqvYyBN4buBbiBUaMO0bmc!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s"
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-xl"
                ></iframe>
            </div>
        </div>
    );
};

export default StoreInfoPage;
