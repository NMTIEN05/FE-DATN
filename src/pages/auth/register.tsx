import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Smartphone, Mail, User, Lock, Eye, EyeOff } from "lucide-react";
import { FormData } from "../../types/User";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      await axios.post(`http://localhost:8888/api/auth/register`, data);
      toast.success("Đăng ký thành công");
      localStorage.setItem("emailForVerify", data.email);
      nav("/checkmail");
    } catch (error) {
      toast.error("Đăng ký thất bại");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="min-h-screen bg-gradient-to-br from-blue-100 via-sky-100 to-teal-100 flex items-center justify-center p-6 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-teal-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-sky-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 bg-white rounded-3xl shadow-soft-xl p-6 w-full max-w-lg border border-white/50 flex flex-col justify-between">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-1">
            Chào mừng bạn đến HOla Phone!
          </h1>
          <p className="text-gray-600 text-sm font-medium">
            Đăng ký để khám phá thế giới công nghệ
          </p>
        </div>

        <div className="space-y-3 flex-grow overflow-y-auto px-2 -mx-2 custom-scrollbar pb-2">
          {/* Username */}
          <div className="relative group">
            <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-0.5">
              Tên đăng nhập*
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="username"
                placeholder={errors.username ? errors.username.message : "Tên đăng nhập của bạn"}
                {...register("username", { required: "Vui lòng nhập tên đăng nhập" })}
                className={`w-full pl-12 pr-4 py-3 bg-gray-50 border ${
                  errors.username ? "border-red-500 placeholder-red-500" : "border-gray-200"
                } text-gray-800 rounded-xl placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all shadow-sm`}
              />
            </div>
          </div>

          {/* Email */}
<div className="relative group">
  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-0.5">
    Email*
  </label>
  <div className="relative">
    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
    <input
      type="email"
      id="email"
      placeholder={errors.email ? errors.email.message : "example@holaphone.com"}
      {...register("email", {
        required: "Vui lòng nhập email",
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
          message: "Email không hợp lệ",
        },
      })}
      className={`w-full pl-12 pr-10 py-3 bg-gray-50 border ${
        errors.email ? "border-red-500 placeholder-red-500" : "border-gray-200"
      } text-gray-800 rounded-xl ${
        errors.email ? "placeholder-red-500" : "placeholder-gray-400"
      } focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all shadow-sm`}
    />
    {errors.email && (
      <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-500 text-lg">
        ❗
      </span>
    )}
  </div>
</div>



          {/* Full Name */}
          <div className="relative group">
            <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-0.5">
              Họ và tên*
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="fullName"
                placeholder={errors.full_name ? errors.full_name.message : "Nguyễn Văn A"}
                {...register("full_name", { required: "Vui lòng nhập họ tên" })}
                className={`w-full pl-12 pr-4 py-3 bg-gray-50 border ${
                  errors.full_name ? "border-red-500 placeholder-red-500" : "border-gray-200"
                } text-gray-800 rounded-xl placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all shadow-sm`}
              />
            </div>
          </div>

          {/* Phone */}
          <div className="relative group">
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-0.5">
              Số điện thoại
            </label>
            <div className="relative">
              <Smartphone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                id="phone"
                placeholder="09xxxxxxxx"
                {...register("phone", {
                  pattern: {
                    value: /^(0|\+84)[0-9]{9}$/,
                    message: "Số điện thoại không hợp lệ",
                  },
                })}
                className={`w-full pl-12 pr-4 py-3 bg-gray-50 border ${
                  errors.phone ? "border-red-500 placeholder-red-500" : "border-gray-200"
                } text-gray-800 rounded-xl placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all shadow-sm`}
              />
            </div>
          </div>

          {/* Password */}
          <div className="relative group">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-0.5">
              Mật khẩu*
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder={errors.password ? errors.password.message : "••••••••"}
                {...register("password", {
                  required: "Vui lòng nhập mật khẩu",
                  minLength: {
                    value: 6,
                    message: "Mật khẩu ít nhất 6 ký tự",
                  },
                })}
                className={`w-full pl-12 pr-14 py-3 bg-gray-50 border ${
                  errors.password ? "border-red-500 placeholder-red-500" : "border-gray-200"
                } text-gray-800 rounded-xl placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all shadow-sm`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-4">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-2 px-6 rounded-2xl font-bold shadow-lg hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-white transition-all duration-300 transform active:scale-[0.98]"
          >
            Đăng ký tài khoản
          </button>

          {/* Login link */}
          <div className="text-center pt-3">
            <p className="text-gray-700 text-sm">
              Bạn đã có tài khoản?{" "}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
              >
                Đăng nhập ngay
              </button>
            </p>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Register;