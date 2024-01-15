import { Controller, Get, Body, Param, Delete, Patch, HttpException, Post, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { MeetingService, RequestT } from './meeting.service';
import { Meeting } from 'src/entities/meeting.entity';
import { createMeetingDto } from './dto/create-meeting.dto';
import { updateMeetingDto } from './dto/update-meeting.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RoleEnum } from 'src/enums/role.enum';
import { joinMeetingResponseDto } from './dto/join-meeting-response.dto';

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
    @Roles(RoleEnum.User, RoleEnum.Doctor)
    getMeetingsByUser(@Param('userId', ParseIntPipe) userId: number): Promise<Meeting[]> {
        return this.meetingService.findAllByUser(userId)
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

    @Delete(':id/:startDatetime')
    @Roles(RoleEnum.User)
    deleteMeeting(@Param('id') id: number, @Param('startDatetime') startDatetime: Date) {
        return this.meetingService.delete(id, startDatetime)
    }
}
