// src/lib/auth.ts
import axios from "axios";
import { login, logout } from '@/state/authSlice';
import { useDispatch } from "react-redux";
// import { useAppDispatch } from '@/state/redux';

export const getUserProfile = async () => {
  const token = localStorage.getItem("token"); // JWT 토큰 가져오기
  if (!token) throw new Error("No authentication token found");

  const response = await axios.get("/api/user/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getUserFromLocalStorage = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // JWT 디코딩
      return payload.user;
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  }
  return null;
};

export const useLoginUser = () => {
  const dispatch = useDispatch();

  const loginUser = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: '로그인 실패. 다시 시도해주세요.' };
    }

    const { token, user } = data;
    if (token) {
      // 로그인 후 Redux 상태 업데이트
      dispatch(login({ user, token }));
      return { success: true };
    }

    return { error: '알 수 없는 오류가 발생했습니다.' };
  };

  return { loginUser };
};

export const useLogoutUser = () => {
  const dispatch = useDispatch();

  const logoutUser = async () => {
    dispatch(logout());
    window.location.href = '/login'; // 로그아웃 후 리다이렉트
  };

  return { logoutUser };
};

export async function registerUser(email: string, password: string) {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include', // 쿠키를 자동으로 포함
  });

  const data = await res.json();

  if (!res.ok) {
    return { error: data.message || '회원가입 실패. 다시 시도해주세요.' };
  }

  const { token, user } = data;
  if (token) {
    return { success: true, token, user };
  }

  return { error: '알 수 없는 오류가 발생했습니다.' };
}

export async function fetchProfile() {
  const res = await fetch('/api/user/profile', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!res.ok) {
    throw new Error('사용자 프로필을 가져오는 데 실패했습니다.');
  }

  return await res.json();  // 사용자 프로필 정보 반환
}

export async function emailLogin(email: string, password: string) {
  const res = await fetch(`/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error('로그인 실패');

  return await res.json(); // { user, token }
}

export async function socialLogin(provider: 'google' | 'github') {
  const res = await fetch(`/api/auth/${provider}`);
  if (!res.ok) throw new Error('소셜 로그인 실패');

  return await res.json(); // { user, token }
}
