import { Controller, Get, Post, Body, Param, Delete, Patch, HttpException, ParseIntPipe, UseGuards } from '@nestjs/common';
import { createSpecialityDto } from './dto/create-speciality.dto';
import { updateSpecialityDto } from './dto/update-speciality.dto';
import { SpecialityService } from './speciality.service';
import { Speciality } from 'src/entities/speciality.entity';

@Controller('speciality')
export class SpecialityController {

    constructor(private specialityService: SpecialityService) {}
    
    @Get()
    getSpecialities(): Promise<Speciality[]> {
        return this.specialityService.findAll()
    }
    
    @Get(':id')
    getSpeciality(@Param('id', ParseIntPipe) id: number): Promise<Speciality | HttpException> {
        return this.specialityService.findOne(id)
    }

    @Post()
    createSpeciality(@Body() speciality: createSpecialityDto): Promise<Speciality | HttpException> {
        return this.specialityService.create(speciality)
    }

    @Patch(':id')
    updateSpeciality(@Param('id', ParseIntPipe) id: number, @Body() speciality: updateSpecialityDto) {
        return this.specialityService.update(id, speciality)
    }

    @Delete(':id')
    deleteSpeciality(@Param('id', ParseIntPipe) id: number) {
        return this.specialityService.delete(id)
    }
}
