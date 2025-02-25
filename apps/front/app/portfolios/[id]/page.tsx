'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { fetchWithAuth } from '@/lib/auth';

export default function PortfolioDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [portfolio, setPortfolio] = useState<{
    id: string;
    title: string;
    description: string;
    tags: string[];
    filePath: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchPortfolio();
  }, [id]);

  const fetchPortfolio = async () => {
    try {
      const data = await fetchWithAuth(`/api/portfolios/${id}`);
      setPortfolio(data || null);
    } catch (error) {
      console.error('❌ 포트폴리오 불러오기 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md mt-6">
      {loading ? (
        <p className="text-center text-gray-500">로딩 중...</p>
      ) : portfolio ? (
        <>
          {/* ✅ 제목 & 편집 버튼 */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{portfolio.title}</h1>
            <button
              onClick={() => router.push(`/portfolios/edit/${portfolio.id}`)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              편집
            </button>
          </div>

          {/* ✅ 설명 */}
          <p className="mt-4 text-gray-700 dark:text-gray-300">{portfolio.description}</p>

          {/* ✅ 기술 스택 */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold">기술 스택</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {portfolio.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* ✅ 업로드된 이미지 */}
          {portfolio.filePath && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold">포트폴리오 이미지</h3>
              <img src={portfolio.filePath} alt="Portfolio Preview" className="mt-2 w-full rounded-lg shadow-md" />
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-gray-500">해당 포트폴리오를 찾을 수 없습니다.</p>
      )}
    </div>
  );
}
