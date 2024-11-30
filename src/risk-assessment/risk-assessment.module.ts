import { Module } from '@nestjs/common';
import { RiskAssessmentController } from './risk-assessment.controller';
import { RiskAssessmentService } from './risk-assessment.service';
import { TransactionMonitoringService } from './services/transaction-monitoring.service';
import { RiskCalculationAggregatorService } from './services/risk-calculation-aggregator.service';
import { AuditLogService } from './services/audit-log.service';
import { RelationshipRiskService } from './services/relationship-risk.service';
import { RiskParameterConfigService } from './services/risk-parameter-config.service';

@Module({
  controllers: [RiskAssessmentController],
  providers: [
    RiskAssessmentService,
    TransactionMonitoringService,
    RiskCalculationAggregatorService,
    AuditLogService,
    RelationshipRiskService,
    RiskParameterConfigService,
  ],
})
export class RiskAssessmentModule {}
