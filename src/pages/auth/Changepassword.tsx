import React, { useState } from 'react';
import { FaKey } from 'react-icons/fa';

const ChangePasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = 'http://localhost:8888/api/auth/me/change-password';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmNewPassword) {
      setError('Mật khẩu mới và xác nhận mật khẩu không khớp.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Bạn chưa đăng nhập. Vui lòng đăng nhập lại.');
      return;
    }

    setIsLoading(true);

    try {
      console.log('🟨 Token:', token);
      console.log('🟨 Body gửi lên:', { oldPassword: currentPassword, newPassword });

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Phản hồi server:', data);
        setMessage(data.message || 'Mật khẩu đã được đổi thành công!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        console.error('❌ Server trả lỗi:', data);
        setError(data.message || 'Đã xảy ra lỗi khi đổi mật khẩu.');
      }
    } catch (err) {
      console.error('❌ Lỗi khi gọi API:', err);
      setError('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
   <div className="flex justify-center mt-20 bg-gray-100 py-8">
  <div className="bg-white p-5 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6 flex items-center justify-center gap-2">
          <FaKey className="text-blue-600" size={28} />
          Đổi Mật Khẩu
        </h2>

        {message && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{message}</span>
          </div>
        )}

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Mật khẩu hiện tại */}
          <div>
            <label
              htmlFor="current-password"
              className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"
            >
              <FaKey className="text-gray-400" />
              Mật khẩu hiện tại
            </label>
            <input
              type="password"
              id="current-password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          {/* Mật khẩu mới */}
          <div>
            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"
            >
              <FaKey className="text-gray-400" />
              Mật khẩu mới
            </label>
            <input
              type="password"
              id="new-password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          {/* Xác nhận mật khẩu mới */}
          <div>
            <label
              htmlFor="confirm-new-password"
              className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"
            >
              <FaKey className="text-gray-400" />
              Xác nhận mật khẩu mới
            </label>
            <input
              type="password"
              id="confirm-new-password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Đang xử lý...' : 'Đổi Mật Khẩu'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordForm;
