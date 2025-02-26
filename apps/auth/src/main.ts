import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { HttpExceptionFilter, setupSwagger, logger as instance } from '@packages/common';
// import { logger as instance } from './logger.config';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import express from 'express';
import { WinstonModule } from 'nest-winston';
import helmet from 'helmet';
// import { NestFactoryStatic } from '@nestjs/core/nest-factory';


async function bootstrap() {
  const app = await NestFactory.create(AuthModule, {
    logger: WinstonModule.createLogger({instance }),
  });
  const configService = app.get(ConfigService);

  // ✅ .env에서 FRONTEND_URL 불러오기
  const frontendUrl = configService.get<string>('FRONTEND_URL', 'http://localhost:3000');

  app.use(helmet());

  // ✅ CORS 설정 추가
  app.enableCors({
    origin: frontendUrl, // Next.js 프론트엔드 URL 허용
    // origin: true,
    credentials: true, // 쿠키, 헤더 포함 가능하도록 설정
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // 허용할 HTTP 메서드
    allowedHeaders: 'Content-Type, Authorization', // 허용할 헤더
  });
  app.use(cookieParser());
  app.use(express.json()); // ✅ JSON 바디를 올바르게 파싱하도록 보장
  app.use(express.urlencoded({ extended: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  // NestFactoryStatic;
  setupSwagger(app);

  await app.listen(4000);
  console.log('🚀 Server running at http://localhost:4000/swagger');
}
bootstrap();
