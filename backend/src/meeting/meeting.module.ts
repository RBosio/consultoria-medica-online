import { Module } from '@nestjs/common';
import { MeetingController } from './meeting.controller';
import { MeetingService } from './meeting.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meeting } from 'src/entities/meeting.entity';
import { DoctorModule } from 'src/doctor/doctor.module';
import { SpecialityModule } from 'src/speciality/speciality.module';
import { UserModule } from 'src/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { HealthInsuranceModule } from 'src/health-insurance/health-insurance.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Meeting]),
    UserModule,
    DoctorModule,
    SpecialityModule,
    HealthInsuranceModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [MeetingController],
  providers: [MeetingService],
  exports: [MeetingService],
})
export class MeetingModule {}
