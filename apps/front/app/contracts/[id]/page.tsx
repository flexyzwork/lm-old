'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

type Contract = {
  id: string;
  projectTitle: string;
  amount: number;
  status: string;
  clientName: string;
  clientEmail: string;
  freelancerName: string;
  freelancerEmail: string;
};

export default function ContractDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContract() {
      try {
        const res = await fetch(`/api/contracts/${id}`);
        if (!res.ok) throw new Error('Failed to fetch contract');

        const data: Contract = await res.json();
        setContract(data);
      } catch (error) {
        console.error('Error fetching contract:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchContract();
  }, [id]);

  const handleCancelContract = async () => {
    if (!confirm('정말 계약을 취소하시겠습니까?')) return;

    const res = await fetch(`/api/contracts/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      alert('계약이 취소되었습니다.');
      router.push('/dashboard');
    } else {
      alert('계약 취소에 실패했습니다.');
    }
  };

  const handleCompleteContract = async () => {
    if (!confirm('계약을 완료 처리하시겠습니까?')) return;

    const res = await fetch(`/api/contracts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: '완료됨' }),
    });

    if (res.ok) {
      alert('계약이 완료되었습니다!');
      router.refresh(); // ✅ 페이지 새로고침
    } else {
      alert('계약 완료 처리에 실패했습니다.');
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500 dark:text-gray-400 mt-4">로딩 중...</p>;
  }

  if (!contract) {
    return <p className="text-center text-gray-500 dark:text-gray-400 mt-4">계약 정보를 찾을 수 없습니다.</p>;
  }

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold text-center dark:text-gray-200">계약 상세 정보</h2>

      <div className="mt-6 bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <p className="text-lg font-semibold dark:text-gray-200">프로젝트: {contract.projectTitle}</p>
        <p className="text-gray-600 dark:text-gray-400">계약 금액: ${contract.amount}</p>
        <p className="text-gray-600 dark:text-gray-400">
          계약 상태: <span className="font-semibold dark:text-gray-300">{contract.status}</span>
        </p>

        <div className="mt-4">
          <h3 className="text-lg font-semibold dark:text-gray-200">클라이언트</h3>
          <p className="dark:text-gray-400">
            {contract.clientName} ({contract.clientEmail})
          </p>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-semibold dark:text-gray-200">프리랜서</h3>
          <p className="dark:text-gray-400">
            {contract.freelancerName} ({contract.freelancerEmail})
          </p>
        </div>

        <div className="mt-6 flex gap-4">
          <button
            onClick={handleCompleteContract}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            계약 완료
          </button>
          <button
            onClick={handleCancelContract}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800"
          >
            계약 취소
          </button>
        </div>
      </div>
    </div>
  );
}
