import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { RiskLevel } from '../risk-assessment/enums/risk-level.enum';
import { CustomerType } from '../risk-assessment/dto/customer.dto';

export function ApiCustomerFilter() {
  return applyDecorators(
    ApiQuery({
      name: 'name',
      required: false,
      type: String,
      description: 'Filter by name',
      example: 'John',
    }),
    ApiQuery({
      name: 'riskLevel',
      required: false,
      enum: RiskLevel,
      description: 'Filter by risk level',
      example: RiskLevel.HIGH,
    }),
    ApiQuery({
      name: 'customerType',
      required: false,
      enum: CustomerType,
      description: 'Filter by customer type',
      example: CustomerType.IRANIAN_INDIVIDUAL,
    }),
    ApiQuery({
      name: 'companyName',
      required: false,
      type: String,
      description: 'Filter by company name (for organizational customers)',
      example: 'ACME Corp',
    }),
  );
} 