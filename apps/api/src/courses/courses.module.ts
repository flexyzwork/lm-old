import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { DatabaseModule } from '@packages/common';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    DatabaseModule,
  ],
  controllers: [CoursesController],
  providers: [ConfigService, CoursesService],
})
export class CoursesModule {}
