// import {
//   jsonb,
//   pgTable,
//   uuid,
//   text,
//   integer,
//   timestamp,
// } from 'drizzle-orm/pg-core';
// import { clients } from './clients';

// // ✅ `projects` 테이블 (클라이언트가 게시한 프로젝트)
// export const projects = pgTable('projects', {
//   id: uuid('id').defaultRandom().primaryKey(), // ✅ UUID 자동 생성
//   client_id: uuid('client_id')
//     .references(() => clients.id)
//     .notNull(),
//   title: text('title').notNull(),
//   description: text('description').notNull(),
//   budget: integer('budget'), // 예산 (단위: USD)
//   deadline: timestamp('deadline'),
//   tags: jsonb('tags').default([]), // JSON 배열로 태그 저장
//   created_at: timestamp('created_at').defaultNow(),
// });

import { pgTable, text, timestamp, uuid, integer, jsonb } from 'drizzle-orm/pg-core';
import { z } from 'zod';

// ✅ 프로젝트 상태 ENUM
export const PROJECT_STATUS = ['진행 중', '마감'] as const;

// ✅ 프로젝트 테이블 정의
export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  client_id: uuid('client_id').notNull(), // 클라이언트 ID
  title: text('title').notNull(),
  description: text('description').notNull(),
  budget: integer('budget'), // 예산 (USD)
  deadline: timestamp('deadline'), // 마감일
  tags: jsonb('tags').default([]), // JSON 배열 (기술 스택, 카테고리 태그 등)
  status: text('status').default('진행 중').notNull(), // ✅ 프로젝트 상태 추가
  created_at: timestamp('created_at').defaultNow(),
});

// ✅ 프로젝트 생성 스키마
export const createProjectSchema = z.object({
  title: z.string().min(3, '제목은 최소 3자 이상이어야 합니다.'),
  description: z.string().min(10, '설명은 최소 10자 이상이어야 합니다.'),
  budget: z.number().min(1, '예산은 최소 1 USD 이상이어야 합니다.'),
  deadline: z.string().optional(),
  tags: z.array(z.string()).optional(),
  clientId: z.string().uuid(),
  status: z.enum(PROJECT_STATUS).optional(), // ✅ 상태 추가
});

// ✅ 프로젝트 수정 스키마
export const updateProjectSchema = createProjectSchema.partial();
