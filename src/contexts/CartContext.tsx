import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api/axios.config';

interface CartItem {
  _id?: string; // ID của CartItem trên backend
  productId: string;
  variantId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  color?: string;
  storage?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  fetchCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // ✅ Hàm lấy giỏ hàng từ BE
  const fetchCart = async () => {
    try {
      const res = await axios.get('/cart');
      setItems(res.data);
    } catch (err) {
      console.error('❌ Lỗi khi lấy giỏ hàng:', err);
    }
  };

  // ✅ Lấy giỏ hàng khi load lần đầu
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetchCart();
  }, []);

  // ✅ Thêm vào giỏ hàng và load lại danh sách
  const addToCart = async (item: CartItem) => {
    try {
      const payload = {
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
      };

      await axios.post('/cart/add', payload);

      // 🔁 Load lại danh sách từ backend để đồng bộ
      await fetchCart();
    } catch (err) {
      console.error('❌ Lỗi khi thêm vào giỏ:', err);
    }
  };

  // ✅ Cập nhật số lượng
  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const res = await axios.put(`/cart/update/${itemId}`, { quantity });
      setItems((prev) =>
        prev.map((item) =>
          item._id === itemId ? { ...item, quantity: res.data.quantity } : item
        )
      );
    } catch (err) {
      console.error('❌ Lỗi khi cập nhật số lượng:', err);
    }
  };

  // ✅ Xoá 1 sản phẩm
  const removeFromCart = async (itemId: string) => {
    try {
      await axios.delete(`/cart/remove/${itemId}`);
      setItems((prev) => prev.filter((item) => item._id !== itemId));
    } catch (err) {
      console.error('❌ Lỗi khi xoá sản phẩm:', err);
    }
  };

  // ✅ Xoá toàn bộ giỏ hàng
  const clearCart = async () => {
    try {
      await axios.delete('/cart/clear');
      setItems([]);
    } catch (err) {
      console.error('❌ Lỗi khi xoá toàn bộ giỏ:', err);
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        fetchCart,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
