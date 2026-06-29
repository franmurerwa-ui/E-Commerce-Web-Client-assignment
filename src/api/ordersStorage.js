const KEY = 'orders';

export const readOrders = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
};

export const writeOrders = (orders) =>
  localStorage.setItem(KEY, JSON.stringify(orders));
