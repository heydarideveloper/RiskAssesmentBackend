import { Injectable } from '@nestjs/common';
import { CustomerDto } from '../dto/customer.dto';
import { RelationshipRiskService } from './relationship-risk.service';
import { RiskParameterConfigService } from './risk-parameter-config.service';
import { RiskLevel } from '../enums/risk-level.enum';

@Injectable()
export class RiskCalculationAggregatorService {
  constructor(
    private readonly relationshipRiskService: RelationshipRiskService,
    private readonly riskParameterConfigService: RiskParameterConfigService,
  ) {}

  async calculateCustomerRisk(
    customer: CustomerDto,
    source: string,
    assessmentType: string,
  ) {
    const relationshipRisk = this.relationshipRiskService.assessRelationshipRisk(customer);
    
    return {
      overallRisk: RiskLevel.LOW,
      components: {
        relationshipRisk,
        geographicRisk: RiskLevel.LOW,
        businessRisk: RiskLevel.LOW,
        financialRisk: RiskLevel.LOW,
        transactionRisk: RiskLevel.LOW,
      },
      factors: [],
    };
  }

  private mapRiskLevelString(risk: string): RiskLevel {
    switch (risk.toUpperCase()) {
      case 'HIGH':
        return RiskLevel.HIGH;
      case 'MEDIUM':
        return RiskLevel.MEDIUM;
      default:
        return RiskLevel.LOW;
    }
  }
}
