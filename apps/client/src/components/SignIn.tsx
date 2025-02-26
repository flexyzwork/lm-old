'use client';

import { useState } from 'react';
import { useLoginUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// import { useAuth } from '@/hooks/useAuth';

export default function SignIn() {
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  // const { handleLogin } = useAuth();
  const { loginUser } = useLoginUser();

  // const handleEmailLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError('');
  //   try {
  //     const res = await handleLogin(email, password);
  //     // if (res.error) {
  //     //   setError(res.error);
  //     //   return;
  //     // }
  //     // if (res.success) {
  //     //   handleLogin(res.user, res.token); // 로그인 후 상태 업데이트
  //     //   router.push('/dashboard');
  //     // }
  //   } catch {
  //     setError('Invalid email or password.');
  //   }
  // };


  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await loginUser(email, password); // 로그인 처리
      if (res.error) {
        setError(res.error);
      } else {
        // 로그인 성공 후 처리
      }
    } catch {
      setError('로그인 실패');
    }
  };


  const handleSocialLogin = (provider: string) => {
    window.location.href = `/api/auth/${provider}`;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white p-6">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center">Sign In</h2>

        {error && <p className="mt-4 text-sm text-red-400 text-center">{error}</p>}

        <form onSubmit={handleEmailLogin} className="mt-6 space-y-4">
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
            Sign In
          </button>
        </form>

        {/* 구분선 */}
        <div className="flex items-center mt-6">
          <div className="flex-grow border-t border-gray-600"></div>
          <span className="mx-3 text-sm text-gray-400">OR</span>
          <div className="flex-grow border-t border-gray-600"></div>
        </div>

        {/* 소셜 로그인 버튼 */}
        <div className="mt-6 space-y-3">
          <button
            onClick={() => handleSocialLogin('google')}
            className="w-full flex items-center justify-center bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
              <path
                fill="#EA4335"
                d="M24 19.6v8.8h12.2C34.9 35 30.3 38 24 38c-8.3 0-15-6.7-15-15s6.7-15 15-15c4.1 0 7.5 1.5 10.3 3.9l-4.6 4.6C27.9 14 26 13 24 13c-6 0-10.9 4.9-10.9 11s4.9 11 10.9 11c5.3 0 9.1-3.4 9.6-7.8H24z"
              ></path>
            </svg>
            Continue with Google
          </button>

          <button
            onClick={() => handleSocialLogin('github')}
            className="w-full flex items-center justify-center bg-gray-700 text-white py-3 rounded-lg font-medium hover:bg-gray-600 transition"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.68c-2.78.6-3.36-1.34-3.36-1.34-.45-1.15-1.1-1.46-1.1-1.46-.9-.6.07-.6.07-.6 1 .07 1.52 1 1.52 1 .9 1.52 2.38 1.1 2.98.83.07-.67.34-1.1.62-1.34-2.22-.25-4.55-1.1-4.55-4.88a3.84 3.84 0 011.07-2.67 3.58 3.58 0 01.1-2.6s.83-.25 2.72 1a9.23 9.23 0 014.94 0c1.89-1.25 2.72-1 2.72-1a3.58 3.58 0 01.1 2.6 3.84 3.84 0 011.07 2.67c0 3.8-2.34 4.6-4.57 4.88.35.32.66.92.66 1.87v2.78c0 .26.17.58.68.48A10 10 0 0012 2"
              ></path>
            </svg>
            Continue with GitHub
          </button>
        </div>

        {/* 회원가입 이동 */}
        <div className="mt-6 text-center">
          <Link href="/signup" className="text-blue-400 hover:underline">
            Don&apos;t have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
