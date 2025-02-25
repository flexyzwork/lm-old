import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from '@packages/common';
import { schema } from '@packages/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, eq, InferInsertModel, InferSelectModel } from 'drizzle-orm';

export type PortfoliosEntity = InferSelectModel<typeof schema.portfolios>;
export type NewPortfolios = InferInsertModel<typeof schema.portfolios>;
export type UpdatePortfolios = Partial<NewPortfolios>;

@Injectable()
export class PortfoliosService {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: NodePgDatabase<typeof schema>
  ) {}


  async isOwner(userId: string, portfolioId: string): Promise<boolean> {
    const portfolio = await this.db.select({ ownerId: schema.portfolios.user_id })
      .from(schema.portfolios)
      .where(eq(schema.portfolios.id, portfolioId))
      .limit(1)
      .execute();
    
    return portfolio.length > 0 ? portfolio[0].ownerId === userId : false;
  }

  async createPortfolios(portfolios: NewPortfolios) {
    return await this.db.insert(schema.portfolios).values(portfolios).returning();
  }

  async getPortfolios(): Promise<PortfoliosEntity[]> {
    return await this.db.query.portfolios.findMany();
  }

  async getPortfolio(id: string) {
    return await this.db.query.portfolios.findFirst({
      where: (portfolios, { eq }) => eq(portfolios.id, id),
    });
  }

  async getPortfoliosByUserId(userId: string) {
    return await this.db.query.portfolios.findMany({
      where: (portfolios, { eq }) => eq(portfolios.user_id, userId),
    });
  }

  // ✅ 포트폴리오 업데이트 (사용자 본인만 수정 가능)
  async updatePortfolio(id: string, userId: string, data: UpdatePortfolios) {
    return await this.db
      .update(schema.portfolios)
      .set(data)
      .where(and(eq(schema.portfolios.id, id), eq(schema.portfolios.user_id, userId)))
      .returning()
      .then((res) => res[0] || null);
  }

  // ✅ 포트폴리오 삭제 (사용자 본인만 삭제 가능)
  async deletePortfolio(id: string, userId: string) {
    return await this.db
      .delete(schema.portfolios)
      .where(and(eq(schema.portfolios.id, id), eq(schema.portfolios.user_id, userId)))
      .execute();
  }
}
