import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, IsNull, LessThan, MoreThan, Repository } from 'typeorm';
import { updateMeetingDto } from './dto/update-meeting.dto';
import { Meeting } from 'src/entities/meeting.entity';
import { createMeetingDto } from './dto/create-meeting.dto';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { joinMeetingResponseDto } from './dto/join-meeting-response.dto';
import { DoctorService } from 'src/doctor/doctor.service';
import { getMeetingsDto } from './dto/get-meetings.dto';
import { UserService } from 'src/user/user.service';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';
import MercadoPagoConfig, { Preference } from 'mercadopago';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import * as moment from 'moment';
import { PreferenceRequest } from 'mercadopago/dist/clients/preference/commonTypes';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HealthInsuranceService } from 'src/health-insurance/health-insurance.service';
import { Doctor } from 'src/entities/doctor.entity';
import { SpecialityService } from 'src/speciality/speciality.service';
import { pesos } from 'src/lib/formatCurrency';
import {
  inNumberArray,
  isBetween,
  isLengthLessThan,
  isRequired,
  matchesStringArray,
  validateRequest,
} from 'src/validations';
import { toStringArray } from 'src/utils';
import { KJUR } from 'jsrsasign';

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
    private healthInsruanceService: HealthInsuranceService,
    private specialityService: SpecialityService,
    private configService: ConfigService,
  ) { }

  async findAll(): Promise<Meeting[]> {
    return this.meetingRepository.find({
      relations: ['user', 'doctor'],
    });
  }

  async findAllByUser(
    userId: number,
    query: getMeetingsDto,
  ): Promise<Meeting[]> {
    const { name, status, specialityId } = query;

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
        status: In(['Pagada', 'Finalizada']),
      },
      order: {
        status: 'DESC',
        startDatetime: 'ASC',
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

    if (specialityId) {
      meetingsFound = meetingsFound.filter((meeting) => {
        const s = meeting.doctor.specialities.map((spe) => spe.id);
        return s.includes(+specialityId);
      });
    }

    meetingsFound = meetingsFound.map((meeting) => {
      delete meeting.user.password;
      delete meeting.doctor.user.password;
      return meeting;
    });

    return meetingsFound;
  }

  private getMonth(month: number): string {
    if ([1, 2, 3, 4, 5, 6, 7, 8, 9].includes(month)) return '0' + month;

    return month.toString();
  }

  private getMinAndMaxDatesOfMonth(month: number, year: number) {
    if ([1, 3, 5, 7, 8, 10, 12].includes(month))
      return moment(`${year}-${this.getMonth(month)}-31T23:59:59`).format(
        'YYYY-MM-DDTHH:mm:ss',
      );
    if ([4, 6, 9, 11].includes(month))
      return moment(`${year}-${this.getMonth(month)}-30T23:59:59`).format(
        'YYYY-MM-DDTHH:mm:ss',
      );
    if ([2].includes(month))
      return moment(`${year}-${this.getMonth(month)}-28T23:59:59`).format(
        'YYYY-MM-DDTHH:mm:ss',
      );
  }

  async findByMonthAndYear(month: number, year: number) {
    const min = moment(`${year}-${this.getMonth(month)}-01T00:00:00`).format(
      'YYYY-MM-DDTHH:mm:ss',
    );
    const max = this.getMinAndMaxDatesOfMonth(month, year);

    return this.meetingRepository.find({
      where: {
        startDatetime: Between(moment(min).toDate(), moment(max).toDate()),
      },
      relations: {
        doctor: {
          user: true,
        },
      },
    });
  }

  async findAllByDoctor(id: number, query: getMeetingsDto): Promise<Meeting[]> {
    const { name, status } = query;

    let doctorFound = await this.doctorService.findOneByUserId(id);

    if (!doctorFound) {
      throw new NotFoundException('doctor not found!');
    }

    let meetingsFound = await this.meetingRepository.find({
      relations: {
        user: true,
        doctor: {
          user: true,
          specialities: true,
          schedules: true,
        },
      },
      where: {
        doctorId: doctorFound.id,
        status: In(['Pagada', 'Finalizada']),
      },
      order: {
        status: 'DESC',
        startDatetime: 'ASC',
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

    meetingsFound = meetingsFound.map((meeting) => {
      delete meeting.user.password;
      delete meeting.doctor.user.password;
      return meeting;
    });

    return meetingsFound;
  }

  async findByUser(userId: number): Promise<Meeting[]> {
    let meetingsFound = await this.meetingRepository.find({
      where: {
        userId,
        status: In(['Pagada', 'Finalizada']),
      },
      relations: ['user', 'doctor', 'medicalRecord'],
    });

    meetingsFound = meetingsFound.map((meeting) => {
      delete meeting.user.password;
      delete meeting.doctor.user.password;
      return meeting;
    });

    return meetingsFound;
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

  async findLastMeeting(userId: number, role: string = 'user') {
    if (role === 'doctor') {
      const meetingFound = await this.meetingRepository.findOne({
        where: {
          doctorId: userId,
          status: 'Pagada',
          startDatetime: MoreThan(new Date()),
        },
        relations: {
          user: {
            healthInsurances: true,
          },
          doctor: {
            user: true,
          },
        },
        order: {
          startDatetime: 'ASC',
        },
      });

      return meetingFound;
    }

    const meetingFound = await this.meetingRepository.findOne({
      where: {
        userId,
        status: 'Pagada',
        startDatetime: MoreThan(new Date()),
      },
      relations: {
        doctor: {
          user: true,
        },
        user: {
          healthInsurances: true,
        },
      },
      order: {
        startDatetime: 'ASC',
      },
    });

    delete meetingFound?.user.password;
    delete meetingFound?.doctor.user.password;

    return meetingFound;
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

    delete meetingFound.user.password;
    delete meetingFound.doctor.user.password;

    return meetingFound;
  }

  async findByMedicalRecords(userId: number, doctorId: number) {
    return this.meetingRepository.find({
      where: {
        medicalRecord: IsNull(),
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

  async lastPayment(userId: number) {
    const meetingFound = await this.meetingRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
      order: {
        created_at: 'DESC',
      },
    });

    if (meetingFound) {
      delete meetingFound.user.password;
    }

    return meetingFound;
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

    newMeeting.doctor = await this.doctorService.findOne(meeting.doctorId);
    newMeeting.user = await this.userService.findOne(req.user.id);
    newMeeting.healthInsurance = await this.healthInsruanceService.findOne(
      meeting.healthInsuranceId,
    );
    newMeeting.speciality = await this.specialityService.findOne(
      meeting.specialityId,
    );
    newMeeting.tpc = uuidv4();

    return this.meetingRepository.save(newMeeting);
  }

  async joinMeeting(
    req: RequestT,
    res: Response,
    id: number,
    startDatetime: Date,
  ) {
    const meeting = await this.findOne(id, startDatetime);

    const { user } = req;

    const validator = {
      role: [inNumberArray([0, 1])],
      sessionName: [isLengthLessThan(200)],
      expirationSeconds: isBetween(1800, 172800),
      userIdentity: isLengthLessThan(35),
      sessionKey: isLengthLessThan(36),
      geoRegions: matchesStringArray([
        'AU',
        'BR',
        'CA',
        'CN',
        'DE',
        'HK',
        'IN',
        'JP',
        'MX',
        'NL',
        'SG',
        'US',
      ]),
      cloudRecordingOption: inNumberArray([0, 1]),
      cloudRecordingElection: inNumberArray([0, 1]),
      audioCompatibleMode: inNumberArray([0, 1]),
    };

    const coerceRequestBody = (body) => ({
      ...body,
      ...[
        'role',
        'expirationSeconds',
        'cloudRecordingOption',
        'cloudRecordingElection',
        'audioCompatibleMode',
      ].reduce(
        (acc, cur) => ({
          ...acc,
          [cur]:
            typeof body[cur] === 'string' ? parseInt(body[cur]) : body[cur],
        }),
        {},
      ),
    });

    const joinGeoRegions = (geoRegions) => toStringArray(geoRegions)?.join(',');

    const requestBody = coerceRequestBody(req.body);
    const validationErrors = validateRequest(requestBody, validator);

    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    const {
      role,
      sessionName,
      expirationSeconds,
      userIdentity,
      sessionKey,
      geoRegions,
      cloudRecordingOption,
      cloudRecordingElection,
      audioCompatibleMode,
    } = requestBody;

    const iat = Math.floor(Date.now() / 1000);
    const exp = expirationSeconds ? iat + expirationSeconds : iat + 60 * 60 * 2;
    const oHeader = { alg: 'HS256', typ: 'JWT' };

    const oPayload = {
      app_key: process.env.ZOOM_VIDEO_SDK_KEY,
      role_type: role,
      tpc: meeting.tpc,
      version: 1,
      iat,
      exp,
      user_identity: userIdentity,
      session_key: sessionKey,
      geo_regions: joinGeoRegions(geoRegions),
      cloud_recording_option: cloudRecordingOption,
      cloud_recording_election: cloudRecordingElection,
      audio_compatible_mode: audioCompatibleMode,
    };

    const sHeader = JSON.stringify(oHeader);
    const sPayload = JSON.stringify(oPayload);
    const sdkJWT = KJUR.jws.JWS.sign(
      'HS256',
      sHeader,
      sPayload,
      process.env.ZOOM_VIDEO_SDK_SECRET,
    );

    return res.status(200).json({
      tokenMeeting: sdkJWT,
      meeting,
    });
  }

  async finish(id: number, startDatetime: Date) {
    const meeting = await this.findOne(id, startDatetime);
    meeting.status = 'Finalizada';
    return this.meetingRepository.save(meeting);
  }

  async createPreference(pref: any, doctorId: number, idempotencyKey: string) {
    const client = new MercadoPagoConfig({
      accessToken: this.configService.get<string>('MP_ACCESS_TOKEN'),
      options: {
        idempotencyKey,
      },
    });
    const doctor = await this.doctorService.findOne(doctorId);

    const body: PreferenceRequest = {
      items: [
        {
          id: uuid(),
          title: `Consulta médica para el día ${moment(
            pref.startDatetime,
          ).format('LL')} a las ${moment(pref.startDatetime).format(
            'LT',
          )} con el Dr. ${doctor.user.surname}, ${doctor.user.name}`,
          quantity: 1,
          currency_id: 'ARS',
          unit_price: pref.price,
        },
      ],
      back_urls: {
        success: `${process.env.FRONTEND_URL}/doctors/${doctorId}`,
        failure: `${process.env.FRONTEND_URL}/doctors/${doctorId}`,
        pending: `${process.env.FRONTEND_URL}/doctors/${doctorId}`,
      },
      auto_return: 'approved',
      payment_methods: {
        installments: 1,
      },
    };

    const preference = new Preference(client);
    const result = await preference.create({
      body,
      requestOptions: {
        idempotencyKey,
      },
    });

    return { id: result.id, init: result.sandbox_init_point };
  }

  async pay(userId: number, startDatetime: Date) {
    const meetingFound = await this.meetingRepository.findOne({
      where: {
        userId,
        startDatetime,
      },
    });

    if (!meetingFound) {
      throw new HttpException('Reunion no encontrada', HttpStatus.NOT_FOUND);
    }

    meetingFound.status = 'Pagada';

    await this.meetingRepository.save(meetingFound);
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

    const doctor = await this.doctorService.findOne(meetingFound.doctorId);

    const avgRate = (doctor.count * doctor.avgRate + meeting.rate) / (doctor.count + 1);

    await this.doctorService.update(meetingFound.doctorId, {
      avgRate,
      count: doctor.count + 1,
    });

    return updateMeeting;
  }

  async repr(userId: number, startDatetime: Date, meeting: updateMeetingDto) {
    const meetingFound = await this.meetingRepository.findOne({
      where: {
        userId,
        startDatetime,
      },
    });

    if (!meetingFound) {
      throw new HttpException('Reunión no encontrada', HttpStatus.NOT_FOUND);
    }

    if (meetingFound.status === 'Finalizada')
      throw new HttpException(
        'La reunión ya ha sido finalizada y no se puede reprogramar',
        HttpStatus.BAD_REQUEST,
      );

    if (meetingFound.repr)
      throw new HttpException(
        'La reunión ya fue reprogramada',
        HttpStatus.BAD_REQUEST,
      );

    meetingFound.repr = true;
    meetingFound.startDatetime = meeting.startDatetime;

    await this.meetingRepository.update(
      { userId, startDatetime },
      meetingFound,
    );

    return meetingFound;
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async validateMeeting() {
    const meetings = await this.meetingRepository.find({
      where: {
        status: 'Pagada',
        startDatetime: LessThan(
          moment(new Date()).subtract(210, 'minutes').toDate(),
        ),
      },
    });

    if (meetings.length === 0) return;

    const m = meetings.map((meeting) => {
      meeting.status = 'Finalizada';

      return meeting;
    });

    await this.meetingRepository.save(m);
  }

  async getData(
    doctor: Doctor,
    month: number,
    year: number,
    hi: number,
  ): Promise<DataList[]> {
    moment.locale('es');

    const meetings = await this.meetingRepository.find({
      where: {
        doctor: {
          user: {
            id: !doctor ? null : +doctor.user.id,
          },
        },
        healthInsurance: {
          id: !hi ? null : +hi,
        },
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
        },
        healthInsurance: true,
      },
      order: {
        startDatetime: 'DESC',
      },
    });

    let filtered = meetings;
    if (month && year) {
      filtered = meetings.filter((meeting) => {
        return (
          meeting.startDatetime.getFullYear() === +year &&
          meeting.startDatetime.getMonth() + 1 === +month
        );
      });
    }

    const response: DataList[] = [];

    filtered.map((meeting: Meeting) => {
      response.push({
        hi: meeting.user.healthInsurances.filter(
          (hi) => hi.healthInsurance?.id === meeting.healthInsurance?.id,
        )[0]
          ? meeting.user.healthInsurances.filter(
            (hi) => hi.healthInsurance.id === meeting.healthInsurance.id,
          )[0].healthInsurance.name
          : '-',
        user: meeting.user.surname + ', ' + meeting.user.name,
        date: moment(meeting.startDatetime).format('LLL'),
        startDatetime: meeting.startDatetime,
        dni: meeting.user.dni,
        num: meeting.user.healthInsurances.filter(
          (hi) => hi.healthInsurance?.id === meeting.healthInsurance?.id,
        )[0]
          ? meeting.user.healthInsurances.filter(
            (hi) => hi.healthInsurance.id === meeting.healthInsurance.id,
          )[0].cod
          : '-',
        price: pesos.format(meeting.price),
        doctor: meeting.doctor.user.surname + ', ' + meeting.doctor.user.name,
      });
    });

    return response.sort((a, b) => {
      return moment(b.startDatetime).diff(moment(a.startDatetime));
    });
  }

  async charts() {
    const response = [];
    const meetings = await this.meetingRepository.find({
      relations: {
        speciality: true,
      },
    });
    const specialities = await this.specialityService.findAll();

    const specialitiesResponse = specialities
      .map((sp) => {
        return {
          x: sp.name,
          y: meetings.filter((meeting) => meeting.speciality.id === sp.id)
            .length,
        };
      })
      .filter((sp) => sp.y !== 0)
      .sort((a, b) => {
        if (a.y > b.y) return -1;
      });

    const years = new Set(
      meetings.map((meeting) => meeting.startDatetime.getFullYear()),
    );
    const resp = [];
    years.forEach((year) => {
      resp.push({
        x: year,
        y: meetings.filter(
          (meeting) => meeting.startDatetime.getFullYear() === year,
        ).length,
      });
    });

    const resp2 = [];
    years.forEach((year) => {
      resp2.push({
        x: year,
        y: meetings
          .filter((meeting) => meeting.startDatetime.getFullYear() === year)
          .map((meeting) => +meeting.price)
          .reduce((prev, curr) => prev + curr, 0),
      });
    });

    response.push(
      specialitiesResponse,
      resp.sort((a, b) => {
        if (a.x < b.x) {
          return -1;
        }
      }),
      resp2.sort((a, b) => {
        if (a.x < b.x) {
          return -1;
        }
      }),
    );
    return response;
  }
}

export interface DataList {
  user: string;
  date: string;
  dni: string;
  hi: string;
  num: string;
  price: string;
  startDatetime: Date;
  doctor: string;
}
