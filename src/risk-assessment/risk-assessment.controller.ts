import {
  Controller,
  Get,
  Query,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomerDto } from './dto/customer.dto';
import { RiskSummaryDto } from './dto/risk-summary.dto';
import { DetailedRiskDto } from './dto/detailed-risk.dto';
import { CustomerFilterDto } from './dto/customer-filter.dto';
import { RiskAssessmentService } from './risk-assessment.service';

@ApiTags('Risk Assessment')
@Controller('risk-assessment')
export class RiskAssessmentController {
  constructor(private readonly riskAssessmentService: RiskAssessmentService) {}

  @Get('customers')
  @ApiOperation({ summary: 'Get filtered list of customers' })
  @ApiResponse({ status: 200, type: [CustomerDto] })
  getCustomers(@Query() filter: CustomerFilterDto): CustomerDto[] {
    return this.riskAssessmentService.getFilteredCustomers(filter);
  }

  @Get('risk-summary')
  @ApiOperation({ summary: 'Get risk summary for filtered customers' })
  @ApiResponse({ status: 200, type: RiskSummaryDto })
  async getRiskSummary(
    @Query() filter: CustomerFilterDto,
  ): Promise<RiskSummaryDto> {
    return this.riskAssessmentService.getRiskSummary(filter);
  }

  @Get('customer/:id/risk-assessment')
  @ApiOperation({ summary: 'Get detailed risk assessment for a customer' })
  @ApiResponse({ status: 200, type: DetailedRiskDto })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async getCustomerRiskAssessment(
    @Param('id') id: string,
  ): Promise<DetailedRiskDto> {
    try {
      return this.riskAssessmentService.getCustomerRiskAssessment(parseInt(id));
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
