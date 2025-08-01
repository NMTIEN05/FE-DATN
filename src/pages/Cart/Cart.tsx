import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { FaTrash } from 'react-icons/fa';
import { BsCartX } from 'react-icons/bs';

const Cart: React.FC = () => {
  const { items, updateQuantity, removeFromCart, fetchCart } = useCart();
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    setSelectedItems(items.map((item) => item._id!));
  }, [items]);

  const toggleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const isChecked = (id: string) => selectedItems.includes(id);

  const handleQuantityChange = (
    itemId: string,
    type: 'increase' | 'decrease',
    current: number,
    stock: number
  ) => {
    let newQuantity = type === 'increase' ? current + 1 : current - 1;
    if (newQuantity < 1) newQuantity = 1;
    if (newQuantity > stock) {
      alert(`Chỉ còn tối đa ${stock} sản phẩm trong kho`);
      return;
    }
    updateQuantity(itemId, newQuantity);
  };

  const selectedCartItems = items.filter((item) => isChecked(item._id!));

  const totalDiscount = selectedCartItems.reduce((acc, item) => {
    const price = item.price || (item as any).variantId?.price || 0;
    const originalPrice = price + 3400000;
    return acc + (originalPrice - price) * item.quantity;
  }, 0);

  const totalPrice = selectedCartItems.reduce((acc, item) => {
    const price = item.price || (item as any).variantId?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  const totalOriginal = totalPrice + totalDiscount;

  return (
    <>
      <h1 className="text-3xl font-bold text-center mt-6 mb-8">🛒 Giỏ hàng</h1>

      <div className="flex flex-col lg:flex-row gap-4 p-4 bg-gray-50 min-h-screen">
        {/* Danh sách sản phẩm */}
        <div className="w-full lg:w-[65%] bg-white p-4 rounded-lg shadow">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-500">
              <BsCartX size={60} className="mb-4" />
              <p className="text-lg font-semibold">Giỏ hàng của bạn đang trống.</p>
              <p className="text-sm text-gray-400">
                Hãy quay lại và chọn những sản phẩm yêu thích nhé!
              </p>
            </div>
          ) : (
            <>
              {items.map((item) => {
                const product = (item as any).productId;
                const variant = (item as any).variantId;
                const capacity = product?.capacity;
                const color =
                  item.color ||
                  variant?.attributes?.find((a: any) =>
                    a.attributeId?.name?.toLowerCase().includes('màu')
                  )?.attributeValueId?.value;

                const name = item.name || product?.title || 'Sản phẩm';
                const image =
                  item.image ||
                  variant?.imageUrl?.[0] ||
                  product?.imageUrl?.[0] ||
                  '/placeholder.jpg';
                const price = item.price || variant?.price || 0;
                const oldPrice = price + 3400000;

                return (
                  <div
                    key={item._id}
                    className={`flex items-center gap-4 py-4 px-2 border rounded-md mb-4 transition-all duration-200 ${
                      isChecked(item._id!) ? 'border' : 'border-gray-200'
                    } hover:shadow-sm`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked(item._id!)}
                      onChange={() => toggleSelectItem(item._id!)}
                      className="w-5 h-5 rounded-full accent-blue-600"
                    />
                    <img
                      src={image}
                      alt={name}
                      className="w-20 h-20 rounded border object-cover transition-transform duration-200 hover:scale-105"
                    />
                    <div className="flex flex-col flex-1">
                      <h3 className="font-medium text-base">{name}</h3>
                      {capacity && <p className="text-xs text-gray-500">Dung lượng: {capacity}</p>}
                      {color && <p className="text-xs text-gray-500">Màu: {color}</p>}

                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-red-600 font-semibold text-lg">
                          {price.toLocaleString('vi-VN')}₫
                        </span>
                        <span className="line-through text-sm text-gray-400">
                          {oldPrice.toLocaleString('vi-VN')}₫
                        </span>
                      </div>

                      {/* Số lượng + - */}
                      <div className="flex items-center mt-2 gap-2">
                        <button
                          className="px-2 py-1 text-base font-bold bg-gray-100 rounded hover:bg-gray-200"
                          onClick={() =>
                            handleQuantityChange(
                              item._id!,
                              'decrease',
                              item.quantity,
                              variant?.stock || 1
                            )
                          }
                        >
                          -
                        </button>
                        <span className="min-w-[24px] text-center">{item.quantity}</span>
                        <button
                          className="px-2 py-1 text-base font-bold bg-gray-100 rounded hover:bg-gray-200"
                          onClick={() =>
                            handleQuantityChange(
                              item._id!,
                              'increase',
                              item.quantity,
                              variant?.stock || 1
                            )
                          }
                        >
                          +
                        </button>
                        <span className="text-xs text-gray-400 ml-2">
                          Còn lại: {variant?.stock || 0}
                        </span>
                      </div>
                    </div>

                    {/* Nút xóa */}
                    <div>
                      <button
                        onClick={() => removeFromCart(item._id!)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Thông tin đơn hàng */}
        <div className="w-full lg:w-[350px] bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Thông tin đơn hàng</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Tổng tiền</span>
              <span>{totalOriginal.toLocaleString('vi-VN')}₫</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Tổng khuyến mãi</span>
              <span>{totalDiscount.toLocaleString('vi-VN')}₫</span>
            </div>
            <div className="flex justify-between font-semibold text-lg text-red-600">
              <span>Cần thanh toán</span>
              <span>{totalPrice.toLocaleString('vi-VN')}₫</span>
            </div>
          </div>

          <button
            disabled={selectedItems.length === 0}
            className={`mt-6 w-full py-2 rounded text-base font-medium transition-all duration-200 ${
              selectedItems.length === 0
                ? 'bg-gray-300 cursor-not-allowed text-gray-600'
                : 'bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-md'
            }`}
            onClick={() => {
              const selectedCartData = items.filter((item) =>
                selectedItems.includes(item._id!)
              );
              localStorage.setItem('selectedCheckoutItems', JSON.stringify(selectedCartData));
              navigate('/checkout');
            }}
          >
            Xác nhận đơn
          </button>
        </div>
      </div>
    </>
  );
};

export default Cart;
