import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { updateDoctorDto } from './dto/update-doctor.dto';
import { Doctor } from 'src/entities/doctor.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class DoctorService {
    constructor(
        @InjectRepository(Doctor) private doctorRepository: Repository<Doctor>,
        private userService: UserService
        ) {}

    findAll(): Promise<Doctor[]> {
        return this.doctorRepository.find({
            relations: ['user', 'schedules']
        })
    }

    findDoctorsBySpeciality(id: number): Promise<Doctor[]> {
        return this.doctorRepository.find({
            where: {
                specialities: {
                    id
                }
            }
        })
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
            }
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
            }
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
}
