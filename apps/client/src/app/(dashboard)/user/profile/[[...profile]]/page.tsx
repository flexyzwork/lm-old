"use client";

import Header from "@/components/Header";
import React, { useEffect, useState } from "react";
import { getUserProfile } from "@/lib/auth"; // 백엔드에서 유저 정보를 가져오는 함수
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface User {
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const UserProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // JWT 토큰을 이용해 유저 정보를 가져옴
    const fetchUser = async () => {
      try {
        const userData = await getUserProfile();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        router.push("/signin"); // 인증이 안된 경우 로그인 페이지로 이동
      }
    };

    fetchUser();
  }, []);


  if (!user) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-10">
      <Header title="Profile" subtitle="View your profile" />
      <div className="bg-customgreys-secondarybg p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gray-500 flex items-center justify-center text-white text-xl">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">{user.name}</h2>
            <p className="text-gray-400">{user.email}</p>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-medium text-white">Account Details</h3>
          <p className="text-gray-300 mt-1">Role: {user.role}</p>
          <p className="text-gray-300">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="mt-6">
          <Button className="bg-red-600 hover:bg-red-700" onClick={() => router.push("/signout")}>
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;