import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { BillingService } from './billing.service';
import { Roles } from 'src/auth/roles.decorator';
import { RoleEnum } from 'src/enums/role.enum';
import { createBillingDto } from './dto/create-billing.dto';

@Controller('billing')
@UseGuards(AuthGuard, RolesGuard)
export class BillingController {
  constructor(private billingService: BillingService) {}

  @Post()
  @Roles(RoleEnum.Admin)
  async save(@Body() createBillingDto: createBillingDto) {
    return this.billingService.save(createBillingDto);
  }
}
