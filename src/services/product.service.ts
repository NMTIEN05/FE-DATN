import axios from '../api/axios.config';
import { Product } from '../types/product.type';


export const ProductService = {
    // Lấy danh sách sản phẩm với phân trang và filter
    getProducts: async (params?: {
        page?: number;
        limit?: number;
        category_id?: number;
        price_min?: number;
        price_max?: number;
        sort?: string;
    }) => {
        const queryParams = {
            _page: params?.page || 1,
            _limit: params?.limit || 12,
            category_id: params?.category_id,
            _sort: params?.sort?.split('-')[0],
            _order: params?.sort?.split('-')[1] || 'asc',
            price_gte: params?.price_min,
            price_lte: params?.price_max
        };

        const response = await axios.get('/products', { 
            params: queryParams,
        });

        // json-server trả về tổng số items trong header x-total-count
        const total = parseInt(response.headers['x-total-count']);
        const hasMore = total > (params?.page || 1) * (params?.limit || 12);

        return {
            products: response.data,
            total,
            hasMore
        };
    },

    // Lấy chi tiết sản phẩm
    getProductById: async (id: number) => {
        const response = await axios.get(`/products/${id}`);
        return response.data;
    },

    getUsers: async () => {
        const response = await axios.get('http://localhost:3001/users');
        return response.data;
    },

    // Lấy sản phẩm theo danh mục
    getProductsByCategory: async (categoryId: number) => {
        const response = await axios.get(`/products?category_id=${categoryId}`);
        return response.data;
    },

    // Thêm sản phẩm mới (Admin)
    createProduct: async (product: Omit<Product, 'id'>) => {
        const response = await axios.post('/products', product);
        return response.data;
    },

    // Cập nhật sản phẩm (Admin)
    updateProduct: async (id: number, product: Partial<Product>) => {
        const response = await axios.put(`/products/${id}`, product);
        return response.data;
    },

    // Xóa sản phẩm (Admin)
    deleteProduct: async (id: number) => {
        const response = await axios.delete(`/products/${id}`);
        return response.data;
    }
}; 