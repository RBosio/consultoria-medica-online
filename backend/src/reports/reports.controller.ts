import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Res,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Response } from 'express';
import { ReportsBillingQuery } from './dto/reports-billing-query.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('billing')
  billings(@Res() res: Response, @Query() query: ReportsBillingQuery) {
    const { month, year } = query;
    return this.reportsService.billings(res, month, year);
  }

  @Get('meeting/:userId/:month/:year/:hi')
  reports(
    @Param('userId', ParseIntPipe) userId: number,
    @Res() res: Response,
    @Param('month', ParseIntPipe) month: number,
    @Param('year', ParseIntPipe) year: number,
    @Param('hi', ParseIntPipe) hi: number,
  ) {
    return this.reportsService.meetings(userId, res, month, year, hi);
  }
}
