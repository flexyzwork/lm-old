import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { schema } from '@packages/common';
import { z } from 'zod';
import { JwtAuthGuard } from '@packages/common';
import { ContractsService } from './contracts.service';

const { createContractSchema } = schema;

type CreateContractDto = z.infer<typeof createContractSchema>;

@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createContract(@Body() body: CreateContractDto) {
    const parsedBody = createContractSchema.parse(body);
    return this.contractsService.create(parsedBody);
  }
}
