import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { jwtConstants } from './constants';
import { Response } from 'express';
import { DoctorService } from 'src/doctor/doctor.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private doctorService: DoctorService,
        private jwtService: JwtService) { }

    async login(userLogin: AuthLoginDto, res: Response): Promise<void> {
        const userFound = await this.userService.findOneByEmail(userLogin.email)

        if (await userFound.comparePassword(userLogin.password)) {
            let role = userFound.admin ? 'admin' : 'user'

            if (role === 'user') {
                const doctor = await this.doctorService.findOneByUserId(userFound.id)

                if (doctor && doctor.verified) {
                    role = 'doctor'
                }
            }

            const payload = {
                id: userFound.id,
                name: userFound.name,
                surname: userFound.surname,
                photo: userFound.image,
                email: userFound.email,
                dni: userFound.dni,
                role,
            };

            const token = await this.jwtService.signAsync(payload, { secret: jwtConstants.secret });
            res.cookie("token", token, { expires: new Date(new Date().getTime() + 1000 * 60 * 60), httpOnly: true });
            res.status(200).json({ token });


        } else {
            res.status(401).json({ error: "Email o contraseña incorrectos" });
        }
    }

    async logout(res: Response) {
        res.clearCookie('token')

        return res.status(200).json({
            "message": "Cierre de sesion exitoso"
        })
    }

    async refreshSession(req: any, res: Response): Promise<void> {
        const userFound = await this.userService.findOneByEmail(req.user.email)

        let role = userFound.admin ? 'admin' : 'user'

        if (role === 'user') {
            const doctor = await this.doctorService.findOneByUserId(userFound.id)

            if (doctor && doctor.verified) {
                role = 'doctor'
            }
        }

        const newPayload = {
            id: userFound.id,
            name: userFound.name,
            surname: userFound.surname,
            photo: userFound.image,
            email: userFound.email,
            dni: userFound.dni,
            role,
        };

        const oldPayload = { ...req.user };
        delete oldPayload.iat;
        delete oldPayload.exp;

        // Si el payload del token enviado difiere de los datos actuales es porque hay que refrescar el token
        if (JSON.stringify(newPayload) !== JSON.stringify(oldPayload)) {
            const token = await this.jwtService.signAsync(newPayload, { secret: jwtConstants.secret });
            res.cookie("token", token, { expires: new Date(new Date().getTime() + 1000 * 60 * 60), httpOnly: true });
            res.status(200).json({ token, refreshed: true });
        } else {
            res.status(200).json({ token: null, refreshed: false });
        };

    };
}