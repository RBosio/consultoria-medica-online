import { Controller, Get, Body, Param, Delete, Patch, HttpException } from '@nestjs/common';
import { updateDoctorDto } from './dto/update-doctor.dto';
import { DoctorService } from './doctor.service';
import { Doctor } from 'src/entities/doctor.entity';

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
    
    @Get('category/:idSpec')
    getDoctorsBySpeciality(@Param('idSpec') idSpec: number): Promise<Doctor[]> {
        return this.doctorService.findDoctorsBySpeciality(idSpec)
    }

    @Patch(':id')
    updateDoctor(@Param('id') id: number, @Body() doctor: updateDoctorDto) {
        return this.doctorService.update(id, doctor)
    }

    @Delete(':id')
    deleteDoctor(@Param('id') id: number) {
        return this.doctorService.delete(id)
    }
}
