import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { BaseController, API, sectionSchemas, chapterSchemas } from '@packages/common';
import type { Chapter, CreateChapterDto, CreateCourseDto, Section, UpdateCourseDto } from '@packages/common';
import { zodToOpenAPI } from 'nestjs-zod';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../config/multer.config';

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
  async update(
    @Param('id') id: string,
    @Req() req: any,
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File // ❌ 파일이 없을 수도 있으므로 `?` 사용
  ) {
    try {
      console.log('✅ Received Request Body:', req.body);

      const isMultipart = req.headers['content-type']?.includes('multipart/form-data');
      let sections = [];

      if (isMultipart) {
        try {
          sections = JSON.parse(req.body.sections || '[]');
        } catch (error) {
          console.error('❌ Error parsing sections JSON:', error);
        }
      } else {
        sections = body.sections || [];
      }

      const updateData = {
        title: isMultipart ? req.body.title : body.title,
        description: isMultipart ? req.body.description : body.description,
        category: isMultipart ? req.body.category : body.category,
        price: isMultipart ? req.body.price : body.price,
        status: (isMultipart ? req.body.status : body.status) === true ? 'Published' : ('Draft' as any),
        sections,
        videoUrl: file ? `/uploads/videos/${file.filename}` : null,
      };

      return this.coursesService.update(id, updateData);
    } catch (error) {
      console.error('❌ Error in course update:', error);
      throw new BadRequestException('Invalid request data');
    }
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

  // ✅ 챕터 추가
  @Post('sections/:id/chapters')
  @API({
    authRequired: ['jwt'],
    requestBody: zodToOpenAPI(chapterSchemas.Insert),
    responseSchema: zodToOpenAPI(chapterSchemas.Select),
  })
  async addChapter(@Param('id') sectionId: string, @Body() chapter: CreateChapterDto) {
    return this.coursesService.addChapter(sectionId, chapter);
  }

  @Post('upload')
  @API({
    autoComplete: false,
    authRequired: false,
  })
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadFile(
    @Req() req: any,  
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('Received file:', file);
    
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
  
    // ✅ 파일 저장 경로 반환
    return {
      message: 'File uploaded successfully',
      fileUrl: `/uploads/${file.filename}`, // 클라이언트에서 접근 가능한 경로 반환
    };
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
