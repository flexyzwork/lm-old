import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    // ✅ CORS 설정 추가
    app.enableCors({
      origin: "http://localhost:3000", // Next.js 프론트엔드 URL 허용
      credentials: true, // 쿠키, 헤더 포함 가능하도록 설정
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // 허용할 HTTP 메서드
      allowedHeaders: "Content-Type, Authorization", // 허용할 헤더
    });
    // ✅ 요청 본문(body) 크기 제한 증가 (예: 50MB)
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  await app.listen(process.env.PORT ?? 4001);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
