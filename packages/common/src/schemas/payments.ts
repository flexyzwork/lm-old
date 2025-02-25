import { pgTable, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { contracts } from './contracts';

// ✅ `payments` 테이블 (결제 내역)
export const payments = pgTable('payments', {
  id: uuid('id').defaultRandom().primaryKey(), // ✅ UUID 자동 생성
  contract_id: uuid('contract_id')
    .references(() => contracts.id)
    .notNull(),
  amount: integer('amount').notNull(), // 결제 금액
  status: text('status').notNull().default('PENDING'), // 'PENDING', 'PAID', 'FAILED'
  created_at: timestamp('created_at').defaultNow(),
});
