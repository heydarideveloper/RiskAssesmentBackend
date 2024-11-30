import { Injectable } from '@nestjs/common';
import { CustomerDto, CustomerType } from '../dto/customer.dto';
import { RiskCalculator } from '../interfaces/risk-calculator.interface';

@Injectable()
export class ActivityRiskService implements RiskCalculator {
  private readonly highRiskOccupations = [
    'Money Exchange',
    'Jewelry Trading',
    'Real Estate',
    'Car Dealer',
  ];

  private readonly highRiskActivities = [
    'Cryptocurrency',
    'International Trade',
    'Precious Metals',
  ];

  calculateRisk(customer: CustomerDto): number {
    let riskScore = 0;

    // Base risk by customer type
    switch (customer.customerType) {
      case CustomerType.FOREIGN_INDIVIDUAL:
        riskScore += 3;
        break;
      case CustomerType.LEGAL_ENTITY:
        riskScore += 2;
        break;
      case CustomerType.IRANIAN_INDIVIDUAL:
        riskScore += 1;
        break;
    }

    // Occupation/Activity risk
    if (customer.customerType === CustomerType.LEGAL_ENTITY) {
      if (this.highRiskActivities.includes(customer.activityType)) {
        riskScore += 3;
      }
    } else {
      if (this.highRiskOccupations.includes(customer.occupation)) {
        riskScore += 3;
      }
    }

    // PEP status risk
    if (customer.isPEP) {
      riskScore += 4;
    }

    // Normalize score to 1-5 range
    return Math.min(Math.max(Math.round(riskScore / 2), 1), 5);
  }

  getWeightage(): number {
    return 0.35; // Activity risk contributes 35% to overall risk
  }
}
