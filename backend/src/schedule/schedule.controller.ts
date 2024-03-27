import { Controller, Get, Post, Body, Param, Delete, Patch, HttpException, ParseIntPipe, UseGuards } from '@nestjs/common';
import { createScheduleDto } from './dto/create-schedule.dto';
import { updateScheduleDto } from './dto/update-schedule.dto';
import { ScheduleService } from './schedule.service';
import { Schedule } from 'src/entities/schedule.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RoleEnum } from 'src/enums/role.enum';
import { ScheduleResponseDto } from './dto/schedule-response.dto';

@Controller('schedule')
@UseGuards(AuthGuard, RolesGuard)
export class ScheduleController {

    constructor(private scheduleService: ScheduleService) {}
    
    @Get(':doctorId')
    @Roles(RoleEnum.User, RoleEnum.Doctor, RoleEnum.Admin)
    getSchedules(@Param('doctorId', ParseIntPipe) doctorId: number): Promise<Schedule[]> {
        return this.scheduleService.findAll(doctorId)
    }
    
    @Get('doctor/:doctorId')
    @Roles(RoleEnum.User, RoleEnum.Doctor, RoleEnum.Admin)
    getSchedulesByDoctor(@Param('doctorId', ParseIntPipe) doctorId: number): Promise<ScheduleResponseDto[]> {
        return this.scheduleService.findByDoctor(doctorId)
    }

    @Post()
    @Roles(RoleEnum.Doctor)
    createSchedule(@Body() schedule: createScheduleDto): Promise<Schedule | HttpException> {
        return this.scheduleService.create(schedule)
    }

    @Patch(':id')
    @Roles(RoleEnum.Doctor)
    updateSchedule(@Param('id', ParseIntPipe) id: number, @Body() schedule: updateScheduleDto) {
        return this.scheduleService.update(id, schedule)
    }

    @Delete(':id')
    @Roles(RoleEnum.Doctor)
    deleteSchedule(@Param('id', ParseIntPipe) id: number) {
        return this.scheduleService.delete(id)
    }
}
