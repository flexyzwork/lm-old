import { Inject, Injectable } from '@nestjs/common';
import { schema } from '@packages/common';
import { DRIZZLE } from '@packages/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export type ServicesEntity = InferSelectModel<typeof schema.services>;
export type NewServices = InferInsertModel<typeof schema.services>;

@Injectable()
export class ServicesService {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: NodePgDatabase<typeof schema>
  ) {}

  async create(services: { freelancerId: string; title: string; description: string; price: string; tags?: string[] }) {
    return await this.db.insert(schema.services).values(services).returning();
  }
}
