import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty({ enum: CustomerType })
  @IsEnum(CustomerType)
  customerType: CustomerType;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  companyName?: string;

  @ApiProperty()
  @IsString()
  identityUniqueId: string;

  @ApiProperty()
  @IsString()
  nationality: string;

  @ApiProperty()
  @IsString()
  birthPlace: string;

  @ApiProperty()
  @IsString()
  legalResidence: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  occupation?: string;

  @ApiProperty()
  @IsBoolean()
  isPEP: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  activityType?: string;

  @ApiProperty()
  @IsNumber()
  monthlyIncome: number;

  @ApiProperty({ enum: RiskLevel })
  @IsEnum(RiskLevel)
  riskLevel: RiskLevel;
}
