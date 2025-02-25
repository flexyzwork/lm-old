'use client';

import { logoutUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user } = useAuthStore();
  const isLoggedIn = !!user;
  const router = useRouter();

  async function handleLogout() {
    await logoutUser();
    router.push('/auth/login');
  }

  return (
    <nav className="bg-gray-100 dark:bg-gray-900 p-4 shadow-md">
      <div className="container mx-auto flex flex-row justify-between items-center">
        <Link href="/" className="text-lg font-bold text-gray-800 dark:text-white">
          flexyz.work
        </Link>

        <div className="flex space-x-4 items-center">
          <Link href="/search" className="text-gray-700 dark:text-gray-300 hover:text-blue-500">
            프리랜서 찾기
          </Link>

          <Link href="/freelancers/1" className="text-gray-700 dark:text-gray-300 hover:text-blue-500">
            오늘의 프리랜서
          </Link>

          <Link href="/story-portfolio" className="text-gray-700 dark:text-gray-300 hover:text-blue-500">
            스토리 포트폴리오
          </Link>

          {isLoggedIn ? (
            <>
              <Link href="/projects" className="text-gray-700 dark:text-gray-300 hover:text-blue-500">
                프로젝트
              </Link>
              <Link href="/proposals/received" className="text-gray-700 dark:text-gray-300 hover:text-blue-500">
                받은제안
              </Link>
              <Link href="/proposals/sent" className="text-gray-700 dark:text-gray-300 hover:text-blue-500">
                보낸제안
              </Link>
              <Link href="/contracts" className="text-gray-700 dark:text-gray-300 hover:text-blue-500">
                계약
              </Link>
              <Link href="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-blue-500">
                대시보드
              </Link>
              <span>{user?.name}</span>
              <button onClick={handleLogout} className="text-gray-700 dark:text-gray-300 hover:text-blue-500">
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-gray-700 dark:text-gray-300 hover:text-blue-500">
                로그인
              </Link>
              <Link href="/auth/signup" className="text-gray-700 dark:text-gray-300 hover:text-blue-500">
                회원가입
              </Link>
            </>
          )}

          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
