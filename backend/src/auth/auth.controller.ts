import { Body, Controller, HttpException, Post, UseGuards, Get, Req, Res } from '@nestjs/common';
import { createUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { User } from 'src/entities/user.entity';
import { AuthGuard } from './auth.guard';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UserService) { }

    @Post('login')
    async login(@Body() userLogin: AuthLoginDto, @Res() res: Response): Promise<void> {
        await this.authService.login(userLogin, res);
    }
    

    @Post('logout')
    @UseGuards(AuthGuard)
    async logout(@Res() res: Response) {
        return this.authService.logout(res)
    }

    @Post('signup')
    signup(@Body() user: createUserDto): Promise<User | HttpException> {
        const { doctor } = user
        return this.userService.create(user, doctor)
    }

    @Get('session')
    @UseGuards(AuthGuard)
    getSession(@Req() req) {
        return req.user;
    }
}

