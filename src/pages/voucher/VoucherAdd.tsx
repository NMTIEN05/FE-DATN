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
  maxDiscount?: number;
  categories?: { _id: string; name: string }[]; // ✅ sửa chỗ này
}


interface Category {
  _id: string;
  name: string;
}

const VoucherList: React.FC = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        message.warning('Bạn chưa đăng nhập!');
        setLoading(false);
        return;
      }

      try {
        const [voucherRes, categoryRes] = await Promise.all([
          axios.get('http://localhost:8888/api/vouchers', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:8888/api/category', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (Array.isArray(voucherRes.data)) {
          setVouchers(voucherRes.data);
          console.log('✅ Voucher data:', voucherRes.data);
        } else {
          message.error('Dữ liệu voucher không hợp lệ!');
        }

        if (Array.isArray(categoryRes.data.data)) {
          setCategories(categoryRes.data.data);
          console.log('✅ Categories data:', categoryRes.data);
        } else {
          message.error('Dữ liệu danh mục không hợp lệ!');
        }
      } catch (err) {
        console.error('❌ Lỗi lấy dữ liệu:', err);
        message.error('Không thể lấy dữ liệu!');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDiscount = (voucher: Voucher) => {
    if (voucher.discountType === 'fixed') {
      return `Giảm ${voucher.discountValue.toLocaleString()}đ`;
    } else {
      return (
        `Giảm ${voucher.discountValue}%` +
        (voucher.maxDiscount ? ` (tối đa ${voucher.maxDiscount.toLocaleString()}đ)` : '')
      );
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      message.success(` Mã ${code} đã được sao chép!`);
    });
  };

  const isNearlyExpired = (endDate: string) => {
    const hoursLeft = dayjs(endDate).diff(dayjs(), 'hour');
    return hoursLeft > 0 && hoursLeft <= 24;
  };

  const trimmedSearch = searchTerm.trim().toLowerCase();

  const availableVouchers = vouchers.filter(
    (v) =>
      dayjs(v.endDate).isAfter(dayjs()) &&
      v.usedCount < v.usageLimit &&
      v.code.toLowerCase().includes(trimmedSearch)
  );

  const disabledVouchers = vouchers.filter(
    (v) =>
      (dayjs(v.endDate).isBefore(dayjs()) || v.usedCount >= v.usageLimit) &&
      v.code.toLowerCase().includes(trimmedSearch)
  );

  // Chuyển id danh mục sang tên danh mục
  const getCategoryNames = (categoryIds?: string[]) => {
    if (!categoryIds || categoryIds.length === 0) return [];
    return categoryIds
      .map((id) => categories.find((c) => c._id === id)?.name)
      .filter(Boolean) as string[];
  };

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
          {disabled ? (isExpired ? 'Hết hạn' : 'Hết lượt') : `×${voucher.usageLimit - voucher.usedCount}`}
        </div>

        {/* Logo shop */}
        <div className="bg-orange-600 w-28 flex flex-col items-center justify-center text-white text-sm px-2 py-4">
          <div className="text-center font-bold text-white text-sm uppercase">VOUCHER</div>
        </div>

        {/* Nội dung */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <p className="font-semibold text-base text-gray-800">{formatDiscount(voucher)}</p>
            <p className="text-sm text-gray-600">
              Đơn tối thiểu: {voucher.minOrderValue?.toLocaleString() || 0}đ
            </p>
            <p className="text-xs mt-1 text-orange-600 border border-orange-500 px-2 inline-block rounded">
              Mã: {voucher.code}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {isNearlyExpired(voucher.endDate)
                ? `Sắp hết hạn: ${dayjs().to(dayjs(voucher.endDate))}`
                : `HSD: đến ${dayjs(voucher.endDate).format('DD/MM/YYYY')}`}
            </p>

         {voucher.categories && voucher.categories.length > 0 && (
  <p className="text-xs mt-1 text-blue-600 border border-blue-500 px-2 inline-block rounded">
    Chỉ áp dụng cho danh mục: {voucher.categories.map(c => c.name).join(', ')}
  </p>
)}


          </div>

          {!disabled && (
            <div className="mt-2 flex justify-end gap-2">
  <Button
    type="default"
    onClick={() => handleSaveVoucher(voucher._id)}
    className="border border-blue-500 text-blue-500 hover:bg-blue-50"
  >
    Lưu mã
  </Button>

  
</div>

          )}
        </div>
      </div>
    );
  };
  const handleSaveVoucher = async (voucherId: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return message.warning("Bạn cần đăng nhập");

    await axios.post(
      "http://localhost:8888/api/user-voucher",
      { voucherId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    message.success("🎉 Đã lưu mã thành công!");
  } catch (err: any) {
    message.error(
      err?.response?.data?.message || "❌ Lỗi khi lưu mã giảm giá"
    );
  }
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
        <p className="text-center text-gray-500 italic">Không có voucher nào phù hợp.</p>
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
