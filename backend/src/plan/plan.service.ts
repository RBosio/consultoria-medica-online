import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createPlanDto } from './dto/create-plan.dto';
import { updatePlanDto } from './dto/update-plan.dto';
import { Plan } from 'src/entities/plan.entity';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { catchError, map } from 'rxjs';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plan) private planRepository: Repository<Plan>,
    private configService: ConfigService,
    private httpService: HttpService,
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

  async create(plan: createPlanDto): Promise<any> {
    const planFound = await this.planRepository.findOne({
      where: {
        name: plan.name,
      },
    });
    if (planFound) {
      throw new HttpException('El nombre ya existe', HttpStatus.BAD_REQUEST);
    }
    const newPlan = this.planRepository.create(plan);

    this.httpService
      .post(
        'https://api.mercadopago.com/preapproval_plan',
        {
          reason: 'Plan de suscripción - ' + newPlan.name,
          auto_recurring: {
            frequency: 1,
            frequency_type: 'months',
            repetitions: 12,
            billing_day: 10,
            billing_day_proportional: true,
            transaction_amount: newPlan.price,
            currency_id: 'ARS',
          },
          payment_methods_allowed: {
            payment_types: [{}],
            payment_methods: [{}],
          },
          back_url: 'https://www.mercadopago.com.ar',
        },
        {
          headers: {
            Authorization: `Bearer ${this.configService.get(
              'MP_ACCESS_TOKEN_SUB',
            )}`,
            'Content-Type': 'application/json',
          },
        },
      )
      .pipe(
        map((res) => res),
        catchError((error) => {
          console.error(error);
          return error;
        }),
      )
      .subscribe((res: any) => {
        newPlan.planId = res.data.id;
        return this.planRepository.save(newPlan);
      });

    return true;
  }

  async subscribe(id: number, cardToken: string): Promise<any> {
    const planFound = await this.planRepository.findOne({
      where: {
        id,
      },
    });
    if (!planFound) {
      throw new HttpException('El plan no existe', HttpStatus.NOT_FOUND);
    }

    this.httpService
      .post(
        'https://api.mercadopago.com/preapproval',
        {
          preapproval_plan_id: planFound.planId,
          reason: 'Plan de suscripción - ' + planFound.name,
          external_reference: 'YG-1234',
          payer_email: 'test_user@testuser.com',
          card_token_id: cardToken,
          auto_recurring: {
            frequency: 1,
            frequency_type: 'months',
            start_date: new Date().toString(),
            end_date: '2030-07-20T15:59:52.581Z',
            transaction_amount: planFound.price,
            currency_id: 'ARS',
          },
          back_url: 'https://www.mercadopago.com.ar',
          status: 'authorized',
        },
        {
          headers: {
            Authorization: `Bearer ${this.configService.get(
              'MP_ACCESS_TOKEN_SUB',
            )}`,
            'Content-Type': 'application/json',
            'X-Idempotency-Key': uuid(),
          },
        },
      )
      .pipe(
        map((res) => res),
        catchError((error) => {
          return error;
        }),
      )
      .subscribe((res: any) => {});

    return true;
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
    planFound.benefits = ben;

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
