import { Injectable } from '@nestjs/common';
import { RiskLevel } from '../enums/risk-level.enum';
import { CustomerType } from '../dto/customer.dto';

export interface DocumentRequirement {
  id: string;
  name: string;
  description: string;
  mandatory: boolean;
  applicableCustomerTypes: CustomerType[];
  applicableRiskLevels: RiskLevel[];
}

export interface CustomerDocument {
  id: string;
  customerId: string;
  requirementId: string;
  documentUrl: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  uploadDate: Date;
  verificationDate?: Date;
  verifiedBy?: string;
  expiryDate?: Date;
}

@Injectable()
export class DocumentationRequirementService {
  private readonly documentRequirements: DocumentRequirement[] = [
    {
      id: 'ID_VERIFICATION',
      name: 'Identity Verification',
      description: 'Official government-issued ID document',
      mandatory: true,
      applicableCustomerTypes: [
        CustomerType.IRANIAN_INDIVIDUAL,
        CustomerType.FOREIGN_INDIVIDUAL,
      ],
      applicableRiskLevels: [RiskLevel.LOW, RiskLevel.MEDIUM, RiskLevel.HIGH],
    },
    {
      id: 'COMPANY_REGISTRATION',
      name: 'Company Registration Documents',
      description: 'Official company registration and establishment documents',
      mandatory: true,
      applicableCustomerTypes: [CustomerType.LEGAL_ENTITY],
      applicableRiskLevels: [RiskLevel.LOW, RiskLevel.MEDIUM, RiskLevel.HIGH],
    },
    {
      id: 'INCOME_PROOF',
      name: 'Income Verification',
      description:
        'Documents proving declared income (tax returns, salary slips)',
      mandatory: true,
      applicableCustomerTypes: [
        CustomerType.IRANIAN_INDIVIDUAL,
        CustomerType.FOREIGN_INDIVIDUAL,
      ],
      applicableRiskLevels: [RiskLevel.MEDIUM, RiskLevel.HIGH],
    },
    {
      id: 'FINANCIAL_STATEMENTS',
      name: 'Financial Statements',
      description: 'Audited financial statements for the last fiscal year',
      mandatory: true,
      applicableCustomerTypes: [CustomerType.LEGAL_ENTITY],
      applicableRiskLevels: [RiskLevel.MEDIUM, RiskLevel.HIGH],
    },
    {
      id: 'SOURCE_OF_FUNDS',
      name: 'Source of Funds Documentation',
      description: 'Documentation proving the origin of funds',
      mandatory: true,
      applicableCustomerTypes: [
        CustomerType.IRANIAN_INDIVIDUAL,
        CustomerType.FOREIGN_INDIVIDUAL,
        CustomerType.LEGAL_ENTITY,
      ],
      applicableRiskLevels: [RiskLevel.HIGH],
    },
    {
      id: 'BENEFICIAL_OWNERSHIP',
      name: 'Beneficial Ownership Declaration',
      description: 'Declaration and documentation of beneficial owners',
      mandatory: true,
      applicableCustomerTypes: [CustomerType.LEGAL_ENTITY],
      applicableRiskLevels: [RiskLevel.MEDIUM, RiskLevel.HIGH],
    },
  ];

  private customerDocuments: CustomerDocument[] = [];

  getRequiredDocuments(
    customerType: CustomerType,
    riskLevel: RiskLevel,
  ): DocumentRequirement[] {
    return this.documentRequirements.filter(
      (req) =>
        req.applicableCustomerTypes.includes(customerType) &&
        req.applicableRiskLevels.includes(riskLevel),
    );
  }

  async uploadDocument(
    document: Omit<CustomerDocument, 'id' | 'status' | 'uploadDate'>,
  ): Promise<CustomerDocument> {
    const newDocument: CustomerDocument = {
      ...document,
      id: Date.now().toString(),
      status: 'PENDING',
      uploadDate: new Date(),
    };
    this.customerDocuments.push(newDocument);
    return newDocument;
  }

  async verifyDocument(
    documentId: string,
    status: 'APPROVED' | 'REJECTED',
    verifiedBy: string,
    expiryDate?: Date,
  ): Promise<boolean> {
    const document = this.customerDocuments.find(
      (doc) => doc.id === documentId,
    );
    if (!document) return false;

    document.status = status;
    document.verificationDate = new Date();
    document.verifiedBy = verifiedBy;
    document.expiryDate = expiryDate;

    return true;
  }

  getCustomerDocuments(customerId: string): CustomerDocument[] {
    return this.customerDocuments.filter(
      (doc) => doc.customerId === customerId,
    );
  }

  checkDocumentationCompliance(
    customerId: string,
    customerType: CustomerType,
    riskLevel: RiskLevel,
  ): {
    compliant: boolean;
    missingDocuments: DocumentRequirement[];
    expiredDocuments: CustomerDocument[];
  } {
    const requiredDocs = this.getRequiredDocuments(customerType, riskLevel);
    const customerDocs = this.getCustomerDocuments(customerId);

    const missingDocuments = requiredDocs.filter(
      (req) =>
        !customerDocs.some(
          (doc) =>
            doc.requirementId === req.id &&
            doc.status === 'APPROVED' &&
            (!doc.expiryDate || doc.expiryDate > new Date()),
        ),
    );

    const expiredDocuments = customerDocs.filter(
      (doc) => doc.expiryDate && doc.expiryDate <= new Date(),
    );

    return {
      compliant: missingDocuments.length === 0 && expiredDocuments.length === 0,
      missingDocuments,
      expiredDocuments,
    };
  }
}
