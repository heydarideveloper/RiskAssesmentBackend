import {
  Controller,
  Get,
  Query,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { Public } from '../decorators/public.decorator';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { CustomerDto } from './dto/customer.dto';
import { RiskSummaryDto } from './dto/risk-summary.dto';
import { DetailedRiskDto } from './dto/detailed-risk.dto';
import { CustomerFilterDto } from './dto/customer-filter.dto';
import { RiskAssessmentService } from './risk-assessment.service';
import { ApiCustomerFilter } from '../decorators/customer-filter.decorator';

@ApiTags('Risk Assessment')
@Controller('risk-assessment')
export class RiskAssessmentController {
  constructor(private readonly riskAssessmentService: RiskAssessmentService) {}

  @Public()
  @Get('customers')
  @ApiOperation({
    summary: 'Get filtered list of customers',
    description: 'Returns a list of customers based on filter criteria',
  })
  @ApiResponse({
    status: 200,
    description: 'List of customers retrieved successfully',
    type: [CustomerDto],
  })
  @ApiCustomerFilter()
  async getCustomers(
    @Query() filter: CustomerFilterDto,
  ): Promise<CustomerDto[]> {
    return this.riskAssessmentService.getFilteredCustomers(filter);
  }

  @Public()
  @Get('risk-summary')
  @ApiOperation({
    summary: 'Get risk summary for filtered customers',
    description: 'Returns a summary of risk assessments for filtered customers',
  })
  @ApiResponse({
    status: 200,
    description: 'Risk summary retrieved successfully',
    type: RiskSummaryDto,
  })
  @ApiCustomerFilter()
  async getRiskSummary(
    @Query() filter: CustomerFilterDto,
  ): Promise<RiskSummaryDto> {
    return this.riskAssessmentService.getRiskSummary(filter);
  }

  @Public()
  @Get('customer/:id/risk-assessment')
  @ApiOperation({
    summary: 'Get detailed risk assessment for a customer',
    description:
      'Returns detailed risk assessment information for a specific customer',
  })
  @ApiResponse({
    status: 200,
    description: 'Detailed risk assessment retrieved successfully',
    type: DetailedRiskDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Customer not found',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Customer ID',
    required: true,
  })
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
