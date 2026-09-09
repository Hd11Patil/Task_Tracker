import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtStrategy } from './jwt.strategy/jwt.strategy.js';
import { UsersModule } from '../users/users.module.js';
import { RolesGuard } from './roles/roles.guard.js';

@Module({
  imports: [
    UsersModule,
    PassportModule,

    JwtModule.register({
      secret: 'task-tracker-secret-key',
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],

  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard],
  exports: [AuthService],
})
export class AuthModule {}