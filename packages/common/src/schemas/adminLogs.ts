import { jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './users';

// ✅ `admin_logs` 테이블 (관리자 로그)
export const adminLogs = pgTable('admin_logs', {
  id: uuid('id').defaultRandom().primaryKey(), // ✅ UUID 자동 생성
  admin_id: uuid('admin_id')
    .references(() => users.id)
    .notNull(),
  action: text('action').notNull(), // 로그 내용
  details: jsonb('details'), // 추가 데이터 저장 가능
  created_at: timestamp('created_at').defaultNow(),
});
