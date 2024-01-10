import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { updateDoctorDto } from './dto/update-doctor.dto';
import { Doctor } from 'src/entities/doctor.entity';
import { UserService } from 'src/user/user.service';
import { getDoctorsDto } from './dto/get-doctors.dto';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';

@Injectable()
export class DoctorService {
    constructor(
        @InjectRepository(Doctor) private doctorRepository: Repository<Doctor>,
        private userService: UserService
        ) {}

    async findAll(query: getDoctorsDto): Promise<Doctor[]> {
        const { name, avgRate, seniority, specialityId } = query
        const moment = extendMoment(Moment)
        
        const doctorsFound = await this.doctorRepository.find({
            relations: ['user'],
            where: {
                user: {
                    name
                },
                avgRate: MoreThan(avgRate),
                specialities: {
                    id: specialityId
                }
            }
        })

        let doctors = doctorsFound

        if(seniority) {
            const dateNow = moment(new Date())
            doctors = doctorsFound.map(doctor => {
                const employmentDate = moment(doctor.employmentDate)
                const diff = dateNow.diff(employmentDate, 'years')
                
                return { ...doctor, seniority: diff }
            })

            doctors = doctors.filter(doctor => doctor.seniority >= seniority)
        }

        return doctors
    }
    
    async findOne(id: number) {
        const doctorFound = await this.doctorRepository.findOne({
            where: {
                id
            },
            relations: ['user', 'schedules']
        })
        
        if (!doctorFound) {
            throw new HttpException('Medico no encontrado', HttpStatus.NOT_FOUND)
        }
        
        return doctorFound
    }
    
    async verify(id: number) {
        const doctorFound = await this.doctorRepository.findOne({
            where: {
                id
            },
            relations: ['user']
        })
        
        if (!doctorFound) {
            throw new HttpException('Medico no encontrado', HttpStatus.NOT_FOUND)
        }

        doctorFound.verified = true

        return this.doctorRepository.save(doctorFound)
    }

    async update(id: number, doctor: updateDoctorDto) {
        const doctorFound = await this.doctorRepository.findOne({
            where: {
                id
            },
            relations: ['user']
        })

        if (!doctorFound) {
            throw new HttpException('Medico no encontrado', HttpStatus.NOT_FOUND)
        }
        
        const updateDoctor = Object.assign(doctorFound, doctor)
        return this.doctorRepository.save(updateDoctor)
    }
    
    async delete(id: number) {
        const doctor = await this.doctorRepository.findOne({
            where: {
                id
            },
            relations: ['user']
        })

        
        const result = await this.doctorRepository.delete({id})
        
        if (result.affected == 0) {
            throw new HttpException('Medico no encontrado', HttpStatus.NOT_FOUND)
        }
        
        await this.userService.delete(doctor.user.dni)
        
        return result
    }

    async uploadRegistration(id: number, url: string) {
        const doctorFound = await this.doctorRepository.findOne({
            where: {
                id
            },
            relations: ['user']
        })
        if (!doctorFound) {
            throw new HttpException('Medico no encontrado', HttpStatus.NOT_FOUND)
        }

        doctorFound.registration = url
        return this.doctorRepository.save(doctorFound)
    }
    
    async uploadTitle(id: number, url: string) {
        const doctorFound = await this.doctorRepository.findOne({
            where: {
                id
            },
            relations: ['user']
        })
        if (!doctorFound) {
            throw new HttpException('Medico no encontrado', HttpStatus.NOT_FOUND)
        }

        doctorFound.title = url
        return this.doctorRepository.save(doctorFound)
    }
}
