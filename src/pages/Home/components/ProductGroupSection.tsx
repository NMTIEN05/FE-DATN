import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "../../../api/axios.config";
import { FaRegHeart, FaHeart, FaEye, FaShoppingCart } from "react-icons/fa";
import { Button } from "antd";
import { IProduct } from "../../../types/product";
import { Category } from "../../../types/category";
import { WishlistItem, wishlistService } from "../../Services/wishlist/wishlist.service";

// ------- APIs load category & products -------
const fetchCategories = async (): Promise<Category[]> => {

    const res = await axios.get("http://localhost:8888/api/category?limit=4");
    // Lọc bỏ danh mục có tên "Điện thoại"
    const categories = res.data.data.filter((c: Category) => c.name !== "Điện thoại");
    return categories;
};


const fetchProductsByCategory = async (
    categoryId: string
): Promise<IProduct[]> => {
    const res = await axios.get(
        `http://localhost:8888/api/product?categoryId=${categoryId}`
    );
    return res.data.data;

};

// ============================================
const CategoryWithProducts: React.FC = () => {
  const { data: categories, isLoading, isError, error } = useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48 mx-4 my-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Đang tải danh mục sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-48 bg-red-50 mx-4 my-8">
        <div className="text-center p-4">
          <p className="text-lg font-medium text-red-600">
            Có lỗi xảy ra khi tải danh mục: <span className="font-normal">{error.message}</span>
          </p>
          <p className="text-sm text-gray-500 mt-2">Vui lòng thử lại sau.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      {Array.isArray(categories) && categories.length > 0 ? (
        categories.map((category) => <CategorySection key={category._id} category={category} />)
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500">Không có danh mục nào để hiển thị.</p>
        </div>
      )}
    </div>
  );
};

