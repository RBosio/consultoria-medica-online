import { Injectable } from '@nestjs/common';
import { Workbook } from 'exceljs';
import { Response } from 'express';
import { BillingService } from 'src/billing/billing.service';
import { DoctorService } from 'src/doctor/doctor.service';
import { HealthInsurance } from 'src/entities/health-insurance.entity';
import { HealthInsuranceService } from 'src/health-insurance/health-insurance.service';
import { DataList, MeetingService } from 'src/meeting/meeting.service';

interface excelInput {
  res: Response;
  data: any;
  filename: string;
  columns: any;
  header: any;
}

@Injectable()
export class ReportsService {
  constructor(
    private billingService: BillingService,
    private doctorService: DoctorService,
    private healthInsruanceService: HealthInsuranceService,
    private meetingService: MeetingService,
  ) {}

  async generateReport({ res, data, filename, columns, header }: excelInput) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('0');

    worksheet.columns = columns;

    data.forEach((val, i, _) => {
      worksheet.addRow(val);
    });

    worksheet.eachRow(function (row, rowNumber) {
      if (rowNumber === 1) {
        worksheet.columns.map((_, idx: number) => {
          worksheet.getCell(`${header[idx]}1`).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '34d399' },
          };
          worksheet.getCell(`${header[idx]}1`).font = {
            name: 'Arial',
            color: { argb: 'FFFFFF' },
            family: 1,
            size: 14,
          };
          worksheet.getCell(`${header[idx]}1`).alignment = {
            vertical: 'middle',
            horizontal: 'center',
          };
        });
      } else {
        worksheet.columns.map((_, idx: number) => {
          worksheet.getCell(`${header[idx]}${rowNumber}`).font = {
            name: 'Arial',
            family: 1,
            size: 10,
          };
          worksheet.getCell(`${header[idx]}${rowNumber}`).alignment = {
            vertical: 'middle',
            horizontal: 'center',
          };
        });
      }
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return res
      .set('Content-Disposition', `attachment; filename=${filename}.xlsx`)
      .send(buffer);
  }

  async billings(res: Response, month: number, year: number) {
    const d = await this.billingService.getBillings(month, year);
    const data = d.map((x) => ({
      ...x,
      doctor: x.doctor.user.surname + ', ' + x.doctor.user.name,
    }));

    const filename = `Pagos${month && year ? '_' + year + '_' + month : ''}`;

    const columns = [
      {
        header: 'Médico',
        key: 'doctor',
        width: 24,
        outlineLevel: 1,
      },
      {
        header: 'Mes',
        key: 'month',
        width: 24,
        outlineLevel: 1,
      },
      {
        header: 'Año',
        key: 'year',
        width: 24,
        outlineLevel: 1,
      },
      {
        header: 'Fecha de pago',
        key: 'date',
        width: 24,
        outlineLevel: 1,
      },
      {
        header: 'Total',
        key: 'total',
        width: 24,
        outlineLevel: 1,
      },
      {
        header: 'CBU',
        key: 'cbu',
        width: 24,
        outlineLevel: 1,
      },
    ];

    const header = ['A', 'B', 'C', 'D', 'E', 'F'];

    return this.generateReport({ res, data, filename, columns, header });
  }

  async meetings(
    userId: number,
    res: Response,
    month: number,
    year: number,
    hi: number,
  ) {
    const doctor = await this.doctorService.findOneByUserId(userId);
    const data: DataList[] = await this.meetingService.getData(
      doctor,
      month,
      year,
      hi,
    );

    let h: HealthInsurance;
    if (hi !== 0) {
      h = await this.healthInsruanceService.findOne(hi);
    }

    const filename = `${year}-${month}_${doctor.user.surname}-${
      doctor.user.name
    }${h !== undefined ? '-' + h.name.replace(' ', '-') : ''}`;

    const columns = [
      {
        header: 'Paciente',
        key: 'user',
        width: 24,
        outlineLevel: 1,
      },
      {
        header: 'Fecha de la reunión',
        key: 'date',
        width: 24,
        outlineLevel: 1,
      },
      {
        header: 'Dni',
        key: 'dni',
        width: 24,
        outlineLevel: 1,
      },
      {
        header: '# de afiliado',
        key: 'num',
        width: 24,
        outlineLevel: 1,
      },
      {
        header: 'Obra social',
        key: 'hi',
        width: 24,
        outlineLevel: 1,
      },
    ];

    const header = ['A', 'B', 'C', 'D', 'E'];

    return this.generateReport({ res, data, filename, columns, header });
  }
}
