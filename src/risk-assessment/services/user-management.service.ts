import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import {
  User,
  UserRole,
  Permission,
  UserSession,
} from '../interfaces/user-management.interface';
import { AuditLogService } from './audit-log.service';

@Injectable()
export class UserManagementService {
  private readonly logger = new Logger(UserManagementService.name);
  private users: Map<string, User> = new Map();
  private sessions: Map<string, UserSession> = new Map();

  constructor(private readonly auditLogService: AuditLogService) {
    this.initializeDefaultUsers();
  }

  private initializeDefaultUsers() {
    // Add default admin user
    const adminUser: User = {
      id: '1',
      username: 'admin',
      email: 'admin@example.com',
      role: UserRole.ADMIN,
      permissions: Object.values(Permission),
      department: 'Administration',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(adminUser.id, adminUser);
  }

  async createUser(userData: Partial<User>, createdBy: string): Promise<User> {
    const user: User = {
      id: Date.now().toString(),
      username: userData.username,
      email: userData.email,
      role: userData.role,
      permissions: this.getDefaultPermissionsForRole(userData.role),
      department: userData.department,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.set(user.id, user);

    await this.auditLogService.logAction(
      user.id,
      'USER_CREATED',
      'CONFIGURATION',
      createdBy,
      'SYSTEM',
    );

    return user;
  }

  async updateUser(
    userId: string,
    updates: Partial<User>,
    updatedBy: string,
  ): Promise<User> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = {
      ...user,
      ...updates,
      updatedAt: new Date(),
    };

    this.users.set(userId, updatedUser);

    await this.auditLogService.logAction(
      userId,
      'USER_UPDATED',
      'CONFIGURATION',
      updatedBy,
      'SYSTEM',
    );

    return updatedUser;
  }

  async deactivateUser(userId: string, deactivatedBy: string): Promise<void> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.isActive = false;
    user.updatedAt = new Date();

    // Invalidate all active sessions
    this.invalidateUserSessions(userId);

    await this.auditLogService.logAction(
      userId,
      'USER_DEACTIVATED',
      'CONFIGURATION',
      deactivatedBy,
      'SYSTEM',
    );
  }

  async createSession(
    userId: string,
    ipAddress: string,
    userAgent: string,
  ): Promise<UserSession> {
    const user = this.users.get(userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid or inactive user');
    }

    const session: UserSession = {
      id: Date.now().toString(),
      userId,
      ipAddress,
      userAgent,
      loginTime: new Date(),
      lastActivityTime: new Date(),
      isActive: true,
    };

    this.sessions.set(session.id, session);
    return session;
  }

  async validatePermission(
    userId: string,
    sessionId: string,
    requiredPermission: Permission,
  ): Promise<boolean> {
    const user = this.users.get(userId);
    const session = this.sessions.get(sessionId);

    if (!user || !session || !session.isActive || !user.isActive) {
      return false;
    }

    // Update last activity time
    session.lastActivityTime = new Date();

    return user.permissions.includes(requiredPermission);
  }

  private getDefaultPermissionsForRole(role: UserRole): Permission[] {
    switch (role) {
      case UserRole.ADMIN:
        return Object.values(Permission);

      case UserRole.RISK_OFFICER:
        return [
          Permission.VIEW_CUSTOMER,
          Permission.VIEW_RISK_ASSESSMENT,
          Permission.PERFORM_RISK_ASSESSMENT,
          Permission.VIEW_DOCUMENTS,
          Permission.VERIFY_DOCUMENTS,
          Permission.VIEW_REPORTS,
          Permission.GENERATE_REPORTS,
        ];

      case UserRole.COMPLIANCE_OFFICER:
        return [
          Permission.VIEW_CUSTOMER,
          Permission.VIEW_RISK_ASSESSMENT,
          Permission.VIEW_DOCUMENTS,
          Permission.VERIFY_DOCUMENTS,
          Permission.VIEW_REPORTS,
          Permission.GENERATE_REPORTS,
        ];

      case UserRole.RELATIONSHIP_MANAGER:
        return [
          Permission.VIEW_CUSTOMER,
          Permission.CREATE_CUSTOMER,
          Permission.UPDATE_CUSTOMER,
          Permission.VIEW_DOCUMENTS,
          Permission.UPLOAD_DOCUMENTS,
        ];

      case UserRole.AUDITOR:
        return [
          Permission.VIEW_CUSTOMER,
          Permission.VIEW_RISK_ASSESSMENT,
          Permission.VIEW_DOCUMENTS,
          Permission.VIEW_REPORTS,
        ];

      default:
        return [];
    }
  }

  private invalidateUserSessions(userId: string): void {
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.userId === userId) {
        session.isActive = false;
      }
    }
  }

  async getSession(sessionId: string): Promise<UserSession | undefined> {
    return this.sessions.get(sessionId);
  }

  async invalidateSession(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.isActive = false;
      this.sessions.set(sessionId, session);
    }
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
}
