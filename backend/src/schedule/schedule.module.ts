import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { Schedule } from 'src/entities/schedule.entity';
import { DoctorModule } from 'src/doctor/doctor.module';
import { MeetingModule } from 'src/meeting/meeting.module';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule]), DoctorModule, MeetingModule],
  controllers: [ScheduleController],
  providers: [ScheduleService]
})
export class ScheduleModule {}
