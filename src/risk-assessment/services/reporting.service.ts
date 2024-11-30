import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { RiskLevel } from '../enums/risk-level.enum';

export interface ReportPeriod {
  startDate: Date;
  endDate: Date;
}

export interface RiskDistribution {
  [RiskLevel.LOW]: number;
  [RiskLevel.MEDIUM]: number;
  [RiskLevel.HIGH]: number;
}

export interface RiskReport {
  period: ReportPeriod;
  summary: {
    totalCustomers: number;
    riskDistribution: RiskDistribution;
    changeFromPreviousPeriod: number;
  };
  details: {
    newHighRiskCustomers: number;
    escalatedRiskLevels: number;
    deescalatedRiskLevels: number;
    averageRiskScore: number;
    topRiskFactors: string[];
  };
  metadata: {
    generatedAt: Date;
    generatedBy: string;
    reportId: string;
  };
}

export interface ComplianceReport {
  period: ReportPeriod;
  summary: {
    totalChecks: number;
    passedChecks: number;
    failedChecks: number;
    complianceRate: number;
  };
  details: {
    documentationIssues: number;
    verificationFailures: number;
    pendingActions: number;
    criticalFindings: string[];
  };
  metadata: {
    generatedAt: Date;
    generatedBy: string;
    reportId: string;
  };
}

@Injectable()
export class ReportingService {
  private readonly logger = new Logger(ReportingService.name);

  async generateRiskReport(
    startDate: Date,
    endDate: Date,
    generatedBy: string,
  ): Promise<RiskReport> {
    try {
      this.validateDateRange(startDate, endDate);

      const report: RiskReport = {
        period: { startDate, endDate },
        summary: {
          totalCustomers: 1000,
          riskDistribution: {
            [RiskLevel.LOW]: 600,
            [RiskLevel.MEDIUM]: 300,
            [RiskLevel.HIGH]: 100,
          },
          changeFromPreviousPeriod: 0.05,
        },
        details: {
          newHighRiskCustomers: 10,
          escalatedRiskLevels: 15,
          deescalatedRiskLevels: 5,
          averageRiskScore: 0.45,
          topRiskFactors: [
            'PEP_STATUS',
            'HIGH_RISK_COUNTRY',
            'LARGE_TRANSACTIONS',
          ],
        },
        metadata: {
          generatedAt: new Date(),
          generatedBy,
          reportId: this.generateReportId('RISK'),
        },
      };

      await this.logReportGeneration('RISK', report.metadata.reportId);
      return report;
    } catch (error) {
      this.logger.error('Error generating risk report', error.stack);
      throw error;
    }
  }

  async generateComplianceReport(
    startDate: Date,
    endDate: Date,
    generatedBy: string,
  ): Promise<ComplianceReport> {
    try {
      this.validateDateRange(startDate, endDate);

      const report: ComplianceReport = {
        period: { startDate, endDate },
        summary: {
          totalChecks: 1000,
          passedChecks: 950,
          failedChecks: 50,
          complianceRate: 0.95,
        },
        details: {
          documentationIssues: 30,
          verificationFailures: 15,
          pendingActions: 5,
          criticalFindings: [
            'Missing KYC Documentation',
            'Incomplete Risk Assessment',
            'Overdue Reviews',
          ],
        },
        metadata: {
          generatedAt: new Date(),
          generatedBy,
          reportId: this.generateReportId('COMPLIANCE'),
        },
      };

      await this.logReportGeneration('COMPLIANCE', report.metadata.reportId);
      return report;
    } catch (error) {
      this.logger.error('Error generating compliance report', error.stack);
      throw error;
    }
  }

  private validateDateRange(startDate: Date, endDate: Date): void {
    if (!startDate || !endDate) {
      throw new BadRequestException('Start date and end date are required');
    }

    if (startDate >= endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    const maxRange = 366; // Maximum one year range
    const daysDiff = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysDiff > maxRange) {
      throw new BadRequestException('Date range cannot exceed one year');
    }
  }

  private generateReportId(type: 'RISK' | 'COMPLIANCE'): string {
    const timestamp = new Date().getTime();
    const random = Math.random().toString(36).substring(2, 8);
    return `${type}-${timestamp}-${random}`;
  }

  private async logReportGeneration(
    type: 'RISK' | 'COMPLIANCE',
    reportId: string,
  ): Promise<void> {
    this.logger.log(`Generated ${type} report with ID: ${reportId}`);
  }
}
