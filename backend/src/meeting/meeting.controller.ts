import {
  Controller,
  Get,
  Body,
  Param,
  Patch,
  HttpException,
  Post,
  UseGuards,
  Req,
  ParseIntPipe,
  Query,
  Res,
} from '@nestjs/common';
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
import { Response } from 'express';

@Controller('meeting')
export class MeetingController {
  constructor(private meetingService: MeetingService) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleEnum.User, RoleEnum.Doctor, RoleEnum.Admin)
  getMeetings(): Promise<Meeting[]> {
    return this.meetingService.findAll();
  }

  @Get('user/:userId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleEnum.User, RoleEnum.Admin)
  getMeetingsByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() query: getMeetingsDto,
  ): Promise<Meeting[]> {
    return this.meetingService.findAllByUser(userId, query);
  }

  @Get('doctor/:userId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleEnum.Doctor, RoleEnum.Admin)
  getMeetingsByDoctor(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() query: getMeetingsDto,
  ): Promise<Meeting[]> {
    return this.meetingService.findAllByDoctor(userId, query);
  }

  @Get('medicalRecord/:userId/:doctorId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleEnum.User, RoleEnum.Doctor, RoleEnum.Admin)
  getMeetingsNoMR(
    @Param('userId') userId: number,
    @Param('doctorId') doctorId: number,
  ): Promise<Meeting[] | HttpException> {
    return this.meetingService.findByMedicalRecords(userId, doctorId);
  }

  @Get('lastPayment/:userId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleEnum.User, RoleEnum.Admin)
  lastPayment(@Param('userId') userId: number) {
    return this.meetingService.lastPayment(userId);
  }

  @Get('lastMeeting/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleEnum.User, RoleEnum.Doctor, RoleEnum.Admin)
  getLastMeeting(
    @Param('id') id: number,
    @Req() req: any,
  ): Promise<Meeting | HttpException> {
    return this.meetingService.findLastMeeting(id, req.user.role);
  }

  @Get('report/:userId/:month/:year')
  reports(
    @Param('userId', ParseIntPipe) userId: number,
    @Res() res: Response,
    @Param('month', ParseIntPipe) month: number,
    @Param('year', ParseIntPipe) year: number,
  ) {
    return this.meetingService.generateReport(userId, res, month, year);
  }

  @Get(':id/:startDatetime')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleEnum.User, RoleEnum.Doctor, RoleEnum.Admin)
  getMeeting(
    @Param('id') id: number,
    @Param('startDatetime') startDatetime: Date,
  ): Promise<Meeting | HttpException> {
    return this.meetingService.findOne(id, startDatetime);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleEnum.User, RoleEnum.Admin)
  createMeeting(
    @Body() meeting: createMeetingDto,
    @Req() req: RequestT,
  ): Promise<Meeting | HttpException> {
    return this.meetingService.create(meeting, req);
  }

  @Post('join/:id/:startDatetime')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleEnum.User, RoleEnum.Doctor, RoleEnum.Admin)
  joinMeeting(
    @Req() req: RequestT,
    @Param('id') id: number,
    @Param('startDatetime') startDatetime: Date,
  ): Promise<joinMeetingResponseDto | HttpException> {
    return this.meetingService.joinMeeting(req, id, startDatetime);
  }

  @Post('create-preference/:doctorId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleEnum.User, RoleEnum.Doctor, RoleEnum.Admin)
  createPreference(
    @Body() createPreference: any,
    @Param('doctorId', ParseIntPipe) doctorId: number,
  ): Promise<any | HttpException> {
    return this.meetingService.createPreference(createPreference, doctorId);
  }

  @Patch('pay/:id/:startDatetime')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleEnum.User, RoleEnum.Admin)
  pay(@Param('id') id: number, @Param('startDatetime') startDatetime: Date) {
    return this.meetingService.pay(id, startDatetime);
  }

  @Patch(':id/:startDatetime')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleEnum.User, RoleEnum.Doctor, RoleEnum.Admin)
  updateMeeting(
    @Param('id') id: number,
    @Param('startDatetime') startDatetime: Date,
    @Body() meeting: updateMeetingDto,
  ) {
    return this.meetingService.update(id, startDatetime, meeting);
  }

  @Patch('repr/:id/:startDatetime')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleEnum.User, RoleEnum.Admin)
  reprMeeting(
    @Param('id') id: number,
    @Param('startDatetime') startDatetime: Date,
    @Body() meeting: updateMeetingDto,
  ) {
    return this.meetingService.repr(id, startDatetime, meeting);
  }

  @Patch('finish/:id/:startDatetime')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleEnum.User, RoleEnum.Doctor, RoleEnum.Admin)
  finishMeeting(
    @Param('id') id: number,
    @Param('startDatetime') startDatetime: Date,
  ): Promise<Meeting | HttpException> {
    return this.meetingService.finish(id, startDatetime);
  }
}
