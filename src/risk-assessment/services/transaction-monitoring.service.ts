import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { RiskLevel } from '../enums/risk-level.enum';
import { AuditLogService } from './audit-log.service';

export enum TransactionType {
  TRANSFER = 'TRANSFER',
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  PAYMENT = 'PAYMENT',
}

export interface Transaction {
  id: string;
  customerId: number;
  amount: number;
  currency: string;
  type: TransactionType;
  timestamp: Date;
  counterparty?: string;
  country?: string;
}

export interface TransactionPattern {
  id: string;
  name: string;
  description: string;
  riskLevel: RiskLevel;
  conditions: {
    timeWindow: number; // hours
    minAmount?: number;
    maxAmount?: number;
    frequency?: number;
    countries?: string[];
  };
}

@Injectable()
export class TransactionMonitoringService {
  private readonly logger = new Logger(TransactionMonitoringService.name);

  private readonly patterns: TransactionPattern[] = [
    {
      id: 'LARGE_SINGLE',
      name: 'Large Single Transaction',
      description: 'Single transaction exceeding threshold',
      riskLevel: RiskLevel.HIGH,
      conditions: {
        timeWindow: 24,
        minAmount: 100000,
      },
    },
    {
      id: 'HIGH_FREQUENCY',
      name: 'High Frequency Trading',
      description: 'Multiple transactions in short period',
      riskLevel: RiskLevel.MEDIUM,
      conditions: {
        timeWindow: 1,
        frequency: 10,
      },
    },
  ];

  constructor(private readonly auditLogService: AuditLogService) {}

  async monitorTransaction(transaction: Transaction): Promise<void> {
    try {
      if (!this.validateTransaction(transaction)) {
        throw new BadRequestException('Invalid transaction data');
      }

      const matchedPatterns = await this.detectPatterns(transaction);

      if (matchedPatterns.length > 0) {
        await this.handleSuspiciousActivity(transaction, matchedPatterns);
      }

      await this.updateCustomerRiskProfile(transaction);
    } catch (error) {
      this.logger.error(
        `Error monitoring transaction ${transaction.id}`,
        error.stack,
      );
      throw error;
    }
  }

  private validateTransaction(transaction: Transaction): boolean {
    return (
      transaction &&
      typeof transaction.amount === 'number' &&
      transaction.amount > 0 &&
      Object.values(TransactionType).includes(transaction.type)
    );
  }

  private async detectPatterns(
    transaction: Transaction,
  ): Promise<TransactionPattern[]> {
    const matchedPatterns: TransactionPattern[] = [];

    for (const pattern of this.patterns) {
      if (await this.matchesPattern(transaction, pattern)) {
        matchedPatterns.push(pattern);
      }
    }

    return matchedPatterns;
  }

  private async matchesPattern(
    transaction: Transaction,
    pattern: TransactionPattern,
  ): Promise<boolean> {
    const { conditions } = pattern;

    if (conditions.minAmount && transaction.amount < conditions.minAmount) {
      return false;
    }

    if (conditions.maxAmount && transaction.amount > conditions.maxAmount) {
      return false;
    }

    if (conditions.countries && transaction.country) {
      if (!conditions.countries.includes(transaction.country)) {
        return false;
      }
    }

    if (conditions.frequency) {
      const recentTransactions = await this.getRecentTransactions(
        transaction.customerId,
        conditions.timeWindow,
      );
      if (recentTransactions.length < conditions.frequency) {
        return false;
      }
    }

    return true;
  }

  private async getRecentTransactions(
    customerId: number,
    hours: number,
  ): Promise<Transaction[]> {
    // In real implementation, fetch from database
    return [];
  }

  private async handleSuspiciousActivity(
    transaction: Transaction,
    patterns: TransactionPattern[],
  ): Promise<void> {
    for (const pattern of patterns) {
      await this.auditLogService.logAction(
        transaction.customerId.toString(),
        'SUSPICIOUS_ACTIVITY',
        'RISK_ASSESSMENT',
        'SYSTEM',
        `Matched pattern: ${pattern.name}`,
      );
    }
  }

  private async updateCustomerRiskProfile(
    transaction: Transaction,
  ): Promise<void> {
    // Implement risk profile update logic
  }
}
