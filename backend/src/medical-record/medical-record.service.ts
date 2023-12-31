import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createMedicalRecordDto } from './dto/create-medical-record.dto';
import { updateMedicalRecordDto } from './dto/update-medical-record.dto';
import { MedicalRecord } from 'src/entities/medical-record.entity';
import { MeetingService } from 'src/meeting/meeting.service';
import { Meeting } from 'src/entities/meeting.entity';
import { UserService } from 'src/user/user.service';
import { File } from 'src/entities/file.entity';

@Injectable()
export class MedicalRecordService {

    constructor(
        @InjectRepository(MedicalRecord) private medicalRecordRepository: Repository<MedicalRecord>,
        @InjectRepository(File) private fileRepository: Repository<File>,
        private meetingService: MeetingService,
        private userService: UserService
        ) {}

    findAll(): Promise<MedicalRecord[]> {
        return this.medicalRecordRepository.find()
    }
    
    async findByUser(userId: number): Promise<Meeting[]> {
        let meetings = await this.meetingService.findByUser(userId)

        for (let i = 0; i < meetings.length; i++) {
            const test = await this.userService.findOne(meetings[i].doctor.userId)
            meetings[i].doctor.user = test
        }

        return meetings
    }
    
    async findOne(datetime: Date): Promise<MedicalRecord> {
        const medicalRecordFound = await this.medicalRecordRepository.findOne({
            where: {
                datetime
            },
            relations: ['meeting']
        })
        if (!medicalRecordFound) {
            throw new HttpException('Registro no encontrado', HttpStatus.NOT_FOUND)
        }
        
        return medicalRecordFound
    }

    async create(medicalRecord: createMedicalRecordDto): Promise<MedicalRecord | HttpException> {
        const medicalRecordFound = await this.medicalRecordRepository.findOne({
            where: {
                datetime: medicalRecord.datetime
            }
        })
        if (medicalRecordFound) {
            throw new HttpException('Registro existente', HttpStatus.BAD_REQUEST)
        }
        
        let newMedicalRecord = this.medicalRecordRepository.create(medicalRecord)
        
        const meetingFound = await this.meetingService.findOne(medicalRecord.userId, medicalRecord.startDatetime)
        
        newMedicalRecord = await this.medicalRecordRepository.save(newMedicalRecord)
        
        meetingFound.medicalRecordDatetime = medicalRecord.datetime
        await this.meetingService.update(meetingFound.userId, meetingFound.startDatetime, meetingFound)
        
        return newMedicalRecord
    }

    async update(datetime: Date, medicalRecord: updateMedicalRecordDto) {
        const medicalRecordFound = await this.medicalRecordRepository.findOne({
            where: {
                datetime
            }
        })
        if (!medicalRecordFound) {
            throw new HttpException('Registro no encontrado', HttpStatus.NOT_FOUND)
        }
        
        const updateMedicalRecord = Object.assign(medicalRecordFound, medicalRecord)
        return this.medicalRecordRepository.save(updateMedicalRecord)
    }
    
    async delete(datetime: Date) {
        const medicalRecord = await this.findOne(datetime)
        
        medicalRecord.meeting.medicalRecordDatetime = null

        await this.meetingService.update(medicalRecord.meeting.userId,medicalRecord.meeting.startDatetime, medicalRecord.meeting)
        
        const result = await this.medicalRecordRepository.delete({datetime})
    
        if (result.affected == 0) {
            throw new HttpException('Registro no encontrado', HttpStatus.NOT_FOUND)
        }

        return result
    }
    
    async uploadFile(datetime: Date, url: string) {
        const medicalRecord = await this.medicalRecordRepository.findOne({
            where: {
                datetime
            }
        })
        if (!medicalRecord) {
            throw new HttpException('Registro no encontrado', HttpStatus.NOT_FOUND)
        }
        
        const newFile = this.fileRepository.create({url, medicalRecordDatetime: datetime})
        return await this.fileRepository.save(newFile)
    }
}
