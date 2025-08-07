import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProductService } from '../services/product.service';
import axios from '../api/axios.config';
import { Product } from '../types/product.type';

interface UseProductsParams {
  limit?: number;
  page?: number;
  sort?: string; // 'price-asc' | 'price-desc'
  category_id?: string;
  group_id?: string;
  search?: string;
  deleted?: boolean;
}

export const useProducts = ({
  limit = 10,
  page = 1,
  sort,
  category_id,
  group_id,
  search,
  deleted,
}: UseProductsParams = {}) => {
  const offset = (page - 1) * limit;

  return useQuery({
    queryKey: ['products', { limit, page, sort, category_id, group_id, search, deleted }],
    queryFn: async () => {
      let url = `/product?limit=${limit}&offset=${offset}`;

      if (category_id) url += `&categoryId=${category_id}`;
      if (group_id) url += `&groupId=${group_id}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (typeof deleted === 'boolean') url += `&deleted=${deleted}`;

      if (sort === 'price-asc') {
        url += '&sortBy=priceDefault&order=asc';
      } else if (sort === 'price-desc') {
        url += '&sortBy=priceDefault&order=desc';
      }

      const response = await axios.get(url);

      return {
        products: response.data.data || [],
        total: response.data.pagination?.total || 0,
        offset: response.data.pagination?.offset || 0,
        limit: response.data.pagination?.limit || limit,
      };
    },
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product: Omit<Product, 'id'>) => ProductService.createProduct(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, product }: { id: number; product: Partial<Product> }) =>
      ProductService.updateProduct(id, product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ProductService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
