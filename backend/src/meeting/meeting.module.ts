import { Module } from '@nestjs/common';
import { MeetingController } from './meeting.controller';
import { MeetingService } from './meeting.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meeting } from 'src/entities/meeting.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Meeting])
  ],
  controllers: [MeetingController],
  providers: [MeetingService]
})
export class MeetingModule {}
