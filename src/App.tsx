// src/App.tsx
import React, { useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import { routes } from './router';
import './App.css';
import axios from 'axios';

function App() {
  useEffect(() => {
    axios
      .get("http://localhost:8888/api/ping")
      .then((response) => {
        console.log(response.data.message);
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
  }, []);

  const routing = useRoutes(routes);

  return (
    <div className="App">
      {routing}
    </div>
  );
}

export default App;
