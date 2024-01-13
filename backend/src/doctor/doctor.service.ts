import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { updateDoctorDto } from './dto/update-doctor.dto';
import { Doctor } from 'src/entities/doctor.entity';
import { UserService } from 'src/user/user.service';
import { getDoctorsDto } from './dto/get-doctors.dto';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';
import { SpecialityService } from 'src/speciality/speciality.service';

@Injectable()
export class DoctorService {
    constructor(
        @InjectRepository(Doctor) private doctorRepository: Repository<Doctor>,
        private userService: UserService,
        private specialityService: SpecialityService
        ) {}

    async findAll(query: getDoctorsDto) {
        const { name, avgRate, seniority, specialityId, planId, page, perPage } = query
        const moment = extendMoment(Moment)
        
        let doctorsFound = await this.doctorRepository.find({
            relations: ['user', 'specialities', 'plan']
        })

        if(!name && !avgRate && !seniority && !specialityId && !planId) {
            return this.paginate(doctorsFound, page, perPage)
        }        

        if(name) {
            doctorsFound = doctorsFound.filter(doctor => {
                const fullName = `${doctor.user.name} ${doctor.user.surname}`.toLowerCase();
                const nameToSearch = name.toLowerCase();
                return fullName.includes(nameToSearch);
            }) 
        }
        
        if(avgRate) {
            doctorsFound = doctorsFound.filter(doctor => doctor.avgRate >= avgRate) 
        }

        if(specialityId) {
            const speciality = await this.specialityService.findOne(specialityId)
            
            doctorsFound = doctorsFound.filter(doctor => doctor.specialities.some(val => val.id === speciality.id))
        }

        if(planId) {
            doctorsFound = doctorsFound.filter(doctor => doctor.plan ? doctor.plan.id == planId : false) 
        }

        const dateNow = moment(new Date())
        doctorsFound = doctorsFound.map(doctor => {
            const employmentDate = moment(doctor.employmentDate)
            const diff = dateNow.diff(employmentDate, 'years')
            
            return { ...doctor, seniority: diff }
        })

        if(seniority) {
            doctorsFound = doctorsFound.filter(doctor => doctor.seniority >= seniority)
        }

        return this.paginate(doctorsFound, page, perPage)
    }

    paginate(items, page = 1, perPage = 10) {
        const offset = perPage * (page - 1);
        const totalPages = Math.ceil(items.length / perPage);
        const paginatedItems = items.slice(offset, perPage * page);
      
        return {
            previousPage: page - 1 ? page - 1 : null,
            nextPage: (totalPages > page) ? page + 1 : null,
            total: items.length,
            totalPages: totalPages,
            items: paginatedItems
        };
    };
    
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
