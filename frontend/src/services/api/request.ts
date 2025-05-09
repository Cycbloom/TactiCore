import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

import { handleError } from '@/utils/error-handler';

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000', // API 的基础URL
  timeout: 15000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 在发送请求之前做些什么
    // 添加 token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    handleError(error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  error => {
    handleError(error);
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        default:
          break;
      }
    }
    return Promise.reject(error);
  }
);

declare module 'axios' {
  interface AxiosInstance {
    get<T = any>(url: string, config?: InternalAxiosRequestConfig): Promise<T>;
    post<T = any>(url: string, data?: any, config?: InternalAxiosRequestConfig): Promise<T>;
    put<T = any>(url: string, data?: any, config?: InternalAxiosRequestConfig): Promise<T>;
    patch<T = any>(url: string, data?: any, config?: InternalAxiosRequestConfig): Promise<T>;
    delete<T = any>(url: string, config?: InternalAxiosRequestConfig): Promise<T>;
  }
}

export default service;
