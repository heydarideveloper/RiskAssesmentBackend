import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RiskAssessmentService } from '../risk-assessment.service';
import { NotificationService, NotificationType } from './notification.service';
import { CustomerDto } from '../dto/customer.dto';
import { RiskLevel } from '../enums/risk-level.enum';

interface RiskAssessmentResult {
  customerId: number;
  previousRiskLevel: RiskLevel;
  newRiskLevel: RiskLevel;
  requiresReview: boolean;
  factors: string[];
}

@Injectable()
export class ScheduledRiskAssessmentService {
  private readonly logger = new Logger(ScheduledRiskAssessmentService.name);

  constructor(
    private readonly riskAssessmentService: RiskAssessmentService,
    private readonly notificationService: NotificationService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async runDailyRiskAssessment() {
    try {
      this.logger.log('Starting daily risk assessment...');

      const customers = await this.getCustomersForAssessment();

      for (const customer of customers) {
        const result = await this.assessCustomerRisk(customer);

        if (result.requiresReview) {
          await this.notificationService.createNotification(
            NotificationType.REVIEW_REQUIRED,
            customer,
            'Customer requires risk review',
            {
              previousRiskLevel: result.previousRiskLevel,
              newRiskLevel: result.newRiskLevel,
              factors: result.factors,
            },
          );
        }
      }

      this.logger.log('Daily risk assessment completed');
    } catch (error) {
      this.logger.error('Error in daily risk assessment', error.stack);
      throw error;
    }
  }

  private async getCustomersForAssessment(): Promise<CustomerDto[]> {
    // Implementation would typically involve database query
    return [];
  }

  private async assessCustomerRisk(
    customer: CustomerDto,
  ): Promise<RiskAssessmentResult> {
    const previousRiskLevel = customer.riskLevel;
    const assessment =
      await this.riskAssessmentService.getCustomerRiskAssessment(customer.id);

    return {
      customerId: customer.id,
      previousRiskLevel,
      newRiskLevel: assessment.overallRiskLevel,
      requiresReview: assessment.overallRiskLevel > previousRiskLevel,
      factors: assessment.riskFactors,
    };
  }
}
