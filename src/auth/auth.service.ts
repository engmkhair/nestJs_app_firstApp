import { BadRequestException, ConflictException, ForbiddenException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {JwtService} from '@nestjs/jwt';
import {ConfigService} from '@nestjs/config';
import * as bcrypt from 'bcrypt'
import { Prisma } from '@prisma/client';
import { SignInDto, SignUpDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma:PrismaService,
        private jwtService:JwtService,
        private config:ConfigService,
    ){}
    async signUp(dto: SignUpDto) {
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        try {
            const newUser = await this.prisma.user.create({
                data: {
                    name: dto.name,
                    email: dto.email,
                    password: hashedPassword,
                    role: dto.role
                }
            })
            const tokens = await this.getTokens(newUser.id, newUser.email, newUser.role);
            
            const { password, ...userWithoutPassword } = newUser;
            
            return {
                user: userWithoutPassword,
                tokens
            };
        }
        catch(error){
            console.error('Sign up error:', error);
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ConflictException('email already exists');
                }
            }
            throw new InternalServerErrorException( 'error creating user');
        }
    }
    async signIn(dto:SignInDto){
        const user=await this.prisma.user.findUnique({
            where:{
                email:dto.email
            }
        })
        if(!user){
            throw new UnauthorizedException('User not found');
        }
        
        // التحقق من أن كلمة المرور مشفرة في قاعدة البيانات لتجنب خطأ bcrypt
        if (!user.password || user.password === '123456') {
             throw new UnauthorizedException('Password in database is not secured. Please contact admin.');
        }

        const isPasswordValid=await bcrypt.compare(dto.password,user.password);
        if(!isPasswordValid){
            throw new UnauthorizedException('Invalid password');
        }
        const tokens=await this.getTokens(user.id,user.email,user.role);
        const { password, ...userWithoutPassword } = user;
        return {user: userWithoutPassword, tokens};
    }
    async refreshTokens(userId: number, rt: string) {
        try {
            await this.jwtService.verifyAsync(rt, {
                secret: this.config.get<string>('JWT_REFRESH_TOKEN_SECRET'),
            });
        } catch (e) {
            throw new ForbiddenException('Invalid Refresh Token');
        }

        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new ForbiddenException('Access Denied');
        }

        const tokens = await this.getTokens(user.id, user.email, user.role);
        return tokens;
    }

    async getTokens(userId:number,email:string,role:string){
        const jwtPayload={sub:userId,email,role}
        const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: '20m', 
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: '7d', 
      }),
    ]);
    return {
        access_token:at,
        refresh_token:rt, 
    }
    }
}
