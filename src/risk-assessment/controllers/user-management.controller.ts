import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserManagementService } from '../services/user-management.service';
import {
  CreateUserDto,
  UpdateUserDto,
  LoginDto,
} from '../dto/user-management.dto';
import { RequirePermission } from '../decorators/require-permission.decorator';
import { Permission } from '../interfaces/user-management.interface';
import { PermissionGuard } from '../guards/permission.guard';

@ApiTags('User Management')
@Controller('users')
@UseGuards(PermissionGuard)
export class UserManagementController {
  constructor(private readonly userManagementService: UserManagementService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  async login(@Body() loginDto: LoginDto, @Request() req) {
    // In real implementation, validate credentials and create session
    const session = await this.userManagementService.createSession(
      '1', // Mock user ID
      req.ip,
      req.headers['user-agent'],
    );
    return {
      sessionId: session.id,
      token: 'mock-jwt-token',
    };
  }

  @Post()
  @RequirePermission(Permission.MANAGE_USERS)
  @ApiOperation({ summary: 'Create new user' })
  async createUser(@Body() createUserDto: CreateUserDto, @Request() req) {
    return this.userManagementService.createUser(createUserDto, req.user.id);
  }

  @Get()
  @RequirePermission(Permission.MANAGE_USERS)
  @ApiOperation({ summary: 'Get all users' })
  async getAllUsers() {
    return this.userManagementService.getAllUsers();
  }

  @Put(':id')
  @RequirePermission(Permission.MANAGE_USERS)
  @ApiOperation({ summary: 'Update user' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    return this.userManagementService.updateUser(
      id,
      updateUserDto,
      req.user.id,
    );
  }

  @Delete(':id')
  @RequirePermission(Permission.MANAGE_USERS)
  @ApiOperation({ summary: 'Deactivate user' })
  async deactivateUser(@Param('id') id: string, @Request() req) {
    return this.userManagementService.deactivateUser(id, req.user.id);
  }

  @Post('logout')
  @ApiOperation({ summary: 'User logout' })
  async logout(@Request() req) {
    if (!req.session?.id) {
      throw new UnauthorizedException('No active session');
    }
    await this.userManagementService.invalidateSession(req.session.id);
    return { message: 'Logged out successfully' };
  }
}
