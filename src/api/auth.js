import client from './client';

export const login = ({ email, password }) =>
  client.post('/auth/login', { email, password }).then((r) => r.data);

export const getProfile = (token) =>
  client.get('/auth/profile', {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.data);
