import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import util from './util';

const api: AxiosInstance = axios.create({
    baseURL: util.apiUrl,
});

// Request interceptor để tự động gắn Token vào Header
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const storedUser = localStorage.getItem('user');
        const user = storedUser ? JSON.parse(storedUser) : null;

        if (user && user.token && config.headers) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor để xử lý lỗi 401 (Unauthorized)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error('Unauthorized! Redirecting to login...');

            // Xóa thông tin auth trong local storage
            localStorage.removeItem('user');

            // redirect về trang login
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
