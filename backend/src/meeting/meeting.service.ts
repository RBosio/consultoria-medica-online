import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { updateMeetingDto } from './dto/update-meeting.dto';
import { Meeting } from 'src/entities/meeting.entity';
import { createMeetingDto } from './dto/create-meeting.dto';
import { uuidv4 } from 'uuid'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express';
import { joinMeetingResponseDto } from './dto/join-meeting-response.dto';

export interface RequestT extends Request {
    user: {
        role
    }
}

@Injectable()
export class MeetingService {
    constructor(
        @InjectRepository(Meeting) private meetingRepository: Repository<Meeting>,
        private jwtService: JwtService
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
    
    findByDoctor(doctorId: number): Promise<Meeting[]> {
        return this.meetingRepository.find({
            select: {
                startDatetime: true,
                doctor: {
                    durationMeeting: true
                }
            },
            where: {
                doctorId,
                startDatetime: MoreThan(new Date())
            },
            relations: ['doctor']
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
        newMeeting.tpc = uuidv4()
        
        return this.meetingRepository.save(newMeeting)
    }

    async joinMeeting(req: RequestT, id: number, startDatetime: Date): Promise<joinMeetingResponseDto | HttpException> {
        const meeting = await this.findOne(id, startDatetime)
        
        const { user } = req
        const { role } = user
        const tpc = meeting.tpc
                
        const payloadMeeting = {
            "app_key": process.env.ZOOM_VIDEO_SDK_KEY,
            "role_type": role === 'doctor' ? 1 : 0,
            tpc,
            "version": 1
          }
        
        return {tokenMeeting: await this.jwtService.signAsync(payloadMeeting, {
            secret: process.env.ZOOM_VIDEO_SDK_SECRET
        })}
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
