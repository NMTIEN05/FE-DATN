import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Button, Input, message, Spin, Typography } from 'antd';

dayjs.extend(relativeTime);
const { Title } = Typography;

interface SavedVoucher {
  _id: string;
  claimedAt: string;
  voucherId: {
    _id: string;
    code: string;
    discountType: 'fixed' | 'percentage';
    discountValue: number;
    maxDiscount?: number;
    usageLimit: number;
    usedCount: number;
    minOrderValue: number;
    startDate: string;
    endDate: string;
    categories: string[]; // bạn có thể dùng ref để populate tên nếu muốn
  };
}

const SavedVoucherList: React.FC = () => {
  const [savedVouchers, setSavedVouchers] = useState<SavedVoucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSavedVouchers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          message.warning('Bạn cần đăng nhập');
          return;
        }

        const res = await axios.get('http://localhost:8888/api/user-voucher/my', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setSavedVouchers(res.data.data || []);
      } catch (err) {
        console.error(err);
        message.error('Không thể lấy danh sách mã đã lưu');
      } finally {
        setLoading(false);
      }
    };

    fetchSavedVouchers();
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      message.success(`📋 Mã ${code} đã được sao chép!`);
    });
  };

  const formatDiscount = (voucher: SavedVoucher['voucherId']) => {
    if (voucher.discountType === 'fixed') {
      return `Giảm ${voucher.discountValue.toLocaleString()}đ`;
    }
    return `Giảm ${voucher.discountValue}%` + 
      (voucher.maxDiscount ? ` (tối đa ${voucher.maxDiscount.toLocaleString()}đ)` : '');
  };

  const isNearlyExpired = (endDate: string) => {
    const hoursLeft = dayjs(endDate).diff(dayjs(), 'hour');
    return hoursLeft > 0 && hoursLeft <= 24;
  };

  const filteredVouchers = savedVouchers.filter((v) =>
    v.voucherId.code.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Title level={2}>🎟️ Mã giảm giá đã lưu</Title>

      <div className="mb-4 flex justify-center">
        <Input
          placeholder="Tìm kiếm mã..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          allowClear
          className="w-full max-w-md"
        />
      </div>

      {loading ? (
        <Spin size="large" />
      ) : filteredVouchers.length === 0 ? (
        <p className="text-center text-gray-500 italic">Bạn chưa lưu mã nào.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredVouchers
  .filter((item) => item.voucherId) // loại bỏ voucher null
  .map((item) => {
    const voucher = item.voucherId!;
    const isExpired = dayjs(voucher.endDate).isBefore(dayjs());

    return (
      <div
        key={item._id}
        className={`flex border rounded-lg shadow-sm bg-white overflow-hidden relative ${
          isExpired ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
        {/* Badge */}
        <div className="absolute top-2 right-2 text-white text-xs font-semibold px-2 py-0.5 rounded-full bg-red-500">
          {isExpired ? 'Hết hạn' : `×${voucher.usageLimit - voucher.usedCount}`}
        </div>

        {/* Logo */}
        <div className="bg-green-600 w-28 flex flex-col items-center justify-center text-white text-sm px-2 py-4">
          <div className="text-center font-bold uppercase">ĐÃ LƯU</div>
        </div>

        {/* Nội dung */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <p className="font-semibold text-base text-gray-800">
              {formatDiscount(voucher)}
            </p>
            <p className="text-sm text-gray-600">
              Đơn tối thiểu: {voucher.minOrderValue?.toLocaleString?.() || 0}đ
            </p>
            <p className="text-xs mt-1 text-orange-600 border border-orange-500 px-2 inline-block rounded">
              Mã: {voucher.code}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {isNearlyExpired(voucher.endDate)
                ? `Sắp hết hạn: ${dayjs().to(dayjs(voucher.endDate))}`
                : `HSD: đến ${dayjs(voucher.endDate).format('DD/MM/YYYY')}`}
            </p>
          </div>

          {!isExpired && (
            <div className="mt-2 text-right">
              <Button
                type="default"
                onClick={() => handleCopy(voucher.code)}
                className="border border-red-500 text-red-500 hover:bg-red-50"
              >
                Dùng mã
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  })}

        </div>
      )}
    </div>
  );
};

export default SavedVoucherList;