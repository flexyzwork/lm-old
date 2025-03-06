import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { CommonModule, Logger } from '@packages/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CoursesModule } from './courses/courses.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UsersModule, CommonModule, CoursesModule, AuthModule],
  controllers: [],
  providers: [Logger, ConfigService],
  exports: [Logger, ConfigService],
})
export class AppModule {}
