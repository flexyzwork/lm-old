/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import useSWR from 'swr';
import Image from 'next/image';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const PortfolioGrid = ({ freelancerId }: any) => {
  const { data: portfolio, mutate } = useSWR(
    `/api/portfolio?freelancerId=${freelancerId}`,
    fetcher
  );

  if (!portfolio) return <p>Loading portfolio...</p>;

  const deletePortfolio = async (id: number) => {
    if (!confirm('Are you sure you want to delete this portfolio item?')) {
      return;
    }

    try {
      const res = await fetch(`/api/portfolio/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete portfolio');

      mutate(); // ✅ 삭제 후 즉시 데이터 업데이트
    } catch {
      alert('Error deleting portfolio item');
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
      {portfolio.map((project: any) => (
        <div key={project.id} className="bg-white shadow-md rounded-lg overflow-hidden relative">
          <Image
            src={project.image || '/default-project.png'}
            alt={project.title}
            width={500}
            height={300}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
            <p className="text-gray-600 text-sm mt-2">{project.description}</p>
          </div>
          <button
            onClick={() => deletePortfolio(project.id)}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded"
          >
            X
          </button>
        </div>
      ))}
    </div>
  );
};

export default PortfolioGrid;