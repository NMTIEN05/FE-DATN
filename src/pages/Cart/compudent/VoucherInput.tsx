import React, { useEffect, useState } from "react";
import { Button, Drawer, Spin } from "antd";
import { toast } from "react-toastify";
import axios from "axios";
import dayjs from "dayjs";

interface Voucher {
  _id: string;
  code: string;
  discountType: "fixed" | "percentage";
  discountValue: number;
  maxDiscount?: number;
  minOrderValue?: number;
  maxOrderValue?: number;
  categories?: string[];
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageLimit?: number;
  usedCount?: number;
}

interface VoucherSelectProps {
  onApply: (code: string) => void;
  initialCode?: string;
}

const VoucherInput: React.FC<VoucherSelectProps> = ({ onApply, initialCode = "" }) => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [selectedCode, setSelectedCode] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    const fetchVouchers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8888/api/user-voucher/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const validVouchers: Voucher[] = res.data.data
          .filter((item: any) => item.voucherId)
          .map((item: any) => item.voucherId);
        setVouchers(validVouchers);
      } catch (err: any) {
        console.error(err);
        toast.error("Không thể tải danh sách mã giảm giá");
      } finally {
        setLoading(false);
      }
    };
    fetchVouchers();
  }, []);

  const handleApply = (code: string) => {
    setSelectedCode(code);
    onApply(code);
    setDrawerVisible(false);
  };

  const handleRemove = () => {
    setSelectedCode("");
    onApply(""); // reset voucher trong parent
  };

  return (
    <div className="flex w-full max-w-md mb-3 mt-3 items-center">
      <Button type="default" onClick={() => setDrawerVisible(true)} className="flex-1">
        {selectedCode ? `🎟️ Voucher: ${selectedCode}` : " Chọn mã giảm giá"}
      </Button>

      {selectedCode && (
        <Button type="default" danger className="ml-2" onClick={handleRemove}>
          Xoá
        </Button>
      )}

      <Drawer
        title="Chọn mã giảm giá"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={380}
      >
        {loading ? (
          <Spin size="large" />
        ) : vouchers.length === 0 ? (
          <p>Không có mã giảm giá nào.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {vouchers.map((v) => {
              const now = dayjs();
              const start = dayjs(v.startDate);
              const end = dayjs(v.endDate);
              const isValid = v.isActive && start.isBefore(now) && end.isAfter(now);
              const nearlyExpired = end.diff(now, "hour") <= 24 && end.diff(now, "hour") > 0;

              return (
                <div
                  key={v._id}
                  className={`flex border rounded-lg shadow-sm bg-white overflow-hidden relative ${
                    !isValid ? "opacity-50 pointer-events-none" : "cursor-pointer"
                  }`}
                >
                  {/* Badge số lần dùng còn lại */}
                  <div className="absolute top-2 right-2 text-white text-xs font-semibold px-2 py-0.5 rounded-full bg-red-500">
                    {v.usageLimit && v.usedCount ? `×${v.usageLimit - v.usedCount}` : ""}
                  </div>

                  {/* Icon / label */}
                  <div className="bg-green-600 w-20 flex flex-col items-center justify-center text-white text-sm px-2 py-4">
                    <div className="text-center font-bold uppercase">ĐÃ LƯU</div>
                  </div>

                  {/* Nội dung */}
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <p className="font-semibold text-base text-gray-800">
                        {v.discountType === "fixed"
                          ? `Giảm ${v.discountValue.toLocaleString()}₫`
                          : `Giảm ${v.discountValue}%${
                              v.maxDiscount ? ` (tối đa ${v.maxDiscount.toLocaleString()}₫)` : ""
                            }`}
                      </p>
                      <p className="text-sm text-gray-600">
                        Đơn tối thiểu: {v.minOrderValue?.toLocaleString() || 0}₫
                      </p>
                      {v.categories && v.categories.length > 0 && (
                        <p className="text-sm text-gray-600">Danh mục: {v.categories.join(", ")}</p>
                      )}
                      <p className={`text-sm mt-1 ${nearlyExpired ? "text-orange-600" : "text-gray-500"}`}>
                        {nearlyExpired
                          ? `Sắp hết hạn: ${now.to(end)}`
                          : `HSD: đến ${end.format("DD/MM/YYYY")}`}
                      </p>
                      <p className="text-xs mt-1 px-2 py-0.5 inline-block border border-gray-300 rounded">
                        Mã: {v.code}
                      </p>
                    </div>

                    {isValid && (
                      <div className="mt-2 text-right">
                        <Button
                          type="default"
                          onClick={() => handleApply(v.code)}
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
      </Drawer>
    </div>
  );
};

export default VoucherInput;
