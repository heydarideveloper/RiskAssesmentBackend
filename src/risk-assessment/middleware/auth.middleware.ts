import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserManagementService } from '../services/user-management.service';

// Extend Express Request type to include our custom properties
declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
      session?: { id: string };
    }
  }
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userManagementService: UserManagementService) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      const sessionId = req.headers['x-session-id'] as string;

      if (!authHeader || !sessionId) {
        throw new UnauthorizedException('Missing authentication credentials');
      }

      const token = authHeader.split(' ')[1];
      const session = await this.validateSession(sessionId, token);

      // Attach user and session info to request
      req.user = { id: session.userId };
      req.session = { id: session.id };

      next();
    } catch (error) {
      next(new UnauthorizedException('Invalid authentication credentials'));
    }
  }

  private async validateSession(
    sessionId: string,
    token: string,
  ): Promise<any> {
    const session = await this.userManagementService.getSession(sessionId);

    if (!session || !session.isActive) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    // In a real implementation, you would also validate the JWT token here
    // For now, we're just checking if the session exists and is active

    return session;
  }
}
