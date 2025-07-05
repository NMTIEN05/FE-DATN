// src/App.tsx
import React, { useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import { routes } from './router';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    <div className="App">
     
      {routing}
      
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
