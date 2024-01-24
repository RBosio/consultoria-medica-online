import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorController } from './doctor.controller';
import { Doctor } from 'src/entities/doctor.entity';
import { DoctorService } from './doctor.service';
import { UserModule } from 'src/user/user.module';
import { SpecialityModule } from 'src/speciality/speciality.module';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor]), UserModule, SpecialityModule],
  controllers: [DoctorController],
  providers: [DoctorService],
  exports: [DoctorService]
})
export class DoctorModule {}
