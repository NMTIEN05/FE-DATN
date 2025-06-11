import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProductService } from '../services/product.service';
import { Product } from '../types/product.type';

export const useProducts = (params?: {
    page?: number;
    limit?: number;
    category_id?: number;
    price_min?: number;
    price_max?: number;
    sort?: string;
}) => {
    return useQuery({
        queryKey: ['products', params],
        queryFn: () => ProductService.getProducts(params)
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