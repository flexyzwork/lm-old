import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { DRIZZLE, schema, Section, Chapter, BaseService } from '@packages/common';

const { courses, sections, chapters } = schema;

@Injectable()
export class CoursesService extends BaseService<typeof courses> {
  constructor(@Inject(DRIZZLE) database: NodePgDatabase<typeof schema>) {
    super(database, courses);
  }

  // ✅ 모든 강의를 조회할 때 섹션과 챕터까지 함께 조회
  async getAll() {
    // 1️⃣ 모든 강의 조회
    const coursesData = await this.database.query.courses.findMany();

    // 2️⃣ 각 강의의 섹션과 챕터를 병렬 조회 후 결합
    const coursesWithSectionsAndChapters = await Promise.all(
      coursesData.map(async (course) => {
        // 섹션 조회
        const sectionsData = await this.database.query.sections.findMany({
          where: eq(sections.courseId, course.id),
        });

        // 각 섹션의 챕터 조회 후 결합
        const sectionsWithChapters = await Promise.all(
          sectionsData.map(async (section) => {
            const chaptersData = await this.database.query.chapters.findMany({
              where: eq(chapters.sectionId, section.id),
            });

            return {
              ...section,
              chapters: chaptersData,
            };
          })
        );

        // 강의 데이터에 섹션과 챕터 결합
        return {
          ...course,
          sections: sectionsWithChapters,
        };
      })
    );

    // 최종 데이터 반환
    return coursesWithSectionsAndChapters;
  }

  // ✅ 특정 강의 조회 시 하위 섹션과 챕터를 모두 함께 조회하는 메서드
  async getOne(id: string) {
    // 1️⃣ 특정 강의 정보 조회
    const course = await this.database.query.courses.findFirst({
      where: eq(courses.id, id),
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found.`);
    }

    // 2️⃣ 해당 강의에 속한 섹션 목록 조회
    const sectionsData = await this.database.query.sections.findMany({
      where: eq(sections.courseId, id),
    });

    // 2️⃣ 각 섹션에 속한 챕터를 조회하여 연결
    const sectionsWithChapters: Section[] = await Promise.all(
      sectionsData.map(async (section) => {
        const chaptersData = await this.database.query.chapters.findMany({
          where: eq(chapters.sectionId, section.id),
        });

        return {
          ...section,
          chapters: chaptersData,
        };
      })
    );

    // 3️⃣ 최종 데이터 구조로 반환
    return {
      ...course,
      sections: sectionsWithChapters,
    };
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
