"use client";

import ProposalDetail from "@/components/proposals/ProposalDetail";
import { useParams } from "next/navigation"; // ✅ useParams 사용

export default function SentProposalDetailPage() {
  const params = useParams(); // ✅ 동적 경로에서 params 가져오기
  const { id } = params as { id: string }; // ✅ 타입 명확화

  if (!id) {
    return <p className="text-center text-gray-500 dark:text-gray-400">잘못된 접근입니다.</p>;
  }

  return <ProposalDetail proposalId={id} proposalType="sent" />;
}