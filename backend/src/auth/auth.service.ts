import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Auth } from './entities/auth.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(Auth) private readonly authRepository: Repository<Auth>, private readonly jwtService: JwtService) {}   

    async login(email: string, password: string) {
        const user = await this.authRepository.findOne({ where: { email } });
        if (!user) {
            throw new BadRequestException('존재하지 않는 이메일입니다.');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new BadRequestException('비밀번호가 올바르지 않습니다.');
        }
        const accessToken = this.jwtService.sign({ userId: user.id, email: user.email, username: user.username });
        const refreshToken = this.jwtService.sign({ userId: user.id, email: user.email, username: user.username }, { expiresIn: '3d' });
        return { message: '로그인 성공', user, accessToken, refreshToken };
    }

    async register(username: string, email: string, password: string) {
        const existingUser = await this.authRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new BadRequestException('이미 존재하는 이메일입니다.');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.authRepository.save({ username, email, password: hashedPassword });
        return { message: '회원가입 성공', user };
    }

    async refreshToken(refreshToken: string) {
        const decoded = this.jwtService.verify(refreshToken);
        if (!decoded) {
            throw new BadRequestException('유효하지 않은 리프레시 토큰입니다.');
        }
        const user = await this.authRepository.findOne({ where: { id: decoded.userId } });
        if (!user) {
            throw new BadRequestException('존재하지 않는 사용자입니다.');
        }
        const accessToken = this.jwtService.sign({ userId: user.id, email: user.email, username: user.username }, { expiresIn: '1h' });
        const newRefreshToken = this.jwtService.sign({ userId: user.id, email: user.email, username: user.username }, { expiresIn: '3d' });
        await this.authRepository.update(user.id, { refresh_token: newRefreshToken });
        return { message: '리프레시 토큰을 이용하여 엑세스 토큰 재발급 성공 + 리프레시 토큰도 갱신', user, accessToken, newRefreshToken };
    }
}
