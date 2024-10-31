import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Patch,
  HttpException,
  UseGuards,
  Post,
  Req,
  Query,
} from '@nestjs/common';
import { updateDoctorDto } from './dto/update-doctor.dto';
import { DoctorService } from './doctor.service';
import { Doctor } from 'src/entities/doctor.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RoleEnum } from 'src/enums/role.enum';
import { getDoctorsDto } from './dto/get-doctors.dto';
import { createDoctorDto } from './dto/create-doctor.dto';
import { FormDataRequest } from 'nestjs-form-data';

@Controller('doctor')
@UseGuards(AuthGuard, RolesGuard)
export class DoctorController {
  constructor(private doctorService: DoctorService) {}

  @Get()
  @Roles(RoleEnum.User, RoleEnum.Doctor, RoleEnum.Admin)
  getDoctors(@Query() query: getDoctorsDto) {
    return this.doctorService.findAll(query);
  }

  @Get('advertised_doctors')
  @Roles(RoleEnum.User, RoleEnum.Doctor, RoleEnum.Admin)
  getAdvertisedDoctors(@Query() query: getDoctorsDto) {
    return this.doctorService.findAllAdvertisedDoctors();
  }

  @Get(':id')
  @Roles(RoleEnum.User, RoleEnum.Doctor, RoleEnum.Admin)
  getDoctor(@Param('id') id: number): Promise<Doctor | HttpException> {
    return this.doctorService.findOne(id);
  }

  @Get('user/:userId')
  @Roles(RoleEnum.User, RoleEnum.Doctor, RoleEnum.Admin)
  getDoctorByUserId(
    @Param('userId') userId: number,
  ): Promise<Doctor | HttpException> {
    return this.doctorService.findOneByUserId(userId);
  }

  @Patch('verify/:id')
  @Roles(RoleEnum.Admin)
  verifyDoctor(@Param('id') id: number) {
    return this.doctorService.verify(id);
  }

  @Patch('plan/:id')
  @Roles(RoleEnum.Doctor)
  cancelPlan(@Param('id') id: number) {
    return this.doctorService.cancelPlan(id);
  }

  @Patch(':id')
  @Roles(RoleEnum.Doctor)
  updateDoctor(@Param('id') id: number, @Body() doctor: updateDoctorDto) {
    return this.doctorService.update(id, doctor);
  }

  @Delete(':id')
  @Roles(RoleEnum.Doctor)
  deleteDoctor(@Param('id') id: number) {
    return this.doctorService.delete(id);
  }

  @Post('signup')
  @UseGuards(AuthGuard)
  @FormDataRequest()
  signup(@Req() req, @Body() doctor: createDoctorDto) {
    return this.doctorService.create(req.user.id, doctor);
  }
}
