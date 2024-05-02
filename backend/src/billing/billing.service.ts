import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Billing } from 'src/entities/billing.entity';
import { Repository } from 'typeorm';
import { createBillingDto } from './dto/create-billing.dto';
import { DoctorService } from 'src/doctor/doctor.service';

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(Billing) private billingRepository: Repository<Billing>,
    private doctorService: DoctorService,
  ) {}

  async getBilling(month: number, year: number, doctorId: number) {
    const billing = await this.billingRepository.findOne({
      where: {
        month,
        year,
        doctor: {
          id: doctorId,
        },
      },
    });

    if (!billing) return;

    return billing;
  }

  async save(createBillingDto: createBillingDto) {
    const billing = this.billingRepository.create(createBillingDto);

    const doctor = await this.doctorService.findOne(createBillingDto.doctorId);
    billing.doctor = doctor;

    return this.billingRepository.save(billing);
  }
}
