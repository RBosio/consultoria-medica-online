import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';
import { User } from 'src/entities/user.entity';
import { CityService } from 'src/city/city.service';
import { Doctor } from 'src/entities/doctor.entity';
import { createDoctorDto } from 'src/doctor/dto/create-doctor.dto';
import { Speciality } from 'src/entities/speciality.entity';
import { HealthInsurance } from 'src/entities/health-insurance.entity';
import { HealthInsuranceService } from 'src/health-insurance/health-insurance.service';
import { UserHealthInsurance } from 'src/entities/userHealthInsurances.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Doctor) private doctorRepository: Repository<Doctor>,
        @InjectRepository(UserHealthInsurance) private userHealthInsuranceRepository: Repository<UserHealthInsurance>,
        private cityService: CityService,
        private healthInsuranceService: HealthInsuranceService
        ) {}

    async findAll(): Promise<User[]> {
        const usersFound = await this.userRepository.find({
            relations: {
                healthInsurances: {
                    healthInsurance: true
                }
            }
        })
        usersFound.map(user => user.password = "");

        return usersFound
    }
    
    async findOne(id: number) {
        const userFound = await this.userRepository.findOne({
            where: {
                id
            },
            relations: {
                healthInsurances: {
                    healthInsurance: true
                }
            }
        })
        if (!userFound) {
            throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND)
        }
        userFound.password = ""
    
        return userFound
    }

    async findOneByDni(dni: string) {
        const userFound = await this.userRepository.findOne({
            where: {
                dni
            },
            relations: {
                healthInsurances: {
                    healthInsurance: true
                }
            }
        })
        if (!userFound) {
            throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND)
        }
        userFound.password = ""
        
        return userFound
    }

    async findOneByEmail(email: string) {
        const userFound = await this.userRepository.findOne({
            where: {
                email
            },
            relations: {
                healthInsurances: {
                    healthInsurance: true
                }
            }
        })
        if (!userFound) {
            throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND)
        }
        
        return userFound
    }

    async findAdmin() {
        const userFound = await this.userRepository.findOne({
            where: {
                admin: true
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
        newUser.healthInsurances = []
        
        newUser = await this.userRepository.save(newUser)

        if(doctor) {
            const newDoctor = this.doctorRepository.create(doctor)

            const { specialities } = doctor
            newDoctor.specialities = specialities
            
            newDoctor.user = newUser

            await this.doctorRepository.save(newDoctor)
        }
        newUser.password = ""

        user.his.map(async hi => {
            const healthInsurance = await this.healthInsuranceService.findOne(hi)
            
            const userHI = this.userHealthInsuranceRepository.create({
                user: newUser,
                healthInsurance
            })
            await this.userHealthInsuranceRepository.save(userHI)
        })

        return newUser
    }

    async update(id: number, user: updateUserDto) {
        const userFound = await this.userRepository.findOne({
            where: {
                id
            },
            relations: {
                healthInsurances: {
                    healthInsurance: true
                }
            }
        })
        if (!userFound) {
            throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND)
        }

        const updateUser = Object.assign(userFound, user)

        if(user.password) {
            await updateUser.hashPassword()
        }

        if(user.healthInsurance) {
            const hi = await this.userHealthInsuranceRepository.findOne({
                where: {
                    userId: id,
                    healthInsuranceId: user.healthInsurance
                }
            })
            if (!hi) {
                throw new HttpException('Obra social no encontrada', HttpStatus.NOT_FOUND)
            }

            hi.verified = true

            this.userHealthInsuranceRepository.save(hi)
        } else {
            const hi = await this.userHealthInsuranceRepository.find({
                where: {
                    userId: id
                }
            })

            updateUser.healthInsurances = hi
        }
        
        return this.userRepository.save(updateUser)
    }
    
    async delete(dni: string) {
        const result = await this.userRepository.delete({dni})
    
        if (result.affected == 0) {
            throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND)
        }

        return result
    }

    async uploadImage(dni: string, url: string) {
        const userFound = await this.userRepository.findOne({
            where: {
                dni
            }
        })
        if (!userFound) {
            throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND)
        }

        userFound.image = url
        return this.userRepository.save(userFound)
    }

    async uploadHealthInsurance(id: number, healthInsuranceId: number, url: string) {
        const hi = await this.userHealthInsuranceRepository.findOne({
            where: {
                userId: id,
                healthInsuranceId
            }
        })
        if (!hi) {
            throw new HttpException('Obra social no encontrada', HttpStatus.NOT_FOUND)
        }

        hi.file_url = url

        this.userHealthInsuranceRepository.save(hi)
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
            his: [1]
        }, null)
        
        const spec1 = new Speciality()
        spec1.id = 1

        const spec2 = new Speciality()
        spec2.id = 2

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
            his: [1]
        }, {
            cuil: "20-38233911-1",
            durationMeeting: 30,
            priceMeeting: 3000,
            employmentDate: new Date('1998-04-08T06:00:00'),
            description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Saepe possimus ad ea nisi iusto temporibus cum, voluptatibus fugiat magnam maiores consequatur, architecto harum dignissimos deleniti eius, quisquam natus minus quas. Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel aspernatur repellendus, eos, cupiditate consectetur eum modi laboriosam vero officia quibusdam earum tenetur omnis similique autem ab facilis aut. Laborum, voluptatum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae, deleniti deserunt iste corporis possimus, eos facere quis quidem, consequuntur sapiente quae! Quidem repellendus ab nemo praesentium. Sequi modi quis et!",
            address: 'St. Exupery 240',
            planId: 1,
            specialities: [spec1, spec2]
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
            his: [1, 2]
        }, null)
    }
}
