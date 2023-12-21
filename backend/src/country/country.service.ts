import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createCountryDto } from './dto/create-country.dto';
import { updateCountryDto } from './dto/update-country.dto';
import { Country } from 'src/entities/country.entity';

@Injectable()
export class CountryService {

    constructor(@InjectRepository(Country) private countryRepository: Repository<Country>) {}

    findAll(): Promise<Country[]> {
        return this.countryRepository.find()
    }
    
    async findOne(id: number): Promise<Country | HttpException> {
        const countryFound = await this.countryRepository.findOne({
            where: {
                id
            }
        })
        if (!countryFound) {
            throw new HttpException('Pais no encontrado', HttpStatus.NOT_FOUND)
        }
        
        return countryFound
    }

    async create(country: createCountryDto): Promise<Country | HttpException> {
        const countryFound = await this.countryRepository.findOne({
            where: {
                name: country.name
            }
        })
        if (countryFound) {
            throw new HttpException('El nombre ya existe', HttpStatus.BAD_REQUEST)
        }

        const newCountry = this.countryRepository.create(country)

        return this.countryRepository.save(newCountry)
    }

    async update(id: number, country: updateCountryDto) {
        const countryFound = await this.countryRepository.findOne({
            where: {
                id
            }
        })
        if (!countryFound) {
            throw new HttpException('Pais no encontrado', HttpStatus.NOT_FOUND)
        }
        
        const updateCountry = Object.assign(countryFound, country)
        return this.countryRepository.save(updateCountry)
    }
    
    async delete(id: number) {
        const result = await this.countryRepository.delete({id})
    
        if (result.affected == 0) {
            throw new HttpException('Pais no encontrado', HttpStatus.NOT_FOUND)
        }

        return result
    }
}
