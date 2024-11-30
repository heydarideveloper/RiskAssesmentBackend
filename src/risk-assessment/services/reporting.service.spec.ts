import { Test, TestingModule } from '@nestjs/testing';
import { ReportingService } from './reporting.service';
import { BadRequestException } from '@nestjs/common';
import { RiskLevel } from '../enums/risk-level.enum';

describe('ReportingService', () => {
  let service: ReportingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportingService],
    }).compile();

    service = module.get<ReportingService>();
  });

  describe('generateRiskReport', () => {
    it('should generate a valid risk report', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-03-31');
      const generatedBy = 'test-user';

      const report = await service.generateRiskReport(
        startDate,
        endDate,
        generatedBy,
      );

      expect(report).toBeDefined();
      expect(report.period.startDate).toEqual(startDate);
      expect(report.period.endDate).toEqual(endDate);
      expect(report.metadata.generatedBy).toBe(generatedBy);
      expect(report.summary.riskDistribution[RiskLevel.HIGH]).toBeDefined();
    });

    it('should throw error for invalid date range', async () => {
      const startDate = new Date('2024-03-31');
      const endDate = new Date('2024-01-01');
      const generatedBy = 'test-user';

      await expect(
        service.generateRiskReport(startDate, endDate, generatedBy),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('generateComplianceReport', () => {
    it('should generate a valid compliance report', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-03-31');
      const generatedBy = 'test-user';

      const report = await service.generateComplianceReport(
        startDate,
        endDate,
        generatedBy,
      );

      expect(report).toBeDefined();
      expect(report.period.startDate).toEqual(startDate);
      expect(report.period.endDate).toEqual(endDate);
      expect(report.metadata.generatedBy).toBe(generatedBy);
      expect(report.details.criticalFindings).toBeInstanceOf(Array);
    });

    it('should throw error for date range exceeding one year', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2025-02-01');
      const generatedBy = 'test-user';

      await expect(
        service.generateComplianceReport(startDate, endDate, generatedBy),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
