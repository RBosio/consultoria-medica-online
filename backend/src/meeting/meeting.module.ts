import { Module } from '@nestjs/common';
import { MeetingController } from './meeting.controller';
import { MeetingService } from './meeting.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meeting } from 'src/entities/meeting.entity';
import { DoctorModule } from 'src/doctor/doctor.module';
import { SpecialityModule } from 'src/speciality/speciality.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Meeting]), UserModule, DoctorModule, SpecialityModule],
  controllers: [MeetingController],
  providers: [MeetingService],
  exports: [MeetingService]
})
export class MeetingModule {}
