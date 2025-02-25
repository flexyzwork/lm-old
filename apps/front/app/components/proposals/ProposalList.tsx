'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

type Proposal = {
  id: string;
  projectId: string;
  senderId: string;
  receiverId: string;
  senderType: string;
  receiverType: string;
  description: string;
  amount: number;
  version: number;
  created_at: string;
  status: string;
};

export default function ProposalList({ proposalType }: { proposalType: 'sent' | 'received' }) {
  const { user } = useAuthStore();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const res = await fetch(`/api/proposals?type=${proposalType}&userId=${user?.id}`);
        const data: Proposal[] = await res.json();

        if (!Array.isArray(data)) {
          console.warn('⚠️ API 응답이 배열이 아닙니다. 빈 배열을 사용합니다.');
          setProposals([]);
        } else {
          setProposals(data);
        }
      } catch {
        console.error('⚠️ 네트워크 오류! 데이터를 불러오지 못했습니다.');
        setProposals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [proposalType, user?.id]);

  if (loading) return <p className="text-center text-gray-500 mt-4">로딩 중...</p>;

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold text-center">{proposalType === 'sent' ? '보낸 제안' : '받은 제안'}</h2>

      {/* ✅ 제안이 없는 경우 */}
      {proposals.length === 0 ? (
        <p className="mt-4 text-center text-gray-600">제안이 없습니다.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {proposals.map((proposal) => (
            <Link
              key={proposal.id}
              href={`/proposals/${proposalType}/${proposal.id}`}
              className="block bg-white dark:bg-gray-800 shadow-md p-4 rounded-lg hover:bg-gray-100"
            >
              <div>
                <h3 className="text-lg font-semibold">프로젝트 ID: {proposal.projectId}</h3>
                <p className="text-gray-600">{proposal.description}</p>
                <p className="text-gray-500">금액: ${proposal.amount}</p>
                <p className="text-gray-500">
                  상태: <span className="font-semibold">{proposal.status}</span>
                </p>
              </div>
              <span className="text-blue-500 font-semibold">자세히 보기 →</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
