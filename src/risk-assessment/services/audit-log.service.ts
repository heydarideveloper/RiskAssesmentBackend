import { Injectable } from '@nestjs/common';
import { RiskLevel } from '../enums/risk-level.enum';

export interface AuditLog {
  id: string;
  timestamp: Date;
  customerId: string;
  action: string;
  category:
    | 'RISK_ASSESSMENT'
    | 'DOCUMENTATION'
    | 'VERIFICATION'
    | 'CONFIGURATION';
  oldValue?: any;
  newValue?: any;
  userId: string;
  ipAddress: string;
}

@Injectable()
export class AuditLogService {
  private auditLogs: AuditLog[] = [];

  async logAction(
    customerId: string,
    action: string,
    category: AuditLog['category'],
    userId: string,
    ipAddress: string,
    oldValue?: any,
    newValue?: any,
  ): Promise<AuditLog> {
    const log: AuditLog = {
      id: Date.now().toString(),
      timestamp: new Date(),
      customerId,
      action,
      category,
      oldValue,
      newValue,
      userId,
      ipAddress,
    };

    this.auditLogs.push(log);
    return log;
  }

  async logRiskChange(
    customerId: string,
    oldRisk: RiskLevel,
    newRisk: RiskLevel,
    userId: string,
    ipAddress: string,
  ): Promise<AuditLog> {
    return this.logAction(
      customerId,
      'RISK_LEVEL_CHANGE',
      'RISK_ASSESSMENT',
      userId,
      ipAddress,
      oldRisk,
      newRisk,
    );
  }

  getCustomerAuditTrail(customerId: string): AuditLog[] {
    return this.auditLogs
      .filter((log) => log.customerId === customerId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  getAuditLogsByCategory(
    category: AuditLog['category'],
    startDate?: Date,
    endDate?: Date,
  ): AuditLog[] {
    return this.auditLogs
      .filter((log) => {
        const matchesCategory = log.category === category;
        const matchesDateRange =
          (!startDate || log.timestamp >= startDate) &&
          (!endDate || log.timestamp <= endDate);
        return matchesCategory && matchesDateRange;
      })
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
}
