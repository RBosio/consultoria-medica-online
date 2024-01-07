import { Controller, Get, Post, Body, Param, Delete, Patch, HttpException, ParseIntPipe, UseGuards } from '@nestjs/common';
import { createProvinceDto } from './dto/create-province.dto';
import { updateProvinceDto } from './dto/update-province.dto';
import { ProvinceService } from './province.service';
import { Province } from 'src/entities/province.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RoleEnum } from 'src/enums/role.enum';

@Controller('province')
@UseGuards(AuthGuard, RolesGuard)
export class ProvinceController {
    
    constructor(private provinceService: ProvinceService) {}
    
    @Get()
    @Roles(RoleEnum.User, RoleEnum.Doctor, RoleEnum.Admin)
    getProvinces(): Promise<Province[]> {
        return this.provinceService.findAll()
    }
    
    @Get(':id')
    @Roles(RoleEnum.User, RoleEnum.Doctor, RoleEnum.Admin)
    getProvince(@Param('id', ParseIntPipe) id: number): Promise<Province | HttpException> {
        return this.provinceService.findOne(id)
    }

    @Post()
    @Roles(RoleEnum.Admin)
    createProvince(@Body() province: createProvinceDto): Promise<Province | HttpException> {
        return this.provinceService.create(province)
    }

    @Patch(':id')
    @Roles(RoleEnum.Admin)
    updateProvince(@Param('id', ParseIntPipe) id: number, @Body() province: updateProvinceDto) {
        return this.provinceService.update(id, province)
    }

    @Delete(':id')
    @Roles(RoleEnum.Admin)
    deleteProvince(@Param('id', ParseIntPipe) id: number) {
        return this.provinceService.delete(id)
    }
}
