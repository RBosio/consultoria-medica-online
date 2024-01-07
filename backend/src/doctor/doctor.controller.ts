import { Controller, Get, Body, Param, Delete, Patch, HttpException, UseInterceptors, Post, Req } from '@nestjs/common';
import { updateDoctorDto } from './dto/update-doctor.dto';
import { DoctorService } from './doctor.service';
import { Doctor } from 'src/entities/doctor.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';

@Controller('doctor')
export class DoctorController {

    constructor(private doctorService: DoctorService) {}

    @Get()
    getDoctors(): Promise<Doctor[]> {
        return this.doctorService.findAll()
    }
    
    @Get(':id')
    getDoctor(@Param('id') id: number): Promise<Doctor | HttpException> {
        return this.doctorService.findOne(id)
    }
    
    @Get('speciality/:idSpec')
    getDoctorsBySpeciality(@Param('idSpec') idSpec: number): Promise<Doctor[]> {
        return this.doctorService.findDoctorsBySpeciality(idSpec)
    }

    @Patch('verify/:id')
    verifyDoctor(@Param('id') id: number) {
        return this.doctorService.verify(id)
    }
    
    @Patch(':id')
    updateDoctor(@Param('id') id: number, @Body() doctor: updateDoctorDto) {
        return this.doctorService.update(id, doctor)
    }

    @Delete(':id')
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
