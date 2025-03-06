import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

// ✅ 댓글 (Comments) 테이블
export const comments = pgTable('comments', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').notNull(),
  course_id: uuid('course_id').notNull(),
  content: text('content').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export type Comment = InferSelectModel<typeof comments>;
export type NewComment = InferInsertModel<typeof comments>;