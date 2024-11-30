import { ApiProperty } from '@nestjs/swagger';
import { RiskLevel } from '../enums/risk-level.enum';

export class DetailedRiskDto {
  @ApiProperty()
  customerId: number;

  @ApiProperty({ enum: RiskLevel })
  overallRiskLevel: RiskLevel;

  @ApiProperty()
  geographicRisk: number;

  @ApiProperty()
  customerTypeRisk: number;

  @ApiProperty()
  activityRisk: number;

  @ApiProperty()
  transactionRisk: number;

  @ApiProperty()
  pepStatus: boolean;

  @ApiProperty({ type: [String] })
  riskFactors: string[];

  @ApiProperty()
  lastAssessmentDate: Date;

  @ApiProperty()
  requiredDueDiligence: string;
}
