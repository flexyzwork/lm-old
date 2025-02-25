import { Injectable } from '@nestjs/common';
// import { ProjectsService } from '../../projects/projects.service';
// import { ContractsService } from '../../contracts/contracts.service';
import { OwnerCheckService } from '../interfaces/owner-check.service';
import { PortfoliosService } from '../../portfolios/portfolios.service';

@Injectable()
export class ResourceService {
  private readonly resourceServiceMap: Record<string, OwnerCheckService>;

  constructor(
    private readonly portfoliosService: PortfoliosService

    // private readonly projectsService: ProjectsService,
    // private readonly contractsService: ContractsService
  ) {
    this.resourceServiceMap = {
      portfolios: this.portfoliosService,
      //   projects: this.projectsService,
      //   contracts: this.contractsService
    };
  }

  /**
   * ✅ 동적으로 리소스 서비스 찾기
   */
  getService(resourceType: string): OwnerCheckService | null {
    return this.resourceServiceMap[resourceType] || null;
  }
}
