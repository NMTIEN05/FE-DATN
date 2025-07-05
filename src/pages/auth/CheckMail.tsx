import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { Key, RotateCcw } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface VerificationFormData {
  verificationCode: string;
}

const EmailVerificationUI = () => {
  const navigate = useNavigate();

  // Lấy email từ state được truyền qua navigate
 const email = localStorage.getItem("emailForVerify");
useEffect(() => {
  if (!email) {
    toast.error("Không tìm thấy email để xác nhận!");
    navigate("/register");
  }
}, []);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerificationFormData>();

 const onSubmit = async (data: VerificationFormData) => {
  try {
    const email = localStorage.getItem("emailForVerify"); // hoặc email bạn có sẵn

    const response = await axios.post("http://localhost:8888/api/auth/email-code", {
      code: data.verificationCode,
      email, // gửi email kèm để xác thực
    });

    // ✅ Xác thực mã thành công
    toast.success(response.data.message || "✅ Xác nhận thành công!");

    // ✅ Lưu email vào localStorage để dùng sau (ví dụ cho reset password)
    localStorage.setItem("emailForReset", email || "");

    // 👉 Chuyển sang trang đổi mật khẩu
    setTimeout(() => {
      navigate("/reset-password");
    }, 2000);
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "❌ Mã xác nhận không hợp lệ!");
  }
};


  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="min-h-screen bg-gradient-to-br from-blue-100 via-sky-100 to-teal-100 flex items-center justify-center p-6 relative overflow-hidden"
      >
        {/* Background effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-teal-300/30 rounded-full blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-sky-300/30 rounded-full blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        {/* Form Container */}
        <div className="relative z-10 bg-white rounded-3xl shadow-soft-xl p-8 w-full max-w-md border border-white/50">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-2">
              Xác nhận Email của bạn
            </h1>
            <p className="text-gray-600 text-sm font-medium">
              Chúng tôi đã gửi mã xác nhận đến
              <span className="font-semibold text-blue-700 ml-1">{email}</span>.
              Vui lòng kiểm tra hộp thư đến.
            </p>
          </div>

          {/* Verification code field */}
          <div className="relative group mb-4">
            <label htmlFor="verificationCode" className="block text-sm font-semibold text-gray-700 mb-1">
              Mã xác nhận*
            </label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="verificationCode"
                placeholder="Nhập mã gồm 6 chữ số"
                {...register("verificationCode", {
                  required: "Vui lòng nhập mã xác nhận",
                  pattern: {
                    value: /^\d{6}$/,
                    message: "Mã xác nhận phải gồm 6 chữ số",
                  },
                })}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all shadow-sm text-center tracking-widest"
              />
              {errors.verificationCode && (
                <p className="text-red-500 text-sm mt-1">{errors.verificationCode.message}</p>
              )}
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 px-6 rounded-2xl font-bold shadow-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-300"
          >
            Xác nhận
          </button>

          {/* Links */}
          <div className="text-center mt-6 space-y-3">
            <p className="text-gray-700 text-sm flex items-center justify-center">
              Không nhận được mã?{" "}
              <button
                type="button"
                onClick={() => toast.info("Mã mới đã được gửi!")}
                className="text-blue-600 hover:text-blue-700 font-semibold flex items-center ml-1"
              >
                <RotateCcw className="h-4 w-4 mr-1" /> Gửi lại mã
              </button>
            </p>
            <p className="text-gray-700 text-sm">
              Quay lại{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Đăng nhập
              </button>
            </p>
          </div>
        </div>
      </form>
    </>
  );
};

export default EmailVerificationUI;
