import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorController } from './doctor.controller';
import { Doctor } from 'src/entities/doctor.entity';
import { DoctorService } from './doctor.service';
import { UserModule } from 'src/user/user.module';
import { SpecialityModule } from 'src/speciality/speciality.module';
import { PlanModule } from 'src/plan/plan.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { Speciality } from 'src/entities/speciality.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor, Speciality]), UserModule, SpecialityModule, PlanModule, NestjsFormDataModule],
  controllers: [DoctorController],
  providers: [DoctorService],
  exports: [DoctorService]
})
export class DoctorModule {}
