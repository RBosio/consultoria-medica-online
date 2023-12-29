import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { updateMeetingDto } from './dto/update-meeting.dto';
import { Meeting } from 'src/entities/meeting.entity';
import { createMeetingDto } from './dto/create-meeting.dto';

@Injectable()
export class MeetingService {
    constructor(
        @InjectRepository(Meeting) private meetingRepository: Repository<Meeting>,
        ) {}

    findAll(): Promise<Meeting[]> {
        return this.meetingRepository.find({
            relations: ['user', 'doctor']
        })
    }
    
    findByUser(userId: number): Promise<Meeting[]> {
        return this.meetingRepository.find({
            where: {
                userId
            },
            relations: ['user', 'doctor', 'medicalRecord']
        })
    }
    
    async findOne(userId: number, startDatetime: Date) {
        const meetingFound = await this.meetingRepository.findOne({
            where: {
                userId,
                startDatetime
            },
            relations: ['user', 'doctor']
        })
        
        if (!meetingFound) {
            throw new HttpException('Reunion no encontrada', HttpStatus.NOT_FOUND)
        }
        
        return meetingFound
    }

    async create(meeting: createMeetingDto): Promise<Meeting | HttpException> {
        const meetingFound = await this.meetingRepository.findOne({
            where: {
                userId: meeting.userId,
                startDatetime: meeting.startDatetime
            }
        })

        if (meetingFound) {
            throw new HttpException('Reunion existente', HttpStatus.BAD_REQUEST)
        }

        const newMeeting = this.meetingRepository.create(meeting)

        return this.meetingRepository.save(newMeeting)
    }

    async update(userId: number, startDatetime: Date, meeting: updateMeetingDto) {
        const meetingFound = await this.meetingRepository.findOne({
            where: {
                userId,
                startDatetime
            }
        })

        if (!meetingFound) {
            throw new HttpException('Reunion no encontrada', HttpStatus.NOT_FOUND)
        }
        
        const updateMeeting = Object.assign(meetingFound, meeting)
        return this.meetingRepository.save(updateMeeting)
    }
    
    async delete(userId: number, startDatetime: Date) {
        const result = await this.meetingRepository.delete({userId, startDatetime})
        
        if (result.affected == 0) {
            throw new HttpException('Reunion no encontrada', HttpStatus.NOT_FOUND)
        }
        
        return result
    }
}
