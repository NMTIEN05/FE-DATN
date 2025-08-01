import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { message, Typography, Spin, Button, Input } from 'antd';

dayjs.extend(relativeTime);
const { Title } = Typography;

interface Voucher {
  _id: string;
  code: string;
  discountType: 'fixed' | 'percentage';
  discountValue: number;
  usageLimit: number;
  usedCount: number;
  minOrderValue: number;
  startDate: string;
  endDate: string;
}

const VoucherList: React.FC = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      message.warning('Bạn chưa đăng nhập!');
      setLoading(false);
      return;
    }

    axios
      .get('http://localhost:8888/api/vouchers', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setVouchers(res.data);
        } else {
          message.error('Dữ liệu không hợp lệ!');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Lỗi gọi API voucher:', err);
        message.error('Không thể lấy danh sách voucher!');
        setLoading(false);
      });
  }, []);

  const formatDiscount = (voucher: Voucher) => {
    return voucher.discountType === 'fixed'
      ? `Giảm ${voucher.discountValue.toLocaleString()}đ`
      : `Giảm ${voucher.discountValue}%`;
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      message.success(`📋 Mã ${code} đã được sao chép!`);
    });
  };

  const isNearlyExpired = (endDate: string) => {
    const hoursLeft = dayjs(endDate).diff(dayjs(), 'hour');
    return hoursLeft > 0 && hoursLeft <= 24;
  };

  const availableVouchers = vouchers.filter(
    (v) =>
      dayjs(v.endDate).isAfter(dayjs()) && v.usedCount < v.usageLimit &&
      v.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const disabledVouchers = vouchers.filter(
    (v) =>
      (dayjs(v.endDate).isBefore(dayjs()) || v.usedCount >= v.usageLimit) &&
      v.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderVoucher = (voucher: Voucher, disabled = false) => {
    const isExpired = dayjs(voucher.endDate).isBefore(dayjs());
    const isUsedUp = voucher.usedCount >= voucher.usageLimit;

    return (
      <div
        key={voucher._id}
        className={`flex border rounded-lg shadow-sm bg-white overflow-hidden relative ${
          disabled ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
        {/* Badge */}
        <div
          className={`absolute top-2 right-2 text-white text-xs font-semibold px-2 py-0.5 rounded-full ${
            disabled ? 'bg-gray-400' : 'bg-red-500'
          }`}
        >
          {disabled
            ? isExpired
              ? 'Hết hạn'
              : 'Hết lượt'
            : `×${voucher.usageLimit - voucher.usedCount}`}
        </div>

        {/* Logo shop */}
        <div className="bg-orange-600 w-28 flex flex-col items-center justify-center text-white text-sm px-2 py-4">
          
       <div className="text-center font-bold text-white text-sm uppercase">
  VOUCHER
</div>



        </div>

        {/* Nội dung */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <p className="font-semibold text-base text-gray-800">{formatDiscount(voucher)}</p>
            <p className="text-sm text-gray-600">
              Đơn tối thiểu: {voucher.minOrderValue.toLocaleString()}đ
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
          {!disabled && (
            <div className="mt-2 text-right">
              <Button
                type="default"
                danger
                onClick={() => handleCopy(voucher.code)}
                className="border border-red-500 text-red-500 hover:bg-red-50"
              >
                Dùng Ngay
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Title level={2}>🎁 Danh sách voucher</Title>

      {/* Search input */}
      <div className="mb-4 flex justify-center">
        <Input
          placeholder="Tìm kiếm mã voucher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          allowClear
          className="w-full max-w-md"
        />
      </div>

      {loading ? (
        <Spin size="large" />
      ) : availableVouchers.length + disabledVouchers.length === 0 ? (
        <p>Không có voucher nào.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableVouchers.map((v) => renderVoucher(v, false))}
          {disabledVouchers.map((v) => renderVoucher(v, true))}
        </div>
      )}
    </div>
  );
};

export default VoucherList;
