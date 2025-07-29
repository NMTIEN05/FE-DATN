import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface UserForm {
  username: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
}

const API_URL = "http://localhost:8888/api";

function decodeJwt(token: string) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

const defaultForm: UserForm = {
  username: "",
  full_name: "",
  email: "",
  phone: "",
  address: "",
};

const iconClass = "flex items-center justify-center w-9 h-9 rounded-full bg-[#ffeaea] text-[#f85959] text-lg shrink-0";

const Account: React.FC = () => {
  const [form, setForm] = useState<UserForm>(defaultForm);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token") || "";
  const userId = (() => {
    const payload = decodeJwt(token);
    return payload?.id || "";
  })();

  useEffect(() => {
    if (!token || !userId) return;
    (async () => {
      try {
        const res = await axios.get(`${API_URL}/auth/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setForm({
          username: res.data.username || "",
          full_name: res.data.full_name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          address: res.data.address || "",
        });
      } catch (err: any) {
        toast.error("Không lấy được thông tin tài khoản!");
        console.error("Lỗi lấy user:", err?.response?.data || err);
      }
    })();
  }, [token, userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { full_name, phone, address } = form;
    try {
      await axios.put(
        `${API_URL}/auth/${userId}`,
        { full_name, phone, address },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Cập nhật tài khoản thành công!");
    } catch (err: any) {
      if (err?.response?.data?.message) {
        toast.error(err.response.data.message);
        console.error("Lỗi BE trả về:", err.response.data.message);
      } else {
        toast.error("Cập nhật thất bại!");
        console.error("Lỗi khác:", err);
      }
    }
    setLoading(false);
  };

  if (!token || !userId)
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-lg text-gray-600">
        Bạn cần đăng nhập để xem trang này.
      </div>
    );

  return (
    <div className="flex justify-center items-center min-h-[70vh] bg-[#fafbfc] pb-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white border border-gray-100 rounded-2xl px-6 py-8 md:px-8 md:py-12 mx-3"
      >
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#f85959]/10 mb-1">
            {/* Simple avatar icon */}
            <svg width={36} height={36} fill="none" viewBox="0 0 24 24">
              <circle cx={12} cy={7} r={5} fill="#f85959" />
              <ellipse cx={12} cy={18.5} rx={7} ry={4.5} fill="#ff8d5c" />
            </svg>
          </div>
          <div className="text-xl font-bold text-[#f85959] tracking-wide">
            Thông tin tài khoản
          </div>
        </div>

        {/* Username */}
        <div className="flex items-center gap-3 mb-5">
          <span className={iconClass}>👤</span>
          <div className="w-full">
            <label className="text-xs text-gray-500 font-medium pl-1">Username</label>
            <input
              name="username"
              value={form.username}
              disabled
              readOnly
              className="w-full px-4 py-2 mt-1 rounded-lg bg-gray-100 border border-gray-200 outline-none text-gray-500 font-medium cursor-not-allowed"
            />
          </div>
        </div>

        {/* Full name */}
        <div className="flex items-center gap-3 mb-5">
          <span className={iconClass}>📝</span>
          <div className="w-full">
            <label className="text-xs text-[#f85959] font-medium pl-1">Tên hiển thị</label>
            <input
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-1 rounded-lg border border-[#f85959] bg-white outline-none focus:border-[#ff8d5c] font-medium transition"
              placeholder="Nhập tên hiển thị"
            />
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center gap-3 mb-5">
          <span className={iconClass}>✉️</span>
          <div className="w-full">
            <label className="text-xs text-gray-500 font-medium pl-1">Email</label>
            <input
              name="email"
              value={form.email}
              disabled
              readOnly
              className="w-full px-4 py-2 mt-1 rounded-lg bg-gray-100 border border-gray-200 outline-none text-gray-500 font-medium cursor-not-allowed"
            />
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-3 mb-5">
          <span className={iconClass}>📱</span>
          <div className="w-full">
            <label className="text-xs text-[#f85959] font-medium pl-1">Số điện thoại</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              type="tel"
              className="w-full px-4 py-2 mt-1 rounded-lg border border-[#f85959] bg-white outline-none focus:border-[#ff8d5c] font-medium transition"
              placeholder="Nhập số điện thoại"
            />
          </div>
        </div>

        {/* Address */}
        <div className="flex items-center gap-3 mb-5">
          <span className={iconClass}>🏠</span>
          <div className="w-full">
            <label className="text-xs text-[#f85959] font-medium pl-1">Địa chỉ</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 rounded-lg border border-[#f85959] bg-white outline-none focus:border-[#ff8d5c] font-medium transition"
              placeholder="Nhập địa chỉ"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full py-2.5 rounded-lg bg-[#f85959] hover:bg-[#ff8d5c] transition text-white font-semibold text-base tracking-wide"
        >
          {loading ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </form>
    </div>
  );
};

export default Account;
