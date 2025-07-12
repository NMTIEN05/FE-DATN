import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { Button } from 'antd';


// --- Interfaces ---
interface Category {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  title: string;
  imageUrl?: string | string[];
  priceDefault?: number;
  isFavorite?: boolean;
}

// --- API Calls ---
const fetchCategories = async (): Promise<Category[]> => {
  const res = await axios.get('http://localhost:8888/api/category');
  return res.data.data;
};

const fetchProductsByCategory = async (categoryId: string): Promise<Product[]> => {
  const res = await axios.get(`http://localhost:8888/api/product?categoryId=${categoryId}`);
  return res.data.data;
};

// --- Main Component: CategoryWithProducts ---
const CategoryWithProducts: React.FC = () => {
  const {
    data: categories,
    isLoading,
    isError,
    error,
  } = useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48 m-4"> {/* Bỏ bg, border, rounded, shadow */}
        <div className="text-xl font-semibold text-gray-700 animate-pulse">
          Đang tải danh mục... ⏳
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-48 text-red-700 m-4"> {/* Bỏ bg, border, rounded, shadow */}
        <div className="text-xl font-semibold">
          Lỗi khi tải danh mục: <span className="font-normal">{error.message}</span> 😟
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 my-8"> {/* Bỏ bg, rounded, shadow */}
      {categories?.length === 0 ? (
        <div className="text-center text-gray-600 py-10 text-lg">
          Không có danh mục nào để hiển thị.
        </div>
      ) : (
        categories?.map((category) => (
          <CategorySection key={category._id} category={category} />
        ))
      )}
    </div>
  );
};

// --- Sub-component: CategorySection ---
const CategorySection: React.FC<{ category: Category }> = ({ category }) => {
  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery<Product[], Error>({
    queryKey: ['productsByCategory', category._id],
    queryFn: () => fetchProductsByCategory(category._id),
  });

  if (isLoading) {
    return (
      <section className="mb-10 p-6 animate-pulse"> {/* Bỏ bg, shadow, rounded */}
        <h2 className="text-2xl font-bold text-blue-600 mb-4">{category.name}</h2>
        <div className="text-gray-500 text-lg">Đang tải sản phẩm cho {category.name}...</div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="mb-10 text-red-600 p-6"> {/* Bỏ bg, border, rounded */}
        <h2 className="text-2xl font-bold text-red-700 mb-4">{category.name}</h2>
        <div className="text-lg">
          Lỗi khi tải sản phẩm cho {category.name}:{' '}
          <span className="font-normal">{error.message}</span> 😥
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <section className="mb-10 p-6"> {/* Bỏ bg, shadow, rounded */}
        <h2 className="text-2xl font-bold text-gray-700 mb-4">{category.name}</h2>
        <div className="text-gray-500 text-lg">Không có sản phẩm nào trong danh mục này.</div>
      </section>
    );
  }

  return (
    <section className="mb-12 p-5"> {/* Bỏ bg, shadow, rounded, border */}
   <div className="flex justify-between items-center mb-6">
  {/* Tiêu đề bên trái */}
  <h2 className="uppercase text-xl font-semibold tracking-wide border border-gray-700 bg-gradient-to-r from-black via-gray-800 to-gray-600 w-[200px] h-[40px] flex items-center justify-center shadow-inner rounded">
    <span className="text-white drop-shadow-sm">{category.name}</span>
  </h2>

  {/* Nút "Xem tất cả" bên phải */}
          <Button color="primary" variant="outlined">
           xem tất cả
          </Button>
</div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {products.map((product) => {
          const image = Array.isArray(product.imageUrl)
            ? product.imageUrl[0]
            : '/placeholder-image.jpg';

          const isFavorite = product.isFavorite;

          const handleFavoriteClick = (e: React.MouseEvent) => {
            e.stopPropagation();
            console.log(`Toggle favorite for ${product.title} (ID: ${product._id})`);
          };

          return (
            <div
              key={product._id}
              className="group overflow-hidden shadow-sm hover:shadow-md transform hover:-translate-y-1 transition duration-300 ease-in-out cursor-pointer"
              onClick={() => (window.location.href = `/product/${product._id}`)}
            >
              <div className="relative w-full h-48 overflow-hidden"> {/* Bỏ bg-gray-100 */}
                <img
                  src={image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
                />
                {!product.imageUrl && (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm"> {/* Bỏ bg-gray-200 */}
                    No Image
                  </div>
                )}
                <div
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md cursor-pointer hover:scale-110 transition-transform duration-200"
                  onClick={handleFavoriteClick}
                  title={isFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
                >
                  {isFavorite ? (
                    <FaHeart className="text-red-500 text-xl" />
                  ) : (
                    <FaRegHeart className="text-gray-400 text-xl" />
                  )}
                </div>
              </div>
              <div className="p-4 text-center">
                <div className="text-base font-semibold text-gray-800 truncate mb-1" title={product.title}>
                  {product.title}
                </div>
                {product.priceDefault ? (
                  <div className="text-red-600 font-bold text-lg">
                    {product.priceDefault.toLocaleString('vi-VN')}₫
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm italic">Giá đang cập nhật</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryWithProducts;