import { Controller, Req, UseGuards, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() body: { email: string, password: string }) {
        return this.authService.login(body.email, body.password);
    }

    @Post('register')
    async register(@Body() body: { username: string, email: string, password: string }) {
        return this.authService.register(body.username, body.email, body.password);
    }

    @Post('refresh')
    async refreshToken(@Body() body: { refreshToken: string }) {
        return this.authService.refreshToken(body.refreshToken);
    }
    
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Req() request: any) {
        return {
            message: '프로필 조회 성공',
            user: request.user
        };
    }
}
