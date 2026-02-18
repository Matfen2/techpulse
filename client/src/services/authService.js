import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

// ── Interceptor: ajoute le token à chaque requête ──
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const signupUser = (data) => API.post('/auth/signup', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');
export const updateMe = (data) => API.put('/auth/me', data);

export default API;