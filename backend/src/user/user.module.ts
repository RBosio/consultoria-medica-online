import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
import { CityService } from 'src/city/city.service';
import { City } from 'src/entities/city.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, City])
  ],
  controllers: [UserController],
  providers: [UserService, CityService],
  exports: [UserService]
})
export class UserModule {}
