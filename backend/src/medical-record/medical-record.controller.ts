import { Controller, Get, Post, Body, Param, Delete, Patch, HttpException, UseGuards, ParseIntPipe, UseInterceptors, Req } from '@nestjs/common';
import { createMedicalRecordDto } from './dto/create-medical-record.dto';
import { updateMedicalRecordDto } from './dto/update-medical-record.dto';
import { MedicalRecordService } from './medical-record.service';
import { MedicalRecord } from 'src/entities/medical-record.entity';
import { Meeting } from 'src/entities/meeting.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';

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

    @UseInterceptors(
        FileInterceptor(
            'file',
            {
                storage: diskStorage({
                    destination: './public/uploads',
                    filename: (req, file, cb) => {
                        req.body.url = uuidv4() + '.' + file.originalname.split('.').slice(-1)
                        cb(null, req.body.url)
                    }
                })
            }
        )
    )
    @Post(':datetime/file')
    uploadFile(@Param('datetime') datetime: Date, @Req() request: Request) {
        const { body } = request

        return this.medicalRecordService.uploadFile(datetime, body.url)
    }
}
