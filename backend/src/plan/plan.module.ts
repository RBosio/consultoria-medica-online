import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';
import { Plan } from 'src/entities/plan.entity';
import { BenefitModule } from 'src/benefit/benefit.module';

@Module({
  imports: [TypeOrmModule.forFeature([Plan]), BenefitModule],
  controllers: [PlanController],
  providers: [PlanService],
  exports: [PlanService],
})
export class PlanModule {}
