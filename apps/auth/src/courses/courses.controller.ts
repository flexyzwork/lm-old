import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { BaseController, API, sectionSchemas, chapterSchemas } from '@packages/common';
import type { Chapter, CreateChapterDto, CreateCourseDto, Section, UpdateCourseDto } from '@packages/common';
import { zodToOpenAPI } from 'nestjs-zod';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController extends BaseController {
  constructor(private readonly coursesService: CoursesService) {
    super();
  }

  // ✅ 강의 생성 (POST)
  @Post()
  @API({ authRequired: ['jwt'] })
  async create(@Body() body: CreateCourseDto) {
    return await this.coursesService.create(body);
  }

  // ✅ 특정 강의 조회 (GET)
  @Get(':id')
  @API({ authRequired: false })
  async getCourse(@Param('id') id: string) {
    return this.coursesService.getOne(id) ?? null; // ✅ undefined 대신 null 반환
  }

  // ✅ 전체 강의 조회 (GET)
  @Get()
  @API({ authRequired: false })
  async getCourses() {
    return this.coursesService.getAll();
  }

  // ✅ 강의 정보 업데이트 (PATCH)
  @Patch(':id')
  @API({ authRequired: ['jwt'] })
  async update(@Param('id') id: string, @Body() body: UpdateCourseDto) {
    return this.coursesService.update(id, body);
  }

  // ✅ 강의 삭제 (DELETE)
  @Delete(':id')
  @API({ authRequired: ['jwt'] })
  async deleteCourse(@Param('id') id: string) {
    return await this.coursesService.delete(id);
  }

  // ✅ 특정 강의의 모든 섹션 조회
  @Get(':id/sections')
  @API({ authRequired: false })
  async getSections(@Param('id') courseId: string) {
    return this.coursesService.getSections(courseId);
  }

  // // ✅ 섹션 추가
  @Post(':id/sections')
  @API({
    authRequired: ['jwt'],
    requestBody: zodToOpenAPI(sectionSchemas.Insert),
    responseSchema: zodToOpenAPI(sectionSchemas.Select),
  })
  async addSection(@Param('id') courseId: string, @Body() section: any) {
    return this.coursesService.addSection(courseId, section);
  }

  // ✅ 특정 섹션 업데이트
  @Patch('sections/:id')
  @API({ authRequired: ['jwt'] })
  async updateSection(@Param('id') sectionId: string, @Body() updates: Partial<Section>) {
    return this.coursesService.updateSection(sectionId, updates);
  }

  // ✅ 특정 섹션 삭제
  @Delete('sections/:id')
  @API({ authRequired: ['jwt'] })
  async deleteSection(@Param('id') sectionId: string) {
    return this.coursesService.deleteSection(sectionId);
  }

  // ✅ 특정 섹션의 모든 챕터 조회
  @Get('sections/:id/chapters')
  async getChapters(@Param('id') sectionId: string) {
    return this.coursesService.getChapters(sectionId);
  }

  // // ✅ 챕터 추가
  @Post('sections/:id/chapters')
  @API({
    authRequired: ['jwt'],
    requestBody: zodToOpenAPI(chapterSchemas.Insert),
    responseSchema: zodToOpenAPI(chapterSchemas.Select),
  })
  async addChapter(@Param('id') sectionId: string, @Body() chapter: CreateChapterDto) {
    return this.coursesService.addChapter(sectionId, chapter);
  }

  // ✅ 특정 챕터 업데이트
  @Patch('chapters/:id')
  @API({ authRequired: ['jwt'] })
  async updateChapter(@Param('id') chapterId: string, @Body() updates: Partial<Chapter>) {
    return this.coursesService.updateChapter(chapterId, updates);
  }

  // ✅ 특정 챕터 삭제
  @Delete('chapters/:id')
  @API({ authRequired: ['jwt'] })
  async deleteChapter(@Param('id') chapterId: string) {
    return this.coursesService.deleteChapter(chapterId);
  }
}
