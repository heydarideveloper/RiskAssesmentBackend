import { ApiProperty } from '@nestjs/swagger';
import { RiskLevel } from '../enums/risk-level.enum';

export class DetailedRiskDto {
  @ApiProperty({ example: 1, description: 'Customer ID' })
  customerId: number;

  @ApiProperty({ enum: RiskLevel, example: RiskLevel.LOW })
  overallRiskLevel: RiskLevel;

  @ApiProperty({ example: 'LOW', description: 'Geographic risk assessment' })
  geographicRisk: string;

  @ApiProperty({ example: 'MEDIUM', description: 'Customer type risk assessment' })
  customerTypeRisk: string;

  @ApiProperty({ example: 'HIGH', description: 'Activity risk assessment' })
  activityRisk: string;

  @ApiProperty({ example: 'LOW', description: 'Financial risk assessment' })
  financialRisk: string;

  @ApiProperty({ example: 'MEDIUM', description: 'Transaction risk assessment' })
  transactionRisk: string;

  @ApiProperty({ type: [String], description: 'Risk factors identified' })
  riskFactors: string[];

  @ApiProperty({ example: false, description: 'PEP status' })
  pepStatus: boolean;

  @ApiProperty({ 
    example: '2024-03-20', 
    description: 'Date of the risk assessment',
    type: Date 
  })
  assessmentDate: Date;

  @ApiProperty({ 
    example: 'Enhanced Due Diligence', 
    description: 'Required due diligence level based on risk assessment',
    enum: ['Simplified Due Diligence', 'Standard Due Diligence', 'Enhanced Due Diligence']
  })
  requiredDueDiligence: string;
}
