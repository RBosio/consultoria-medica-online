import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { Schedule } from 'src/entities/schedule.entity';
import { DoctorService } from 'src/doctor/doctor.service';
import { Doctor } from 'src/entities/doctor.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/entities/user.entity';
import { CityService } from 'src/city/city.service';
import { City } from 'src/entities/city.entity';
import { MeetingService } from 'src/meeting/meeting.service';
import { Meeting } from 'src/entities/meeting.entity';
import { SpecialityService } from 'src/speciality/speciality.service';
import { Speciality } from 'src/entities/speciality.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule, Doctor, User, City, Meeting, Speciality])],
  controllers: [ScheduleController],
  providers: [ScheduleService, DoctorService, UserService, CityService, MeetingService, SpecialityService]
})
export class ScheduleModule {}
