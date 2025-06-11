import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProductService } from '../services/product.service';
import { Product } from '../types/product.type';
import axios from '../api/axios.config';

interface UseProductsParams {
    limit?: number;
    page?: number;
    sort?: string;
    category_id?: string;
}

export const useProducts = ({ limit = 10, page = 1, sort, category_id }: UseProductsParams = {}) => {
    return useQuery({
        queryKey: ['products', { limit, page, sort, category_id }],
        queryFn: async () => {
            let url = `/products?_page=${page}&_limit=${limit}`;
            
            if (category_id) {
                url += `&category_id=${category_id}`;
            }

            if (sort === 'price-asc') {
                url += '&_sort=base_price&_order=asc';
            } else if (sort === 'price-desc') {
                url += '&_sort=base_price&_order=desc';
            }

            const response = await axios.get(url);
            
            // Đảm bảo response.data là một mảng
            const products = Array.isArray(response.data) ? response.data : [];
            
            return {
                products,
                total: parseInt(response.headers['x-total-count'] || '0')
            };
        }
    });
};

export const useProduct = (id: number) => {
    return useQuery({
        queryKey: ['product', id],
        queryFn: () => ProductService.getProductById(id)
    });
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (product: Omit<Product, 'id'>) => ProductService.createProduct(product),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        }
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, product }: { id: number; product: Partial<Product> }) =>
            ProductService.updateProduct(id, product),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        }
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => ProductService.deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        }
    });
}; 