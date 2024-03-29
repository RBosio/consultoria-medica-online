import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, IsNull, Repository } from 'typeorm';
import { updateMeetingDto } from './dto/update-meeting.dto';
import { Meeting } from 'src/entities/meeting.entity';
import { createMeetingDto } from './dto/create-meeting.dto';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { joinMeetingResponseDto } from './dto/join-meeting-response.dto';
import { DoctorService } from 'src/doctor/doctor.service';
import { getMeetingsDto } from './dto/get-meetings.dto';
import { UserService } from 'src/user/user.service';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';

export interface RequestT extends Request {
  user: {
    id;
    role;
  };
}

@Injectable()
export class MeetingService {
  constructor(
    @InjectRepository(Meeting) private meetingRepository: Repository<Meeting>,
    private jwtService: JwtService,
    private userService: UserService,
    private doctorService: DoctorService,
  ) {}

  async findAll(): Promise<Meeting[]> {
    return this.meetingRepository.find({
      relations: ['user', 'doctor'],
    });
  }

  async findAllByUser(
    userId: number,
    query: getMeetingsDto,
  ): Promise<Meeting[]> {
    const { name, status } = query;

    let meetingsFound = await this.meetingRepository.find({
      relations: {
        user: true,
        doctor: {
          user: true,
          specialities: true,
        },
      },
      where: {
        userId,
      },
    });

    if (name) {
      meetingsFound = meetingsFound.filter((meeting) => {
        const fullName =
          `${meeting.doctor.user.name} ${meeting.doctor.user.surname}`.toLowerCase();
        const nameToSearch = name.toLowerCase();
        return fullName.includes(nameToSearch);
      });
    }

    if (status) {
      meetingsFound = meetingsFound.filter(
        (meeting) => meeting.status === status,
      );
    }

    return meetingsFound;
  }

  async findAllByDoctor(id: number, query: getMeetingsDto): Promise<Meeting[]> {
    const { name, status } = query;

    let doctorFound = await this.doctorService.findOneByUserId(id);

    let meetingsFound = await this.meetingRepository.find({
      relations: {
        user: true,
        doctor: {
          user: true,
          specialities: true,
        },
      },
      where: {
        doctorId: doctorFound.id,
      },
    });

    if (name) {
      meetingsFound = meetingsFound.filter((meeting) => {
        const fullName =
          `${meeting.user.name} ${meeting.user.surname}`.toLowerCase();
        const nameToSearch = name.toLowerCase();
        return fullName.includes(nameToSearch);
      });
    }

    if (status) {
      meetingsFound = meetingsFound.filter(
        (meeting) => meeting.status === status,
      );
    }

    return meetingsFound;
  }

  async findByUser(userId: number): Promise<Meeting[]> {
    return this.meetingRepository.find({
      where: {
        userId,
      },
      relations: ['user', 'doctor', 'medicalRecord'],
    });
  }

  async findByDoctor(doctorId: number): Promise<Meeting[]> {
    const moment = extendMoment(Moment);

    return this.meetingRepository.find({
      select: {
        startDatetime: true,
        doctor: {
          durationMeeting: true,
        },
      },
      where: {
        doctorId,
        startDatetime: Between(
          new Date(),
          moment(new Date()).add(7, 'days').toDate(),
        ),
      },
      relations: ['doctor'],
    });
  }

  async findOne(userId: number, startDatetime: Date) {
    const meetingFound = await this.meetingRepository.findOne({
      where: {
        userId,
        startDatetime,
      },
      relations: {
        user: {
          healthInsurances: {
            healthInsurance: true,
          },
        },
        doctor: {
          user: {
            healthInsurances: {
              healthInsurance: true,
            },
          },
          specialities: true,
        },
      },
    });

    if (!meetingFound) {
      throw new HttpException('Reunion no encontrada', HttpStatus.NOT_FOUND);
    }

    return meetingFound;
  }

  async findByMedicalRecords(userId: number, doctorId: number) {
    return this.meetingRepository.find({
      where: {
        medicalRecordDatetime: IsNull(),
        user: {
          id: userId,
        },
        doctor: {
          user: {
            id: doctorId,
          },
        },
      },
    });
  }

