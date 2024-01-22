import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalRecordController } from './medical-record.controller';
import { MedicalRecordService } from './medical-record.service';
import { MedicalRecord } from 'src/entities/medical-record.entity';
import { File } from 'src/entities/file.entity';
import { MeetingModule } from 'src/meeting/meeting.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MedicalRecord, File]),
    MeetingModule,
    UserModule
  ],
  controllers: [MedicalRecordController],
  providers: [MedicalRecordService]
})
export class MedicalRecordModule {}
