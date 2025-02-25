import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from '@packages/common';
import { schema } from '@packages/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Proposal, NewProposal, UpdateProposal } from '@packages/common/types';
import { eq } from 'drizzle-orm';

const { proposals } = schema;

@Injectable()
export class ProposalsService {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: NodePgDatabase<typeof schema>
  ) {}

  // ✅ 제안 생성
  async createProposal(data: NewProposal): Promise<Proposal> {
    return this.db
      .insert(proposals)
      .values(data)
      .returning()
      .then((res) => res[0]);
  }

  // ✅ 특정 제안 조회
  async getProposal(id: string): Promise<Proposal | null> {
    return (
      (await this.db.query.proposals.findFirst({
        where: (p, { eq }) => eq(p.id, id),
      })) ?? null
    );
  }

  // ✅ 특정 프로젝트의 모든 제안 조회
  async getProposalsByProject(projectId: string): Promise<Proposal[]> {
    return this.db.query.proposals.findMany({
      where: (p, { eq }) => eq(p.project_id, projectId),
    });
  }

  // ✅ 특정 유저가 보낸 제안 조회
  async getSentProposals(userId: string): Promise<Proposal[]> {
    return this.db.query.proposals.findMany({
      where: (p, { eq }) => eq(p.sender_id, userId),
    });
  }

  // ✅ 특정 유저가 받은 제안 조회
  async getReceivedProposals(userId: string): Promise<Proposal[]> {
    return this.db.query.proposals.findMany({
      where: (p, { eq }) => eq(p.receiver_id, userId),
    });
  }

  // ✅ 제안 업데이트 (예: 상태 변경)
  async updateProposal(id: string, data: UpdateProposal): Promise<Proposal | null> {
    return this.db
      .update(proposals)
      .set(data)
      .where(eq(proposals.id, id))
      .returning()
      .then((res) => res[0] || null);
  }

  // ✅ 제안 삭제
  async deleteProposal(id: string): Promise<void> {
    await this.db.delete(proposals).where(eq(proposals.id, id)).execute();
  }
}
