import { Controller, Get, Post, Body, Param, Delete, Patch, HttpException, UseGuards, ParseIntPipe } from '@nestjs/common';
import { createMedicalRecordDto } from './dto/create-medical-record.dto';
import { updateMedicalRecordDto } from './dto/update-medical-record.dto';
import { MedicalRecordService } from './medical-record.service';
import { MedicalRecord } from 'src/entities/medical-record.entity';
import { Meeting } from 'src/entities/meeting.entity';

@Controller('medicalRecord')
export class MedicalRecordController {

    constructor(private medicalRecordService: MedicalRecordService) {}
    
    @Get()
    getMedicalRecords(): Promise<MedicalRecord[]> {
        return this.medicalRecordService.findAll()
    }
    
    @Get('user/:userId')
    getMedicalRecordsByUser(@Param('userId', ParseIntPipe) userId: number): Promise<Meeting[]> {
        return this.medicalRecordService.findByUser(userId)
    }
    
    @Get(':datetime')
    getMedicalRecord(@Param('datetime') datetime: Date): Promise<MedicalRecord | HttpException> {
        return this.medicalRecordService.findOne(datetime)
    }

    @Post()
    createMedicalRecord(@Body() medicalRecord: createMedicalRecordDto): Promise<MedicalRecord | HttpException> {
        return this.medicalRecordService.create(medicalRecord)
    }

    @Patch(':datetime')
    updateMedicalRecord(@Param('datetime') datetime: Date, @Body() medicalRecord: updateMedicalRecordDto) {
        return this.medicalRecordService.update(datetime, medicalRecord)
    }

    @Delete(':datetime')
    deleteMedicalRecord(@Param('datetime') datetime: Date) {
        return this.medicalRecordService.delete(datetime)
    }
}
