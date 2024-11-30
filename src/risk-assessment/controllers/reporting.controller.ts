import {
  Controller,
  Get,
  Query,
  UseGuards,
  BadRequestException,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ReportingService } from '../services/reporting.service';
import { RiskReport, ComplianceReport } from '../services/reporting.service';
import { ParseDatePipe } from '../pipes/parse-date.pipe';

@ApiTags('Reporting')
@Controller('reports')
export class ReportingController {
  constructor(private readonly reportingService: ReportingService) {}

  @Get('risk')
  @ApiOperation({ summary: 'Generate risk assessment report' })
  @ApiResponse({
    status: 200,
    description: 'Risk report generated successfully',
  })
  @ApiQuery({ name: 'startDate', required: true, type: String })
  @ApiQuery({ name: 'endDate', required: true, type: String })
  async generateRiskReport(
    @Query('startDate', ParseDatePipe) startDate: Date,
    @Query('endDate', ParseDatePipe) endDate: Date,
    @Request() req,
  ): Promise<RiskReport> {
    if (startDate >= endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    return this.reportingService.generateRiskReport(
      startDate,
      endDate,
      req.user?.username || 'SYSTEM',
    );
  }

  @Get('compliance')
  @ApiOperation({ summary: 'Generate compliance report' })
  @ApiResponse({
    status: 200,
    description: 'Compliance report generated successfully',
  })
  @ApiQuery({ name: 'startDate', required: true, type: String })
  @ApiQuery({ name: 'endDate', required: true, type: String })
  async generateComplianceReport(
    @Query('startDate', ParseDatePipe) startDate: Date,
    @Query('endDate', ParseDatePipe) endDate: Date,
    @Request() req,
  ): Promise<ComplianceReport> {
    if (startDate >= endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    return this.reportingService.generateComplianceReport(
      startDate,
      endDate,
      req.user?.username || 'SYSTEM',
    );
  }
}
