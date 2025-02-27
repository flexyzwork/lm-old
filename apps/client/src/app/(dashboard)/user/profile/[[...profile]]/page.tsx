'use client';

import Header from '@/components/Header';
import React, { useEffect } from 'react';
import { getUserProfile } from '@/lib/auth'; // 백엔드에서 유저 정보를 가져오는 함수
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAppSelector, useAppDispatch } from '@/state/redux';
import { setUser } from '@/state/auth';
import { useGetUserProfileQuery } from '@/state/api';
// import { useUpdateUserMutation } from '@/state/api';

const UserProfilePage = () => {
  const router = useRouter();
  const { data, error: queryError } = useGetUserProfileQuery(undefined); // RTK 쿼리로 프로필 데이터 가져오기
  // const [updateProfile] = useUpdateUserMutation(); // RTK 쿼리로 프로필 업데이트
  const dispatch = useAppDispatch();
  const user = data?.user;
  const accessToken = data?.token;
  console.log('data', data);
  // console.log('accessToken', accessToken);

  useEffect(() => {
    // accessToken이 있을 때만 유저 정보 요청
    if (accessToken) {
      const fetchUser = async () => {
        try {
          // const userData = await getUserProfile(accessToken);
          const userData = data?.user;
          console.log('userData', userData);
          dispatch(setUser(userData.user)); // 유저 정보를 리덕스 상태에 저장
        } catch (error) {
          console.error('Failed to fetch user:', error);
          router.push('/signin'); // 인증이 안된 경우 로그인 페이지로 이동
        }
      };

      fetchUser();
    } else {
      router.push('/signin'); // 토큰이 없으면 로그인 페이지로 이동
    }
  }, [accessToken, dispatch, router]); // accessToken, dispatch, router를 의존성 배열에 추가

  if (!user) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-10">
      <Header title="Profile" subtitle="View your profile" />
      <div className="bg-customgreys-secondarybg p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gray-500 flex items-center justify-center text-white text-xl">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">{user.name}</h2>
            <p className="text-gray-400">{user.email}</p>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-medium text-white">Account Details</h3>
          <p className="text-gray-300 mt-1">Role: {user.roles}</p>
          <p className="text-gray-300">Joined: {new Date(user.created_at).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
