import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

API.interceptors.request.use((config) => {
  config.headers['x-user-id'] = 1;
  return config;
});

export const getEvents = (params) => API.get('/events', { params });
export const getCart = () => API.get('/cart');
export const addToCart = (eventId) => API.post('/cart', { eventId });
export const createOrder = (orderData) => API.post('/orders', orderData);
export const getNotifications = () => API.get('/notifications');
export const createEvent = (formData) =>
  API.post('/events', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
