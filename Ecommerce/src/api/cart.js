import client from './client';

export const USER_ID = '6a415d4852deb9cfee038783';

export const fetchCart = () =>
  client.get('/cart', { params: { userId: USER_ID } }).then((r) => r.data.data.cart);

export const apiAddToCart = ({ productId, variantId, quantity = 1 }) => {
  const body = { userId: USER_ID, productId, quantity };
  if (variantId) body.variantId = variantId;
  return client.post('/cart/items', body).then((r) => r.data.data.cart);
};

export const apiUpdateQty = ({ itemId, quantity }) =>
  client.patch(`/cart/items/${itemId}`, { userId: USER_ID, quantity }).then((r) => r.data.data.cart);

export const apiRemoveItem = (itemId) =>
  client.delete(`/cart/items/${itemId}`, { data: { userId: USER_ID } }).then((r) => r.data.data.cart);
