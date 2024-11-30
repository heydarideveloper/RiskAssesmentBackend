import { Injectable, Logger } from '@nestjs/common';
import { CustomerDto } from '../dto/customer.dto';
import { RiskLevel } from '../enums/risk-level.enum';

interface RelationshipRiskFactor {
  factor: string;
  weight: number;
  threshold: number;
}

@Injectable()
export class RelationshipRiskService {
  private readonly logger = new Logger(RelationshipRiskService.name);

  private readonly riskFactors: RelationshipRiskFactor[] = [
    { factor: 'accountAge', weight: 0.3, threshold: 365 }, // days
    { factor: 'transactionVolume', weight: 0.3, threshold: 1000000 },
    { factor: 'productUsage', weight: 0.2, threshold: 3 },
    { factor: 'serviceHistory', weight: 0.2, threshold: 5 },
  ];

  async calculateRelationshipRisk(customer: CustomerDto): Promise<number> {
    try {
      const relationshipMetrics = await this.getRelationshipMetrics(
        customer.id,
      );
      let totalRiskScore = 0;

      for (const factor of this.riskFactors) {
        const metricValue = relationshipMetrics[factor.factor];
        const factorScore = this.calculateFactorScore(
          metricValue,
          factor.threshold,
        );
        totalRiskScore += factorScore * factor.weight;
      }

      return this.normalizeRiskScore(totalRiskScore);
    } catch (error) {
      this.logger.error(
        `Error calculating relationship risk for customer ${customer.id}`,
        error.stack,
      );
      throw error;
    }
  }

  private async getRelationshipMetrics(
    customerId: number,
  ): Promise<Record<string, number>> {
    // In a real implementation, this would fetch data from a database
    return {
      accountAge: 180,
      transactionVolume: 500000,
      productUsage: 2,
      serviceHistory: 4,
    };
  }

  private calculateFactorScore(value: number, threshold: number): number {
    return Math.min(value / threshold, 1);
  }

  private normalizeRiskScore(score: number): number {
    return Math.min(Math.max(score, 0), 1);
  }
}
