'use client';

import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.improfessor.kro.kr',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 90000, // 1분 타임아웃 추가
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    // 토큰이 필요한 경우 여기서 처리
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 에러 처리 로직
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // 인증 에러 처리
      localStorage.removeItem('accessToken');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 