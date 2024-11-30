import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { RiskLevel } from '../enums/risk-level.enum';

interface TransactionReport {
  id: string;
  customerId: number;
  reportType: 'STR' | 'CTR';
  status: 'DRAFT' | 'SUBMITTED' | 'ACCEPTED' | 'REJECTED';
  details: {
    transactionId: string;
    amount: number;
    currency: string;
    date: Date;
    suspicionIndicators?: string[];
    riskLevel: RiskLevel;
  };
  submissionDate?: Date;
  submittedBy?: string;
  comments?: string[];
}

@Injectable()
export class TransactionReportService {
  private readonly logger = new Logger(TransactionReportService.name);
  private reports: Map<string, TransactionReport> = new Map();

  async createReport(
    customerId: number,
    reportType: 'STR' | 'CTR',
    details: Omit<TransactionReport['details'], 'riskLevel'>,
    riskLevel: RiskLevel,
  ): Promise<TransactionReport> {
    try {
      const report: TransactionReport = {
        id: this.generateReportId(),
        customerId,
        reportType,
        status: 'DRAFT',
        details: {
          ...details,
          riskLevel,
        },
        comments: [],
      };

      this.reports.set(report.id, report);
      await this.logReportCreation(report);

      return report;
    } catch (error) {
      this.logger.error('Error creating transaction report', error.stack);
      throw error;
    }
  }

  async submitReport(
    reportId: string,
    submittedBy: string,
    comments?: string,
  ): Promise<TransactionReport> {
    const report = this.reports.get(reportId);
    if (!report) {
      throw new NotFoundException(`Report ${reportId} not found`);
    }

    try {
      const updatedReport = {
        ...report,
        status: 'SUBMITTED' as const,
        submissionDate: new Date(),
        submittedBy,
        comments: comments
          ? [...(report.comments || []), comments]
          : report.comments,
      };

      this.reports.set(reportId, updatedReport);
      await this.logReportSubmission(updatedReport);

      return updatedReport;
    } catch (error) {
      this.logger.error(`Error submitting report ${reportId}`, error.stack);
      throw error;
    }
  }

  async getCustomerReports(
    customerId: number,
    startDate?: Date,
    endDate?: Date,
  ): Promise<TransactionReport[]> {
    try {
      const customerReports = Array.from(this.reports.values())
        .filter((report) => report.customerId === customerId)
        .filter((report) => {
          if (!startDate && !endDate) return true;
          const reportDate = report.submissionDate || new Date();
          if (startDate && reportDate < startDate) return false;
          if (endDate && reportDate > endDate) return false;
          return true;
        });

      return customerReports;
    } catch (error) {
      this.logger.error(
        `Error fetching reports for customer ${customerId}`,
        error.stack,
      );
      throw error;
    }
  }

  private generateReportId(): string {
    return `REP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private async logReportCreation(report: TransactionReport): Promise<void> {
    this.logger.log(
      `Created ${report.reportType} report ${report.id} for customer ${report.customerId}`,
    );
  }

  private async logReportSubmission(report: TransactionReport): Promise<void> {
    this.logger.log(
      `Submitted ${report.reportType} report ${report.id} for customer ${report.customerId}`,
    );
  }
}
