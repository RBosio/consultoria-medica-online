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
import { DoctorService } from 'src/doctor/doctor.service';
import { SpecialityService } from 'src/speciality/speciality.service';
import { Speciality } from 'src/entities/speciality.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MedicalRecord, Meeting, User, Doctor, City, File, Speciality])],
  controllers: [MedicalRecordController],
  providers: [
    MedicalRecordService,
    MeetingService,
    DoctorService,
    UserService,
    CityService,
    SpecialityService
  ]
})
export class MedicalRecordModule {}
