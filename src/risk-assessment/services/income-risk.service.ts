import { Injectable } from '@nestjs/common';
import { CustomerType } from '../dto/customer.dto';

export interface IncomeThreshold {
  threshold: number;
  riskLevel: number;
  requiresDocumentation: boolean;
}

@Injectable()
export class IncomeRiskService {
  private readonly individualIncomeThresholds: IncomeThreshold[] = [
    { threshold: 100_000_000, riskLevel: 1, requiresDocumentation: false }, // Up to 100M
    { threshold: 200_000_000, riskLevel: 1, requiresDocumentation: false }, // 100M to 200M
    { threshold: 300_000_000, riskLevel: 2, requiresDocumentation: true }, // 200M to 300M
    { threshold: 500_000_000, riskLevel: 3, requiresDocumentation: true }, // 300M to 500M
    { threshold: 1_000_000_000, riskLevel: 4, requiresDocumentation: true }, // 500M to 1B
    { threshold: 2_000_000_000, riskLevel: 4, requiresDocumentation: true }, // 1B to 2B
    { threshold: 5_000_000_000, riskLevel: 5, requiresDocumentation: true }, // 2B to 5B
    { threshold: Infinity, riskLevel: 5, requiresDocumentation: true }, // Above 5B
  ];

  private readonly entityRevenueThresholds: IncomeThreshold[] = [
    { threshold: 500_000_000, riskLevel: 1, requiresDocumentation: false }, // Up to 500M
    { threshold: 1_000_000_000, riskLevel: 1, requiresDocumentation: false }, // 500M to 1B
    { threshold: 2_000_000_000, riskLevel: 1, requiresDocumentation: true }, // 1B to 2B
    { threshold: 5_000_000_000, riskLevel: 2, requiresDocumentation: true }, // 2B to 5B
    { threshold: 10_000_000_000, riskLevel: 3, requiresDocumentation: true }, // 5B to 10B
    { threshold: 20_000_000_000, riskLevel: 3, requiresDocumentation: true }, // 10B to 20B
    { threshold: 50_000_000_000, riskLevel: 3, requiresDocumentation: true }, // 20B to 50B
    { threshold: 100_000_000_000, riskLevel: 4, requiresDocumentation: true }, // 50B to 100B
    { threshold: Infinity, riskLevel: 5, requiresDocumentation: true }, // Above 100B
  ];

  calculateIncomeRisk(
    amount: number,
    customerType: CustomerType,
  ): {
    riskLevel: number;
    requiresDocumentation: boolean;
  } {
    const thresholds =
      customerType === CustomerType.LEGAL_ENTITY
        ? this.entityRevenueThresholds
        : this.individualIncomeThresholds;

    const assessment =
      thresholds.find((t) => amount <= t.threshold) ||
      thresholds[thresholds.length - 1];

    return {
      riskLevel: assessment.riskLevel,
      requiresDocumentation: assessment.requiresDocumentation,
    };
  }

  calculateExpectedAnnualActivity(
    monthlyAmount: number,
    customerType: CustomerType,
  ): number {
    const multiplier = customerType === CustomerType.LEGAL_ENTITY ? 6 : 4;
    return monthlyAmount * multiplier * 12;
  }

  getActivityRiskLevel(annualAmount: number): number {
    if (annualAmount <= 5_000_000_000) return 1; // Up to 5B
    if (annualAmount <= 50_000_000_000) return 2; // 5B to 50B
    if (annualAmount <= 300_000_000_000) return 3; // 50B to 300B
    return 5; // Above 300B
  }
}
