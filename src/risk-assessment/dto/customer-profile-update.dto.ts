import { ApiProperty } from '@nestjs/swagger';
import { CustomerType } from './customer.dto';
import {
  IsEnum,
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  ValidateIf,
} from 'class-validator';

export class CustomerProfileUpdateDto {
  @ApiProperty({ enum: CustomerType })
  @IsEnum(CustomerType)
  customerType: CustomerType;

  @ApiProperty({ required: false })
  @IsString()
  @ValidateIf((o) => o.customerType !== CustomerType.LEGAL_ENTITY)
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @ValidateIf((o) => o.customerType === CustomerType.LEGAL_ENTITY)
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
}
