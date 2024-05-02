import { Module } from '@nestjs/common';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { DoctorModule } from 'src/doctor/doctor.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Billing } from 'src/entities/billing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Billing]), DoctorModule],
  controllers: [BillingController],
  providers: [BillingService],
})
export class BillingModule {}
