import { Injectable } from '@nestjs/common';
import { CustomerDto, CustomerType } from '../dto/customer.dto';
import { RiskCalculator } from '../interfaces/risk-calculator.interface';

@Injectable()
export class FinancialRiskService implements RiskCalculator {
  private readonly monthlyIncomeThresholds = {
    individual: {
      low: 5000,
      medium: 15000,
      high: 30000,
    },
    legal: {
      low: 50000,
      medium: 150000,
      high: 300000,
    },
  };

  calculateRisk(customer: CustomerDto): number {
    let riskScore = 0;
    const thresholds =
      customer.customerType === CustomerType.LEGAL_ENTITY
        ? this.monthlyIncomeThresholds.legal
        : this.monthlyIncomeThresholds.individual;

    // Income level risk
    if (customer.monthlyIncome > thresholds.high) {
      riskScore += 5;
    } else if (customer.monthlyIncome > thresholds.medium) {
      riskScore += 3;
    } else if (customer.monthlyIncome > thresholds.low) {
      riskScore += 2;
    } else {
      riskScore += 1;
    }

    // Additional risk factors could be added here
    // such as transaction patterns, cash transactions, etc.

    return Math.min(Math.max(riskScore, 1), 5);
  }

  getWeightage(): number {
    return 0.35; // Financial risk contributes 35% to overall risk
  }
}
