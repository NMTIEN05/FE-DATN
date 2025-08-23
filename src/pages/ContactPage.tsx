import React, { useState } from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const ContactPage: React.FC = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("📩 Form gửi:", form);
        alert("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.");
        setForm({ name: "", email: "", message: "" });
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 py-10">
            <div className="max-w-6xl mx-auto px-4">
                {/* Tiêu đề */}
                <h1 className="text-2xl md:text-3xl font-bold text-center text-blue-600 mb-8">
                    Liên hệ với chúng tôi
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Thông tin liên hệ */}
                    <div className="bg-white shadow rounded-xl p-6 space-y-5">
                        <h2 className="text-xl font-semibold mb-4">
                            Thông tin liên hệ
                        </h2>
                        <div className="flex items-center gap-3 text-gray-700">
                            <FaMapMarkerAlt className="text-blue-500 text-lg" />
                            <span>123 Đường ABC, Quận XYZ, Hà Nội</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700">
                            <FaPhoneAlt className="text-blue-500 text-lg" />
                            <span>Hotline: 0123 456 789</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700">
                            <FaEnvelope className="text-blue-500 text-lg" />
                            <span>Email: support@myshop.com</span>
                        </div>

                        <div className="mt-5">
                            <iframe
                                title="Google Maps"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.68824504882!2d105.7806293154026!3d21.046382492548834!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab443c178d05%3A0x7d3b7fba2e63a64!2zQ8O0bmcgVHkgQ-G7lSBQaOG6p24gUGjhuqFt!5e0!3m2!1svi!2s!4v1684392678956!5m2!1svi!2s"
                                width="100%"
                                height="250"
                                style={{ border: 0 }}
                                loading="lazy"
                            ></iframe>
                        </div>
                    </div>

                    {/* Form liên hệ */}
                    <div className="bg-white shadow rounded-xl p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            Gửi tin nhắn
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Họ và tên
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Nội dung
                                </label>
                                <textarea
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    required
                                    rows={4}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300 outline-none"
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                            >
                                Gửi ngay
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
