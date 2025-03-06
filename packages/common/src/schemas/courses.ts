import { pgTable, uuid, text, numeric, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// ✅ ENUM 정의
export const courseLevelEnum = pgEnum('course_level', ['Beginner', 'Intermediate', 'Advanced']);
export const courseStatusEnum = pgEnum('course_status', ['Draft', 'Published']);
export const chapterTypeEnum = pgEnum('chapter_type', ['Text', 'Quiz', 'Video']);

// ✅ 1️⃣ 강의 (Courses) 테이블
export const courses = pgTable('courses', {
  id: uuid('id').defaultRandom().primaryKey(),
  teacher_id: uuid('teacher_id').notNull(),
  teacher_name: text('teacher_name').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  category: text('category').notNull(),
  image: text('image'),
  price: numeric('price', { precision: 10, scale: 2 }),
  level: courseLevelEnum('level').notNull(),
  status: courseStatusEnum('status').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// ✅ 2️⃣ 섹션 (Sections) 테이블 - courses와 1:N 관계
export const sections = pgTable('sections', {
  id: uuid('id').defaultRandom().primaryKey(),
  course_id: uuid('course_id')
    .references(() => courses.id, { onDelete: 'cascade' })
    .notNull(),
  title: text('title').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// ✅ 3️⃣ 챕터 (Chapters) 테이블 - sections와 1:N 관계
export const chapters = pgTable('chapters', {
  id: uuid('id').defaultRandom().primaryKey(),
  section_id: uuid('section_id')
    .references(() => sections.id, { onDelete: 'cascade' })
    .notNull(),
  title: text('title').notNull(),
  type: chapterTypeEnum('type').notNull(),
  content: text('content').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// ✅ API 요청/응답 타입 정의
export type Course = InferSelectModel<typeof courses>;
export type Section = InferSelectModel<typeof sections>;
export type Chapter = InferSelectModel<typeof chapters>;

export type NewCourse = InferInsertModel<typeof courses>;
export type NewSection = InferInsertModel<typeof sections>;
export type NewChapter = InferInsertModel<typeof chapters>;

// ✅ 📌 Zod 스키마 자동 생성 (CRUD 요청/응답 DTO)
export const courseSchemas = {
  Select: createSelectSchema(courses).openapi({ title: 'CourseResponse' }),
  Insert: createInsertSchema(courses).omit({ id: true, created_at: true }).openapi({ title: 'CreateCourse' }),
  Update: createInsertSchema(courses)
    .omit({ id: true, created_at: true, teacher_id: true })
    .partial()
    .openapi({ title: 'UpdateCourse' }),
};

export const sectionSchemas = {
  Select: createSelectSchema(sections).openapi({ title: 'SectionResponse' }),
  Insert: createInsertSchema(sections).omit({ id: true, created_at: true }).openapi({ title: 'CreateSection' }),
  Update: createInsertSchema(sections)
    .omit({ id: true, created_at: true, course_id: true })
    .partial()
    .openapi({ title: 'UpdateSection' }),
};

export const chapterSchemas = {
  Select: createSelectSchema(chapters).openapi({ title: 'ChapterResponse' }),
  Insert: createInsertSchema(chapters).omit({ id: true, created_at: true }).openapi({ title: 'CreateChapter' }),
  Update: createInsertSchema(chapters)
    .omit({ id: true, created_at: true, section_id: true })
    .partial()
    .openapi({ title: 'UpdateChapter' }),
};

// ✅ API 요청/응답 타입
export type CreateCourseDto = z.infer<typeof courseSchemas.Insert>;
export type UpdateCourseDto = z.infer<typeof courseSchemas.Update>;
export type CourseResponseDto = z.infer<typeof courseSchemas.Select>;

export type CreateSectionDto = z.infer<typeof sectionSchemas.Insert>;
export type UpdateSectionDto = z.infer<typeof sectionSchemas.Update>;
export type SectionResponseDto = z.infer<typeof sectionSchemas.Select>;

export type CreateChapterDto = z.infer<typeof chapterSchemas.Insert>;
export type UpdateChapterDto = z.infer<typeof chapterSchemas.Update>;
export type ChapterResponseDto = z.infer<typeof chapterSchemas.Select>;
