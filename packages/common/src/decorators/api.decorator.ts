/* eslint-disable @typescript-eslint/no-explicit-any */
import { applyDecorators, HttpCode, SetMetadata, UseGuards, UsePipes } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiBody,
  ApiParam,
  ApiNotFoundResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Role, Permission } from '../enums';
import { zodToOpenAPI } from 'nestjs-zod';
import { ZodValidationPipe } from '../enhancer/pipes/zod-validation.pipe';
import * as schema from '../schemas';
import { GoogleAuthGuard, GithubAuthGuard, JwtAuthGuard, RoleGuard } from '../auth/guards';

export enum MetaKey {
  USE_ROLE = 'USE_ROLE',
  USE_ACCESS = 'USE_ACCESS',
  REQUIRE_OWNER = 'REQUIRE_OWNER',
}

/**
 * 📌 역할별 권한 자동 매핑
 */
const RolePermissions: Record<Role, Permission[]> = {
  [Role.DEFAULT]: [Permission.READ],
  [Role.ADMIN]: [Permission.READ, Permission.EDIT],
  [Role.OWNER]: [Permission.READ, Permission.EDIT],
};

/**
 * 📌 복수형 → 단수형 변환 (기본적인 변환 규칙 적용)
 */
function toSingular(name: string): string {
  if (name.endsWith('ies')) {
    return name.slice(0, -3) + 'y'; // ex) "Categories" -> "Category"
  } else if (name.endsWith('es')) {
    return name.slice(0, -2); // ex) "Users" -> "User"
  } else if (name.endsWith('s')) {
    return name.slice(0, -1); // ex) "Projects" -> "Project"
  }
  return name; // 단수 그대로 반환
}

/**
 * 📌 API 데코레이터
 */
