'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

type Contract = {
  id: string;
  projectTitle: string;
  amount: number;
  status: string;
};

export default function ContractsPage() {
  const { user } = useAuthStore();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContracts() {
      try {
        const res = await fetch(`/api/contracts?userId=${user?.id}`);
        if (!res.ok) throw new Error('API 응답 실패');

        const data: Contract[] = await res.json();
        setContracts(data);
      } catch (error) {
        console.log('Error fetching contracts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchContracts();
  }, [user?.id]);

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold text-center dark:text-gray-200">계약 목록</h2>

      {/* ✅ 로딩 중 메시지 */}
      {loading && <p className="text-center text-gray-500 dark:text-gray-400 mt-4">로딩 중...</p>}

      {/* ✅ 계약이 없는 경우 */}
      {!loading && contracts.length === 0 && (
        <div className="text-center text-gray-600 dark:text-gray-400 mt-6">
          <p className="text-lg font-semibold">진행 중인 계약이 없습니다.</p>
          <p className="text-gray-500 dark:text-gray-400">새로운 프로젝트를 찾아보세요!</p>
          <Link
            href="/projects"
            className="mt-4 inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            프로젝트 목록 보기
          </Link>
        </div>
      )}

      {/* ✅ 계약 리스트 */}
      {!loading && contracts.length > 0 && (
        <div className="mt-6 space-y-4">
          {contracts.map((contract) => (
            <Link
              key={contract.id}
              href={`/contracts/${contract.id}`}
              className="block bg-white dark:bg-gray-800 shadow-md p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold dark:text-gray-200">{contract.projectTitle}</h3>
                  <p className="text-gray-600 dark:text-gray-400">금액: ${contract.amount}</p>
                  <p className="text-gray-500 dark:text-gray-400">
                    상태: <span className="font-semibold dark:text-gray-300">{contract.status}</span>
                  </p>
                </div>
                <span className="text-blue-500 dark:text-blue-400 font-semibold">자세히 보기 →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
