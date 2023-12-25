import { Controller, Get, Post, Body, Param, Delete, Patch, HttpException, ParseIntPipe, UseGuards } from '@nestjs/common';
import { createScheduleDto } from './dto/create-schedule.dto';
import { updateScheduleDto } from './dto/update-schedule.dto';
import { ScheduleService } from './schedule.service';
import { Schedule } from 'src/entities/schedule.entity';

@Controller('schedule')
export class ScheduleController {

    constructor(private scheduleService: ScheduleService) {}
    
    @Get()
    getSchedules(): Promise<Schedule[]> {
        return this.scheduleService.findAll()
    }
    
    @Get('doctor/:id')
    getSchedulesByDoctor(@Param('id', ParseIntPipe) id: number): Promise<Schedule[]> {
        return this.scheduleService.findByDoctor(id)
    }
    
    @Get(':id')
    getSchedule(@Param('id', ParseIntPipe) id: number): Promise<Schedule | HttpException> {
        return this.scheduleService.findOne(id)
    }

    @Post()
    createSchedule(@Body() schedule: createScheduleDto): Promise<Schedule | HttpException> {
        return this.scheduleService.create(schedule)
    }

    @Patch(':id')
    updateSchedule(@Param('id', ParseIntPipe) id: number, @Body() schedule: updateScheduleDto) {
        return this.scheduleService.update(id, schedule)
    }

    @Delete(':id')
    deleteSchedule(@Param('id', ParseIntPipe) id: number) {
        return this.scheduleService.delete(id)
    }
}
