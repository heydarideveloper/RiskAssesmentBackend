import { Injectable, Logger } from '@nestjs/common';
import { RiskLevel } from '../enums/risk-level.enum';
import { RiskParameterConfigService } from './risk-parameter-config.service';

export interface OccupationRiskConfig {
  occupation: string;
  baseRiskLevel: RiskLevel;
  riskFactors: string[];
  industryCategory: string;
  requiresEnhancedDueDiligence: boolean;
}

@Injectable()
export class OccupationRiskService {
  private readonly logger = new Logger(OccupationRiskService.name);
  private occupationConfigs: Map<string, OccupationRiskConfig> = new Map();

  constructor(
    private readonly riskParameterConfig: RiskParameterConfigService,
  ) {
    this.initializeOccupationConfigs();
  }

  async calculateOccupationRisk(
    occupation: string,
    monthlyIncome: number,
  ): Promise<{
    riskLevel: RiskLevel;
    riskScore: number;
    riskFactors: string[];
  }> {
    try {
      const config = await this.getOccupationConfig(occupation);
      const incomeRiskFactor = await this.calculateIncomeRiskFactor(
        occupation,
        monthlyIncome,
      );

      const baseRiskScore = this.getBaseRiskScore(config.baseRiskLevel);
      const finalRiskScore = baseRiskScore * (1 + incomeRiskFactor);

      return {
        riskLevel: this.determineRiskLevel(finalRiskScore),
        riskScore: finalRiskScore,
        riskFactors: config.riskFactors,
      };
    } catch (error) {
      this.logger.error(
        `Error calculating occupation risk for ${occupation}`,
        error.stack,
      );
      throw error;
    }
  }

  private async getOccupationConfig(
    occupation: string,
  ): Promise<OccupationRiskConfig> {
    const config = this.occupationConfigs.get(occupation.toLowerCase());
    if (!config) {
      return this.getDefaultConfig();
    }
    return config;
  }

  private async calculateIncomeRiskFactor(
    occupation: string,
    monthlyIncome: number,
  ): Promise<number> {
    const avgIncome = await this.getAverageIncome(occupation);
    const deviation = Math.abs(monthlyIncome - avgIncome) / avgIncome;

    if (deviation > 2) return 0.5; // High risk factor
    if (deviation > 1) return 0.3; // Medium risk factor
    return 0; // Normal risk factor
  }

  private getBaseRiskScore(riskLevel: RiskLevel): number {
    switch (riskLevel) {
      case RiskLevel.HIGH:
        return 0.8;
      case RiskLevel.MEDIUM:
        return 0.5;
      case RiskLevel.LOW:
        return 0.2;
      default:
        return 0.5;
    }
  }

  private determineRiskLevel(riskScore: number): RiskLevel {
    if (riskScore >= 0.7) return RiskLevel.HIGH;
    if (riskScore >= 0.4) return RiskLevel.MEDIUM;
    return RiskLevel.LOW;
  }

  private async getAverageIncome(occupation: string): Promise<number> {
    // In real implementation, fetch from database or external service
    return 50000;
  }

  private getDefaultConfig(): OccupationRiskConfig {
    return {
      occupation: 'DEFAULT',
      baseRiskLevel: RiskLevel.MEDIUM,
      riskFactors: ['UNKNOWN_OCCUPATION'],
      industryCategory: 'UNKNOWN',
      requiresEnhancedDueDiligence: true,
    };
  }

  private initializeOccupationConfigs(): void {
    // Initialize with some example configurations
    const configs: OccupationRiskConfig[] = [
      {
        occupation: 'politician',
        baseRiskLevel: RiskLevel.HIGH,
        riskFactors: ['PEP', 'HIGH_PUBLIC_EXPOSURE'],
        industryCategory: 'GOVERNMENT',
        requiresEnhancedDueDiligence: true,
      },
      // Add more occupation configs...
    ];

    configs.forEach((config) => {
      this.occupationConfigs.set(config.occupation.toLowerCase(), config);
    });
  }
}
