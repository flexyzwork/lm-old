// import {
//   pgTable,
//   uuid,
//   text,
//   integer,
//   timestamp,
// } from 'drizzle-orm/pg-core';
// import { projects } from './projects';
// import { clients } from './clients';
// import { freelancers } from './freelancers';

// // ✅ `contracts` 테이블 (프리랜서와 클라이언트 간 계약)
// export const contracts = pgTable('contracts', {
//   id: uuid('id').defaultRandom().primaryKey(),
//   project_id: uuid('project_id').references(() => projects.id).notNull(),
//   freelancer_id: uuid('freelancer_id').references(() => freelancers.id).notNull(),
//   client_id: uuid('client_id').references(() => clients.id).notNull(),
//   amount: integer('amount').notNull(), // 계약 금액
//   status: text('status').notNull().default('ACTIVE'), // 'ACTIVE', 'COMPLETED', 'CANCELLED'
//   start_date: timestamp('start_date').defaultNow(),
//   end_date: timestamp('end_date'),
//   created_at: timestamp('created_at').defaultNow(),
// });

import { pgTable, uuid, text, numeric, timestamp } from 'drizzle-orm/pg-core';
import { z } from 'zod';

// ✅ 계약 테이블 정의
export const contracts = pgTable('contracts', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id').notNull(),
  freelancerId: uuid('freelancer_id').notNull(),
  clientId: uuid('client_id').notNull(),
  amount: numeric('amount').notNull(),
  status: text('status').default('pending'), // pending, approved, completed
  created_at: timestamp('created_at').defaultNow(),
});

// ✅ 계약 생성 요청 스키마
export const createContractSchema = z.object({
  projectId: z.string().uuid(),
  freelancerId: z.string().uuid(),
  clientId: z.string().uuid(),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, '금액 형식이 올바르지 않습니다.'),
});
