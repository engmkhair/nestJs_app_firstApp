import { Post, Body, Controller, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './gaurds/auth.gaurd';
import { Roles } from './decorator/roles.decorator';
import { RolesGuard } from './gaurds/roles.gaurd';
import { Role } from '@prisma/client';
import { SignInDto, SignUpDto, RefreshTokenDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('sign-up')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin)
    async signUp(@Body() dto: SignUpDto) {
        return await this.authService.signUp(dto);
    }

    @Post('sign-in')
    @HttpCode(HttpStatus.OK)
    async signIn(@Body() dto: SignInDto) {
        return await this.authService.signIn(dto);
    }


    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refresh(@Body() dto: RefreshTokenDto) {
        return await this.authService.refreshTokens(dto.userId, dto.refreshToken);
    }
}
