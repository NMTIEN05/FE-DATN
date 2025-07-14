import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { Button } from 'antd';

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

const fetchCategories = async (): Promise<Category[]> => {
  const res = await axios.get('http://localhost:8888/api/category');
  return res.data.data;
};

const fetchProductsByCategory = async (categoryId: string): Promise<Product[]> => {
  const res = await axios.get(`http://localhost:8888/api/product?categoryId=${categoryId}`);
  return res.data.data;
};

const CategoryWithProducts: React.FC = () => {
  const { data: categories, isLoading, isError, error } = useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-lg text-gray-600 animate-pulse">Đang tải danh mục... ⏳</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-48 text-red-600">
        <p className="text-lg font-medium">Lỗi: {error.message} 😟</p>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {categories?.length === 0 ? (
        <p className="text-center text-gray-500">Không có danh mục nào để hiển thị.</p>
      ) : (
        categories.map((category) => (
          <CategorySection key={category._id} category={category} />
        ))
      )}
    </div>
  );
};

const CategorySection: React.FC<{ category: Category }> = ({ category }) => {
  const { data: products, isLoading, isError, error } = useQuery<Product[], Error>({
    queryKey: ['productsByCategory', category._id],
    queryFn: () => fetchProductsByCategory(category._id),
  });

  if (isLoading) {
    return (
      <section className="mb-10 animate-pulse px-2">
        <h2 className="text-xl font-bold text-blue-600 mb-3">{category.name}</h2>
        <p className="text-gray-500">Đang tải sản phẩm...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="mb-10 text-red-600 px-2">
        <h2 className="text-xl font-bold mb-2">{category.name}</h2>
        <p className="text-sm">Lỗi khi tải sản phẩm: {error.message}</p>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <section className="mb-10 px-2">
        <h2 className="text-xl font-bold text-gray-700 mb-3">{category.name}</h2>
        <p className="text-gray-500">Không có sản phẩm nào trong danh mục này.</p>
      </section>
    );
  }

  return (
    <section className="mb-12 px-2">
      <div className="flex justify-between items-center mb-6">
        <h2 className="uppercase text-xl font-semibold tracking-wide border border-gray-700 bg-gradient-to-r from-black via-gray-800 to-gray-600 w-[200px] h-10 flex items-center justify-center text-white rounded shadow-inner">
          {category.name}
        </h2>
        <Button type="default" className="border border-blue-500 text-blue-500 hover:bg-blue-50">
          Xem tất cả
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {products.map((product) => {
          const image = Array.isArray(product.imageUrl)
            ? product.imageUrl[0]
            : '/placeholder-image.jpg';

          const handleFavoriteClick = (e: React.MouseEvent) => {
            e.stopPropagation();
            console.log(`Toggle favorite for ${product.title} (ID: ${product._id})`);
          };

          return (
            <div
              key={product._id}
              onClick={() => (window.location.href = `/product/${product._id}`)}
              className="group bg-white rounded-lg shadow-sm hover:shadow-md transition hover:-translate-y-1 cursor-pointer overflow-hidden"
            >
              {/* Ảnh sản phẩm với aspect-ratio */}
              <div className="relative w-full aspect-[4/5] overflow-hidden">
                <img
                  src={image}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div
                  onClick={handleFavoriteClick}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:scale-110 transition"
                  title={product.isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                >
                  {product.isFavorite ? (
                    <FaHeart className="text-red-500 text-lg" />
                  ) : (
                    <FaRegHeart className="text-gray-400 text-lg" />
                  )}
                </div>
              </div>

              {/* Nội dung sản phẩm */}
              <div className="p-4 text-center">
                <h3
                  className="text-base font-medium text-gray-800 truncate mb-1"
                  title={product.title}
                >
                  {product.title}
                </h3>
                {product.priceDefault ? (
                  <p className="text-red-600 font-bold text-lg">
                    {product.priceDefault.toLocaleString('vi-VN')}₫
                  </p>
                ) : (
                  <p className="text-gray-500 text-sm italic">Giá đang cập nhật</p>
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
