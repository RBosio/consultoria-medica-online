import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createSpecialityDto } from './dto/create-speciality.dto';
import { updateSpecialityDto } from './dto/update-speciality.dto';
import { Speciality } from 'src/entities/speciality.entity';

@Injectable()
export class SpecialityService {
  constructor(
    @InjectRepository(Speciality)
    private specialityRepository: Repository<Speciality>,
  ) {}

  findAll(): Promise<Speciality[]> {
    return this.specialityRepository.find();
  }

  async findOne(id: number): Promise<Speciality> {
    const specialityFound = await this.specialityRepository.findOne({
      where: {
        id,
      },
    });
    if (!specialityFound) {
      throw new HttpException(
        'Especialidad no encontrada',
        HttpStatus.NOT_FOUND,
      );
    }

    return specialityFound;
  }

  async create(
    speciality: createSpecialityDto,
  ): Promise<Speciality | HttpException> {
    const specialityFound = await this.specialityRepository.findOne({
      where: {
        name: speciality.name,
      },
    });
    if (specialityFound) {
      throw new HttpException('El nombre ya existe', HttpStatus.BAD_REQUEST);
    }

    const newSpeciality = this.specialityRepository.create(speciality);

    return this.specialityRepository.save(newSpeciality);
  }

  async update(id: number, speciality: updateSpecialityDto) {
    const specialityFound = await this.specialityRepository.findOne({
      where: {
        id,
      },
    });
    if (!specialityFound) {
      throw new HttpException(
        'Especialidad no encontrada',
        HttpStatus.NOT_FOUND,
      );
    }

    const updateSpeciality = Object.assign(specialityFound, speciality);
    return this.specialityRepository.save(updateSpeciality);
  }

  async delete(id: number) {
    const result = await this.specialityRepository.softDelete({ id });

    if (result.affected == 0) {
      throw new HttpException(
        'Especialidad no encontrada',
        HttpStatus.NOT_FOUND,
      );
    }

    return result;
  }
}
