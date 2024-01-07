import { Controller, Get, Post, Body, Param, Delete, Patch, HttpException, ParseIntPipe, UseGuards } from '@nestjs/common';
import { createCountryDto } from './dto/create-country.dto';
import { updateCountryDto } from './dto/update-country.dto';
import { CountryService } from './country.service';
import { Country } from 'src/entities/country.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RoleEnum } from 'src/enums/role.enum';

@Controller('country')
@UseGuards(AuthGuard, RolesGuard)
export class CountryController {

    constructor(private countryService: CountryService) {}
    
    @Get()
    @Roles(RoleEnum.User, RoleEnum.Doctor, RoleEnum.Admin)
    getCountries(): Promise<Country[]> {
        return this.countryService.findAll()
    }
    
    @Get(':id')
    @Roles(RoleEnum.User, RoleEnum.Doctor, RoleEnum.Admin)
    getCountry(@Param('id', ParseIntPipe) id: number): Promise<Country | HttpException> {
        return this.countryService.findOne(id)
    }

    @Post()
    @Roles(RoleEnum.Admin)
    createCountry(@Body() country: createCountryDto): Promise<Country | HttpException> {
        return this.countryService.create(country)
    }

    @Patch(':id')
    @Roles(RoleEnum.Admin)
    updateCountry(@Param('id', ParseIntPipe) id: number, @Body() country: updateCountryDto) {
        return this.countryService.update(id, country)
    }

    @Delete(':id')
    @Roles(RoleEnum.Admin)
    deleteCountry(@Param('id', ParseIntPipe) id: number) {
        return this.countryService.delete(id)
    }
}
