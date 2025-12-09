import { create } from "zustand";

interface AuthState {
    accessToken: string | null;
    refreshToken: string | null; // 얘도 메모리에 저장
    isAuthenticated: boolean;
    
    // 로그인 시 둘 다 받음
    login: (access: string, refresh: string) => void;
    logout: () => void;
  }
  
  export const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
  
    // 로그인 시 둘 다 받음 + 리프레시 토큰을 이용한 재발급
    login: (access, refresh) => set({ 
      accessToken: access, 
      refreshToken: refresh, 
      isAuthenticated: true 
    }),
    
    // 로그아웃 시 둘 다 없음
    logout: () => set({ 
      accessToken: null, 
      refreshToken: null, 
      isAuthenticated: false 
    }),


  }));