import { ApiProperty } from '@nestjs/swagger';

export class RiskSummaryDto {
  @ApiProperty()
  totalCustomers: number;

  @ApiProperty()
  lowRiskCount: number;

  @ApiProperty()
  normalRiskCount: number;

  @ApiProperty()
  highRiskCount: number;

  @ApiProperty()
  lowRiskPercentage: number;

  @ApiProperty()
  normalRiskPercentage: number;

  @ApiProperty()
  highRiskPercentage: number;
}
