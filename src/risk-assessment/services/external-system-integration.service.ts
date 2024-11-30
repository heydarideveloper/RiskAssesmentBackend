import { Injectable, Logger } from '@nestjs/common';
import { CustomerType } from '../dto/customer.dto';
import {
  ExternalSystemIntegration,
  ExternalSystemResponse,
  NationalIDVerification,
  CompanyRegistrationInfo,
  SanctionsCheckResult,
} from '../interfaces/external-system.interface';

@Injectable()
export class ExternalSystemIntegrationService
  implements ExternalSystemIntegration
{
  private readonly logger = new Logger(ExternalSystemIntegrationService.name);

  async verifyNationalID(
    id: string,
    type: CustomerType,
  ): Promise<ExternalSystemResponse<NationalIDVerification>> {
    try {
      // In real implementation, this would make an HTTP call to the national ID verification system
      this.logger.log(`Verifying national ID: ${id} for type: ${type}`);

      // Mock implementation
      const isValid = id.length === 10 && /^\d+$/.test(id);

      return {
        success: true,
        data: {
          isValid,
          fullName: isValid ? 'Mock Name' : undefined,
          dateOfBirth: isValid ? new Date('1990-01-01') : undefined,
          fatherName: isValid ? 'Mock Father Name' : undefined,
          isAlive: isValid,
        },
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error(`Error verifying national ID: ${error.message}`);
      return {
        success: false,
        error: error.message,
        timestamp: new Date(),
      };
    }
  }

  async checkCompanyRegistration(
    registrationNumber: string,
  ): Promise<ExternalSystemResponse<CompanyRegistrationInfo>> {
    try {
      // Mock implementation
      const isValid =
        registrationNumber.length === 11 && /^\d+$/.test(registrationNumber);

      return {
        success: true,
        data: {
          registrationNumber,
          companyName: 'Mock Company Ltd.',
          registrationDate: new Date('2020-01-01'),
          status: 'ACTIVE',
          directors: ['Director 1', 'Director 2'],
          shareholders: [
            { name: 'Shareholder 1', percentage: 60 },
            { name: 'Shareholder 2', percentage: 40 },
          ],
        },
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error(
        `Error checking company registration: ${error.message}`,
      );
      return {
        success: false,
        error: error.message,
        timestamp: new Date(),
      };
    }
  }

  async checkSanctions(
    identifier: string,
    type: CustomerType,
  ): Promise<ExternalSystemResponse<SanctionsCheckResult>> {
    try {
      // Mock implementation
      const isListed = false; // In real implementation, this would check against sanctions databases

      return {
        success: true,
        data: {
          isListed,
          listName: isListed ? 'Mock Sanctions List' : undefined,
          listingDate: isListed ? new Date() : undefined,
          reason: isListed ? 'Mock Reason' : undefined,
          restrictions: isListed
            ? ['TRANSACTION_BLOCKED', 'ACCOUNT_FROZEN']
            : undefined,
        },
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error(`Error checking sanctions: ${error.message}`);
      return {
        success: false,
        error: error.message,
        timestamp: new Date(),
      };
    }
  }
}
