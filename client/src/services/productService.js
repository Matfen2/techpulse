import API from './authService';

export const getProducts = (params) => API.get('/products', { params });
export const getProductBySlug = (slug) => API.get(`/products/${slug}`);
export const getBrands = () => API.get('/products/brands');