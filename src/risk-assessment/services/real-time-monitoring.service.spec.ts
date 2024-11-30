import { Test, TestingModule } from '@nestjs/testing';
import { RealTimeMonitoringService } from './real-time-monitoring.service';
import { AuditLogService } from './audit-log.service';
import { CustomerDto, CustomerType } from '../dto/customer.dto';
import { RiskLevel } from '../enums/risk-level.enum';

describe('RealTimeMonitoringService', () => {
  let service: RealTimeMonitoringService;
  let auditLogService: AuditLogService;

  const mockCustomer: CustomerDto = {
    id: 1,
    customerType: CustomerType.IRANIAN_INDIVIDUAL,
    name: 'Test Customer',
    identityUniqueId: '1234567890',
    nationality: 'IR',
    birthPlace: 'Tehran',
    legalResidence: 'Tehran',
    isPEP: false,
    monthlyIncome: 50000,
    riskLevel: RiskLevel.LOW,
  };

  const mockAuditLogService = {
    logAction: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RealTimeMonitoringService,
        {
          provide: AuditLogService,
          useValue: mockAuditLogService,
        },
      ],
    }).compile();

    service = module.get<RealTimeMonitoringService>(RealTimeMonitoringService);
    auditLogService = module.get<AuditLogService>(AuditLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('monitorCustomerActivity', () => {
    const createActivityData = (amount: number) => ({
      amount,
      type: 'TRANSFER',
      timestamp: new Date(),
      currency: 'USD',
    });

    it('should detect large transactions', async () => {
      const activityData = createActivityData(150000);

      const alerts = await service.monitorCustomerActivity(
        mockCustomer,
        'TRANSACTION',
        activityData,
      );

      expect(alerts).toHaveLength(1);
      expect(alerts[0].alertType).toBe('LARGE_TRANSACTION');
      expect(alerts[0].severity).toBe('MEDIUM');
      expect(alerts[0].customerId).toBe(mockCustomer.id);
    });

    it('should not generate alerts for normal transactions', async () => {
      const activityData = createActivityData(5000);

      const alerts = await service.monitorCustomerActivity(
        mockCustomer,
        'TRANSACTION',
        activityData,
      );

      expect(alerts).toHaveLength(0);
    });

    it('should log alerts when suspicious activity is detected', async () => {
      const activityData = createActivityData(150000);

      await service.monitorCustomerActivity(
        mockCustomer,
        'TRANSACTION',
        activityData,
      );

      expect(auditLogService.logAction).toHaveBeenCalledWith(
        expect.any(String),
        'ALERT_GENERATED',
        'RISK_ASSESSMENT',
        'SYSTEM',
        expect.any(String),
      );
    });

    it('should handle errors gracefully', async () => {
      const activityData = null;

      await expect(
        service.monitorCustomerActivity(
          mockCustomer,
          'TRANSACTION',
          activityData,
        ),
      ).rejects.toThrow();
    });
  });
});
