// src/router/index.tsx
import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';

import HomePage from '../pages/Home/HomePage';
import Products from '../pages/Products/Products';
// import ProductDetail from '../pages/Products/ProductDetail';
import Services from '../pages/Services/Services';
import Contact from '../pages/Contact/Contact';
import Cart from '../pages/Cart/Cart';
import Shipping from '../pages/Shipping/Shipping';
import MainLayout from '../components/Layouts/MainLayout';
import Login from '../pages/auth/login';
import Register from '../pages/auth/register';
import EmailVerificationUI from '../pages/auth/CheckMail';
import ForgotPassword from '../pages/auth/ForgotPassWord';
import ResetPassword from '../pages/auth/ResetPass';
import ChangePasswordForm from '../pages/auth/Changepassword';

import ProductDetail from '../pages/Products/ProductDetail';
import Deteil from '../pages/Products/DeteilProduct/Deteil';

import OrderDetail from '../pages/order/OrderDetail';
import Checkout from '../pages/Cart/checkout';
import OrderTabs from '../pages/order/OrderTabs';


const token = localStorage.getItem("token");

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'checkout', element: <Checkout /> },

      { index: true, element: <HomePage /> },
      { path: 'products', element: <Products /> },
      { path: 'dien-thoai', element: <Products /> },
      { path: 'product/:id', element: <Deteil /> },
      { path: 'services', element: <Services /> },
      { path: 'contact', element: <Contact /> },
      { path: 'cart', element: <Cart /> },
      { path: 'shipping', element: <Shipping /> },
      { path: 'change-password', element: <ChangePasswordForm /> },
      { path: 'orders/:id', element: <OrderDetail /> },
      { path: 'orders', element: <OrderTabs /> },

    ],
  },
  // Auth routes (không có layout)
  { path: '/register', element: <Register /> },
  { path: '/login', element: <Login /> },
  { path: '/checkmail', element: <EmailVerificationUI /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/reset-password', element: <ResetPassword /> },
];
