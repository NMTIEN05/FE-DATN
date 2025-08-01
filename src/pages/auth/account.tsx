import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Input, Button, message, Modal } from "antd";
import { jwtDecode } from "jwt-decode";

interface User {
  _id: string;
  username: string;
  email: string;
  phone: string;
  full_name: string;
  address: string;
  role: string;
  isActive: boolean;
}

interface DecodedToken {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

const Account: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Bạn chưa đăng nhập");
        return;
      }

      const decoded = jwtDecode<DecodedToken>(token);
      console.log("✅ Token decoded:", decoded);

      const res = await axios.get(`http://localhost:8888/api/auth/${decoded.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data);
      form.setFieldsValue(res.data);
    } catch (error) {
      console.error("❌ Lỗi khi lấy thông tin tài khoản:", error);
      message.error("Không thể lấy thông tin người dùng");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const onFinish = async (values: Partial<User>) => {
    if (!user) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:8888/api/auth/${user._id}`,
        values,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success("✅ Cập nhật thành công");
      setUser(res.data);
    } catch (error: any) {
      console.error("❌ Cập nhật thất bại:", error);
      message.error(error.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = () => {
    Modal.confirm({
      title: "Vô hiệu hóa tài khoản?",
      content: "Bạn sẽ không thể sử dụng tài khoản sau khi vô hiệu hóa.",
      okText: "Xác nhận",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const token = localStorage.getItem("token");
          await axios.delete(`http://localhost:8888/api/auth/${user?._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          message.success("Đã vô hiệu hóa tài khoản");
          localStorage.removeItem("token");
          window.location.href = "/login";
        } catch (error) {
          message.error("Vô hiệu hóa thất bại");
        }
      },
    });
  };

  if (!user) return <div>Đang tải...</div>;

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-6">Thông tin tài khoản</h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Tên đăng nhập" name="username">
          <Input disabled />
        </Form.Item>

        <Form.Item label="Email">
          <Input value={user.email} disabled />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Họ và tên"
          name="full_name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Địa chỉ" name="address">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Lưu thay đổi
          </Button>
        </Form.Item>
      </Form>

      <Button danger block onClick={handleDeactivate}>
        Vô hiệu hóa tài khoản
      </Button>
    </div>
  );
};

export default Account;
