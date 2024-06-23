import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Response } from 'express';
import { ReportsBillingQuery } from './dto/reports-billing-query.dto';
import { GetUser } from 'src/user/user.decorator';
import { User } from 'src/entities/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RoleEnum } from 'src/enums/role.enum';
import { ReportsMeetingQuery } from './dto/reports-meeting-query.dto';

@Controller('reports')
@UseGuards(AuthGuard, RolesGuard)
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('billing')
  @Roles(RoleEnum.Admin)
  billings(@Res() res: Response, @Query() query: ReportsBillingQuery) {
    const { month, year } = query;
    return this.reportsService.billings(res, month, year);
  }

  @Get('meeting')
  @Roles(RoleEnum.Doctor, RoleEnum.Admin)
  reports(
    @Res() res: Response,
    @GetUser() user: User,
    @Query() query: ReportsMeetingQuery,
  ) {
    // El userId sólo se usa con el administrador (sería el id de la tabla user de un médico en específico, puede no enviarse),
    // para los médicos se toma el id desde el token
    // Todos los parámetros son opcionales
    const { userId, month, year, hi } = query;
    return this.reportsService.meetings(userId, res, month, year, hi, user);
  }
}
