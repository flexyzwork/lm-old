'use client';

import { useEffect, useState } from 'react';
// import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

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

export default function ProposalEdit({ proposalId, proposalType }: { proposalId: string; proposalType: string }) {
  // const { user } = useAuthStore();
  const router = useRouter();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const isSentProposal = proposalType === 'sent';
  const isReceivedProposal = proposalType === 'received';

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const res = await fetch(`/api/proposals/${proposalId}`);
        const data: Proposal = await res.json();
        setProposal(data);
      } catch {
        console.warn('⚠️ 네트워크 오류! 데이터를 불러오지 못했습니다.');
        setProposal(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProposal();
  }, [proposalId]);

  useEffect(() => {
    if (proposal !== null) {
      setDescription(proposal.description || '');
      setAmount(proposal.amount.toString() || '');
    }
  }, [proposal]);

  // ✅ 제안 수정 핸들러
  const handleEditProposal = async () => {
    if (!confirm('제안을 수정하시겠습니까?')) return;

    const res = await fetch(`/api/proposals/${proposalId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description, amount: parseFloat(amount), version: proposal!.version + 1 }),
    });

    if (!res.ok) {
      alert('수정 실패');
      return;
    }

    alert('제안이 수정되었습니다!');
    router.push(`/proposals/sent/${proposalId}`);
  };

  if (loading) return <p className="text-center text-gray-500 mt-4">로딩 중...</p>;
  if (!proposal) return <p className="text-center text-gray-500 dark:text-gray-400">제안 정보를 찾을 수 없습니다.</p>;

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold text-center">제안 수정</h2>

      <div className="mt-6 bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        {isReceivedProposal && (
          <div className="text-center text-red-500 font-semibold">받은 제안은 수정할 수 없습니다.</div>
        )}

        {isSentProposal && (
          <>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">설명</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border rounded"
            ></textarea>

            <label className="block text-gray-700 dark:text-gray-300 font-semibold mt-4 mb-2">금액 (USD)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 border rounded"
            />

            <button
              onClick={handleEditProposal}
              className="mt-6 w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
            >
              수정 완료
            </button>
          </>
        )}
      </div>
    </div>
  );
}
