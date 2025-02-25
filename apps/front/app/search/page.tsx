'use client';
import { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import FreelancerCard from '@/components/FreelancerCard';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const freelancers = [
    {
      id: '0',
      name: '김개발',
      skill: 'React / Next.js',
      image: '/default-profile.png',
    },
    {
      id: '1',
      name: '이디자이너',
      skill: 'UI/UX 디자인',
      image: '/default-profile.png',
    },
    {
      id: '2',
      name: '박백엔드',
      skill: 'NestJS / TypeScript',
      image: '/default-profile.png',
    },
  ];

  const filteredFreelancers = freelancers.filter(
    (f) => f.name.includes(searchQuery) || f.skill.includes(searchQuery)
  );

  return (
    <div>
      {/* 검색 바 */}
      <div className="mt-10">
        <SearchBar onSearch={setSearchQuery} />
      </div>

      {/* 검색 결과 */}
      <section className="mt-10">
        <h3 className="text-2xl font-semibold mb-6">검색 결과</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredFreelancers.length > 0 ? (
            filteredFreelancers.map((freelancer, index) => (
              <FreelancerCard key={index} {...freelancer} />
            ))
          ) : (
            <p className="text-gray-500">검색 결과가 없습니다.</p>
          )}
        </div>
      </section>
    </div>
  );
}
