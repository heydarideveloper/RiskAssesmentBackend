import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission } from '../interfaces/user-management.interface';
import { UserManagementService } from '../services/user-management.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userManagementService: UserManagementService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.get<Permission>(
      'permission',
      context.getHandler(),
    );

    if (!requiredPermission) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;
    const sessionId = request.session?.id;

    if (!userId || !sessionId) {
      return false;
    }

    return this.userManagementService.validatePermission(
      userId,
      sessionId,
      requiredPermission,
    );
  }
}
