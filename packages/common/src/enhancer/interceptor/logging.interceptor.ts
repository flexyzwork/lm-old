import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { logger } from '../../../logger.config'; // winston 로거 import

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor() {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { method, url, body } = context.getArgByIndex(0);
    const logMessage = `Request to ${method} ${url} \n Request body: ${JSON.stringify(body, null, 2)}`; // pretty print JSON

    // 요청 로그를 콘솔과 파일에 기록
    logger.info(logMessage);

    return next.handle().pipe(
      tap((data) => {
        // data만 예쁘게 출력
        const responseMessage = `Response from ${method} ${url} \n Response Data: ${JSON.stringify(data?.data, null, 2)}`; // data만 예쁘게 출력

        // 응답 로그를 콘솔과 파일에 기록
        logger.info(responseMessage);
      })
    );
  }
}
