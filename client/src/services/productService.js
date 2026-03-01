import API from './authService';

export const getProducts = (params) => API.get('/products', { params });
export const getProductBySlug = (slug) => API.get(`/products/${slug}`);
export const getBrands = () => API.get('/products/brands');

// Admin
export const getAllListings = (params) => API.get('/admin/listings', { params });
export const verifyListing = (id, status) => API.patch(`/listings/${id}/verify`, { status });
export const getAdminStats = () => API.get('/admin/stats');
export const getAllUsers = () => API.get('/admin/users');
export const deleteUser = (id) => API.delete(`/admin/users/${id}`);

// Reviews
export const getProductReviews = (productId) => API.get(`/reviews/${productId}`);
export const createReview = (productId, data) => API.post(`/reviews/${productId}`, data);
export const updateReview = (id, data) => API.put(`/reviews/${id}`, data);
export const deleteReview = (id) => API.delete(`/reviews/${id}`);
export const getMyReviews = () => API.get('/reviews/user/me');

// ── Admin CRUD ──
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Favorites
export const getFavorites = () => API.get('/favorites');
export const addFavorite = (productId) => API.post(`/favorites/${productId}`);
export const removeFavorite = (productId) => API.delete(`/favorites/${productId}`);

// Listings (Marketplace)
export const getListings = (params) => API.get('/listings', { params });
export const getListingBySlug = (slug) => API.get(`/listings/${slug}`);
export const getMyListings = () => API.get('/listings/my');
export const createListing = (formData) =>
  API.post('/listings', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const deleteListing = (id) => API.delete(`/listings/${id}`);