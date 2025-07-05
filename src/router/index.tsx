// src/router/index.tsx
import React from 'react';
import { RouteObject } from 'react-router-dom';

import HomePage from '../pages/Home/HomePage';
import Products from '../pages/Products/Products';
import ProductDetail from '../pages/Products/ProductDetail';
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

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'products', element: <Products /> },
      { path: 'products/:slug', element: <ProductDetail /> },
      { path: 'services', element: <Services /> },
      { path: 'contact', element: <Contact /> },
      { path: 'cart', element: <Cart /> },
      { path: 'shipping', element: <Shipping /> },
    ],
  },
  { path: '/register', element: <Register /> }, // không có layout
  {path :'/login',element :<Login/>},
  {path :'/checkmail',element :<EmailVerificationUI/>},
  {path:'/forgot-password',element:<ForgotPassword/>},
  {path:"/reset-password", element: <ResetPassword />}, // Đổi mật khẩu sau khi xác minh email
];


