import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BenefitController } from './benefit.controller';
import { BenefitService } from './benefit.service';
import { Benefit } from 'src/entities/benefit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Benefit])],
  controllers: [BenefitController],
  providers: [BenefitService]
})
export class BenefitModule {}
