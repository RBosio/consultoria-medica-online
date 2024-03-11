import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { Notification } from 'src/entities/notification.entity';
import { UserModule } from 'src/user/user.module';
import { MeetingModule } from 'src/meeting/meeting.module';
import { HealthInsuranceModule } from 'src/health-insurance/health-insurance.module';

@Module({
  imports: [TypeOrmModule.forFeature([Notification]), UserModule, MeetingModule, HealthInsuranceModule],
  controllers: [NotificationController],
  providers: [NotificationService]
})
export class NotificationModule {}
