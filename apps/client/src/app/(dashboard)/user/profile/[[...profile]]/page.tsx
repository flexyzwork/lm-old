'use client';

import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserProfile, useUpdateProfile } from '@/queries/useUserProfile';
import { PencilIcon } from 'lucide-react';
import Header from '@/components/Header';


const UserProfilePage = () => {
  const { data, isLoading } = useUserProfile();
  const { mutate, isPending } = useUpdateProfile();

  const [name, setName] = useState('');

  useEffect(() => {
    if (data?.user?.name) {
      setName(data.user.name);
    }
  }, [data?.user?.name]);

  // ✅ 이름 입력값 업데이트
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  // ✅ 폼 제출 (이름만 업데이트)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ id: data?.user?.id, name });
  };

  if (isLoading) return <p className="text-center mt-10 text-gray-400">🔄 프로필 불러오는 중...</p>;

  return (
    <div className="user-courses">
      <Header title="My Profile" subtitle="View your enrolled courses" />
      {/* <Toolbar onSearch={setSearchTerm} onCategoryChange={setSelectedCategory} /> */}
      <div className="user-courses__grid">
        
        <Card className="bg-gray-900 text-white shadow-lg">
          <CardHeader className="border-b border-gray-700">
            <CardTitle className="text-lg font-semibold">Profile</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* 프로필 이미지 및 정보 */}
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24 border-2 border-gray-600">
                  <AvatarImage src={data?.user?.picture ?? ''} alt="Profile" />
                  <AvatarFallback className="text-lg font-bold">{data?.user?.name?.charAt(0) ?? 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <h2 className="text-xl font-semibold">{data?.user?.name || 'No Name'}</h2>
                  <p className="text-gray-400">{data?.user?.email || 'No Email'}</p>
                  <span className="text-gray-500 bg-gray-800 px-3 py-1 rounded-md text-sm inline-block">
                    {data?.user?.role || 'Student'}
                  </span>
                </div>
              </div>

              {/* 프로필 편집 섹션 */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-gray-300 mb-2 block">Name</label>
                  <div className="relative">
                    <Input
                      type="text"
                      name="name"
                      value={name}
                      onChange={handleChange}
                      className="w-full pr-10"
                      required
                    />
                    <PencilIcon className="h-5 w-5 text-gray-400 absolute right-3 top-3" />
                  </div>
                </div>
              </div>

              {/* 저장 버튼 */}
              <div className="flex justify-end">
                <Button type="submit" variant="default" disabled={isPending} className="px-4 py-2 shadow-md w-36">
                  {isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfilePage;
