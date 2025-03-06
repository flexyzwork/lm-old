import { pgTable, uuid, text, boolean, numeric, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { users } from './users';
import { courses } from './courses';

// ✅ 강의 챕터 진행 상황 (Chapter Progress) 테이블
export const chapterProgress = pgTable('chapter_progress', {
  id: uuid('id').defaultRandom().primaryKey(), // ✅ 기존 chapterId → id 변경
  user_id: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  course_id: uuid('course_id')
    .references(() => courses.id, { onDelete: 'cascade' })
    .notNull(),
  section_id: uuid('section_id').notNull(),
  chapter_id: uuid('chapter_id').notNull(),
  completed: boolean('completed').default(false).notNull(),
  last_accessed_at: timestamp('last_accessed_at').defaultNow().notNull(), // ✅ 기존 lastAccessedTimestamp → last_accessed_at 변경
});

// ✅ 강의 섹션 진행 상황 (Section Progress) 테이블
export const sectionProgress = pgTable('section_progress', {
  id: uuid('id').defaultRandom().primaryKey(), // ✅ 기존 sectionId → id 변경
  user_id: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  course_id: uuid('course_id')
    .references(() => courses.id, { onDelete: 'cascade' })
    .notNull(),
  section_id: uuid('section_id').notNull(),
  chapters: jsonb('chapters').$type<Array<{ id: string; completed: boolean; last_accessed_at: string }>>().default([]), // ✅ JSONB 활용
  last_accessed_at: timestamp('last_accessed_at').defaultNow().notNull(),
});

// ✅ 사용자 강의 진행 상황 (User Course Progress) 테이블
export const userCourseProgress = pgTable('user_course_progress', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  course_id: uuid('course_id')
    .references(() => courses.id, { onDelete: 'cascade' })
    .notNull(),
  enrollment_date: timestamp('enrollment_date').defaultNow().notNull(), // ✅ 기존 enrollmentDate 변경
  overall_progress: numeric('overall_progress', { precision: 5, scale: 2 }).default(0).notNull(), // ✅ 0~100% 정밀도 설정
  sections: jsonb('sections')
    .$type<Array<{ id: string; chapters: Array<{ id: string; completed: boolean }> }>>()
    .default([]), // ✅ JSONB 활용
  last_accessed_at: timestamp('last_accessed_at').defaultNow().notNull(),
});

// ✅ 타입 정의
export type ChapterProgress = InferSelectModel<typeof chapterProgress>;
export type NewChapterProgress = InferInsertModel<typeof chapterProgress>;
export type SectionProgress = InferSelectModel<typeof sectionProgress>;
export type NewSectionProgress = InferInsertModel<typeof sectionProgress>;
export type UserCourseProgress = InferSelectModel<typeof userCourseProgress>;
export type NewUserCourseProgress = InferInsertModel<typeof userCourseProgress>;
