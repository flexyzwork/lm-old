// import {
//   jsonb,
//   pgTable,
//   text,
//   integer,
//   timestamp,
//   uuid,
// } from 'drizzle-orm/pg-core';
// import { freelancers } from './freelancers';

// // services (프리랜서가 제공하는 서비스)
// export const services = pgTable('services', {
//   id: uuid('id').defaultRandom().primaryKey(), // ✅ UUID 자동 생성
//   freelancer_id: uuid('freelancer_id')
//     .references(() => freelancers.id)
//     .notNull(),
//   title: text('title').notNull(), // 서비스명
//   description: text('description').notNull(), // 서비스 설명
//   price: integer('price').notNull(), // 서비스 가격 (고정)
//   delivery_time: integer('delivery_time').notNull(), // 제공 기간 (일 단위)
//   tags: jsonb('tags').default([]), // JSON 배열로 태그 저장
//   created_at: timestamp('created_at').defaultNow(),
// });

import { pgTable, uuid, text, numeric, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { z } from 'zod';

// ✅ 프리랜서 서비스 테이블
export const services = pgTable('services', {
  id: uuid('id').defaultRandom().primaryKey(),
  freelancerId: uuid('freelancer_id').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  price: numeric('price').notNull(),
  tags: jsonb('tags').default([]),
  created_at: timestamp('created_at').defaultNow(),
});

// ✅ 서비스 생성 요청 스키마
export const createServiceSchema = z.object({
  freelancerId: z.string().uuid(),
  title: z.string().min(3, '제목은 최소 3자 이상이어야 합니다.'),
  description: z.string().min(10, '설명은 최소 10자 이상이어야 합니다.'),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, '금액 형식이 올바르지 않습니다.'),
  tags: z.array(z.string()).optional(),
});
