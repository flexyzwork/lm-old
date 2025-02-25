"use client"

import ProposalEdit from "@/app/components/proposals/ProposalEdit";
import { useParams } from "next/navigation"; // ✅ useParams 사용

export default function SentProposalEditPage() {
  const params = useParams(); // ✅ 동적 경로에서 params 가져오기
  const { id } = params as { id: string }; // ✅ 타입 명확화

  return <ProposalEdit proposalId={id} proposalType="sent" />;
}