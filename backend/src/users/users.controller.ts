import {
  Controller,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UsersService } from './users.service.js';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Request() req: any) {
    return {
      message: 'Manager Access Granted',
      user: req.user,
    };
  }

  @Get('employees')
  @UseGuards(AuthGuard('jwt'))
  getEmployees() {
    return this.usersService.getEmployees();
  }
}