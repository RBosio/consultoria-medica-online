import { Controller, Get, Post, Body, Param, Delete, Patch, HttpException, UseGuards } from '@nestjs/common';
import { createCityDto } from './dto/create-city.dto';
import { updateCityDto } from './dto/update-city.dto';
import { CityService } from './city.service';
import { City } from 'src/entities/city.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RoleEnum } from 'src/enums/role.enum';

@Controller('city')
@UseGuards(AuthGuard, RolesGuard)
export class CityController {

    constructor(private cityService: CityService) {}

    @Get()
    @Roles(RoleEnum.User, RoleEnum.Doctor, RoleEnum.Admin)
    getCities(): Promise<City[]> {
        return this.cityService.findAll()
    }
    
    @Get(':zipCode')
    @Roles(RoleEnum.Admin)
    getCity(@Param('zipCode') zipCode: string): Promise<City | HttpException> {
        return this.cityService.findOne(zipCode)
    }
    
    @Post()
    @Roles(RoleEnum.Admin)
    createCity(@Body() city: createCityDto): Promise<City | HttpException> {
        return this.cityService.create(city)
    }
    
    @Patch(':zipCode')
    @Roles(RoleEnum.Admin)
    updateCity(@Param('zipCode') zipCode: string, @Body() city: updateCityDto) {
        return this.cityService.update(zipCode, city)
    }
    
    @Delete(':zipCode')
    @Roles(RoleEnum.Admin)
    deleteCity(@Param('zipCode') zipCode: string) {
        return this.cityService.delete(zipCode)
    }
}
