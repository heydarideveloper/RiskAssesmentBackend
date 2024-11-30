import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsString, IsOptional } from 'class-validator';
import { RiskLevel } from '../enums/risk-level.enum';
import { CustomerType } from './customer.dto';

export class CustomerFilterDto {
  @ApiPropertyOptional({
    description: 'Filter by name',
    example: 'John',
    type: String
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filter by risk level',
    enum: RiskLevel,
    example: RiskLevel.HIGH
  })
  @IsOptional()
  @IsEnum(RiskLevel)
  riskLevel?: RiskLevel;

  @ApiPropertyOptional({
    description: 'Filter by customer type',
    enum: CustomerType,
    example: CustomerType.IRANIAN_INDIVIDUAL
  })
  @IsOptional()
  @IsEnum(CustomerType)
  customerType?: CustomerType;

  @ApiPropertyOptional({
    description: 'Filter by company name (for organizational customers)',
    example: 'ACME Corp',
    type: String
  })
  @IsOptional()
  @IsString()
  companyName?: string;
}
