import { Body, Controller, HttpException, Post, UseGuards, Get, Request, Response as ResponseDec } from '@nestjs/common';
import { createUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { loginResponseDto } from './dto/login-response.dto';
import { User } from 'src/entities/user.entity';
import { AuthGuard } from './auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UserService) { }

    @Post('login')
    async login(@Body() userLogin: AuthLoginDto, @ResponseDec() res: Response): Promise<void> {
        await this.authService.login(userLogin, res);
    }

    @Post('signup')
    signup(@Body() user: createUserDto): Promise<User | HttpException> {
        const { doctor } = user
        return this.userService.create(user, doctor)
    }

    @UseGuards(AuthGuard)
    @Get('session')
    getSession(@Request() req) {
        return req.user;
    }
}

