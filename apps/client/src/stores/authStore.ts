import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: {
    id: string;
    provider: string;
    name: string;
    email: string;
    role: string[];
    picture: string;
    created_at: string;
  } | null;
  accessToken: string | null;
  login: (user: AuthState['user'], token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      login: (user, token) => {
        console.log('✅ 로그인 성공 - 저장:', user, token);
        set({ user, accessToken: token });
      },
      logout: () => {
        console.log('🔴 로그아웃 - 상태 초기화');
        set({ user: null, accessToken: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
