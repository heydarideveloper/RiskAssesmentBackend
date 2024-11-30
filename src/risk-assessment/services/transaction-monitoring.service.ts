import { Injectable } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';

@Injectable()
export class TransactionMonitoringService {
  constructor(private readonly auditLogService: AuditLogService) {}

  async monitorTransaction(data: any) {
    await this.auditLogService.logAudit('Monitor Transaction', data);
    // Implementation
  }
}
