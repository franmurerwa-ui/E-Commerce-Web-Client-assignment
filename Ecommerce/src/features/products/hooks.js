import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCategories, fetchProduct, fetchProducts, createCategory } from '../../api/products';

export const useProducts = (filters) =>
  useQuery({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters),
    placeholderData: (prev) => prev,
  });

export const useProduct = (id) =>
  useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id),
    enabled: !!id,
  });

export const useCategories = () =>
  useQuery({ queryKey: ['categories'], queryFn: fetchCategories });

export const useCreateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });
};
