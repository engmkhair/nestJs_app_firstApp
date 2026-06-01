import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { RolesGuard } from './gaurds/roles.gaurd';
import { AuthGuard } from './gaurds/auth.gaurd';

@Module({
  imports:[JwtModule.register({})],
  providers: [AuthService, AuthGuard, RolesGuard],
  controllers: [AuthController]
})
export class AuthModule {}
