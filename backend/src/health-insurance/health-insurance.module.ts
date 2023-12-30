import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthInsuranceController } from './health-insurance.controller';
import { HealthInsuranceService } from './health-insurance.service';
import { HealthInsurance } from 'src/entities/health-insurance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HealthInsurance])],
  controllers: [HealthInsuranceController],
  providers: [HealthInsuranceService]
})
export class HealthInsuranceModule {}
