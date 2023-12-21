import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';
import { User } from 'src/entities/user.entity';
import { CityService } from 'src/city/city.service';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private cityService: CityService
        ) {}

    findAll(): Promise<User[]> {
        return this.userRepository.find()
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

    async create(user: createUserDto) {
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

        const newUser = this.userRepository.create(user)
        
        const city = await this.cityService.findOne(user.zipCode)
        if (!city) {
            throw new HttpException('Ciudad no encontrada', HttpStatus.BAD_REQUEST)
        }
        newUser.city = city
        
        return this.userRepository.save(newUser)
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
}
