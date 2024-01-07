import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { Schedule } from 'src/entities/schedule.entity';
import { Doctor } from 'src/entities/doctor.entity';
import { DoctorService } from 'src/doctor/doctor.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/entities/user.entity';
import { CityService } from 'src/city/city.service';
import { City } from 'src/entities/city.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule, Doctor, User, City])],
  controllers: [ScheduleController],
  providers: [ScheduleService, DoctorService, UserService, CityService]
})
export class ScheduleModule {}
