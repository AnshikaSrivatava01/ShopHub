import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('shophub_user') || 'null');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default API;

// Auth
export const loginUser = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/register', data);
export const getProfile = () => API.get('/auth/profile');
export const updateProfile = (data) => API.put('/auth/profile', data);
export const getAllUsers = () => API.get('/auth/users');

// Products
export const getProducts = (params) => API.get('/products', { params });
export const getProductById = (id) => API.get(`/products/${id}`);
export const getCategories = () => API.get('/products/categories');
export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// Orders
export const createOrder = (data) => API.post('/orders', data);
export const getMyOrders = () => API.get('/orders/my');
export const getAllOrders = () => API.get('/orders');
export const getOrderStats = () => API.get('/orders/stats');
export const updateOrderStatus = (id, data) => API.put(`/orders/${id}/status`, data);
export const requestOrderReturn = (id, data) => API.put(`/orders/${id}/return`, data);

// Reviews
export const createReview = (data) => API.post('/reviews', data);
export const getMyReviews = () => API.get('/reviews/my');
export const getProductReviews = (productId) => API.get(`/reviews/${productId}`);
export const deleteReview = (id) => API.delete(`/reviews/${id}`);

// Wishlist
export const getWishlist = () => API.get('/wishlist');
export const addToWishlist = (productId) => API.post(`/wishlist/${productId}`);
export const removeFromWishlist = (productId) => API.delete(`/wishlist/${productId}`);

// Payments
export const createPaymentIntent = (amount) => API.post('/payments/create-intent', { amount });

// Coupons
export const validateCoupon = (code, orderTotal) => API.post('/coupons/validate', { code, orderTotal });

// Related Products
export const getRelatedProducts = (id) => API.get(`/products/${id}/related`);
