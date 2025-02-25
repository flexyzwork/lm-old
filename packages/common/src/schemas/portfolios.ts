import { jsonb, pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

// ✅ `portfolios` 테이블 (프리랜서 포트폴리오)
export const portfolios = pgTable('portfolios', {
  id: uuid('id').defaultRandom().primaryKey(), // ✅ UUID 자동 생성
  user_id: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  title: text('title').notNull(),
  description: text('description'),
  url: text('url'), // 프로젝트 링크
  tags: jsonb('tags').default([]), // JSON 배열로 태그 저장
  created_at: timestamp('created_at').defaultNow(),
});

import { z } from 'zod';

// ✅ 포트폴리오 생성 스키마
export const createPortfolioSchema = z.object({
  user_id: z.string().uuid(), // 프리랜서 ID
  title: z.string().min(1), // 필수 입력
  description: z.string().optional(), // 설명 (선택적)
  url: z.string().url().optional(), // 프로젝트 링크
  tags: z.array(z.string()).default([]), // 태그 리스트
});

export type CreatePortfolioInput = z.infer<typeof createPortfolioSchema>;
