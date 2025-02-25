'use client';

import { useEffect, useState } from 'react';
// import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';

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

export default function ProposalDetail({ proposalId, proposalType }: { proposalId: string; proposalType: string }) {
  // const { user } = useAuthStore();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);

  const isSentProposal = proposalType === 'sent';
  const isReceivedProposal = proposalType === 'received';

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const res = await fetch(`/api/proposals/${proposalId}`);
        const data: Proposal = await res.json();

        if (!data?.id) {
          console.warn('⚠️ 네트워크 오류! 데이터를 불러오지 못했습니다.');
          setProposal(null);
        } else {
          setProposal(data);
        }
      } catch {
        console.warn('⚠️ 네트워크 오류! 데이터를 불러오지 못했습니다.');
        setProposal(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProposal();
  }, [proposalId]);

  if (loading) return <p className="text-center text-gray-500 mt-4">로딩 중...</p>;
  if (!proposal) return <p className="text-center text-gray-500 dark:text-gray-400">제안 정보를 찾을 수 없습니다.</p>;

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold text-center">제안 상세 정보</h2>

      <div className="mt-6 bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <p className="text-lg font-semibold">프로젝트 ID: {proposal.projectId}</p>
        <p className="text-gray-600">설명: {proposal.description}</p>
        <p className="text-gray-600">금액: ${proposal.amount}</p>
        <p className="mt-2 text-gray-600">
          상태: <span className="font-semibold">{proposal.status}</span>
        </p>

        {/* ✅ 받은 제안일 경우 (수락/거절/보류 버튼 표시) */}
        {isReceivedProposal && (
          <div className="mt-6 flex gap-4">
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg">수락</button>
            <button className="px-4 py-2 bg-red-500 text-white rounded-lg">거절</button>
            <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg">보류</button>
          </div>
        )}

        {/* ✅ 보낸 제안일 경우 (수정/철회 버튼 표시) */}
        {isSentProposal && (
          <div className="mt-6 flex gap-4">
            <Link href={`/proposals/sent/${proposalId}/edit`}>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">제안 수정</button>
            </Link>
            <button className="px-4 py-2 bg-gray-500 text-white rounded-lg">제안 철회</button>
          </div>
        )}
      </div>
    </div>
  );
}
