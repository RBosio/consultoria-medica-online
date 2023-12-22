import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorController } from './doctor.controller';
import { Doctor } from 'src/entities/doctor.entity';
import { DoctorService } from './doctor.service';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { City } from 'src/entities/city.entity';
import { CityService } from 'src/city/city.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Doctor, User, City])
  ],
  controllers: [DoctorController],
  providers: [DoctorService, UserService, CityService]
})
export class DoctorModule {}
