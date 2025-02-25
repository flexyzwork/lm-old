import { Controller, Post, Get, Patch, Param, Body, UseGuards, Delete } from '@nestjs/common';
import { ProposalsService } from './proposals.service';
import { CreateProposalDto, UpdateProposalDto } from '@packages/common/schemas';
import { JwtAuthGuard } from '@packages/common';

@Controller('proposals')
export class ProposalsController {
  constructor(private readonly proposalsService: ProposalsService) {}

  // ✅ 제안 생성
  @UseGuards(JwtAuthGuard)
  @Post()
  async createProposal(@Body() body: CreateProposalDto) {
    return this.proposalsService.createProposal(body);
  }

  // ✅ 특정 제안 조회
  @Get(':id')
  async getProposal(@Param('id') id: string) {
    return this.proposalsService.getProposal(id);
  }

  // ✅ 특정 프로젝트의 제안 목록 조회
  @Get('project/:projectId')
  async getProposalsByProject(@Param('projectId') projectId: string) {
    return this.proposalsService.getProposalsByProject(projectId);
  }

  // ✅ 특정 유저가 보낸 제안 목록
  @Get('sent/:userId')
  async getSentProposals(@Param('userId') userId: string) {
    return this.proposalsService.getSentProposals(userId);
  }

  // ✅ 특정 유저가 받은 제안 목록
  @Get('received/:userId')
  async getReceivedProposals(@Param('userId') userId: string) {
    return this.proposalsService.getReceivedProposals(userId);
  }

  // ✅ 제안 업데이트 (예: 상태 변경)
  @Patch(':id')
  async updateProposal(@Param('id') id: string, @Body() body: UpdateProposalDto) {
    return this.proposalsService.updateProposal(id, body);
  }

  // ✅ 제안 삭제
  @Delete(':id')
  async deleteProposal(@Param('id') id: string) {
    return this.proposalsService.deleteProposal(id);
  }
}
