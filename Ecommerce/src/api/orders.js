import client from './client';
import { USER_ID } from './cart';

export const fetchOrders = () =>
  client.get('/orders', { params: { userId: USER_ID } }).then((r) => r.data.data);

export const fetchOrder = (id) =>
  client.get(`/orders/${id}`, { params: { userId: USER_ID } }).then((r) => r.data.data.order);

export const placeOrder = () =>
  client.post('/orders', { userId: USER_ID }).then((r) => r.data.data.order);
