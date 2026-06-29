import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const KEY = 'cart_v2';
const CART_KEY = ['cart'];

const readCart = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
const writeCart = (items) => localStorage.setItem(KEY, JSON.stringify(items));

export const useCart = () =>
  useQuery({ queryKey: CART_KEY, queryFn: readCart, staleTime: Infinity });

export const useAddToCart = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (product) => {
      const cart = readCart();
      const exists = cart.find((i) => i.id === product.id);
      const updated = exists
        ? cart.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
        : [...cart, { id: product.id, title: product.title, price: product.price, image: product.images?.[0] ?? '', qty: 1 }];
      writeCart(updated);
      return updated;
    },
    onSuccess: (updated) => qc.setQueryData(CART_KEY, updated),
  });
};

export const useUpdateQty = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, qty }) => {
      const updated = readCart().map((i) => i.id === id ? { ...i, qty } : i).filter((i) => i.qty > 0);
      writeCart(updated);
      return updated;
    },
    onSuccess: (updated) => qc.setQueryData(CART_KEY, updated),
  });
};

export const useRemoveFromCart = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => {
      const updated = readCart().filter((i) => i.id !== id);
      writeCart(updated);
      return updated;
    },
    onSuccess: (updated) => qc.setQueryData(CART_KEY, updated),
  });
};

export const useClearCart = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => { writeCart([]); return []; },
    onSuccess: (updated) => qc.setQueryData(CART_KEY, updated),
  });
};
