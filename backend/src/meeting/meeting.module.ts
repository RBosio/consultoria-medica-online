import { Module } from '@nestjs/common';
import { MeetingController } from './meeting.controller';
import { MeetingService } from './meeting.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meeting } from 'src/entities/meeting.entity';
import { DoctorService } from 'src/doctor/doctor.service';
import { Doctor } from 'src/entities/doctor.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/entities/user.entity';
import { CityService } from 'src/city/city.service';
import { City } from 'src/entities/city.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Meeting, Doctor, User, City])
  ],
  controllers: [MeetingController],
  providers: [MeetingService, DoctorService, UserService, CityService]
})
export class MeetingModule {}
