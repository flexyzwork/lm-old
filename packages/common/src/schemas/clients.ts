import { jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './users';

// ✅ `clients` 테이블 (클라이언트 정보)
export const clients = pgTable('clients', {
  id: uuid('id')
    .primaryKey()
    .references(() => users.id)
    .notNull(), // ✅ users.id와 동일
  company_name: text('company_name').notNull(),
  website: text('website').notNull(),
  industry: text('industry').notNull(), // 산업 분야,
  bio: text('bio').notNull(), // 자기소개
  contact_info: jsonb('contact_info').default([]),
  created_at: timestamp('created_at').defaultNow(),
});
