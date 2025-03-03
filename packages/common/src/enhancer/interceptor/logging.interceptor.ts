import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { logger } from '../../../logger.config';
import safeStringify from 'fast-safe-stringify'; // 🚀 안전한 JSON 변환

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor() {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const { method, url } = req;

    // 🚀 JSON 변환 중 오류 방지 (Pretty Print 적용)
    const safeJsonStringify = (data: any) => {
      try {
        return data !== undefined ? safeStringify(data, undefined, 2) : '[UNDEFINED]'; // ✅ Pretty Print 적용
      } catch (error) {
        return '[CIRCULAR STRUCTURE]';
      }
    };

    logger.info(`📌 Request to ${method} ${url} \n📤 Request Body: \n${safeJsonStringify(req.body)}`);

    return next.handle().pipe(
      tap(
        (data) => {
          logger.info(`✅ Response from ${method} ${url} \n📥 Response Data: \n${safeJsonStringify(data)}`);
          if (!res.headersSent) {
            res.json(data); // 🚀 응답을 명확하게 반환하여 무한 대기 방지
          }
        },
        (error) => {
          logger.error(`❌ Error in ${method} ${url} \n🚨 Error: \n${safeJsonStringify(error)}`);
          if (!res.headersSent) {
            res.status(500).json({ message: 'Internal Server Error', error: safeJsonStringify(error) });
          }
        }
      )
    );
  }
}