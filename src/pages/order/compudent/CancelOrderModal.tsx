import React from "react";
import { Modal, Radio, Input, message } from "antd";

interface CancelOrderModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  selectedReason: string;
  setSelectedReason: (value: string) => void;
  customReason: string;
  setCustomReason: (value: string) => void;
  predefinedReasons: string[];
}

const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
  open,
  onCancel,
  onConfirm,
  selectedReason,
  setSelectedReason,
  customReason,
  setCustomReason,
  predefinedReasons,
}) => {
  return (
    <Modal
      title="Lý do hủy đơn hàng"
      open={open}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Xác nhận hủy"
      cancelText="Thoát"
    >
      <p className="mb-2">Vui lòng chọn lý do bạn muốn hủy đơn hàng:</p>
      <Radio.Group
        onChange={(e) => setSelectedReason(e.target.value)}
        value={selectedReason}
        className="flex flex-col gap-2"
      >
        {predefinedReasons.map((reason, idx) => (
          <Radio key={idx} value={reason}>
            {reason}
          </Radio>
        ))}
      </Radio.Group>

      {selectedReason === "Khác" && (
        <Input.TextArea
          rows={4}
          className="mt-4"
          placeholder="Vui lòng nhập lý do cụ thể..."
          value={customReason}
          onChange={(e) => setCustomReason(e.target.value)}
        />
      )}
    </Modal>
  );
};

export default CancelOrderModal;
