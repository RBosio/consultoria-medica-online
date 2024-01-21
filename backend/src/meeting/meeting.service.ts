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
import { DoctorService } from 'src/doctor/doctor.service';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';
import { getMeetingsDto } from './dto/get-meetings.dto';

export interface RequestT extends Request {
    user: {
        role
    }
}

@Injectable()
export class MeetingService {
    constructor(
        @InjectRepository(Meeting) private meetingRepository: Repository<Meeting>,
        private jwtService: JwtService,
        private doctorService: DoctorService
        ) {}

    async findAll(): Promise<Meeting[]> {
        return this.meetingRepository.find({
            relations: ['user', 'doctor']
        })
    }
    
    async findAllByUser(userId: number, query: getMeetingsDto): Promise<Meeting[]> {
        const { name, specialityId, status } = query
        
        let meetingsFound = await this.meetingRepository.find({
            relations: {
                user: true,
                doctor: {
                    user: true
                },
                speciality: true
            },
            where: {
                userId
            }
        })

        if (name) {
            meetingsFound = meetingsFound.filter(meeting => {
                const fullName = `${meeting.doctor.user.name} ${meeting.doctor.user.surname}`.toLowerCase();
                const nameToSearch = name.toLowerCase();
                return fullName.includes(nameToSearch);
            })
        }

        if (specialityId) {
            meetingsFound = meetingsFound.filter(meeting => meeting.speciality.id == specialityId)
        }
        
        if (status) {
            meetingsFound = meetingsFound.filter(meeting => meeting.status === status)
        }

        return meetingsFound
    }

    async findAllByDoctor(id: number, query: getMeetingsDto): Promise<Meeting[]> {
        const { name, status } = query
        
        let doctorFound = await this.doctorService.findOneByUserId(id)

        let meetingsFound = await this.meetingRepository.find({
            relations: {
                user: true,
                doctor: {
                    user: true
                },
                speciality: true
            },
            where: {
                doctorId: doctorFound.id
            }
        })

        if (name) {
            meetingsFound = meetingsFound.filter(meeting => {
                const fullName = `${meeting.user.name} ${meeting.user.surname}`.toLowerCase();
                const nameToSearch = name.toLowerCase();
                return fullName.includes(nameToSearch);
            })
        }

        if (status) {
            meetingsFound = meetingsFound.filter(meeting => meeting.status === status)
        }

        return meetingsFound
    }
    
    async findByUser(userId: number): Promise<Meeting[]> {
        return this.meetingRepository.find({
            where: {
                userId
            },
            relations: ['user', 'doctor', 'medicalRecord']
        })
    }
    
    async findByDoctor(doctorId: number): Promise<Meeting[]> {
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
            relations: {
                user: {
                    healthInsurance: true
                },
                doctor: {
                    user: {
                        healthInsurance: true
                    }
                },
                speciality: true
            },
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

        meeting.status = 'Finalizada'
        await this.meetingRepository.save(meeting)
        
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
        
        if (meeting.rate && !(meeting.rate >= 0 && meeting.rate <= 5)) {
            throw new HttpException('Puntuacion invalida... [0-5]', HttpStatus.CONFLICT)
        }
        
        const updateMeeting = Object.assign(meetingFound, meeting)
        await this.meetingRepository.save(updateMeeting)
        
        const avgRate = await this.meetingRepository.average('rate', { doctorId: meetingFound.doctorId })

        await this.doctorService.update(meetingFound.doctorId, {
            avgRate
        })
    
        return updateMeeting
    }
    
    async cancel(userId: number, startDatetime: Date, meeting: updateMeetingDto) {
        const meetingFound = await this.meetingRepository.findOne({
            where: {
                userId,
                startDatetime
            }
        })
        
        if (!meetingFound) {
            throw new HttpException('Reunion no encontrada', HttpStatus.NOT_FOUND)
        }

        meetingFound.status = 'Cancelada'
        meetingFound.motive = meeting.motive
        meetingFound.cancelDate = new Date()

        await this.meetingRepository.save(meetingFound)
        
        return meetingFound
    }
}
