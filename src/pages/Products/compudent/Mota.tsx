// src/components/DescriptionCard.tsx
import React, { useState } from "react";
import { Star } from "lucide-react";

interface DescriptionCardProps {
  short?: string;
  full?: string;
  maxChars?: number;
}

const DescriptionCard: React.FC<DescriptionCardProps> = ({ short, full, maxChars = 500 }) => {
  const [expanded, setExpanded] = useState(false);

  const hasContent = (short && short.trim()) || (full && full.trim());
  if (!hasContent) return null;

  const fullText = String(full || "");
  const preview = fullText.length > maxChars ? fullText.slice(0, maxChars) + "…" : fullText;
  const isTruncated = fullText.length > maxChars;

  return (
    <div className="mt-10 rounded-2xl border shadow-sm bg-white overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b bg-gradient-to-r from-gray-50 to-white">
        <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
          <Star className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Mô tả sản phẩm</h2>
          <p className="text-xs text-gray-500">Thông tin tổng quan, điểm nổi bật</p>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {short?.trim() && (
          <div className="mb-4 rounded-xl bg-blue-50/60 border border-blue-100 px-4 py-3">
            <div className="text-[13px] font-medium text-blue-900">Thông tin nhanh</div>
            <div className="text-[13px] text-blue-800 mt-1">{short}</div>
          </div>
        )}

        {full?.trim() && (
          <>
            <div className="text-[15px] leading-relaxed text-gray-800 whitespace-pre-line">
              {expanded ? fullText : preview}
            </div>

            {isTruncated && (
              <div className="mt-3">
                <button
                  onClick={() => setExpanded((v) => !v)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                             border border-gray-300 hover:border-gray-400 transition bg-white"
                >
                  {expanded ? "Thu gọn" : "Xem thêm"}
                  <svg
                    className={`w-4 h-4 transition ${expanded ? "rotate-180" : ""}`}
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" fill="none" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}

        <div className="mt-6 grid sm:grid-cols-3 gap-3">
          <div className="rounded-xl border bg-gray-50 px-4 py-3 text-sm">
            <div className="font-medium text-gray-800">Hàng chính hãng</div>
            <div className="text-gray-600 mt-1">Nguồn gốc rõ ràng, bảo hành tại TTBH uỷ quyền.</div>
          </div>
          <div className="rounded-xl border bg-gray-50 px-4 py-3 text-sm">
            <div className="font-medium text-gray-800">Đổi trả 7 ngày</div>
            <div className="text-gray-600 mt-1">Đổi sản phẩm nếu lỗi do NSX theo chính sách.</div>
          </div>
          <div className="rounded-xl border bg-gray-50 px-4 py-3 text-sm">
            <div className="font-medium text-gray-800">Hỗ trợ trả góp</div>
            <div className="text-gray-600 mt-1">Lãi suất tốt, duyệt nhanh tại cửa hàng.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DescriptionCard;
