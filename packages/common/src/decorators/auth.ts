import {
  applyDecorators,
  // SetMetadata,
  UseGuards,
} from '@nestjs/common/decorators';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards';
// import { JwtAuthGuard } from '../../auth/guards';
// import { RolesGuard } from '../guard/roles.quard';
// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

export function Auth(/* ...roles: string[] */) {
  return applyDecorators(
    // SetMetadata('roles', roles),
    UseGuards(JwtAuthGuard /*, RolesGuard */),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
