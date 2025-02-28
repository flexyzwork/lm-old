import axios from 'axios';
import { useAuthStore } from '@/lib/store/authStore';

const authStore = useAuthStore.getState();

export async function registerUser(email: string, password: string) {
  const { login } = authStore;

  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider: 'email', email, password }),
    credentials: 'include',
  });

  const data = await res.json();
  console.log(data);

  if (!res.ok) {
    console.log(data.message);
    return { errors: data.message.errors || [data] || ['회원가입 실패. 다시 시도해주세요.'] };
  }

  const { token, user } = data;
  if (token) {
    login(user, token);
    return { success: true };
  }

  return { errors: { message: ['알 수 없는 오류가 발생했습니다.'] } };
}

export async function loginUser(email: string, password: string) {
  const { login } = authStore;
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });

  const data = await res.json();

  console.log(data);

  if (!res.ok) {
    return { error: data.message || '로그인 실패. 다시 시도해주세요.' };
  }

  const { token, user } = data;
  if (token) {
    login(user, token);
    return { success: true };
  }

  return { error: '알 수 없는 오류가 발생했습니다.' };
}

// ✅ 로그아웃
export async function logoutUser() {
  const { logout } = authStore;

  await fetchWithAuth('/api/auth/logout', {
    method: 'POST',
    credentials: 'include', // ✅ HTTP Only 쿠키 자동 포함
  });

  logout();
  document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  window.location.href = '/signin';
}

// ✅ 리프레시 토큰을 사용하여 새 엑세스 토큰 받기
export async function refreshAccessToken() {
  const { login } = authStore;
  const res = await fetch('/api/auth/refresh', {
    method: 'POST',
    credentials: 'include', // ✅ HTTP Only 쿠키 자동 포함
  });

  const { token, user } = await res.json();
  if (token) {
    login(user, token);
    return { user, token };
  }

  return null;
}

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const authStore = useAuthStore.getState();
  const accessToken = authStore?.accessToken; // ✅ 상태가 없으면 undefined 반환

  console.log('accessToken-------', accessToken);

  if (!accessToken) {
    console.log('❌ Access token not found. Please log in.');
    return null;
  }

  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`, // ✅ 엑세스 토큰 포함
    },
    credentials: 'include',
  });

  console.log('res', res);

  if (accessToken && res.status === 401) {
    console.warn('🔄 Access Token expired. Trying to refresh...');
    const result = await refreshAccessToken();
    const token = result?.token;
    if (token) {
      return fetchWithAuth(url, options);
    }
  }

  if (res && res.status >= 400) {
    console.log('HTTP Error:', res.status, res.statusText);
    return { error: true, status: res.status, message: res.statusText };
  }

  return res.json();
}

// ✅ 사용자 프로필 가져오기 (엑세스 토큰 필요)
export async function fetchProfile() {
  const authStore = useAuthStore.getState();
  if (authStore.accessToken) {
    const res = await refreshAccessToken();
    return res;
  }
}
