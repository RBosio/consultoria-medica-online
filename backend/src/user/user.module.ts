import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
import { Doctor } from 'src/entities/doctor.entity';
import { CityModule } from 'src/city/city.module';
import { HealthInsuranceModule } from 'src/health-insurance/health-insurance.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Doctor]), CityModule, HealthInsuranceModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
