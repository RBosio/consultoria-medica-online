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
import { createSpecialityDto } from './dto/create-speciality.dto';
import { updateSpecialityDto } from './dto/update-speciality.dto';
import { SpecialityService } from './speciality.service';
import { Speciality } from 'src/entities/speciality.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RoleEnum } from 'src/enums/role.enum';
import { Request } from 'express';

@Controller('speciality')
@UseGuards(AuthGuard, RolesGuard)
export class SpecialityController {
  constructor(private specialityService: SpecialityService) {}

  @Get()
  @Roles(RoleEnum.User, RoleEnum.Doctor, RoleEnum.Admin)
  getSpecialities(@Req() req: Request): Promise<Speciality[]> {
    const page = Number(req.query.page);
    return this.specialityService.findAll(page);
  }

  @Get('count')
  @Roles(RoleEnum.User, RoleEnum.Doctor, RoleEnum.Admin)
  count() {
    return this.specialityService.count();
  }

  @Get(':id')
  @Roles(RoleEnum.User, RoleEnum.Doctor, RoleEnum.Admin)
  getSpeciality(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Speciality | HttpException> {
    return this.specialityService.findOne(id);
  }

  @Post()
  @Roles(RoleEnum.Admin)
  createSpeciality(
    @Body() speciality: createSpecialityDto,
  ): Promise<Speciality | HttpException> {
    return this.specialityService.create(speciality);
  }

  @Patch(':id')
  @Roles(RoleEnum.Admin)
  updateSpeciality(
    @Param('id', ParseIntPipe) id: number,
    @Body() speciality: updateSpecialityDto,
  ) {
    return this.specialityService.update(id, speciality);
  }

  @Delete(':id')
  @Roles(RoleEnum.Admin)
  deleteSpeciality(@Param('id', ParseIntPipe) id: number) {
    return this.specialityService.delete(id);
  }
}
