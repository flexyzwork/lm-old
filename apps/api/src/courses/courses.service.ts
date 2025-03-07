import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, sql } from 'drizzle-orm';
import { DRIZZLE, schema, Section, Chapter, BaseService, CourseResponseDto, CreateCourseDto } from '@packages/common';

const { courses, sections, chapters } = schema;
type SectionWithChapters = Section & { chapters?: Chapter[] };

@Injectable()
export class CoursesService {
  constructor(
    @Inject(DRIZZLE)
    private database: NodePgDatabase<typeof schema>
  ) {}

  // ✅ 모든 강의를 조회할 때 섹션과 챕터까지 함께 조회
  async getAll(userId?: string) {
    // ✅ 강의 + 섹션 + 챕터 + 소유 여부(`isOwner`) 옵션 추가
    const coursesWithSectionsAndChapters = await this.database
      .select({
        courseId: courses.id,
        courseTitle: courses.title,
        courseDescription: courses.description,
        courseCategory: courses.category,
        courseImage: courses.image,
        coursePrice: courses.price,
        courseLevel: courses.level,
        courseStatus: courses.status,
        createdAt: courses.createdAt,
        teacherId: courses.teacherId,

        isOwner: userId ? eq(courses.teacherId, userId).as('isOwner') : sql`FALSE`.as('isOwner'),

        sectionId: sections.id,
        sectionTitle: sections.title,

        chapterId: chapters.id,
        chapterTitle: chapters.title,
        chapterType: chapters.type,
        chapterContent: chapters.content,
      })
      .from(courses)
      .leftJoin(sections, eq(sections.courseId, courses.id))
      .leftJoin(chapters, eq(chapters.sectionId, sections.id))
      .execute();

    // ✅ 조회된 데이터를 강의 단위로 그룹화
    const courseMap = new Map<string, any>();

    for (const row of coursesWithSectionsAndChapters) {
      if (!courseMap.has(row.courseId)) {
        courseMap.set(row.courseId, {
          id: row.courseId,
          title: row.courseTitle,
          description: row.courseDescription,
          category: row.courseCategory,
          image: row.courseImage,
          price: row.coursePrice,
          level: row.courseLevel,
          status: row.courseStatus,
          createdAt: row.createdAt,
          teacherId: row.teacherId,
          isOwner: userId ? row.isOwner : undefined, // ✅ `userId`가 없으면 `undefined`
          sections: [],
        });
      }

      const course = courseMap.get(row.courseId);

      if (row.sectionId) {
        let section = course.sections.find((s: any) => s.id === row.sectionId);
        if (!section) {
          section = {
            id: row.sectionId,
            title: row.sectionTitle,
            chapters: [],
          };
          course.sections.push(section);
        }

        if (row.chapterId) {
          section.chapters.push({
            id: row.chapterId,
            title: row.chapterTitle,
            type: row.chapterType,
            content: row.chapterContent,
          });
        }
      }
    }

    return Array.from(courseMap.values());
  }

  // ✅ 특정 강의 조회 시 하위 섹션과 챕터를 모두 함께 조회하는 메서드
  async getOne(id: string, userId?: string) {
    // 1️⃣ 특정 강의 정보 조회
    const course = await this.database.query.courses.findFirst({
      where: eq(courses.id, id),
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found.`);
    }

    let isOwner = false;
    if (course.teacherId === userId) {
      isOwner = true;
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
      isOwner,
      sections: sectionsWithChapters,
    };
  }

  // ✅ 강의 생성
  async create(data: CreateCourseDto): Promise<CourseResponseDto> {
    const newCourse = await this.database
      .insert(schema.courses)
      .values(data)
      .returning()
      .then((res) => res[0]);

    return newCourse;
  }

  // ✅ 강의 업데이트 + 섹션 & 챕터 업설트
  async update(
    id: string,
    updateData: {
      title?: string;
      description?: string;
      category?: string;
      price?: number;
      status?: 'Draft' | 'Published';
      sections?: SectionWithChapters[];
      videoFile?: Express.Multer.File; // ✅ 추가: 업로드된 비디오 파일
    }
  ) {
    const existingCourse = await this.database.query.courses.findFirst({
      where: eq(courses.id, id),
    });

    if (!existingCourse) {
      throw new NotFoundException(`Course with ID ${id} not found.`);
    }

    // ✅ 강의 정보 업데이트
    const updatedCourse = await this.database
      .update(courses)
      .set({
        title: updateData.title,
        description: updateData.description,
        category: updateData.category,
        price: updateData.price !== undefined ? sql`${updateData.price}` : undefined,
        status: updateData.status,
      })
      .where(eq(courses.id, id))
      .returning()
      .execute()
      .then((res) => res[0]);

    // ✅ 섹션 & 챕터 업데이트
    if (updateData.sections && updateData.sections.length > 0) {
      for (const sectionData of updateData.sections) {
        let section = await this.database.query.sections.findFirst({
          where: eq(sections.id, sectionData.id),
        });

        if (!section) {
          section = await this.database
            .insert(sections)
            .values({ courseId: id, title: sectionData.title })
            .returning()
            .execute()
            .then((res) => res[0]);
        } else {
          section = await this.database
            .update(sections)
            .set({ title: sectionData.title })
            .where(eq(sections.id, sectionData.id))
            .returning()
            .execute()
            .then((res) => res[0]);
        }

        if (sectionData.chapters && sectionData.chapters.length > 0) {
          for (const chapterData of sectionData.chapters) {
            let chapter = await this.database.query.chapters.findFirst({
              where: eq(chapters.id, chapterData.id),
            });

            if (!chapter) {
              chapter = await this.database
                .insert(chapters)
                .values({
                  sectionId: section!.id,
                  title: chapterData.title,
                  type: chapterData.type,
                  content:
                    chapterData.type === 'Video' && updateData.videoFile
                      ? `/uploads/videos/${updateData.videoFile.filename}` // ✅ 비디오 파일 URL 저장
                      : chapterData.content,
                })
                .returning()
                .execute()
                .then((res) => res[0]);
            } else {
              chapter = await this.database
                .update(chapters)
                .set({
                  title: chapterData.title,
                  type: chapterData.type,
                  content:
                    chapterData.type === 'Video' && updateData.videoFile
                      ? `/uploads/videos/${updateData.videoFile.filename}` // ✅ 비디오 파일이 있을 경우 URL 업데이트
                      : chapterData.content,
                })
                .where(eq(chapters.id, chapterData.id))
                .returning()
                .execute()
                .then((res) => res[0]);
            }
          }
        }
      }
    }

    return { message: 'Course updated successfully', updatedCourse };
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
