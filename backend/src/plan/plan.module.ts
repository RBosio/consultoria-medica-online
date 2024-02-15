import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';
import { Plan } from 'src/entities/plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Plan])],
  controllers: [PlanController],
  providers: [PlanService],
  exports: [PlanService]
})
export class PlanModule {}
