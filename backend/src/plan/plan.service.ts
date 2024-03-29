import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createPlanDto } from './dto/create-plan.dto';
import { updatePlanDto } from './dto/update-plan.dto';
import { Plan } from 'src/entities/plan.entity';
import { BenefitService } from 'src/benefit/benefit.service';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plan) private planRepository: Repository<Plan>,
    private benefitService: BenefitService,
  ) {}

  findAll(): Promise<Plan[]> {
    return this.planRepository.find({
      relations: {
        benefits: true,
      },
    });
  }

  async findOne(id: number): Promise<Plan> {
    const planFound = await this.planRepository.findOne({
      where: {
        id,
      },
      relations: {
        benefits: true,
      },
    });
    if (!planFound) {
      throw new HttpException('Plan no encontrado', HttpStatus.NOT_FOUND);
    }

    return planFound;
  }

  async create(plan: createPlanDto): Promise<Plan | HttpException> {
    const planFound = await this.planRepository.findOne({
      where: {
        name: plan.name,
      },
    });
    if (planFound) {
      throw new HttpException('El nombre ya existe', HttpStatus.BAD_REQUEST);
    }
    const newPlan = this.planRepository.create(plan);

    return this.planRepository.save(newPlan);
  }

  async modifyBenefits(id: number, { ben }) {
    const planFound = await this.planRepository.findOne({
      where: {
        id,
      },
    });
    if (!planFound) {
      throw new HttpException('Plan no encontrado', HttpStatus.NOT_FOUND);
    }
    planFound.benefits = ben
    /* ben.map(async (b) => {
      const benefit = await this.benefitService.findOne(b);
      planFound.benefits.push(benefit);
      console.log(planFound.benefits);
    }); */

    await this.planRepository.save(planFound);
    return;
  }

  async update(id: number, plan: updatePlanDto) {
    const planFound = await this.planRepository.findOne({
      where: {
        id,
      },
    });
    if (!planFound) {
      throw new HttpException('Plan no encontrado', HttpStatus.NOT_FOUND);
    }

    const updatePlan = Object.assign(planFound, plan);
    return this.planRepository.save(updatePlan);
  }

  async delete(id: number) {
    const result = await this.planRepository.softDelete({ id });

    if (result.affected == 0) {
      throw new HttpException('Plan no encontrado', HttpStatus.NOT_FOUND);
    }

    return result;
  }
}