  async create(
    meeting: createMeetingDto,
    req: RequestT,
  ): Promise<Meeting | HttpException> {
    const moment = extendMoment(Moment);
    let sch: string[] = [];
    let band = false;

    if (
      moment(new Date(meeting.startDatetime)).diff(
        moment(new Date()),
        'days',
      ) >= 7
    ) {
      throw new HttpException('Fecha inválida', HttpStatus.BAD_REQUEST);
    } else if (
      moment(new Date()).diff(moment(new Date(meeting.startDatetime)), 'days') >
      0
    ) {
      throw new HttpException('Fecha inválida', HttpStatus.BAD_REQUEST);
    }

    const doctorFound = await this.doctorService.findOne(meeting.doctorId);
    const { schedules } = doctorFound;

    const d = new Date(meeting.startDatetime).getDay();
    schedules.map((schedule) => {
      if (d === schedule.day) {
        const day_start = moment().startOf('day').hours(schedule.start_hour);
        const day_end = moment().startOf('day').hours(schedule.end_hour);
        const day = moment.range(day_start, day_end);
        const time_slots = Array.from(
          day.by('minutes', { step: doctorFound.durationMeeting }),
        );

        const t = time_slots.map((time) => time.format('HH:mm'));
        sch = sch.concat(t);
      }
    });

    sch.map((s) => {
      if (s === moment(new Date(meeting.startDatetime)).format('HH:mm')) {
        band = true;
      }
    });

    if (!band) {
      throw new HttpException(
        'Horario del doctor no definido',
        HttpStatus.NOT_FOUND,
      );
    }

    const meetingFound = await this.meetingRepository.findOne({
      where: {
        userId: meeting.userId,
        startDatetime: meeting.startDatetime,
      },
    });

    if (meetingFound) {
      throw new HttpException('Reunion existente', HttpStatus.BAD_REQUEST);
    }

    const newMeeting = this.meetingRepository.create(meeting);
    newMeeting.userId = req.user.id;

    newMeeting.doctor = await this.doctorService.findOne(meeting.doctorId);
    newMeeting.user = await this.userService.findOne(meeting.userId);
    newMeeting.tpc = uuidv4();

    return this.meetingRepository.save(newMeeting);
  }

  async joinMeeting(
    req: RequestT,
    id: number,
    startDatetime: Date,
  ): Promise<joinMeetingResponseDto | HttpException> {
    const meeting = await this.findOne(id, startDatetime);

    const { user } = req;
    const { role } = user;
    const tpc = meeting.tpc;

    const payloadMeeting = {
      app_key: process.env.ZOOM_VIDEO_SDK_KEY,
      role_type: role === 'doctor' ? 1 : 0,
      tpc,
      version: 1,
    };

    meeting.status = 'Finalizada';
    await this.meetingRepository.save(meeting);

    return {
      tokenMeeting: await this.jwtService.signAsync(payloadMeeting, {
        secret: process.env.ZOOM_VIDEO_SDK_SECRET,
      }),
      meeting,
    };
  }

  async update(userId: number, startDatetime: Date, meeting: updateMeetingDto) {
    const meetingFound = await this.meetingRepository.findOne({
      where: {
        userId,
        startDatetime,
      },
    });

    if (!meetingFound) {
      throw new HttpException('Reunion no encontrada', HttpStatus.NOT_FOUND);
    }

    if (meeting.rate && !(meeting.rate >= 0 && meeting.rate <= 5)) {
      throw new HttpException(
        'Puntuacion invalida... [0-5]',
        HttpStatus.CONFLICT,
      );
    }

    const updateMeeting = Object.assign(meetingFound, meeting);
    await this.meetingRepository.save(updateMeeting);

    const avgRate = await this.meetingRepository.average('rate', {
      doctorId: meetingFound.doctorId,
    });

    if (avgRate) {
      await this.doctorService.update(meetingFound.doctorId, {
        avgRate,
      });
    }

    return updateMeeting;
  }

  async cancel(userId: number, startDatetime: Date, meeting: updateMeetingDto) {
    const meetingFound = await this.meetingRepository.findOne({
      where: {
        userId,
        startDatetime,
      },
    });

    if (!meetingFound) {
      throw new HttpException('Reunion no encontrada', HttpStatus.NOT_FOUND);
    }

    meetingFound.status = 'Cancelada';
    meetingFound.motive = meeting.motive;
    meetingFound.cancelDate = new Date();

    await this.meetingRepository.save(meetingFound);

    return meetingFound;
  }
}
