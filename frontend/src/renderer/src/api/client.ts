import axios from 'axios';
import { useAuthStore } from '@renderer/store/AuthStore';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const client = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// 1. 요청 인터셉터
client.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;
  
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// 2. 응답 인터셉터
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    // 401 에러이고, 처음 재시도 요청일 때만 실행
    if (response?.status === 401 && !config._retry) {
      config._retry = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        
        if (refreshToken) {
          // 1. 토큰 재발급 요청
          const res = await axios.post(`${baseURL}/api/auth/refresh`, { refreshToken });
          
          // 2. 스토어 업데이트
          const { accessToken: newAccess, refreshToken: newRefresh } = res.data;
          useAuthStore.getState().login(newAccess, newRefresh);

          // 3. 원래 요청 헤더 교체 후 재전송
          config.headers.Authorization = `Bearer ${newAccess}`;
          return client(config);
        }
      } catch (refreshError) {
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(error);
  }
);