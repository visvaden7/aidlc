import axios from 'axios';
import { notification } from 'antd';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('table-order-auth');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      const token = parsed?.state?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // ignore parse error
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      const stored = localStorage.getItem('table-order-auth');
      let role: string | null = null;
      try {
        const parsed = JSON.parse(stored || '{}');
        role = parsed?.state?.role;
      } catch { /* ignore */ }
      localStorage.removeItem('table-order-auth');
      localStorage.removeItem('table-order-cart');
      notification.error({
        message: '인증 만료',
        description: '인증이 만료되었습니다. 다시 설정해주세요.',
      });
      window.location.href = role === 'ADMIN' ? '/admin/login' : '/';
      return Promise.reject(error);
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      (error.code === 'ECONNABORTED'
        ? '요청 시간이 초과되었습니다.'
        : '서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');

    notification.error({
      message: '오류',
      description: message,
      duration: 5,
    });

    return Promise.reject(error);
  },
);

export default api;
