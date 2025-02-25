'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { fetchWithAuth } from '@/lib/auth';

export default function ProfileEditPage() {
  const { accessToken, user, login } = useAuthStore();
  const router = useRouter();

  const [profile, setProfile] = useState<{
    name: string;
    email: string;
    picture: string;
    roles: string[];
    bio: string;
    skills: string[];
    experiences: string[];
    contactInfo: string;
    website: string;
    companyName: string;
    industry: string;
  }>({
    name: '',
    email: '',
    picture: '',
    roles: ['FREELANCER'],
    bio: '',
    skills: [],
    experiences: [],
    contactInfo: '',
    website: '',
    companyName: '',
    industry: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    fetchWithAuth(`/api/auth/profile`)
      .then((data) => {
        console.log('📌 프로필 로드:', data);

        const { user } = data;

        // ✅ `null` 값이 들어올 경우 기본값 설정
        const updatedProfile = {
          name: user.name ?? '',
          email: user.email ?? '',
          picture: user.picture ?? '',
          roles: Array.isArray(user.roles) && user.roles.length > 0 ? user.roles : ['FREELANCER'],
          bio: user.bio ?? '',
          skills: Array.isArray(user.skills) ? user.skills : [],
          experiences: Array.isArray(user.experiences) ? user.experiences : [],
          contactInfo: user.contactInfo ?? '',
          website: user.website ?? '',
          companyName: user.companyName ?? '',
          industry: user.industry ?? '',
        };

        setProfile(updatedProfile);
      })
      .catch((error) => console.error('❌ 프로필 로드 실패:', error))
      .finally(() => setLoading(false));
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!user || !accessToken) return;

    const response = await fetchWithAuth(`/api/auth/profile`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });

    console.log(response);

    if (response.user.id) {
      alert('✅ 프로필이 업데이트되었습니다.');
      login(response.user, accessToken!);
      router.push('/profile');
    } else {
      alert('❌ 프로필 업데이트에 실패했습니다.');
    }
  };

  if (loading) return <p className="text-center text-gray-500 mt-4">로딩 중...</p>;

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold text-center dark:text-gray-200">프로필 편집</h2>

      {/* ✅ 기본 정보 */}
      <div className="mt-6 bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <label className="block font-semibold dark:text-gray-200">이름</label>
        <input
          type="text"
          value={profile.name || ''}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          className="w-full p-3 border rounded mt-2 dark:bg-gray-800 dark:text-gray-200"
        />

        <label className="block font-semibold mt-4 dark:text-gray-200">이메일</label>
        <input
          type="email"
          value={profile.email || ''}
          disabled
          className="w-full p-3 border rounded mt-2 bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
        />

        <label className="block font-semibold mt-4 dark:text-gray-200">프로필 사진 URL</label>
        <input
          type="text"
          value={profile.picture || ''}
          onChange={(e) => setProfile({ ...profile, picture: e.target.value })}
          className="w-full p-3 border rounded mt-2 dark:bg-gray-800 dark:text-gray-200"
        />
      </div>

      {/* ✅ 기술 스택 */}
      <div className="mt-6 bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <label className="block font-semibold mt-4 dark:text-gray-200">기술 스택</label>
        <input
          type="text"
          placeholder="React, Node.js, TypeScript"
          value={profile.skills.length > 0 ? profile.skills.join(', ') : ''}
          onChange={(e) => setProfile({ ...profile, skills: e.target.value ? e.target.value.split(', ') : [] })}
          className="w-full p-3 border rounded mt-2 dark:bg-gray-800 dark:text-gray-200"
        />
      </div>

      {/* ✅ 경력 */}
      <div className="mt-6 bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <label className="block font-semibold mt-4 dark:text-gray-200">경력</label>
        <textarea
          value={profile.experiences.length > 0 ? profile.experiences.join('\n') : ''}
          onChange={(e) => setProfile({ ...profile, experiences: e.target.value ? e.target.value.split('\n') : [] })}
          className="w-full p-3 border rounded mt-2 dark:bg-gray-800 dark:text-gray-200"
        />
      </div>

      {/* ✅ 저장 버튼 */}
      <button
        onClick={handleUpdateProfile}
        className="mt-6 w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
      >
        저장
      </button>
    </div>
  );
}
