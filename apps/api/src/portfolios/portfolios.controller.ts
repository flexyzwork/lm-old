import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PortfoliosService } from './portfolios.service';
import { schema } from '@packages/common';

import { z } from 'zod';
import { JwtAuthGuard } from '@packages/common';
import { InferSelectModel } from 'drizzle-orm';
import { FileInterceptor } from '@nestjs/platform-express';

const { createPortfolioSchema } = schema;
export const updatePortfolioSchema = createPortfolioSchema.partial();

type CreatePortfoliosDto = z.infer<typeof createPortfolioSchema>;
type UpdatePortfoliosDto = z.infer<typeof updatePortfolioSchema>;
export type PortfoliosEntity = InferSelectModel<typeof schema.portfolios>;

@Controller('portfolios')
export class PortfoliosController {
  constructor(private readonly portfoliosService: PortfoliosService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  async createPortfolios(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Req() req: any,
    @Body() body: CreatePortfoliosDto
  ): Promise<PortfoliosEntity> {
    const validatedData = createPortfolioSchema.parse({
      ...body,
      user_id: req.user.id,
    });
    return (await this.portfoliosService.createPortfolios(validatedData))[0];
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getPortfoliosByUserId(@Query('userId') userId: string): Promise<PortfoliosEntity[]> {
    return await this.portfoliosService.getPortfoliosByUserId(userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async getPortfolios(): Promise<PortfoliosEntity[]> {
    return await this.portfoliosService.getPortfolios();
  }

  @Get(':id')
  async getPortfolio(@Param('id') id: string): Promise<PortfoliosEntity | null> {
    return (await this.portfoliosService.getPortfolio(id)) || null;
  }

  // @Patch(':id')
  // @UseGuards(JwtAuthGuard)
  // async updatePortfolio(
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   @Req() req: any,
  //   @Param('id') id: string,
  //   @Body() body: UpdatePortfoliosDto
  // ): Promise<PortfoliosEntity | null> {
  //   console.log('body', body);
  //   const validatedData = updatePortfolioSchema.parse(body);
  //   console.log('validatedData', validatedData);
  //   return await this.portfoliosService.updatePortfolio(id, req.user.id, validatedData);
  // }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file')) // ✅ 파일 업로드 지원
  async updatePortfolio(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: UpdatePortfoliosDto,
    @UploadedFile() file: Express.Multer.File // ✅ 파일 업로드 처리
  ): Promise<PortfoliosEntity | null> {
    console.log('📌 받은 데이터:', body);
    console.log('📌 업로드된 파일:', file);

    const validatedData = updatePortfolioSchema.parse(body);

    // ✅ 파일이 업로드되었다면, 파일 경로 추가
    if (file) {
      validatedData.url = `/uploads/${file.filename}`;
    }

    return await this.portfoliosService.updatePortfolio(id, req.user.id, validatedData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deletePortfolio(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Req() req: any,
    @Param('id') id: string
  ): Promise<{ message: string }> {
    await this.portfoliosService.deletePortfolio(id, req.user.id);
    return { message: '포트폴리오가 삭제되었습니다.' };
  }
}
