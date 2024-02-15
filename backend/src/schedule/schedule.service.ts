import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createScheduleDto } from './dto/create-schedule.dto';
import { updateScheduleDto } from './dto/update-schedule.dto';
import { Schedule } from 'src/entities/schedule.entity';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';
import { ScheduleResponseDto } from './dto/schedule-response.dto';
import { DoctorService } from 'src/doctor/doctor.service';
import { MeetingService } from 'src/meeting/meeting.service';
import { Meeting } from 'src/entities/meeting.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    private doctorService: DoctorService,
    private meetingService: MeetingService,
  ) {}

  findAll(doctorId: number): Promise<Schedule[]> {
    return this.scheduleRepository.find({
      where: {
        doctor: {
          id: doctorId,
        },
      },
      order: {
        day: 'ASC',
        start_hour: 'ASC'
      }
    });
  }

  async findByDoctor(doctorId: number): Promise<ScheduleResponseDto[]> {
    let response: ScheduleResponseDto[] = [];
    const moment = extendMoment(Moment);

    const schedulesFound = await this.scheduleRepository.find({
      where: {
        doctorId,
      },
      order: {
        day: 'ASC',
      },
    });

    const doctorFound = await this.doctorService.findOne(doctorId);

    const meetingsFound = await this.meetingService.findByDoctor(doctorId);

    let dayAnt = -1;
    schedulesFound.map((schedule) => {
      const day_start = moment().startOf('day').hours(schedule.start_hour);
      const day_end = moment().startOf('day').hours(schedule.end_hour);
      const day = moment.range(day_start, day_end);
      const time_slots = Array.from(
        day.by('minutes', { step: doctorFound.durationMeeting }),
      );

      const test = time_slots.map((time) => time.format('HH:mm'));

      const s = test.map((time) => {
        return {
          time,
          available: this.isAvailable(meetingsFound, time, schedule.day),
        };
      });

      if (schedule.day === dayAnt) {
        response[dayAnt].schedule = response[dayAnt].schedule.concat(s);
      } else {
        response.push({
          day: schedule.day,
          schedule: s,
        });
      }
      dayAnt = schedule.day;
    });

    const temp = response.filter((s) => s.day >= new Date().getDay());
    const temp2 = response.filter((s) => s.day < new Date().getDay());
    response = temp.concat(temp2);

    moment.locale('es');
    let day = 0;
    response = response.map((res) => {
      const d = moment(new Date()).add(day, 'd').format('LLLL').split(' ')[0];
      return {
        formattedDate: d + ' ' + moment(new Date()).add(day, 'd').format('LL'),
        schedule: res.schedule,
        date: moment(new Date()).add(day++, 'd').local().format('YYYY-MM-DD'),
      };
    });

    return response;
  }

  isAvailable(meetings: Meeting[], time: string, day: number): boolean {
    const moment = extendMoment(Moment);
    let available = true;

    if (day === new Date().getDay()) {
      if (
        Number(time.split(':')[0]) <
        Number(moment(new Date()).format('HH:mm').split(':')[0])
      ) {
        available = false;

        return available;
      } else if (
        Number(time.split(':')[0]) ===
          Number(moment(new Date()).format('HH:mm').split(':')[0]) &&
        Number(time.split(':')[1]) <
          Number(moment(new Date()).format('HH:mm').split(':')[1])
      ) {
        available = false;

        return available;
      }
    }

    meetings.map((meeting) => {
      const { startDatetime } = meeting;
      if (startDatetime.getDay() === day) {
        const moment = extendMoment(Moment);

        if (moment(startDatetime).format('HH:mm') === time) {
          available = false;
        }
      }
    });

    return available;
  }

  async create(schedule: createScheduleDto): Promise<Schedule | HttpException> {
    const query = `
        select * from schedule 
        where ((start_hour < ${schedule.end_hour} and start_hour >= ${schedule.start_hour}) 
        or (end_hour <= ${schedule.end_hour} and end_hour > ${schedule.start_hour})) 
        and day = ${schedule.day} 
        and doctorId = ${schedule.doctorId};
        `;

    let schedulesFound: Schedule[] = await this.scheduleRepository.query(query);

    if (schedulesFound.length > 0) {
      throw new HttpException(
        'Superposicion de rango horario',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newSchedule = this.scheduleRepository.create(schedule);

    return this.scheduleRepository.save(newSchedule);
  }

  async update(id: number, schedule: updateScheduleDto) {
    const scheduleFound = await this.scheduleRepository.findOne({
      where: {
        id,
      },
    });
    if (!scheduleFound) {
      throw new HttpException(
        'Rango horario no encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    const query = `
        select * from schedule 
        where ((start_hour < ${schedule.end_hour} and start_hour >= ${schedule.start_hour}) 
        or (end_hour <= ${schedule.end_hour} and end_hour > ${schedule.start_hour})) 
        and day = ${schedule.day} 
        and doctorId = ${scheduleFound.doctorId};
        `;

    let schedulesFound: Schedule[] = await this.scheduleRepository.query(query);

    if (schedulesFound.length > 0) {
      throw new HttpException(
        'Superposicion de rango horario',
        HttpStatus.BAD_REQUEST,
      );
    }

    const updateSchedule = Object.assign(scheduleFound, schedule);
    return this.scheduleRepository.save(updateSchedule);
  }

  async delete(id: number) {
    const result = await this.scheduleRepository.delete({ id });

    if (result.affected == 0) {
      throw new HttpException(
        'Rango horario no encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    return result;
  }
}
