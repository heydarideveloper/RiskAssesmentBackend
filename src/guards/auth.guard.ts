import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Allow Swagger UI access
    const request = context.switchToHttp().getRequest();
    if (request.url.startsWith('/api')) {
      return true;
    }

    if (isPublic) {
      return true;
    }

    // ... rest of your authentication logic
    return true; // Temporarily return true to allow all requests
  }
}
