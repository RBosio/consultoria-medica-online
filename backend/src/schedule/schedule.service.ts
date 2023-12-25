import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createScheduleDto } from './dto/create-schedule.dto';
import { updateScheduleDto } from './dto/update-schedule.dto';
import { Schedule } from 'src/entities/schedule.entity';

@Injectable()
export class ScheduleService {

    constructor(
        @InjectRepository(Schedule) private scheduleRepository: Repository<Schedule>
        ) {}

    findAll(): Promise<Schedule[]> {
        return this.scheduleRepository.find({
            relations: ['doctor']
        })
    }
    
    findByDoctor(id: number): Promise<Schedule[]> {
        return this.scheduleRepository.find({
            where: {
                doctorId: id
            }
        })
    }
    
    async findOne(id: number): Promise<Schedule | HttpException> {
        const scheduleFound = await this.scheduleRepository.findOne({
            where: {
                id
            }
        })
        if (!scheduleFound) {
            throw new HttpException('Rango horario no encontrado', HttpStatus.NOT_FOUND)
        }
        
        return scheduleFound
    }

    async create(schedule: createScheduleDto): Promise<Schedule | HttpException> {
        const query = `
        select * from schedule 
        where ((start_hour < ${schedule.end_hour} and start_hour >= ${schedule.start_hour}) 
        or (end_hour <= ${schedule.end_hour} and end_hour > ${schedule.start_hour})) 
        and day = ${schedule.day} 
        and doctorId = ${schedule.doctorId};
        `

        let schedulesFound: Schedule[] = await this.scheduleRepository.query(query)

        if (schedulesFound.length > 0) {
            throw new HttpException('Superposicion de rango horario', HttpStatus.BAD_REQUEST)
        }

        const newSchedule = this.scheduleRepository.create(schedule)

        return this.scheduleRepository.save(newSchedule)
    }

    async update(id: number, schedule: updateScheduleDto) {
        const scheduleFound = await this.scheduleRepository.findOne({
            where: {
                id
            }
        })
        if (!scheduleFound) {
            throw new HttpException('Rango horario no encontrado', HttpStatus.NOT_FOUND)
        }

        const query = `
        select * from schedule 
        where ((start_hour < ${schedule.end_hour} and start_hour >= ${schedule.start_hour}) 
        or (end_hour <= ${schedule.end_hour} and end_hour > ${schedule.start_hour})) 
        and day = ${schedule.day} 
        and doctorId = ${scheduleFound.doctorId};
        `

        let schedulesFound: Schedule[] = await this.scheduleRepository.query(query)

        if (schedulesFound.length > 0) {
            throw new HttpException('Superposicion de rango horario', HttpStatus.BAD_REQUEST)
        }
        
        const updateSchedule = Object.assign(scheduleFound, schedule)
        return this.scheduleRepository.save(updateSchedule)
    }
    
    async delete(id: number) {
        const result = await this.scheduleRepository.delete({id})
    
        if (result.affected == 0) {
            throw new HttpException('Rango horario no encontrado', HttpStatus.NOT_FOUND)
        }

        return result
    }
}
