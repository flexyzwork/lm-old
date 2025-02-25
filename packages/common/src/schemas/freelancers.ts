import { jsonb, pgTable, uuid, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { users } from './users';
// import { z } from 'zod';

// ✅ `freelancers` 테이블 (프리랜서 정보)
export const freelancers = pgTable('freelancers', {
  id: uuid('id')
    .primaryKey()
    .references(() => users.id)
    .notNull(), // ✅ users.id와 동일
  title: varchar('title', { length: 255 }).notNull(),
  bio: text('bio').notNull(), // 자기소개
  skills: jsonb('skills').default([]), // JSON 배열로 기술 스택 저장
  experiences: jsonb('experience').default([]), // 경력
  links: jsonb('links').default([]), // 링크 - 개인 웹사이트 등
  categories: jsonb('categories').default([]), // 카테고리 - 개발, 디자인 등
  contact_info: jsonb('contact_info').default([]),
  created_at: timestamp('created_at').defaultNow(),
});

// // ✅ 프리랜서 생성 요청 스키마
// export const createFreelancerSchema = z.object({
//   user_id: z.string().uuid(), // 사용자 ID (필수)
//   title: z.string().max(255).optional(), // 제목 (선택적, 최대 255자)
//   bio: z.string().optional(), // 자기소개 (선택적)
//   skills: z.array(z.string()).default([]), // 기술 스택 (기본값: 빈 배열)
//   experiences: z.array(z.object({
//     company: z.string(), // 회사명
//     position: z.string(), // 직책
//     duration: z.string(), // 근무 기간
//   })).default([]),
//   links: z.array(z.string().url()).default([]), // 개인 웹사이트, 포트폴리오 링크 등 (URL 형식 검증)
//   categories: z.array(z.string()).default([]), // 카테고리 (예: 개발, 디자인 등)
//   contact_info: z.record(z.string()).default({}), // 연락처 정보 (JSON 객체)
// });

// // ✅ 프리랜서 응답 스키마
// export const freelancerResponseSchema = z.object({
//   id: z.string().uuid(), // 프리랜서 ID
//   user_id: z.string().uuid(), // 사용자 ID
//   title: z.string().nullable(),
//   bio: z.string().nullable(),
//   skills: z.array(z.string()),
//   experiences: z.array(z.object({
//     company: z.string(),
//     position: z.string(),
//     duration: z.string(),
//   })),
//   links: z.array(z.string().url()),
//   categories: z.array(z.string()),
//   contact_info: z.record(z.string()),
//   created_at: z.string(), // ISO 형식의 날짜 문자열
// });
