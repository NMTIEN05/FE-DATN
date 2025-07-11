// src/App.tsx
import React, { useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import { routes } from './router';
import './App.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// 👇 Thêm dòng này theo dev
import { CartProvider } from './contexts/CartContext';

function App() {
  useEffect(() => {
    axios
      .get("http://localhost:8888/api/ping")
      .then((response) => {
        console.log(response.data.message);
      })
      .catch((error) => {
        toast.error("Không thể kết nối tới server!");
        console.error("Lỗi khi gọi API:", error);
      });
  }, []);

  const routing = useRoutes(routes);

  return (
    <CartProvider> {/* 👈 Bọc toàn bộ app bên trong CartProvider */}
      <div className="App">
        {routing}
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </CartProvider>
  );
}

export default App;
