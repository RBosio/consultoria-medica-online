import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  HttpException,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { createHealthInsuranceDto } from './dto/create-health-insurance.dto';
import { updateHealthInsuranceDto } from './dto/update-health-insurance.dto';
import { HealthInsuranceService } from './health-insurance.service';
import { HealthInsurance } from 'src/entities/health-insurance.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RoleEnum } from 'src/enums/role.enum';
import { Request } from 'express';

@Controller('healthInsurance')
@UseGuards(AuthGuard, RolesGuard)
export class HealthInsuranceController {
  constructor(private healthInsuranceService: HealthInsuranceService) {}

  @Get()
  @Roles(RoleEnum.User, RoleEnum.Doctor, RoleEnum.Admin)
  getHealthInsurances(@Req() req: Request): Promise<HealthInsurance[]> {
    const page = Number(req.query.page);
    return this.healthInsuranceService.findAll(page);
  }

  @Get('count')
  @Roles(RoleEnum.User, RoleEnum.Doctor, RoleEnum.Admin)
  count() {
    return this.healthInsuranceService.count();
  }

  @Get(':id')
  @Roles(RoleEnum.User, RoleEnum.Doctor, RoleEnum.Admin)
  getHealthInsurance(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<HealthInsurance | HttpException> {
    return this.healthInsuranceService.findOne(id);
  }

  @Post()
  @Roles(RoleEnum.Admin)
  createHealthInsurance(
    @Body() healthInsurance: createHealthInsuranceDto,
  ): Promise<HealthInsurance | HttpException> {
    return this.healthInsuranceService.create(healthInsurance);
  }

  @Patch(':id')
  @Roles(RoleEnum.Admin)
  updateHealthInsurance(
    @Param('id', ParseIntPipe) id: number,
    @Body() healthInsurance: updateHealthInsuranceDto,
  ) {
    return this.healthInsuranceService.update(id, healthInsurance);
  }

  @Delete(':id')
  @Roles(RoleEnum.Admin)
  deleteHealthInsurance(@Param('id', ParseIntPipe) id: number) {
    return this.healthInsuranceService.delete(id);
  }
}
