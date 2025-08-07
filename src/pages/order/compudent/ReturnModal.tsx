import React, { useState } from "react";
import { Modal, Radio, Input, message } from "antd";
import axios from "axios";

interface Props {
  orderId: string;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const reasonOptions = [
  "Sản phẩm bị lỗi",
  "Giao sai sản phẩm",
  "Không đúng mô tả",
  "Đổi ý không muốn mua nữa",
  "Khác",
];

const ReturnModal: React.FC<Props> = ({ orderId, open, onClose, onSuccess }) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [loading, setLoading] = useState(false);

const handleReturn = async () => {
  const reasonToSend = selectedReason === "Khác" ? customReason.trim() : selectedReason;

  if (!reasonToSend) {
    message.warning("Vui lòng chọn hoặc nhập lý do trả hàng.");
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    message.error("Bạn cần đăng nhập để thực hiện thao tác này.");
    return;
  }

  try {
    setLoading(true);
    await axios.post(
      `http://localhost:8888/api/orders/${orderId}/return-request`,
      { reason: reasonToSend },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    message.success("Yêu cầu trả hàng đã được gửi");
    onClose();
    setSelectedReason("");
    setCustomReason("");
    onSuccess?.();
  } catch (err) {
    console.error("Lỗi trả hàng:", err);
    message.error("Không thể gửi yêu cầu trả hàng.");
  } finally {
    setLoading(false);
  }
};


  return (
    <Modal
      open={open}
      title="Lý do trả hàng"
      onCancel={onClose}
      onOk={handleReturn}
      confirmLoading={loading}
      okText="Gửi yêu cầu"
      cancelText="Huỷ"
    >
      <Radio.Group
        onChange={(e) => setSelectedReason(e.target.value)}
        value={selectedReason}
        className="flex flex-col gap-2"
      >
        {reasonOptions.map((reason, idx) => (
          <Radio key={idx} value={reason}>
            {reason}
          </Radio>
        ))}
      </Radio.Group>

      {selectedReason === "Khác" && (
        <Input.TextArea
          className="mt-4"
          placeholder="Nhập lý do khác..."
          value={customReason}
          onChange={(e) => setCustomReason(e.target.value)}
          rows={3}
        />
      )}
    </Modal>
  );
};

export default ReturnModal;
