import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { CommonService } from './common.service';

// 🎯 JWT 인증 모듈
@Global()
@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRESIN'),
        },
      }),
    }),
  ],
  providers: [JwtStrategy, JwtService, Reflector, CommonService],
  exports: [JwtStrategy, JwtService, Reflector, JwtModule, CommonService],
})
export class CommonModule {}
