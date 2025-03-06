import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { DRIZZLE, schema, CreateCourseDto, UpdateCourseDto, Section, Chapter } from '@packages/common';
import lodash from 'lodash';
import { CourseResponse } from './dto/course.interface';

const { courses, sections, chapters } = schema;

// ✅ 데이터의 키를 카멜케이스로 변환하는 유틸 함수
const keysToCamel = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((v) => keysToCamel(v));
  } else if (obj != null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (acc, key) => ({
        ...acc,
        [lodash.camelCase(key)]: keysToCamel(obj[key]),
      }),
      {}
    );
  }
  return obj;
};

@Injectable()
export class CoursesService {
  constructor(@Inject(DRIZZLE) private database: NodePgDatabase<typeof schema>) {}

  // ✅ 전체 강의 조회 (섹션, 챕터 포함)
  async getAll(): Promise<CourseResponse[]> {
    const coursesData = await this.database.query.courses.findMany();

    const coursesWithDetails = await Promise.all(
      coursesData.map(async (course) => {
        const sectionsData = await this.database.query.sections.findMany({
          where: eq(schema.sections.courseId, course.id),
        });

        const sectionsWithChapters = await Promise.all(
          sectionsData.map(async (section) => {
            const chaptersData = await this.database.query.chapters.findMany({
              where: eq(schema.chapters.sectionId, section.id),
            });

            return { ...section, chapters: chaptersData };
          })
        );

        return { ...course, sections: sectionsWithChapters };
      })
    );

    return keysToCamel(coursesWithDetails);
  }

  // ✅ 특정 강의 조회 시 섹션 및 챕터 포함
  async getOne(id: string): Promise<CourseResponse> {
    const course = await this.database.query.courses.findFirst({
      where: eq(schema.courses.id, id),
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found.`);
    }

    const sectionsData = await this.database.query.sections.findMany({
      where: eq(schema.sections.courseId, id),
    });

    const sectionsWithChapters = await Promise.all(
      sectionsData.map(async (section) => {
        const chaptersData = await this.database.query.chapters.findMany({
          where: eq(schema.chapters.sectionId, section.id),
        });

        return { ...section, chapters: chaptersData };
      })
    );

    return keysToCamel({ ...course, sections: sectionsWithChapters });
  }

  // ✅ 강의 생성
  async create(data: CreateCourseDto): Promise<CourseResponse> {
    const newCourse = await this.database
      .insert(schema.courses)
      .values(data)
      .returning()
      .then((res) => res[0]);

    return keysToCamel(newCourse);
  }

  // ✅ 강의 업데이트
  async update(id: string, updates: UpdateCourseDto): Promise<CourseResponse> {
    const updatedCourse = await this.database
      .update(schema.courses)
      .set(updates)
      .where(eq(schema.courses.id, id))
      .returning()
      .then((res) => res[0]);

    return keysToCamel(updatedCourse);
  }

  // ✅ 강의 삭제
  async delete(id: string): Promise<void> {
    await this.database.delete(schema.courses).where(eq(schema.courses.id, id));
  }

  // ✅ 특정 강의의 모든 섹션 조회
  async getSections(courseId: string): Promise<Section[]> {
    return await this.database.query.sections.findMany({
      where: eq(sections.courseId, courseId),
    });
  }

  // ✅ 섹션 추가
  async addSection(courseId: string, sectionData: { title: string }): Promise<Section> {
    return await this.database
      .insert(sections)
      .values({ courseId: courseId, ...sectionData })
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
      where: eq(chapters.sectionId, sectionId),
    });
  }

  // ✅ 챕터 추가
  async addChapter(
    sectionId: string,
    chapterData: { title: string; type: 'Text' | 'Quiz' | 'Video'; content: string }
  ): Promise<Chapter> {
    return await this.database
      .insert(chapters)
      .values({ sectionId: sectionId, ...chapterData })
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
