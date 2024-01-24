import { Controller, Get, Body, Param, Delete, Patch, HttpException, Post, UseGuards, Req, ParseIntPipe, Query } from '@nestjs/common';
import { MeetingService, RequestT } from './meeting.service';
import { Meeting } from 'src/entities/meeting.entity';
import { createMeetingDto } from './dto/create-meeting.dto';
import { updateMeetingDto } from './dto/update-meeting.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RoleEnum } from 'src/enums/role.enum';
import { joinMeetingResponseDto } from './dto/join-meeting-response.dto';
import { getMeetingsDto } from './dto/get-meetings.dto';

@Controller('meeting')
@UseGuards(AuthGuard, RolesGuard)
export class MeetingController {
    
    constructor(private meetingService: MeetingService) {}

    @Get()
    @Roles(RoleEnum.User, RoleEnum.Doctor)
    getMeetings(): Promise<Meeting[]> {
        return this.meetingService.findAll()
    }
    
    @Get('user/:userId')
    @Roles(RoleEnum.User)
    getMeetingsByUser(@Param('userId', ParseIntPipe) userId: number, @Query() query: getMeetingsDto): Promise<Meeting[]> {
        return this.meetingService.findAllByUser(userId, query)
    }

    @Get('doctor/:userId')
    @Roles(RoleEnum.Doctor)
    getMeetingsByDoctor(@Param('userId', ParseIntPipe) userId: number, @Query() query: getMeetingsDto): Promise<Meeting[]> {
        return this.meetingService.findAllByDoctor(userId, query)
    }
    
    @Get(':id/:startDatetime')
    @Roles(RoleEnum.User, RoleEnum.Doctor)
    getMeeting(@Param('id') id: number, @Param('startDatetime') startDatetime: Date): Promise<Meeting | HttpException> {
        return this.meetingService.findOne(id, startDatetime)
    }
    
    @Post()
    @Roles(RoleEnum.User)
    createMeeting(@Body() meeting: createMeetingDto): Promise<Meeting | HttpException> {
        return this.meetingService.create(meeting)
    }

    @Post('join/:id/:startDatetime')
    @Roles(RoleEnum.User, RoleEnum.Doctor)
    joinMeeting(@Req() req: RequestT, @Param('id') id: number, @Param('startDatetime') startDatetime: Date): Promise<joinMeetingResponseDto | HttpException> {
        return this.meetingService.joinMeeting(req, id, startDatetime)
    }

    @Patch(':id/:startDatetime')
    @Roles(RoleEnum.User, RoleEnum.Doctor)
    updateMeeting(@Param('id') id: number, @Param('startDatetime') startDatetime: Date, @Body() meeting: updateMeetingDto) {
        return this.meetingService.update(id, startDatetime, meeting)
    }

    @Patch('cancel/:id/:startDatetime')
    @Roles(RoleEnum.User, RoleEnum.Doctor)
    cancelMeeting(@Param('id') id: number, @Param('startDatetime') startDatetime: Date, @Body() meeting: updateMeetingDto) {
        return this.meetingService.cancel(id, startDatetime, meeting)
    }
}
