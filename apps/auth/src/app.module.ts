import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { Logger } from '@packages/common';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
  ],
  controllers: [],
  providers: [Logger],
  exports: [Logger],
})
export class AppModule {}