// ============================================
// Section theo từng category + xử lý Wishlist
// ============================================
const CategorySection: React.FC<{ category: Category }> = ({ category }) => {
  const { data: products, isLoading, isError, error } = useQuery<IProduct[], Error>({
    queryKey: ["productsByCategory", category._id],
    queryFn: () => fetchProductsByCategory(category._id),
  });

  // Map trạng thái tim theo productId
  const [favMap, setFavMap] = useState<Record<string, boolean>>({});

  // Load wishlist 1 lần cho section này
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await wishlistService.getAll();
        if (!mounted) return;
        const map: Record<string, boolean> = {};
        list.forEach((it: WishlistItem) => {
          const pid = String(it.product?._id ?? it.product);
          map[pid] = true;
        });
        setFavMap(map);
      } catch {/* ignore */}
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const toggleFavorite = async (productId: string) => {
    const liked = !!favMap[productId];
    try {
      if (!liked) {
        await wishlistService.add(productId);           // POST /wishlist/:id
        setFavMap((prev) => ({ ...prev, [productId]: true }));
      } else {
        await wishlistService.remove(productId);        // DELETE /wishlist/:id
        setFavMap((prev) => ({ ...prev, [productId]: false }));
      }
    } catch (e: any) {
      // fallback theo BE của bạn: 400=đã tồn tại, 404=chưa có
      const code = e?.response?.status;
      if (!liked && code === 400) {
        await wishlistService.remove(productId);
        setFavMap((prev) => ({ ...prev, [productId]: false }));
      } else if (liked && code === 404) {
        await wishlistService.add(productId);
        setFavMap((prev) => ({ ...prev, [productId]: true }));
      } else {
        alert(e?.response?.data?.message || "Có lỗi xảy ra");
      }
    }
  };

  if (isLoading) {
    return (
      <section className="mb-16 p-6 animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <div className="h-10 bg-gray-200 rounded w-56"></div>
          <div className="h-10 bg-gray-200 rounded w-28"></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="rounded-lg overflow-hidden bg-gray-100 p-4">
              <div className="bg-gray-200 rounded-lg h-56 mb-4"></div>
              <div className="bg-gray-200 h-5 rounded mb-2"></div>
              <div className="bg-gray-200 h-4 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="mb-16 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{category.name}</h2>
        <div className="bg-red-50 p-4 text-center">
          <p className="text-red-600 font-medium">
            Rất tiếc, không thể tải sản phẩm cho danh mục "{category.name}".
          </p>
          <p className="text-sm text-red-500 mt-1">Lỗi: {error.message}</p>
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <section className="mb-16 p-6">
        <h2 className="uppercase text-xl font-semibold tracking-wide border-gray-700 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 w-[220px] h-11 flex items-center justify-center text-white rounded-lg shadow-md transform -rotate-1 skew-x-3">
          {category.name}
        </h2>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Không có sản phẩm nào trong danh mục này.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-16 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="uppercase text-xl font-semibold tracking-wide border border-gray-700 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 w-[220px] h-11 flex items-center justify-center text-white rounded-lg shadow-md transform -rotate-1 skew-x-3">
            {category.name}
          </h2>
          <Button
            type="default"
            className="text-blue-500 hover:!bg-blue-50 hover:!text-blue-600 transition-all duration-200 font-medium px-6 py-2 rounded-lg flex items-center"
          >
            Xem tất cả
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-8">
          {products.map((product) => {
            const image = Array.isArray(product.imageUrl) ? product.imageUrl[0] : "/placeholder-image.jpg";
            const salePrice = product.priceDefault ?? 0;
            const fakeOriginalPrice = salePrice + 1000000;
            const isFreeShip = salePrice > 10000000;

            const isFav = !!favMap[product._id]; // ✅ trạng thái tim theo wishlist

            const handleQuickView = (e: React.MouseEvent) => {
              e.stopPropagation();
              console.log(`Quick view: ${product.title}`);
            };

            const handleAddToCart = (e: React.MouseEvent) => {
              e.stopPropagation();
              console.log(`Add to cart: ${product.title}`);
            };

            return (
              <div
                key={product._id}
                onClick={() => (window.location.href = `/product/${product._id}`)}
                className="group rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden relative bg-white border border-gray-100"
              >
                {/* Badges */}
                <div className="absolute top-3 left-3 z-10 flex flex-row gap-2 flex-wrap">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded border border-green-600 text-green-600">
                    Trả góp 0%
                  </span>
                  {isFreeShip && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded border border-blue-600 text-blue-600">
                      Free Ship
                    </span>
                  )}
                </div>

                {/* Favorite */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(product._id);
                  }}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform duration-200 z-10"
                  title="Yêu thích"
                >
                  {isFav ? (
                    <FaHeart className="text-red-500 text-lg" />
                  ) : (
                    <FaRegHeart className="text-gray-400 text-lg group-hover:text-red-500 transition-colors" />
                  )}
                </button>

                {/* Image */}
                <div className="relative w-full aspect-[4/5] bg-gray-50 flex items-center justify-center overflow-hidden">
                  <img
                    src={image}
                    alt={product.title}
                    className="max-h-[80%] max-w-[80%] object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-3">
                      <button
                        onClick={handleQuickView}
                        className="bg-white p-2 rounded-full shadow hover:bg-gray-100 transition-transform transform hover:scale-110"
                        title="Xem nhanh"
                      >
                        <FaEye className="text-gray-600 text-sm" />
                      </button>
                      <button
                        onClick={handleAddToCart}
                        className="bg-blue-600 p-2 rounded-full shadow hover:bg-blue-700 transition-transform transform hover:scale-110"
                        title="Thêm vào giỏ hàng"
                      >
                        <FaShoppingCart className="text-white text-sm" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-800 line-clamp-2" title={product.title}>
                    {product.title}
                  </h3>

                  {/* Giá & giảm */}
                  <div className="flex flex-col mt-1">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-gray-400 line-through text-sm">
                        {fakeOriginalPrice.toLocaleString("vi-VN")}₫
                      </span>
                      <span className="text-blue-600 font-semibold text-lg">
                        {salePrice.toLocaleString("vi-VN")}₫
                      </span>
                    </div>

                    <span
                      className={`mt-1 text-xs font-medium px-2 py-[2px] rounded border w-fit 
                      ${salePrice > 20000000 ? "border-red-300 text-red-500 bg-red-50" : "border-green-300 text-green-600 bg-green-50"}`}
                    >
                      Giảm trực tiếp 1.000.000₫
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mt-2">
                    <div className="flex text-yellow-400 text-sm">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>{i < 4 ? "★" : "☆"}</span>
                      ))}
                    </div>
                    <span className="text-gray-500 text-xs ml-2">(24 đánh giá)</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryWithProducts;
