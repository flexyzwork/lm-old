'use client';

import { useEffect, useState } from 'react';
import { fetchProfile, logoutUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await fetchProfile();
        if (data?.user) {
          setUser(user);
        } else {
          throw new Error('Unauthorized');
        }
      } catch {
        handleLogout();
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  // ✅ 로그인 페이지로 이동
  async function handleLogout() {
    if (user) {
      await logoutUser();
      setUser(null);
    }
    router.push('/auth/login'); // 로그인 페이지로 이동
  }

  if (loading) return <p className="text-center mt-10">🔄 프로필 불러오는 중...</p>;

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">내 프로필</h2>
      {user ? (
        <div>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <button onClick={handleLogout} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
            로그아웃
          </button>
        </div>
      ) : (
        <p>로그인이 필요합니다.</p>
      )}
    </div>
  );
}
