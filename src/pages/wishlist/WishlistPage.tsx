import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  wishlistService,
  WishlistItem,
} from "../../pages/Services/wishlist/wishlist.service";
const WishlistPage: React.FC = () => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await wishlistService.getAll();
        setItems(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const remove = async (pid: string) => {
    await wishlistService.remove(pid);
    setItems((prev) =>
      prev.filter((it) => String(it.product?._id ?? it.product) !== pid)
    );
  };

  if (loading) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold mb-6">Danh sách yêu thích</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-100 p-3 animate-pulse bg-white"
            >
              <div className="aspect-[4/5] bg-gray-100 rounded-lg mb-3" />
              <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-100 rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-14 text-center">
        <h1 className="text-2xl font-semibold mb-2">Danh sách yêu thích</h1>
        <p className="text-gray-500">Bạn chưa thêm sản phẩm nào.</p>
        <Link
          to="/products"
          className="inline-block mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Mua sắm ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Danh sách yêu thích</h1>

      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {items.map((it) => {
          const p: any = it.product;
          const pid = String(p?._id ?? it.product);

          const title = p?.title ?? p?.name ?? "Sản phẩm";
          const cover = Array.isArray(p?.imageUrl)
            ? p.imageUrl[0]
            : typeof p?.imageUrl === "string"
            ? p.imageUrl
            : undefined;
          const price = p?.priceDefault ?? p?.price;

          return (
            <li
              key={it._id}
              className="group rounded-xl border border-gray-100 bg-white overflow-hidden hover:shadow-md transition-all"
            >
              {/* Image */}
              <Link to={`/product/${p?.slug ?? pid}`} className="block">
                <div className="relative aspect-[4/5] bg-gray-50">
                  {cover ? (
                    <img
                      src={cover}
                      alt={title}
                      className="absolute inset-0 w-full h-full object-contain p-3 transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-100" />
                  )}
                </div>
              </Link>

              {/* Content */}
              <div className="p-3">
                <Link
                  to={`/product/${p?.slug ?? pid}`}
                  className="line-clamp-2 text-sm font-medium text-gray-800 hover:text-blue-600"
                  title={title}
                >
                  {title}
                </Link>

                {price != null && (
                  <div className="mt-1 text-red-500 font-semibold">
                    {Number(price).toLocaleString("vi-VN")}₫
                  </div>
                )}

                <div className="mt-3 flex items-center gap-2">
                  <Link
                    to={`/product/${p?.slug ?? pid}`}
                    className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50"
                  >
                    Xem
                  </Link>
                  <button
                    onClick={() => remove(pid)}
                    className="px-3 py-1.5 text-sm border border-pink-400 text-pink-500 rounded-lg hover:bg-pink-50"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default WishlistPage;
