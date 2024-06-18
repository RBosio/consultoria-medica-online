import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { BillingService } from './billing.service';
import { Roles } from 'src/auth/roles.decorator';
import { RoleEnum } from 'src/enums/role.enum';
import { CreateBillingDto } from './dto/create-billing.dto';

@Controller('billing')
@UseGuards(AuthGuard, RolesGuard)
export class BillingController {
  constructor(private billingService: BillingService) {}

  @Get(':month/:year')
  @Roles(RoleEnum.Admin)
  async getBillingsByMonthAndYear(
    @Param('month') month: string,
    @Param('year') year: string,
  ) {
    return this.billingService.getBillingsByMonthAndYear(+month, +year);
  }

  @Get(':id/:month/:year')
  @Roles(RoleEnum.Admin)
  async getBilling(
    @Param('id') id: string,
    @Param('month') month: string,
    @Param('year') year: string,
  ) {
    return this.billingService.getBilling(+month, +year, +id);
  }

  @Post()
  @Roles(RoleEnum.Admin)
  async save(@Body() createBillingDto: CreateBillingDto) {
    return this.billingService.save(createBillingDto);
  }
}
