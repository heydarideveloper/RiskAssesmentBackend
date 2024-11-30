import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { RiskAssessmentController } from './controllers/risk-assessment.controller';
import { CustomerProfileController } from './controllers/customer-profile.controller';
import { ReportingController } from './controllers/reporting.controller';
import { UserManagementController } from './controllers/user-management.controller';
import { AuthMiddleware } from './middleware/auth.middleware';
import { RiskAssessmentService } from './risk-assessment.service';
import { RiskCalculationAggregatorService } from './services/risk-calculation-aggregator.service';
import { DocumentationRequirementService } from './services/documentation-requirement.service';
import { ExternalSystemIntegrationService } from './services/external-system-integration.service';
import { AuditLogService } from './services/audit-log.service';
import { ScheduledRiskAssessmentService } from './services/scheduled-risk-assessment.service';
import { GeographicRiskService } from './services/geographic-risk.service';
import { ActivityRiskService } from './services/activity-risk.service';
import { IncomeRiskService } from './services/income-risk.service';
import { TransactionReportService } from './services/transaction-report.service';
import { RelationshipRiskService } from './services/relationship-risk.service';
import { FinancialRiskService } from './services/financial-risk.service';
import { TransactionMonitoringService } from './services/transaction-monitoring.service';
import { NotificationService } from './services/notification.service';
import { RiskParameterConfigService } from './services/risk-parameter-config.service';
import { UserManagementService } from './services/user-management.service';
import { HighRiskAreasService } from './services/high-risk-areas.service';
import { SanctionsListService } from './services/sanctions-list.service';
import { ReportingService } from './services/reporting.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [
    RiskAssessmentController,
    CustomerProfileController,
    ReportingController,
    UserManagementController,
  ],
  providers: [
    RiskAssessmentService,
    RiskCalculationAggregatorService,
    DocumentationRequirementService,
    ExternalSystemIntegrationService,
    AuditLogService,
    ScheduledRiskAssessmentService,
    GeographicRiskService,
    ActivityRiskService,
    IncomeRiskService,
    TransactionReportService,
    RelationshipRiskService,
    FinancialRiskService,
    TransactionMonitoringService,
    NotificationService,
    RiskParameterConfigService,
    UserManagementService,
    HighRiskAreasService,
    SanctionsListService,
    ReportingService,
  ],
})
export class RiskAssessmentModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
