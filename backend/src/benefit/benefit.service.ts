import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createBenefitDto } from './dto/create-benefit.dto';
import { updateBenefitDto } from './dto/update-benefit.dto';
import { Benefit } from 'src/entities/benefit.entity';

@Injectable()
export class BenefitService {
  constructor(
    @InjectRepository(Benefit) private benefitRepository: Repository<Benefit>,
  ) {}

  findAll(): Promise<Benefit[]> {
    return this.benefitRepository.find();
  }

  async findOne(id: number): Promise<Benefit> {
    const benefitFound = await this.benefitRepository.findOne({
      where: {
        id,
      },
      relations: {
        plans: true,
      },
    });
    if (!benefitFound) {
      throw new HttpException('Beneficio no encontrado', HttpStatus.NOT_FOUND);
    }

    return benefitFound;
  }

  async create(benefit: createBenefitDto): Promise<Benefit | HttpException> {
    const benefitFound = await this.benefitRepository.findOne({
      where: {
        name: benefit.name,
      },
    });
    if (benefitFound) {
      throw new HttpException('El nombre ya existe', HttpStatus.BAD_REQUEST);
    }

    const newBenefit = this.benefitRepository.create(benefit);

    return this.benefitRepository.save(newBenefit);
  }

  async update(id: number, benefit: updateBenefitDto) {
    const benefitFound = await this.benefitRepository.findOne({
      where: {
        id,
      },
    });
    if (!benefitFound) {
      throw new HttpException('Beneficio no encontrado', HttpStatus.NOT_FOUND);
    }

    const updateBenefit = Object.assign(benefitFound, benefit);
    return this.benefitRepository.save(updateBenefit);
  }

  async delete(id: number) {
    const result = await this.benefitRepository.softDelete({ id });

    if (result.affected == 0) {
      throw new HttpException('Beneficio no encontrado', HttpStatus.NOT_FOUND);
    }

    return result;
  }
}
