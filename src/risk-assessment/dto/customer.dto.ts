import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsString,
  IsBoolean,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { RiskLevel } from '../enums/risk-level.enum';

export enum CustomerType {
  IRANIAN_INDIVIDUAL = 'IRANIAN_INDIVIDUAL',
  FOREIGN_INDIVIDUAL = 'FOREIGN_INDIVIDUAL',
  LEGAL_ENTITY = 'LEGAL_ENTITY',
}

export class CustomerDto {
  @ApiProperty({ example: 1, description: 'Customer ID' })
  id: number;

  @ApiPropertyOptional({ example: 'John Doe', description: 'Customer name' })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'ACME Corp', description: 'Company name' })
  @IsOptional()
  companyName?: string;

  @ApiProperty({ description: 'Unique identity ID' })
  identityUniqueId: string;

  @ApiProperty({ enum: CustomerType, example: CustomerType.IRANIAN_INDIVIDUAL })
  customerType: CustomerType;

  @ApiProperty({ enum: RiskLevel, example: RiskLevel.LOW })
  riskLevel: RiskLevel;

  @ApiProperty({ example: 'Iran', description: 'Nationality of the customer' })
  nationality: string;

  @ApiProperty({ example: 'Tehran', description: 'Place of birth' })
  birthPlace: string;

  @ApiProperty({ example: 'Tehran', description: 'Legal residence' })
  legalResidence: string;

  @ApiPropertyOptional({ example: 'Doctor', description: 'Customer occupation' })
  @IsOptional()
  occupation?: string;

  @ApiPropertyOptional({ example: 'Healthcare', description: 'Type of activity' })
  @IsOptional()
  activityType?: string;

  @ApiPropertyOptional({ example: 50000, description: 'Monthly income' })
  @IsOptional()
  monthlyIncome?: number;

  @ApiPropertyOptional({ example: false, description: 'Is politically exposed person' })
  @IsOptional()
  isPEP?: boolean;
}
