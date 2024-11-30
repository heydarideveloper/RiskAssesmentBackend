import { ApiProperty } from '@nestjs/swagger';
import { CustomerType } from './customer.dto';
import { RiskLevel } from '../enums/risk-level.enum';

export class CustomerFilterDto {
  @ApiProperty({ enum: CustomerType, required: false })
  customerType?: CustomerType;

  @ApiProperty({ required: false })
  nationality?: string;

  @ApiProperty({ enum: RiskLevel, required: false })
  riskLevel?: RiskLevel;
}
