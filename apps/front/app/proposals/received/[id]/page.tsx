'use client'


import { useParams } from "next/navigation";
import ProposalDetail from "@/components/proposals/ProposalDetail";

export default function ReceivedProposalDetailPage() {
  const params = useParams();
  const { id } = params as { id: string };

  if (!id) {
    return <p className="text-center text-gray-500 dark:text-gray-400">잘못된 접근입니다.</p>;
  }

  return <ProposalDetail proposalId={id} proposalType="received" />;
}