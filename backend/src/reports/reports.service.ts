import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Workbook } from 'exceljs';
import { Response } from 'express';
import * as moment from 'moment';
import { BillingService } from 'src/billing/billing.service';
import { DoctorService } from 'src/doctor/doctor.service';
import { HealthInsurance } from 'src/entities/health-insurance.entity';
import { HealthInsuranceService } from 'src/health-insurance/health-insurance.service';
import { pesos } from 'src/lib/formatCurrency';
import { DataList, MeetingService } from 'src/meeting/meeting.service';

interface excelInput {
  res: Response;
  data: any;
  filename: string;
  columns: any;
  header: any;
}

enum Months {
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
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
    if ((!month && year) || (month && !year)) {
      throw new BadRequestException(
        'El mes y el año son requeridos o bien, ninguno de los 2',
      );
    }

    moment.locale('es');

    const d = await this.billingService.getBillings(month, year);
    const data = d.map((x) => ({
      ...x,
      period: `${Months[x.month - 1]} ${x.year}`,
      total: pesos.format(x.total),
      date: moment(x.date).subtract(3, 'hours').format('LLL'),
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
        header: 'CBU',
        key: 'cbu',
        width: 24,
        outlineLevel: 1,
      },
      {
        header: 'Período',
        key: 'period',
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
    user: any,
  ) {
    let doctor = null;

    if (user.role === 'admin') {
      if (userId) {
        doctor = await this.doctorService.findOneByUserId(userId);
        if (!doctor)
          throw new NotFoundException(
            'No existe un médico con el userId: ' + userId,
          );
      }
    } else {
      doctor = await this.doctorService.findOneByUserId(user.id);
    }

    const data: DataList[] = await this.meetingService.getData(
      doctor,
      month,
      year,
      hi,
    );

    let h: HealthInsurance;
    if (hi) {
      h = await this.healthInsruanceService.findOne(hi);
    }

    const filename = `Reuniones${year && month ? `_${year}-${month}` : ''}${
      doctor ? `_${doctor.user.surname}-${doctor.user.name}` : ''
    }${h ? `_${h.name.replace(' ', '-')}` : ''}`;

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

    if (user.role === 'admin') {
      columns.push(
        {
          header: 'Precio',
          key: 'price',
          width: 24,
          outlineLevel: 1,
        },
        {
          header: 'Médico',
          key: 'doctor',
          width: 24,
          outlineLevel: 1,
        },
      );

      header.push('F');
      header.push('G');
    }

    return this.generateReport({ res, data, filename, columns, header });
  }
}
