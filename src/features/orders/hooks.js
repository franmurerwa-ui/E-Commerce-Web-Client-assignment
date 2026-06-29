import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const KEY = 'orders_v2';
const ORDERS_KEY = ['orders'];

const readOrders = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
const writeOrders = (o) => localStorage.setItem(KEY, JSON.stringify(o));

export const useOrders = () =>
  useQuery({ queryKey: ORDERS_KEY, queryFn: readOrders, staleTime: Infinity });

export const useOrder = (id) =>
  useQuery({
    queryKey: ['orders', id],
    queryFn: () => readOrders().find((o) => o.id === id) ?? null,
    enabled: !!id,
    staleTime: Infinity,
  });

export const usePlaceOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (items) => {
      const order = {
        id: `ORD-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: 'CONFIRMED',
        items,
        total: items.reduce((s, i) => s + i.price * i.qty, 0),
      };
      writeOrders([order, ...readOrders()]);
      return order;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ORDERS_KEY }),
  });
};
