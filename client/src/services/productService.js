import API from './authService';

export const getProducts = (params) => API.get('/products', { params });
export const getProductBySlug = (slug) => API.get(`/products/${slug}`);
export const getBrands = () => API.get('/products/brands');

// Reviews
export const getProductReviews = (productId) => API.get(`/reviews/${productId}`);
export const createReview = (productId, data) => API.post(`/reviews/${productId}`, data);
export const updateReview = (id, data) => API.put(`/reviews/${id}`, data);
export const deleteReview = (id) => API.delete(`/reviews/${id}`);
export const getMyReviews = () => API.get('/reviews/user/me');

// Favorites
export const getFavorites = () => API.get('/favorites');
export const addFavorite = (productId) => API.post(`/favorites/${productId}`);
export const removeFavorite = (productId) => API.delete(`/favorites/${productId}`);