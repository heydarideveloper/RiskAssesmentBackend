import { ApiProperty } from '@nestjs/swagger';

export class RiskSummaryDto {
  @ApiProperty({ example: 100, description: 'Total number of customers' })
  totalCustomers: number;

  @ApiProperty({ example: 30, description: 'Number of low risk customers' })
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
