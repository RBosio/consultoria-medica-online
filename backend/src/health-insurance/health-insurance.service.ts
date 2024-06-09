import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createHealthInsuranceDto } from './dto/create-health-insurance.dto';
import { updateHealthInsuranceDto } from './dto/update-health-insurance.dto';
import { HealthInsurance } from 'src/entities/health-insurance.entity';

@Injectable()
export class HealthInsuranceService {
  constructor(
    @InjectRepository(HealthInsurance)
    private healthInsuranceRepository: Repository<HealthInsurance>,
  ) {}

  findAll(page: number): Promise<HealthInsurance[]> {
    return this.healthInsuranceRepository.find({
      skip: page ? (page - 1) * 10 : 0,
      take: 10,
    });
  }

  count() {
    return this.healthInsuranceRepository.count()
  }

  async findOne(id: number): Promise<HealthInsurance> {
    const healthInsuranceFound = await this.healthInsuranceRepository.findOne({
      where: {
        id,
      },
    });
    if (!healthInsuranceFound) {
      throw new HttpException(
        'Obra social no encontrada',
        HttpStatus.NOT_FOUND,
      );
    }

    return healthInsuranceFound;
  }

  async create(
    healthInsurance: createHealthInsuranceDto,
  ): Promise<HealthInsurance | HttpException> {
    const healthInsuranceFound = await this.healthInsuranceRepository.findOne({
      where: {
        name: healthInsurance.name,
      },
    });
    if (healthInsuranceFound) {
      throw new HttpException('El nombre ya existe', HttpStatus.BAD_REQUEST);
    }

    const newHealthInsurance =
      this.healthInsuranceRepository.create(healthInsurance);

    return this.healthInsuranceRepository.save(newHealthInsurance);
  }

  async update(id: number, healthInsurance: updateHealthInsuranceDto) {
    const healthInsuranceFound = await this.healthInsuranceRepository.findOne({
      where: {
        id,
      },
    });
    if (!healthInsuranceFound) {
      throw new HttpException(
        'Obra social no encontrada',
        HttpStatus.NOT_FOUND,
      );
    }

    const updateHealthInsurance = Object.assign(
      healthInsuranceFound,
      healthInsurance,
    );
    return this.healthInsuranceRepository.save(updateHealthInsurance);
  }

  async delete(id: number) {
    const result = await this.healthInsuranceRepository.softDelete({ id });

    if (result.affected == 0) {
      throw new HttpException(
        'Obra social no encontrada',
        HttpStatus.NOT_FOUND,
      );
    }

    return result;
  }
}
