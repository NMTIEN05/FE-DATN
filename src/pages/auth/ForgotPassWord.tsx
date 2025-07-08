import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, KeyRound, AlertCircle } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [isCodeSent, setIsCodeSent] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<{ email: string; code: string }>();

  // Gửi mã xác minh
  const handleSendCode = async () => {
    const email = getValues("email")?.trim().toLowerCase();
    if (!email) {
      toast.error("Vui lòng nhập email trước khi lấy mã");
      return;
    }
    try {
      const res = await axios.post("http://localhost:8888/api/auth/forgot-password", { email });

      toast.success(res.data.message || "✅ Mã xác minh đã được gửi!");
      setIsCodeSent(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "❌ Không gửi được mã xác minh");
    }
  };

  // Xác minh mã
  const handleVerify = async (data: { email: string; code: string }) => {
     const trimmedEmail = data.email.trim().toLowerCase(); // ✅ thêm dòng này
    try {
      const response = await axios.post("http://localhost:8888/api/auth/email-code", {
        code: data.code.trim(),
        email: data.email.trim().toLowerCase(),
      });

      toast.success(response.data.message || "✅ Xác minh thành công!");
       localStorage.setItem("emailForReset", trimmedEmail);
      setTimeout(() => {
        navigate(`/reset-password`);
      }, 1500);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "❌ Mã xác minh không hợp lệ!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-sky-100 to-teal-100 px-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md space-y-6 border border-white/50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-blue-600 mb-2">Lấy lại mật khẩu</h2>
          <p className="text-sm text-gray-500">Nhập email để nhận mã xác minh</p>
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">Email*</label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                placeholder={errors.email ? errors.email.message : "example@email.com"}
                {...register("email", {
                  required: "Vui lòng nhập email",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
                    message: "Email không hợp lệ",
                  },
                })}
                disabled={isCodeSent}
                className={`w-full pl-10 pr-10 py-3 border ${
                  errors.email ? "border-red-500 placeholder-red-500" : "border-gray-200"
                } rounded-xl bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
              {errors.email && (
                <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
              )}
            </div>
            <button
              type="button"
              onClick={handleSendCode}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              Lấy mã
            </button>
          </div>
        </div>

        {/* Mã xác minh */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">Mã xác minh*</label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Nhập mã xác minh"
              {...register("code", {
                required: "Vui lòng nhập mã xác minh",
              })}
              disabled={!isCodeSent}
              className={`w-full pl-10 pr-10 py-3 border ${
                errors.code ? "border-red-500 placeholder-red-500" : "border-gray-200"
              } rounded-xl bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            {errors.code && (
              <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
            )}
          </div>
          {!isCodeSent && (
            <p className="text-xs text-gray-400 mt-1">Vui lòng lấy mã xác minh trước</p>
          )}
        </div>

        {/* Nút xác nhận */}
        <button
          type="submit"
          onClick={handleSubmit(handleVerify)}
          disabled={!isCodeSent}
          className={`w-full py-3 rounded-xl font-semibold transition-all ${
            isCodeSent
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Xác nhận
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
