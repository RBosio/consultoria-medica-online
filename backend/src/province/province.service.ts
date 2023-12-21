import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createProvinceDto } from './dto/create-province.dto';
import { updateProvinceDto } from './dto/update-province.dto';
import { Province } from 'src/entities/province.entity';

@Injectable()
export class ProvinceService {

    constructor(
        @InjectRepository(Province) private provinceRepository: Repository<Province>
        ) {}

    findAll(): Promise<Province[]> {
        return this.provinceRepository.find({
            relations: ['country']
        })
    }
    
    async findOne(id: number): Promise<Province | HttpException> {
        const provinceFound = await this.provinceRepository.findOne({
            where: {
                id
            },
            relations: ['country']
        })
        if (!provinceFound) {
            throw new HttpException('Provincia no encontrada', HttpStatus.NOT_FOUND)
        }
        
        return provinceFound
    }

    async create(province: createProvinceDto): Promise<Province | HttpException> {
        const provinceFound = await this.provinceRepository.findOne({
            where: {
                name: province.name
            }
        })
        if (provinceFound) {
            throw new HttpException('El nombre ya existe', HttpStatus.BAD_REQUEST)
        }

        const newProvince = this.provinceRepository.create(province)

        return this.provinceRepository.save(newProvince)
    }

    async update(id: number, province: updateProvinceDto) {
        const provinceFound = await this.provinceRepository.findOne({
            where: {
                id
            }
        })
        if (!provinceFound) {
            throw new HttpException('Provincia no encontrada', HttpStatus.NOT_FOUND)
        }
        
        const updateProvince = Object.assign(provinceFound, province)
        return this.provinceRepository.save(updateProvince)
    }
    
    async delete(id: number) {
        const result = await this.provinceRepository.delete({id})
    
        if (result.affected == 0) {
            throw new HttpException('Provincia no encontrada', HttpStatus.NOT_FOUND)
        }

        return result
    }
}
