const KEY = 'cart';

export const readCart = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
};

export const writeCart = (items) =>
  localStorage.setItem(KEY, JSON.stringify(items));
