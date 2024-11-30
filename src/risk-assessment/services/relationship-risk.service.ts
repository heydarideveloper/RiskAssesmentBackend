import { Injectable } from '@nestjs/common';
import { CustomerDto, CustomerType } from '../dto/customer.dto';
import { RiskLevel } from '../enums/risk-level.enum';

@Injectable()
export class RelationshipRiskService {
  assessRelationshipRisk(customer: CustomerDto): string {
    // Basic implementation
    if (customer.customerType === CustomerType.FOREIGN_INDIVIDUAL) {
      return RiskLevel.HIGH;
    }
    return RiskLevel.LOW;
  }
}
