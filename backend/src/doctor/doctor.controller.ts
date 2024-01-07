import { Controller, Get, Body, Param, Delete, Patch, HttpException, UseGuards, UseInterceptors, Post, Req } from '@nestjs/common';
import { updateDoctorDto } from './dto/update-doctor.dto';
import { DoctorService } from './doctor.service';
import { Doctor } from 'src/entities/doctor.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RoleEnum } from 'src/enums/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';

@Controller('doctor')
@UseGuards(AuthGuard, RolesGuard)
export class DoctorController {

    constructor(private doctorService: DoctorService) {}

    @Get()
    @Roles(RoleEnum.User, RoleEnum.Doctor)
    getDoctors(): Promise<Doctor[]> {
        return this.doctorService.findAll()
    }
    
    @Get(':id')
    @Roles(RoleEnum.User, RoleEnum.Doctor, RoleEnum.Admin)
    getDoctor(@Param('id') id: number): Promise<Doctor | HttpException> {
        return this.doctorService.findOne(id)
    }
    
    @Get('speciality/:idSpec')
    @Roles(RoleEnum.User, RoleEnum.Doctor)
    getDoctorsBySpeciality(@Param('idSpec') idSpec: number): Promise<Doctor[]> {
        return this.doctorService.findDoctorsBySpeciality(idSpec)
    }

    @Patch('verify/:id')
    @Roles(RoleEnum.Admin)
    verifyDoctor(@Param('id') id: number) {
        return this.doctorService.verify(id)
    }
    
    @Patch(':id')
    @Roles(RoleEnum.Doctor)
    updateDoctor(@Param('id') id: number, @Body() doctor: updateDoctorDto) {
        return this.doctorService.update(id, doctor)
    }

    @Delete(':id')
    @Roles(RoleEnum.Doctor)
    deleteDoctor(@Param('id') id: number) {
        return this.doctorService.delete(id)
    }

    @UseInterceptors(
        FileInterceptor(
            'file',
            {
                storage: diskStorage({
                    destination: './public/uploads/doctor/registration',
                    filename: (req, file, cb) => {
                        req.body.url = uuidv4() + '.' + file.originalname.split('.').slice(-1)
                        cb(null, req.body.url)
                    }
                })
            }
        )
    )
    @Post(':id/registration')
    uploadRegistration(@Param('id') id: number, @Req() request: Request) {
        const { body } = request

        return this.doctorService.uploadRegistration(id, body.url)
    }
    
    @UseInterceptors(
        FileInterceptor(
            'file',
            {
                storage: diskStorage({
                    destination: './public/uploads/doctor/title',
                    filename: (req, file, cb) => {
                        req.body.url = uuidv4() + '.' + file.originalname.split('.').slice(-1)
                        cb(null, req.body.url)
                    }
                })
            }
        )
    )
    @Post(':id/title')
    uploadTitle(@Param('id') id: number, @Req() request: Request) {
        const { body } = request

        return this.doctorService.uploadTitle(id, body.url)
    }
}
