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

  @Get('meeting/:userId/:month/:year/:hi')
  @Roles(RoleEnum.Doctor, RoleEnum.Admin)
  reports(
    @Param('userId', ParseIntPipe) userId: number,
    @Res() res: Response,
    @Param('month', ParseIntPipe) month: number,
    @Param('year', ParseIntPipe) year: number,
    @Param('hi', ParseIntPipe) hi: number,
    @GetUser() user: User,
  ) {
    return this.reportsService.meetings(userId, res, month, year, hi, user);
  }
}
