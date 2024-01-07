import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';
import { User } from 'src/entities/user.entity';
import { CityService } from 'src/city/city.service';
import { Doctor } from 'src/entities/doctor.entity';
import { createDoctorDto } from 'src/doctor/dto/create-doctor.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Doctor) private doctorRepository: Repository<Doctor>,
        private cityService: CityService
        ) {}

    findAll(): Promise<User[]> {
        return this.userRepository.find({
            relations: ['healthInsurance']
        })
    }
    
    async findOne(id: number) {
        const userFound = await this.userRepository.findOne({
            where: {
                id
            },
            relations: ['healthInsurance']
        })
        if (!userFound) {
            throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND)
        }
        
        return userFound
    }

    async findOneByDni(dni: string) {
        const userFound = await this.userRepository.findOne({
            where: {
                dni
            }
        })
        if (!userFound) {
            throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND)
        }
        
        return userFound
    }

    async findOneByEmail(email: string) {
        const userFound = await this.userRepository.findOne({
            where: {
                email
            }
        })
        if (!userFound) {
            throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND)
        }
        
        return userFound
    }

    async create(user: createUserDto, doctor: createDoctorDto) {
        const userFoundDni = await this.userRepository.findOne({
            where: {
                dni: user.dni
            }
        })
        if (userFoundDni) {
            throw new HttpException('El dni ya existe', HttpStatus.BAD_REQUEST)
        }
        
        const userFoundEmail = await this.userRepository.findOne({
            where: {
                email: user.email
            }
        })
        if (userFoundEmail) {
            throw new HttpException('El email ya existe', HttpStatus.BAD_REQUEST)
        }

        let newUser = this.userRepository.create(user)
        
        const city = await this.cityService.findOne(user.zipCode)
        if (!city) {
            throw new HttpException('Ciudad no encontrada', HttpStatus.BAD_REQUEST)
        }
        newUser.city = city

        newUser = await this.userRepository.save(newUser)

        if(doctor) {
            const newDoctor = this.doctorRepository.create(doctor)

            const { specialities } = doctor
            newDoctor.specialities = specialities
            
            newDoctor.user = newUser

            await this.doctorRepository.save(newDoctor)
        }
        
        return newUser
    }

    async update(dni: string, user: updateUserDto) {
        const userFound = await this.userRepository.findOne({
            where: {
                dni
            }
        })
        if (!userFound) {
            throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND)
        }
        
        const updateUser = Object.assign(userFound, user)
        return this.userRepository.save(updateUser)
    }
    
    async delete(dni: string) {
        const result = await this.userRepository.delete({dni})
    
        if (result.affected == 0) {
            throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND)
        }

        return result
    }

    async uploadFile(id: number, url: string) {
        const userFound = await this.userRepository.findOne({
            where: {
                id
            }
        })
        if (!userFound) {
            throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND)
        }

        userFound.image = url
        return this.userRepository.save(userFound)
    }

    async loadUsers() {
        await this.create({
            dni: '33429120',
            email: 'user@gmail.com',
            name: 'User',
            surname: 'User',
            password: '123456',
            phone: '33-333333',
            cuit: "20-33429120-1",
            birthday: new Date("1993-04-01"),
            admin: false,
            gender: false,
            zipCode: "2000",
            healthInsuranceId: 1
        }, null)
        
        await this.create({
            dni: '38233911',
            email: 'doctor@gmail.com',
            name: 'Doctor',
            surname: 'Doctor',
            password: '123456',
            phone: '44-444444',
            cuit: "20-38233911-1",
            birthday: new Date("1998-08-14"),
            admin: false,
            gender: true,
            zipCode: "2000",
            healthInsuranceId: 1
        }, {
            cuil: "20-38233911-1",
            durationMeeting: 30,
            priceMeeting: 3000,
            registration: "slaoeiwmdjsq-mskrieldsx-qmaisd.pdf",
            title: "nfsakjfnaskf-dmasiodmsa-mdasod.pdf",
            specialities: [{
                id: 1,
                name: "",
                doctors: [],
                created_at: new Date(),
                meetings: []
            }]
        })
        
        await this.create({
            dni: '34266592',
            email: 'admin@gmail.com',
            name: 'Admin',
            surname: 'Admin',
            password: '123456',
            phone: '55-555555',
            cuit: "20-33429120-1",
            birthday: new Date("1993-04-01"),
            admin: true,
            gender: true,
            zipCode: "2000",
            healthInsuranceId: 1
        }, null)
    }
}
