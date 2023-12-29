import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalRecordController } from './medical-record.controller';
import { MedicalRecordService } from './medical-record.service';
import { MedicalRecord } from 'src/entities/medical-record.entity';
import { MeetingService } from 'src/meeting/meeting.service';
import { Meeting } from 'src/entities/meeting.entity';
import { User } from 'src/entities/user.entity';
import { Doctor } from 'src/entities/doctor.entity';
import { City } from 'src/entities/city.entity';
import { UserService } from 'src/user/user.service';
import { CityService } from 'src/city/city.service';
import { File } from 'src/entities/file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MedicalRecord, Meeting, User, Doctor, City, File])],
  controllers: [MedicalRecordController],
  providers: [
    MedicalRecordService,
    MeetingService,
    UserService,
    CityService
  ]
})
export class MedicalRecordModule {}
