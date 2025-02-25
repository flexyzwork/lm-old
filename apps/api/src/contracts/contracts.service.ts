import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from '@packages/common';
import { schema } from '@packages/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export type ContractsEntity = InferSelectModel<typeof schema.contracts>;
export type NewContracts = InferInsertModel<typeof schema.contracts>;
const { contracts } = schema;

@Injectable()
export class ContractsService {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: NodePgDatabase<typeof schema>
  ) {}

  async create(data: NewContracts) {
    return this.db.insert(contracts).values(data).returning();
  }
}
