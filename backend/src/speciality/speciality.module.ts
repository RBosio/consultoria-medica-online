import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialityController } from './speciality.controller';
import { SpecialityService } from './speciality.service';
import { Speciality } from 'src/entities/speciality.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Speciality])],
  controllers: [SpecialityController],
  providers: [SpecialityService]
})
export class SpecialityModule {}
