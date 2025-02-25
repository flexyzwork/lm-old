import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from '@packages/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { schema } from '@packages/common';

@Injectable()
export class PostsService {
  constructor(
    @Inject(DRIZZLE)
    private readonly database: NodePgDatabase<typeof schema>
  ) {}

  async getPosts() {
    return this.database.query.posts.findMany();
  }

  async createPost(post: typeof schema.posts.$inferInsert) {
    return await this.database.insert(schema.posts).values(post).returning();
  }
}
