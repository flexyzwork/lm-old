'use client';

import Header from '@/components/Header';
import React, { useEffect, useState } from 'react';
import { fetchProfile, logoutUser } from '@/services/authService';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

const UserProfilePage = () => {
  const router = useRouter();
  const { user: initialUser } = useAuthStore();
  const [user, setUser] = useState<User | null>(initialUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await fetchProfile();
        console.log('data', data);
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
    router.push('/signin'); // 로그인 페이지로 이동
  }

  if (loading) return <p className="text-center mt-10">🔄 프로필 불러오는 중...</p>;

  return (
    <div className="max-w-4xl mx-auto py-10">
      <Header title="Profile" subtitle="View your profile" />
      <div className="bg-customgreys-secondarybg p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gray-500 flex items-center justify-center text-white text-xl">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">{user?.name || 'No name'}</h2>
            <p className="text-gray-400">{user?.email || 'No Email'}</p>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-medium text-white">Account Details</h3>
          <p className="text-gray-300 mt-1">Role: {user?.roles || 'student'}</p>
          {/* <p className="text-gray-300">Joined: {new Date(user.created_at).toLocaleDateString()}</p> */}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
