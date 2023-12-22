import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
import { CityService } from 'src/city/city.service';
import { City } from 'src/entities/city.entity';
import { Doctor } from 'src/entities/doctor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, City, Doctor])
  ],
  controllers: [UserController],
  providers: [UserService, CityService],
  exports: [UserService]
})
export class UserModule {}
