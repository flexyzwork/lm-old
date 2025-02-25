'use client';
import { useState } from 'react';
import { registerUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setSuccess('');

    const res = await registerUser(email, password);
    console.log(res);
    if (res.errors?.length > 0) {
      console.log(res.errors);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setErrors(res.errors.map((err: any) => err.message));
      return;
    }
    setSuccess('회원가입이 완료되었습니다. 대시보드로 이동합니다.');
    if (res.success) {
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">회원가입</h2>
        <div className="mt-4 text-sm text-red-500 text-center">
          {errors && (
            <ul className="list-disc list-inside">
              {errors.map((errMsg, index) => (
                <li key={index}>{errMsg}</li>
              ))}
            </ul>
          )}
        </div>
        {success && <p className="mt-4 text-sm text-green-500 text-center">{success}</p>}

        {/* 회원가입 폼 */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-2 p-3 border rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-2 p-3 border rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            회원가입
          </button>
        </form>

        {/* 구분선 */}
        <div className="flex items-center mt-6">
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
          <span className="mx-3 text-sm text-gray-500 dark:text-gray-400">또는</span>
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
        </div>

        {/* 로그인 페이지로 이동 */}
        <div className="mt-6 text-center">
          <a href="/auth/login" className="text-blue-500 hover:underline">
            로그인 페이지로 이동
          </a>
        </div>
      </div>
    </div>
  );
}
