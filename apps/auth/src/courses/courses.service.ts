import { Injectable, Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import {
  BaseService,
  DRIZZLE,
  schema,
  Course,
  CreateCourseDto,
  UpdateCourseDto,
  Section,
  Chapter,
} from '@packages/common';

const { courses, sections, chapters } = schema;

@Injectable()
export class CoursesService extends BaseService<typeof courses> {
  constructor(@Inject(DRIZZLE) database: NodePgDatabase<typeof schema>) {
    super(database, courses);
  }

  // // ✅ 특정 강의 조회
  // async getOne(courseId: string): Promise<Course | null> {
  //   const course = await this.database.select().from(courses).where(eq(courses.id, courseId)).limit(1).execute();
  //   return course.length > 0 ? course[0] : null;
  // }

  // // ✅ 강의 생성
  // async create(body: CreateCourseDto): Promise<Course> {
  //   return await super.create(body);
  // }

  // // ✅ 강의 업데이트
  // async update(id: string, updates: Partial<UpdateCourseDto>): Promise<Course> {
  //   return await super.update(id, updates);
  // }

  // // ✅ 강의 삭제
  // async delete(courseId: string): Promise<void> {
  //   return await super.delete(courseId);
  // }

  // ✅ 특정 강의의 모든 섹션 조회
  async getSections(courseId: string): Promise<Section[]> {
    return await this.database.query.sections.findMany({
      where: eq(sections.course_id, courseId),
    });
  }

  // ✅ 섹션 추가
  async addSection(courseId: string, sectionData: { title: string }): Promise<Section> {
    return await this.database
      .insert(sections)
      .values({ course_id: courseId, ...sectionData })
      .returning()
      .execute()
      .then((res) => res[0]);
  }

  // ✅ 특정 섹션 업데이트
  async updateSection(sectionId: string, updates: Partial<Section>): Promise<Section> {
    return await this.database
      .update(sections)
      .set(updates)
      .where(eq(sections.id, sectionId))
      .returning()
      .execute()
      .then((res) => res[0]);
  }

  // ✅ 특정 섹션 삭제
  async deleteSection(sectionId: string): Promise<void> {
    await this.database.delete(sections).where(eq(sections.id, sectionId)).execute();
  }

  // ✅ 특정 섹션의 모든 챕터 조회
  async getChapters(sectionId: string): Promise<Chapter[]> {
    return await this.database.query.chapters.findMany({
      where: eq(chapters.section_id, sectionId),
    });
  }

  // ✅ 챕터 추가
  async addChapter(
    sectionId: string,
    chapterData: { title: string; type: 'Text' | 'Quiz' | 'Video'; content: string }
  ): Promise<Chapter> {
    return await this.database
      .insert(chapters)
      .values({ section_id: sectionId, ...chapterData })
      .returning()
      .execute()
      .then((res) => res[0]);
  }

  // ✅ 특정 챕터 업데이트
  async updateChapter(chapterId: string, updates: Partial<Chapter>): Promise<Chapter> {
    return await this.database
      .update(chapters)
      .set(updates)
      .where(eq(chapters.id, chapterId))
      .returning()
      .execute()
      .then((res) => res[0]);
  }

  // ✅ 특정 챕터 삭제
  async deleteChapter(chapterId: string): Promise<void> {
    await this.database.delete(chapters).where(eq(chapters.id, chapterId)).execute();
  }
}
