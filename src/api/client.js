import axios from 'axios';

const api = axios.create({
  baseURL: "https://api.escuelajs.co/api/v1",
});

client.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default client;
