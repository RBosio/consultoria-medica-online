import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { loginResponseDto } from './dto/login-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctor } from 'src/entities/doctor.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Doctor) private doctorRepository: Repository<Doctor>,
        private userService: UserService,
        private jwtService: JwtService) {}
    
    async login(userLogin: AuthLoginDto): Promise<loginResponseDto | HttpException> {
        const userFound = await this.userService.findOneByEmail(userLogin.email)

        if (await userFound.comparePassword(userLogin.password)) {
            let role = userFound.admin ? 'admin' : 'user'

            if(role === 'user') {
                const doctor = await this.doctorRepository.findOne({
                    where: {
                        userId: userFound.id
                    }
                })
                
                if(doctor) {
                    role = 'doctor'
                }
            }

            const payload = { name: userFound.name, surname: userFound.surname, sub: userFound.dni, role };

            return {token: await this.jwtService.signAsync(payload)}
        } else {
            throw new HttpException('Email o contraseña incorrectos', HttpStatus.UNAUTHORIZED)
        }
    }
}