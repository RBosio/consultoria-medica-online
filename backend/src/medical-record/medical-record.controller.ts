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
    @Roles(RoleEnum.User, RoleEnum.Doctor, RoleEnum.Admin)
    getMedicalRecords(): Promise<MedicalRecord[]> {
        return this.medicalRecordService.findAll()
    }
    
    @Get('user/:userId')
    @Roles(RoleEnum.User, RoleEnum.Doctor, RoleEnum.Admin)
    getMedicalRecordsByUser(@Param('userId', ParseIntPipe) userId: number, @Req() req: Request): Promise<MedicalRecord[]> {
        const page = Number(req.query.page)
        return this.medicalRecordService.findByUser(userId, page)
    }

    @Get('user/pages/:userId')
    @Roles(RoleEnum.User, RoleEnum.Doctor, RoleEnum.Admin)
    getPages(@Param('userId', ParseIntPipe) userId: number): Promise<number> {
        return this.medicalRecordService.getPages(userId)
    }
    
    @Get(':id')
    @Roles(RoleEnum.User, RoleEnum.Doctor, RoleEnum.Admin)
    getMedicalRecord(@Param('id') id: string): Promise<MedicalRecord | HttpException> {
        return this.medicalRecordService.findOne(+id)
    }

    @Post()
    @Roles(RoleEnum.Doctor)
    createMedicalRecord(@Body() medicalRecord: createMedicalRecordDto): Promise<MedicalRecord | HttpException> {
        return this.medicalRecordService.create(medicalRecord)
    }

    @Patch(':id')
    @Roles(RoleEnum.Doctor)
    updateMedicalRecord(@Param('id') id: string, @Body() medicalRecord: updateMedicalRecordDto) {
        return this.medicalRecordService.update(+id, medicalRecord)
    }

    @Delete(':id')
    @Roles(RoleEnum.Doctor)
    deleteMedicalRecord(@Param('id') id: string) {
        return this.medicalRecordService.delete(+id)
    }

    @UseInterceptors(
        FileInterceptor(
            'file',
            {
                storage: diskStorage({
                    destination: './public/api/uploads/medical-record',
                    filename: (req, file, cb) => {
                        req.body.url = uuidv4() + '.' + file.originalname.split('.').slice(-1)
                        req.body.name = file.originalname
                        
                        cb(null, req.body.url)
                    }
                })
            }
        )
    )
    @Post(':id/file')
    @Roles(RoleEnum.Doctor)
    uploadFile(@Param('id') id: string, @Req() request: Request) {
        const { body } = request

        return this.medicalRecordService.uploadFile(+id, body)
    }
}
