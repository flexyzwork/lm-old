'use client';

import FreelancerCard from '@/components/FreelancerCard';
import Link from 'next/link';

export default function HomeContent() {
  const freelancers = [
    { name: '김개발', skill: 'React / Next.js', image: '/default-profile.png' },
    {
      name: '이디자이너',
      skill: 'UI/UX 디자인',
      image: '/default-profile.png',
    },
    {
      name: '박백엔드',
      skill: 'NestJS / TypeScript',
      image: '/default-profile.png',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition">
      {/* Hero Section */}
      <header className="container mx-auto text-center mt-16">
        <h2 className="text-4xl font-extrabold">프리랜서를 찾아보세요!</h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          전문 프리랜서를 검색하고, 원하는 프로젝트를 함께하세요.
        </p>
        <Link
          href="/search"
          className="mt-6 inline-block bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition"
        >
          프리랜서 찾기 →
        </Link>
      </header>

      {/* 프리랜서 추천 섹션 */}
      <section className="container mx-auto mt-16">
        <h3 className="text-2xl font-semibold mb-6">인기 프리랜서 🔥</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {freelancers.map((freelancer, index) => (
            <FreelancerCard key={index} {...freelancer} />
          ))}
        </div>
      </section>
    </div>
  );
}
