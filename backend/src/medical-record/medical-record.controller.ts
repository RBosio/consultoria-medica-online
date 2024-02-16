import { Controller, Get, Post, Body, Param, Delete, Patch, HttpException, UseGuards, ParseIntPipe, UseInterceptors, Req } from '@nestjs/common';
import { createMedicalRecordDto } from './dto/create-medical-record.dto';
import { updateMedicalRecordDto } from './dto/update-medical-record.dto';
import { MedicalRecordService } from './medical-record.service';
import { MedicalRecord } from 'src/entities/medical-record.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RoleEnum } from 'src/enums/role.enum';

@Controller('medicalRecord')
@UseGuards(AuthGuard, RolesGuard)
export class MedicalRecordController {

    constructor(private medicalRecordService: MedicalRecordService) {}
    
    @Get()
    @Roles(RoleEnum.User, RoleEnum.Doctor)
    getMedicalRecords(): Promise<MedicalRecord[]> {
        return this.medicalRecordService.findAll()
    }
    
    @Get('user/:userId')
    @Roles(RoleEnum.User, RoleEnum.Doctor)
    getMedicalRecordsByUser(@Param('userId', ParseIntPipe) userId: number, @Req() req: Request): Promise<MedicalRecord[]> {
        const page = Number(req.query.page)
        return this.medicalRecordService.findByUser(userId, page)
    }

    @Get('user/pages/:userId')
    @Roles(RoleEnum.User, RoleEnum.Doctor)
    getPages(@Param('userId', ParseIntPipe) userId: number): Promise<number> {
        return this.medicalRecordService.getPages(userId)
    }
    
    @Get(':datetime')
    @Roles(RoleEnum.User, RoleEnum.Doctor)
    getMedicalRecord(@Param('datetime') datetime: Date): Promise<MedicalRecord | HttpException> {
        return this.medicalRecordService.findOne(datetime)
    }

    @Post()
    @Roles(RoleEnum.Doctor)
    createMedicalRecord(@Body() medicalRecord: createMedicalRecordDto): Promise<MedicalRecord | HttpException> {
        return this.medicalRecordService.create(medicalRecord)
    }

    @Patch(':datetime')
    @Roles(RoleEnum.Doctor)
    updateMedicalRecord(@Param('datetime') datetime: Date, @Body() medicalRecord: updateMedicalRecordDto) {
        return this.medicalRecordService.update(datetime, medicalRecord)
    }

    @Delete(':datetime')
    @Roles(RoleEnum.Doctor)
    deleteMedicalRecord(@Param('datetime') datetime: Date) {
        return this.medicalRecordService.delete(datetime)
    }

    @UseInterceptors(
        FileInterceptor(
            'file',
            {
                storage: diskStorage({
                    destination: './public/uploads/medical-record',
                    filename: (req, file, cb) => {
                        req.body.url = uuidv4() + '.' + file.originalname.split('.').slice(-1)
                        cb(null, req.body.url)
                    }
                })
            }
        )
    )
    @Post(':datetime/file')
    @Roles(RoleEnum.Doctor)
    uploadFile(@Param('datetime') datetime: Date, @Req() request: Request) {
        const { body } = request

        return this.medicalRecordService.uploadFile(datetime, body.url)
    }
}
