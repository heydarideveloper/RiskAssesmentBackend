import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CustomerProfileUpdateDto } from '../dto/customer-profile-update.dto';
import { DocumentUploadDto } from '../dto/document-upload.dto';
import { CustomerDto } from '../dto/customer.dto';
import { RiskCalculationAggregatorService } from '../services/risk-calculation-aggregator.service';
import { DocumentationRequirementService } from '../services/documentation-requirement.service';
import { ExternalSystemIntegrationService } from '../services/external-system-integration.service';
import { AuditLogService } from '../services/audit-log.service';
import { RiskLevel } from '../enums/risk-level.enum';

@ApiTags('Customer Profile Management')
@ApiBearerAuth()
@Controller('customer-profile')
export class CustomerProfileController {
  private readonly logger = new Logger(CustomerProfileController.name);

  constructor(
    private readonly riskCalculator: RiskCalculationAggregatorService,
    private readonly documentationService: DocumentationRequirementService,
    private readonly externalSystemService: ExternalSystemIntegrationService,
    private readonly auditLogService: AuditLogService,
  ) {}

  @Put(':id')
  @ApiOperation({ summary: 'Update customer profile' })
  @ApiResponse({
    status: 200,
    type: CustomerDto,
    description: 'Profile updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or verification failed',
  })
  async updateProfile(
    @Param('id') id: string,
    @Body() updateDto: CustomerProfileUpdateDto,
  ): Promise<CustomerDto> {
    try {
      await this.verifyCustomerIdentity(updateDto);

      // Create updated customer object
      const updatedCustomer: CustomerDto = {
        id: parseInt(id),
        ...updateDto,
        riskLevel: RiskLevel.LOW, // Default risk level, will be updated by risk calculator
      };

      // Calculate risk for updated profile
      const riskAssessment = await this.riskCalculator.calculateCustomerRisk(
        updatedCustomer,
        'SYSTEM',
        'PROFILE_UPDATE',
      );

      // Update the customer's risk level based on assessment
      updatedCustomer.riskLevel = riskAssessment.overallRisk;

      await this.auditLogService.logAction(
        id,
        'PROFILE_UPDATE',
        'DOCUMENTATION',
        'SYSTEM',
        'API_REQUEST',
      );

      return updatedCustomer;
    } catch (error) {
      this.logger.error(
        `Failed to update profile for customer ${id}`,
        error.stack,
      );
      throw error;
    }
  }

  private async verifyCustomerIdentity(
    updateDto: CustomerProfileUpdateDto,
  ): Promise<void> {
    if (updateDto.customerType !== 'LEGAL_ENTITY') {
      const idVerification = await this.externalSystemService.verifyNationalID(
        updateDto.identityUniqueId,
        updateDto.customerType,
      );
      if (!idVerification.success || !idVerification.data?.isValid) {
        throw new BadRequestException('Invalid national ID');
      }
    } else {
      const companyVerification =
        await this.externalSystemService.checkCompanyRegistration(
          updateDto.identityUniqueId,
        );
      if (
        !companyVerification.success ||
        companyVerification.data?.status !== 'ACTIVE'
      ) {
        throw new BadRequestException('Invalid company registration');
      }
    }
  }

  @Post(':id/documents')
  @ApiOperation({ summary: 'Upload customer document' })
  async uploadDocument(
    @Param('id') id: string,
    @Body() documentDto: DocumentUploadDto,
  ) {
    const document = await this.documentationService.uploadDocument({
      customerId: id,
      requirementId: documentDto.requirementId,
      documentUrl: documentDto.documentUrl,
      expiryDate: documentDto.expiryDate
        ? new Date(documentDto.expiryDate)
        : undefined,
    });

    await this.auditLogService.logAction(
      id,
      'DOCUMENT_UPLOAD',
      'DOCUMENTATION',
      'SYSTEM',
      'API_REQUEST',
    );

    return document;
  }

  @Get(':id/documents')
  @ApiOperation({ summary: 'Get customer documents' })
  async getDocuments(@Param('id') id: string) {
    return this.documentationService.getCustomerDocuments(id);
  }
}
