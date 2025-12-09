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

// 1. 요청 인터셉터 (그대로)
client.interceptors.request.use((config) => {
  // AuthState(타입)가 아니라 useAuthStore(변수)를 써야 함
  const accessToken = useAuthStore.getState().accessToken;
  
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// 2. 응답 인터셉터 (핵심 수정)
client.interceptors.response.use(
  (response) => response,
  async (error) => { // 👈 async 추가 필수!
    const { config, response } = error;

    // 401 에러이고, 아직 재시도 안 한 요청일 때만 실행
    if (response?.status === 401 && !config._retry) {
      config._retry = true; // 👈 무한루프 방지 플래그

      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        
        if (refreshToken) {
          // 1. 토큰 재발급 요청 (client 대신 쌩 axios 사용 추천 - 인터셉터 안 타게)
          const res = await axios.post(`${baseURL}/api/auth/refresh`, { refreshToken });
          
          // 2. 스토어 업데이트 (login 함수 사용)
          const { accessToken: newAccess, refreshToken: newRefresh } = res.data;
          useAuthStore.getState().login(newAccess, newRefresh);

          // 3. 원래 요청 헤더 교체 후 재전송 👈 이게 빠졌었음
          config.headers.Authorization = `Bearer ${newAccess}`;
          return client(config);
        }
      } catch (refreshError) {
        // 재발급 실패하면 로그아웃
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(error);
  }
);