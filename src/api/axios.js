import axios from 'axios';

const BASE_URL = 'https://kanban-vph5.onrender.com/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('apex_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('apex_refresh_token');
        if (!refreshToken) throw new Error('No refresh token');
        const { data } = await axios.post(`${BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });
        localStorage.setItem('apex_access_token', data.access);
        api.defaults.headers.common.Authorization = `Bearer ${data.access}`;
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return api(originalRequest);
      } catch {
        localStorage.removeItem('apex_access_token');
        localStorage.removeItem('apex_refresh_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
