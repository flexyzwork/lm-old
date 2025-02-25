import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DRIZZLE } from '@packages/common';
import { schema } from '@packages/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { InferInsertModel, InferSelectModel, eq } from 'drizzle-orm';

export type ProjectsEntity = InferSelectModel<typeof schema.projects>;
export type NewProjects = InferInsertModel<typeof schema.projects>;
const { projects } = schema;

@Injectable()
export class ProjectsService {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: NodePgDatabase<typeof schema>
  ) {}

  async create(data: NewProjects) {
    return this.db.insert(projects).values(data).returning();
  }

  // ✅ 전체 프로젝트 목록 조회
  async getAll(): Promise<ProjectsEntity[]> {
    return this.db.query.projects.findMany();
  }

  // ✅ 단일 프로젝트 조회
  async getById(id: string): Promise<ProjectsEntity | null> {
    const project = await this.db.query.projects.findFirst({
      where: eq(projects.id, id),
    });

    if (!project) throw new NotFoundException('프로젝트를 찾을 수 없습니다.');
    return project;
  }

  async update(id: string, updates: Partial<NewProjects>) {
    const updatedProject = await this.db.update(projects).set(updates).where(eq(projects.id, id)).returning();

    if (!updatedProject.length) throw new NotFoundException('프로젝트를 찾을 수 없습니다.');
    return updatedProject[0];
  }

  async delete(id: string) {
    const deletedProject = await this.db.delete(projects).where(eq(projects.id, id)).returning();

    if (!deletedProject.length) throw new NotFoundException('프로젝트를 찾을 수 없습니다.');
    return { message: '프로젝트가 삭제되었습니다.', project: deletedProject[0] };
  }
}
