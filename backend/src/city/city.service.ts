import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createCityDto } from './dto/create-city.dto';
import { updateCityDto } from './dto/update-city.dto';
import { City } from 'src/entities/city.entity';

@Injectable()
export class CityService {

    constructor(
        @InjectRepository(City) private cityRepository: Repository<City>
        ) {}

    findAll(): Promise<City[]> {
        return this.cityRepository.find({
            relations: ['province']
        })
    }
    
    async findOne(zipCode: string): Promise<City | HttpException> {
        const cityFound = await this.cityRepository.findOne({
            where: {
                zipCode
            },
            relations: ['province']
        })
        if (!cityFound) {
            throw new HttpException('Ciudad no encontrada', HttpStatus.NOT_FOUND)
        }
        
        return cityFound
    }

    async create(city: createCityDto): Promise<City | HttpException> {
        const cityFound = await this.cityRepository.findOne({
            where: {
                name: city.name
            }
        })
        if (cityFound) {
            throw new HttpException('El nombre ya existe', HttpStatus.BAD_REQUEST)
        }
        
        const newCity = this.cityRepository.create(city)

        return this.cityRepository.save(newCity)
    }

    async update(zipCode: string, city: updateCityDto) {
        const cityFound = await this.cityRepository.findOne({
            where: {
                zipCode
            }
        })
        if (!cityFound) {
            throw new HttpException('Ciudad no encontrada', HttpStatus.NOT_FOUND)
        }
        
        const updateCity = Object.assign(cityFound, city)
        return this.cityRepository.save(updateCity)
    }
    
    async delete(zipCode: string) {
        const result = await this.cityRepository.delete({zipCode})
    
        if (result.affected == 0) {
            throw new HttpException('Ciudad no encontrada', HttpStatus.NOT_FOUND)
        }

        return result
    }
}
