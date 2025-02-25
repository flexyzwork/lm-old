// 아직 제대로 적용 안 함
// 일단 컨셉만 저장

// import { CanActivate, ExecutionContext, Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
// import { ResourceService } from '../services/resource.service';
// import { Role } from '@packages/common';
// import { MetaKey } from '../decorators/api.decorators';
// import { Reflector } from '@nestjs/core';

// @Injectable()
// export class OwnerGuard implements CanActivate {
//   constructor(
//     private reflector: Reflector,
//     private resourceService: ResourceService // ✅ 리소스 서비스에서 동적 매핑
//   ) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const requireOwner = this.reflector.get<boolean>(MetaKey.REQUIRE_OWNER, context.getHandler());
//     const request = context.switchToHttp().getRequest();
//     const user = request.user;
//     const resourceId = request.params.id; // 리소스 ID
//     const resourceType = request.route.path.split('/')[1]; // ✅ URL에서 리소스 타입 자동 추출

//     if (!user || !resourceId || !resourceType) {
//       throw new ForbiddenException('잘못된 요청입니다.');
//     }

//     // ✅ 기본 사용자(DEFAULT)는 수정 및 삭제 불가
//     if (user.role === Role.DEFAULT && ['PATCH', 'DELETE'].includes(request.method.toUpperCase())) {
//       throw new ForbiddenException('기본 사용자는 수정 및 삭제할 수 없습니다.');
//     }

//     // ✅ 리소스 서비스 찾기
//     const service = this.resourceService.getService(resourceType);
//     if (!service) {
//       throw new BadRequestException('잘못된 리소스 유형입니다.');
//     }

//     // ✅ 사용자가 소유자인지 검증
//     const isOwner = await service.isOwner(user.id, resourceId);
//     if (!isOwner) {
//       throw new ForbiddenException('이 리소스에 대한 소유권이 없습니다.');
//     }

//     return true;
//   }
// }