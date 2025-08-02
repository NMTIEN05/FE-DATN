import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const MainLayout: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState("");

  return (
    <div className="main-layout">
      <Header setSelectedMenu={setSelectedMenu} />
      <main style={{ minHeight: '80vh' }}>
        <Outlet context={{ selectedMenu, setSelectedMenu }} />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
