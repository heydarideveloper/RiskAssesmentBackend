import { CustomerType } from '../dto/customer.dto';

export interface ExternalSystemResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

export interface NationalIDVerification {
  isValid: boolean;
  fullName?: string;
  dateOfBirth?: Date;
  fatherName?: string;
  isAlive: boolean;
}

export interface CompanyRegistrationInfo {
  registrationNumber: string;
  companyName: string;
  registrationDate: Date;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  directors: string[];
  shareholders: Array<{
    name: string;
    percentage: number;
  }>;
}

export interface SanctionsCheckResult {
  isListed: boolean;
  listName?: string;
  listingDate?: Date;
  reason?: string;
  restrictions?: string[];
}

export interface ExternalSystemIntegration {
  verifyNationalID(
    id: string,
    type: CustomerType,
  ): Promise<ExternalSystemResponse<NationalIDVerification>>;
  checkCompanyRegistration(
    registrationNumber: string,
  ): Promise<ExternalSystemResponse<CompanyRegistrationInfo>>;
  checkSanctions(
    identifier: string,
    type: CustomerType,
  ): Promise<ExternalSystemResponse<SanctionsCheckResult>>;
}
