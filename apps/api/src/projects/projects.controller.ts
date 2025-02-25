import { Controller, Post, Body, UseGuards, Get, Param, Patch, Delete } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { schema } from '@packages/common';
import { z } from 'zod';
import { JwtAuthGuard } from '@packages/common';

const { createProjectSchema, updateProjectSchema } = schema;

type CreateProjectDto = z.infer<typeof createProjectSchema>;
type UpdateProjectDto = z.infer<typeof updateProjectSchema>;

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createProject(@Body() body: CreateProjectDto) {
    const parsedBody = createProjectSchema.parse(body);
    const { clientId, deadline, ...rest } = parsedBody;

    return this.projectsService.create({
      ...rest,
      client_id: clientId,
      deadline: deadline ? new Date(deadline) : undefined,
    });
  }

  // ✅ 프로젝트 전체 목록 조회 (GET /projects)
  @Get()
  async getAllProjects() {
    return this.projectsService.getAll();
  }

  // ✅ 단일 프로젝트 조회 (GET /projects/:id)
  @Get(':id')
  async getProjectById(@Param('id') id: string) {
    return this.projectsService.getById(id);
  }

  @Patch(':id')
  async updateProject(@Param('id') id: string, @Body() body: UpdateProjectDto) {
    const parsedBody = updateProjectSchema.parse(body);
    const { clientId, deadline, ...rest } = parsedBody;

    return this.projectsService.update(id, {
      ...rest,
      client_id: clientId,
      deadline: deadline ? new Date(deadline) : undefined,
    });
  }

  @Patch(':id/close')
  async closeProject(@Param('id') id: string) {
    return this.projectsService.update(id, { status: '마감' });
  }

  @Delete(':id')
  async deleteProject(@Param('id') id: string) {
    return this.projectsService.delete(id);
  }
}
