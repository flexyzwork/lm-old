import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { DatabaseModule } from '@packages/common';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import { CommonModule } from '@packages/common';
import { AppController } from './app.controller';
import { PortfoliosModule } from './portfolios/portfolios.module';
import { ProjectsModule } from './projects/projects.module';
import { ContractsModule } from './contracts/contracts.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    CommonModule,
    ProductsModule,
    PostsModule,
    PortfoliosModule,
    ProjectsModule,
    ContractsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