export function API(options?: {
  summary?: string;
  description?: string;
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  authRequired?: boolean | ('jwt' | 'google' | 'github' | 'local')[];
  role?: Role;
  requestBody?: any;
  updateBody?: any;
  responseSchema?: any;
  params?: { name: string; description: string; example?: any }[];
  autoComplete?: boolean; // 🔹 자동완성 여부 추가 (기본값: true)
}) {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    const decorators: MethodDecorator[] = [];

    // ✅ `autoComplete: false`가 설정된 경우 → 제공된 옵션만 반영하고 자동완성 방지
    if (options?.autoComplete === false) {
      if (options.summary) {
        decorators.push(ApiOperation({ summary: options.summary }));
      }
      if (options.description) {
        decorators.push(ApiOperation({ description: options.description }));
      }
      if (options.method === 'POST' && options.requestBody) {
        decorators.push(ApiBody({ schema: options.requestBody }));
      }
      if (options.method === 'PATCH' && options.updateBody) {
        decorators.push(ApiBody({ schema: options.updateBody }));
      }
      if (options.responseSchema) {
        decorators.push(
          ApiOkResponse({
            description: '요청 성공',
            content: { 'application/json': { schema: options.responseSchema } },
          })
        );
      }
      if (options.authRequired) {
        if (
          options.authRequired === true ||
          (Array.isArray(options.authRequired) && options.authRequired.includes('jwt'))
        ) {
          decorators.push(ApiBearerAuth());
          decorators.push(UseGuards(JwtAuthGuard));
        }
        if (Array.isArray(options.authRequired)) {
          if (options.authRequired.includes('google')) {
            decorators.push(UseGuards(GoogleAuthGuard));
          }
          if (options.authRequired.includes('github')) {
            decorators.push(UseGuards(GithubAuthGuard));
          }
        }
      }
      if (options.role) {
        decorators.push(SetMetadata(MetaKey.USE_ROLE, options.role));
        decorators.push(SetMetadata(MetaKey.USE_ACCESS, RolePermissions[options.role]));
        decorators.push(UseGuards(RoleGuard));
      }
      if (options.params) {
        options.params.forEach((param) => {
          decorators.push(ApiParam({ name: param.name, description: param.description, example: param.example }));
        });
      }

      applyDecorators(...decorators)(target, key, descriptor);
      Reflect.defineMetadata('API_OPTIONS', options, target, key); // ✅ 메타데이터 저장
      return descriptor;
    }

    // ✅ 자동완성 활성화 (`autoComplete`가 `true`이거나 명시되지 않은 경우)
    const controllerName = toSingular(target.constructor.name.replace('Controller', ''));
    const schemasName = `${controllerName.charAt(0).toLowerCase()}${controllerName.slice(1)}Schemas`;

    const schemas = (schema as any)[schemasName];

    if (!schemas) {
      throw new Error(`[API] 스키마를 찾을 수 없습니다: ${schemasName}`);
    }

    // ✅ HTTP 메소드 자동 설정 (기본: `GET`)
    const methodName = key.toLowerCase();
    const defaultMethod =
      options?.method ??
      (methodName.startsWith('create') || methodName.startsWith('register') || methodName.startsWith('login')
        ? 'POST'
        : methodName.startsWith('update')
          ? 'PATCH'
          : methodName.startsWith('delete')
            ? 'DELETE'
            : 'GET');

    const defaultRequestBody = options?.requestBody ?? zodToOpenAPI(schemas.Create);
    const defaultUpdateBody = options?.updateBody ?? zodToOpenAPI(schemas.Update);
    const defaultResponseSchema = options?.responseSchema ?? zodToOpenAPI(schemas.Response);

    // ✅ 인증 적용 여부 확인
    if (options?.authRequired) {
      if (options.authRequired === true || options.authRequired.includes('jwt')) {
        decorators.push(ApiBearerAuth()); // ✅ API 문서에 Bearer Token 인증 추가
        decorators.push(UseGuards(JwtAuthGuard));
      }
      if (Array.isArray(options.authRequired)) {
        if (options.authRequired.includes('google')) {
          decorators.push(UseGuards(GoogleAuthGuard));
        }
        if (options.authRequired.includes('github')) {
          decorators.push(UseGuards(GithubAuthGuard));
        }
      }
    }

    // ✅ 역할(Role)이 지정된 경우 `RoleGuard` 적용
    if (options?.role) {
      decorators.push(SetMetadata(MetaKey.USE_ROLE, options.role));
      decorators.push(SetMetadata(MetaKey.USE_ACCESS, RolePermissions[options.role]));
      decorators.push(UseGuards(RoleGuard));
    }

    // ✅ Swagger 문서화 적용
    decorators.push(
      ApiOperation({
        summary: options?.summary ?? `${controllerName} ${methodName}`,
        description: options?.description ?? `Executes a ${defaultMethod} request.`,
      })
    );

    // ✅ 요청 Body 추가 (POST, PATCH만 해당)
    if (defaultRequestBody && defaultMethod === 'POST') {
      decorators.push(ApiBody({ schema: defaultRequestBody }));
      decorators.push(UsePipes(new ZodValidationPipe(schemas.Create)));
    }
    if (defaultUpdateBody && defaultMethod === 'PATCH') {
      decorators.push(ApiBody({ schema: defaultUpdateBody }));
      decorators.push(UsePipes(new ZodValidationPipe(schemas.Update)));
    }

    // ✅ 성공 응답 처리
    if (defaultMethod === 'POST') {
      decorators.push(
        ApiCreatedResponse({
          description: '리소스가 생성됨',
          content: { 'application/json': { schema: defaultResponseSchema } },
        })
      );
    } else if (defaultMethod === 'DELETE') {
      decorators.push(HttpCode(204));
      decorators.push(ApiNoContentResponse({ description: '성공적으로 삭제됨' }));
    } else {
      decorators.push(
        ApiOkResponse({
          description: '요청 성공',
          content: { 'application/json': { schema: defaultResponseSchema } },
        })
      );
    }

    // ✅ 공통 에러 응답 추가
    decorators.push(
      ApiBadRequestResponse({
        description: '잘못된 요청',
        content: { 'application/json': { example: { statusCode: 400, message: 'Validation failed' } } },
      }),
      ApiUnauthorizedResponse({
        description: '인증 실패',
        content: { 'application/json': { example: { statusCode: 401, message: 'Unauthorized' } } },
      }),
      ApiForbiddenResponse({
        description: '권한 없음',
        content: { 'application/json': { example: { statusCode: 403, message: 'Access denied' } } },
      }),
      ApiNotFoundResponse({
        description: '리소스를 찾을 수 없음',
        content: { 'application/json': { example: { statusCode: 404, message: 'Resource not found' } } },
      }),
      ApiInternalServerErrorResponse({
        description: '서버 오류',
        content: { 'application/json': { example: { statusCode: 500, message: 'Internal server error' } } },
      })
    );

    // ✅ URL 파라미터 추가
    if (options?.params) {
      options.params.forEach((param) => {
        decorators.push(ApiParam({ name: param.name, description: param.description, example: param.example }));
      });
    }

    applyDecorators(...decorators)(target, key, descriptor);
    Reflect.defineMetadata('API_OPTIONS', options, target, key);
    return descriptor;
  };
}
