'use client';

import { useState } from 'react';
import { registerUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { login } from '@/state/authSlice'; // 로그인 액션을 가져옵니다.
import Link from 'next/link';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();

  // 로그인 후 Redux 상태 업데이트
  const handleLogin = async (email: string, password: string) => {
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
      // Redux 상태 업데이트
      dispatch(login({ user, token }));
      return { success: true };
    }

    return { error: '알 수 없는 오류가 발생했습니다.' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setSuccess('');

    const res = await registerUser(email, password);
    if (res.error?.length > 0) {
      setErrors(res.error.map((err: any) => err.message));
      return;
    }

    setSuccess('Sign-up successful! Redirecting to the dashboard...');
    if (res.success) {
      // 로그인 후 상태 업데이트
      const loginRes = await handleLogin(email, password);
      if (loginRes.success) {
        setTimeout(() => {
          router.push('/dashboard');
        }, 500);
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white p-6">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center">Sign Up</h2>

        {errors.length > 0 && (
          <div className="mt-4 text-sm text-red-400 text-center">
            <ul className="list-disc list-inside">
              {errors.map((errMsg, index) => (
                <li key={index}>{errMsg}</li>
              ))}
            </ul>
          </div>
        )}

        {success && <p className="mt-4 text-sm text-green-400 text-center">{success}</p>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-2 p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-2 p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/signin" className="text-blue-400 hover:underline">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
