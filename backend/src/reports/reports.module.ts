import { Module, forwardRef } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { BillingModule } from 'src/billing/billing.module';
import { DoctorModule } from 'src/doctor/doctor.module';
import { HealthInsuranceModule } from 'src/health-insurance/health-insurance.module';
import { MeetingModule } from 'src/meeting/meeting.module';

@Module({
  imports: [BillingModule, DoctorModule, HealthInsuranceModule, MeetingModule],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
