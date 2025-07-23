import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from '../../api/axios.config';

const VnpayReturn = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('Đang xử lý...');

  useEffect(() => {
    const fetch = async () => {
      try {
        const query = Object.fromEntries([...searchParams.entries()]);
        const res = await axios.get('/vnpay/verify', { params: query });

        if (res.data.success) {
          setStatus('✅ Thanh toán thành công!');
        } else {
          setStatus('❌ Thanh toán thất bại!');
        }
      } catch (err) {
        console.error(err);
        setStatus('❌ Lỗi xác minh thanh toán');
      }
    };

    fetch();
  }, [searchParams]);

  return (
    <div style={{ padding: 32 }}>
      <h2>Kết quả thanh toán</h2>
      <p>{status}</p>
    </div>
  );
};

export default VnpayReturn;
