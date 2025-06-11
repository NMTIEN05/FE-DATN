import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/Home/HomePage';
import Products from './pages/Products/Products';
import ProductDetail from './pages/Products/ProductDetail';
import Services from './pages/Services/Services';
import Contact from './pages/Contact/Contact';
import Cart from './pages/Cart/Cart';
import Shipping from './pages/Shipping/Shipping';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/shipping" element={<Shipping />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
