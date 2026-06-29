import client from './client';

const LIMIT = 12;

export function fetchProducts({ page = 1, limit = LIMIT, categoryId, search, priceMin, priceMax, sort } = {}) {
  const params = { offset: (page - 1) * limit, limit };
  if (categoryId) params.categoryId = categoryId;
  if (search) params.title = search;
  if (priceMin !== undefined && priceMin !== '') params.price_min = priceMin;
  if (priceMax !== undefined && priceMax !== '') params.price_max = priceMax;
  return client.get('/products', { params }).then((r) => {
    let products = r.data;
    if (sort === 'price_asc') products = [...products].sort((a, b) => a.price - b.price);
    if (sort === 'price_desc') products = [...products].sort((a, b) => b.price - a.price);
    if (sort === 'name_asc') products = [...products].sort((a, b) => a.title.localeCompare(b.title));
    return { products };
  });
}

export const fetchProductCount = ({ categoryId, search } = {}) => {
  const params = { offset: 0, limit: 200 };
  if (categoryId) params.categoryId = categoryId;
  if (search) params.title = search;
  return client.get('/products', { params }).then((r) => r.data.length);
};

export const fetchProduct = (id) =>
  client.get(`/products/${id}`).then((r) => r.data);

export const fetchCategories = () =>
  client.get('/categories').then((r) => r.data);

export const createCategory = ({ name }) =>
  client.post('/categories', { name, image: 'https://i.imgur.com/QkIa5tT.jpeg' }).then((r) => r.data);
