import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface FormData {
  newPassword: string;
  confirmPassword: string;
}

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const newPassword = watch("newPassword");

  useEffect(() => {
    const storedEmail = localStorage.getItem("emailForReset");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
       toast.error("Không tìm thấy email xác thực!");
      navigate("/forgot-password");
    }
  }, [navigate]);

  const onSubmit = async (data: FormData) => {
    if (!email) return;

    try {
      const res = await axios.post("http://localhost:8888/api/auth/reset-password", {
        email,
        newPassword: data.newPassword,
      });

      toast.success(res.data.message || "✅ Đổi mật khẩu thành công!");
      localStorage.removeItem("emailForReset");
      navigate("/login");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "❌ Đổi mật khẩu thất bại!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="min-h-screen bg-gradient-to-br from-blue-100 via-sky-100 to-teal-100 flex items-center justify-center p-6 relative"
    >
      <div className="relative z-10 bg-white rounded-3xl shadow-xl p-6 w-full max-w-lg border border-white/50">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-1">
            Đặt lại mật khẩu
          </h1>
          <p className="text-gray-600 text-sm font-medium">
            Nhập mật khẩu mới cho tài khoản <br />
            <span className="font-semibold text-blue-500">{email}</span>
          </p>
        </div>

        <div className="space-y-4">
          {/* Mật khẩu mới */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-0.5">
              Mật khẩu mới*
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                {...register("newPassword", {
                  required: "Vui lòng nhập mật khẩu mới",
                  minLength: {
                    value: 6,
                    message: "Mật khẩu ít nhất 6 ký tự",
                  },
                })}
                placeholder="••••••••"
                className={`w-full pl-12 pr-14 py-3 border ${
                  errors.newPassword ? "border-red-500" : "border-gray-200"
                } bg-gray-50 rounded-xl text-sm`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
              {errors.newPassword && (
                <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
              )}
            </div>
            {errors.newPassword && (
              <p className="text-sm text-red-500 mt-1">{errors.newPassword.message}</p>
            )}
          </div>

          {/* Xác nhận mật khẩu */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-0.5">
              Xác nhận mật khẩu*
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                {...register("confirmPassword", {
                  required: "Vui lòng xác nhận mật khẩu",
                  validate: (value) =>
                    value === newPassword || "Mật khẩu xác nhận không khớp",
                })}
                placeholder="••••••••"
                className={`w-full pl-12 pr-10 py-3 border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-200"
                } bg-gray-50 rounded-xl text-sm`}
              />
              {errors.confirmPassword && (
                <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
              )}
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-2 px-6 rounded-2xl font-bold shadow-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-300"
          >
            Xác nhận đổi mật khẩu
          </button>
        </div>
      </div>
    </form>
  );
};

export default ResetPassword;
