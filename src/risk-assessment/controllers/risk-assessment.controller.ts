import {
  Controller,
  Get,
  Query,
  Param,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomerDto } from '../dto/customer.dto';
import { RiskSummaryDto } from '../dto/risk-summary.dto';
import { DetailedRiskDto } from '../dto/detailed-risk.dto';
import { CustomerFilterDto } from '../dto/customer-filter.dto';
import { RiskAssessmentService } from '../risk-assessment.service';

@ApiTags('Risk Assessment')
@Controller('risk-assessment')
export class RiskAssessmentController {
  private readonly logger = new Logger(RiskAssessmentController.name);

  constructor(private readonly riskAssessmentService: RiskAssessmentService) {}

  @Get('customers')
  @ApiOperation({ summary: 'Get filtered list of customers' })
  @ApiResponse({ status: 200, type: [CustomerDto] })
  getCustomers(@Query() filter: CustomerFilterDto): CustomerDto[] {
    return this.riskAssessmentService.getFilteredCustomers(filter);
  }

  @Get('risk-summary')
  @ApiOperation({ summary: 'Get risk summary for filtered customers' })
  @ApiResponse({
    status: 200,
    type: RiskSummaryDto,
    description: 'Risk summary retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Risk summary not found',
  })
  async getRiskSummary(
    @Query() filter: CustomerFilterDto,
  ): Promise<RiskSummaryDto> {
    try {
      const summary = await this.riskAssessmentService.getRiskSummary(filter);
      if (!summary) {
        throw new NotFoundException('Risk summary not found');
      }
      return summary;
    } catch (error) {
      this.logger.error('Error getting risk summary', error.stack);
      throw error;
    }
  }

  @Get('customer/:id/risk-assessment')
  @ApiOperation({ summary: 'Get detailed risk assessment for a customer' })
  @ApiResponse({
    status: 200,
    type: DetailedRiskDto,
    description: 'Risk assessment retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Customer not found',
  })
  async getCustomerRiskAssessment(
    @Param('id') id: string,
  ): Promise<DetailedRiskDto> {
    try {
      const customerId = parseInt(id, 10);
      if (isNaN(customerId)) {
        throw new NotFoundException('Invalid customer ID');
      }

      const assessment =
        await this.riskAssessmentService.getCustomerRiskAssessment(customerId);

      if (!assessment) {
        throw new NotFoundException(
          `Customer risk assessment not found for ID: ${id}`,
        );
      }

      return assessment;
    } catch (error) {
      this.logger.error(
        `Error getting risk assessment for customer ${id}`,
        error.stack,
      );
      throw error;
    }
  }
}
