import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Billing } from 'src/entities/billing.entity';
import { Repository } from 'typeorm';
import { CreateBillingDto } from './dto/create-billing.dto';
import { DoctorService } from 'src/doctor/doctor.service';
import { MeetingService } from 'src/meeting/meeting.service';

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(Billing) private billingRepository: Repository<Billing>,
    private doctorService: DoctorService,
    private meetingService: MeetingService,
  ) {}

  async getBillings(month: number, year: number) {
    return this.billingRepository.find({
      where: {
        month,
        year,
      },
      relations: {
        doctor: {
          user: true,
        },
      },
    });
  }

  async getBillingsByMonthAndYear(month: number, year: number) {
    const meetings = await this.meetingService.findByMonthAndYear(month, year);
    const doctors = [];
    let response = [];

    meetings.map((meeting) => {
      if (doctors.includes(meeting.doctorId)) {
        response = response.map((m) => {
          if (m.doctor.id === meeting.doctorId) {
            return { ...m, price: m.price + +meeting.price };
          }

          return m;
        });
      } else {
        doctors.push(meeting.doctorId);
        response.push({
          doctor: meeting.doctor,
          price: +meeting.price,
          paid: 1,
        });
      }
    });

    response = await Promise.all(
      response.map(async (r) => {
        return { ...r, paid: await this.checkPaid(month, year, r.doctor.id) };
      }),
    );

    return response;
  }

  private async checkPaid(month: number, year: number, doctorId: number) {
    const check = await this.billingRepository.find({
      where: {
        doctor: {
          id: doctorId,
        },
        month,
        year,
      },
    });

    return check.length > 0;
  }

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

  async save(createBillingDto: CreateBillingDto) {
    if (createBillingDto.billings) {
      Promise.all(
        createBillingDto.billings.map(async (billing) => {
          const b = this.billingRepository.create({
            month: createBillingDto.month,
            year: createBillingDto.year,
            total: billing.total,
            cbu: billing.cbu,
          });

          const doctor = await this.doctorService.findOne(billing.doctorId);
          b.doctor = doctor;

          return this.billingRepository.save(b);
        }),
      );
    } else {
      const billing = this.billingRepository.create(createBillingDto);

      const doctor = await this.doctorService.findOne(
        createBillingDto.doctorId,
      );
      billing.doctor = doctor;

      return this.billingRepository.save(billing);
    }
  }
}
