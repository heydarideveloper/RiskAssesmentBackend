export enum UserRole {
  ADMIN = 'ADMIN',
  RISK_OFFICER = 'RISK_OFFICER',
  COMPLIANCE_OFFICER = 'COMPLIANCE_OFFICER',
  RELATIONSHIP_MANAGER = 'RELATIONSHIP_MANAGER',
  AUDITOR = 'AUDITOR',
}

export enum Permission {
  // Customer Management
  VIEW_CUSTOMER = 'VIEW_CUSTOMER',
  CREATE_CUSTOMER = 'CREATE_CUSTOMER',
  UPDATE_CUSTOMER = 'UPDATE_CUSTOMER',

  // Risk Assessment
  VIEW_RISK_ASSESSMENT = 'VIEW_RISK_ASSESSMENT',
  PERFORM_RISK_ASSESSMENT = 'PERFORM_RISK_ASSESSMENT',
  OVERRIDE_RISK_RATING = 'OVERRIDE_RISK_RATING',

  // Document Management
  VIEW_DOCUMENTS = 'VIEW_DOCUMENTS',
  UPLOAD_DOCUMENTS = 'UPLOAD_DOCUMENTS',
  VERIFY_DOCUMENTS = 'VERIFY_DOCUMENTS',

  // Reporting
  VIEW_REPORTS = 'VIEW_REPORTS',
  GENERATE_REPORTS = 'GENERATE_REPORTS',

  // Configuration
  MANAGE_RISK_PARAMETERS = 'MANAGE_RISK_PARAMETERS',
  MANAGE_USERS = 'MANAGE_USERS',
  MANAGE_SYSTEM_CONFIG = 'MANAGE_SYSTEM_CONFIG',
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  department: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSession {
  id: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  loginTime: Date;
  lastActivityTime: Date;
  isActive: boolean;
}
