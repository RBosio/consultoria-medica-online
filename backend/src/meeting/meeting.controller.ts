import { Controller, Get, Body, Param, Delete, Patch, HttpException, Post } from '@nestjs/common';
import { MeetingService } from './meeting.service';
import { Meeting } from 'src/entities/meeting.entity';
import { createMeetingDto } from './dto/create-meeting.dto';
import { updateMeetingDto } from './dto/update-meeting.dto';

@Controller('meeting')
export class MeetingController {
    
    constructor(private meetingService: MeetingService) {}

    @Get()
    getMeetings(): Promise<Meeting[]> {
        return this.meetingService.findAll()
    }
    
    @Get(':id/:startDatetime')
    getMeeting(@Param('id') id: number, @Param('startDatetime') startDatetime: Date): Promise<Meeting | HttpException> {
        return this.meetingService.findOne(id, startDatetime)
    }
    
    @Post()
    createMeeting(@Body() meeting: createMeetingDto): Promise<Meeting | HttpException> {
        return this.meetingService.create(meeting)
    }

    @Patch(':id/:startDatetime')
    updateMeeting(@Param('id') id: number, @Param('startDatetime') startDatetime: Date, @Body() meeting: updateMeetingDto) {
        return this.meetingService.update(id, startDatetime, meeting)
    }

    @Delete(':id/:startDatetime')
    deleteMeeting(@Param('id') id: number, @Param('startDatetime') startDatetime: Date) {
        return this.meetingService.delete(id, startDatetime)
    }
}
