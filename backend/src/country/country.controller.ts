import { Controller, Get, Post, Body, Param, Delete, Patch, HttpException, ParseIntPipe, UseGuards } from '@nestjs/common';
import { createCountryDto } from './dto/create-country.dto';
import { updateCountryDto } from './dto/update-country.dto';
import { CountryService } from './country.service';
import { Country } from 'src/entities/country.entity';

@Controller('country')
export class CountryController {

    constructor(private countryService: CountryService) {}
    
    @Get()
    getCountries(): Promise<Country[]> {
        return this.countryService.findAll()
    }
    
    @Get(':id')
    getCountry(@Param('id', ParseIntPipe) id: number): Promise<Country | HttpException> {
        return this.countryService.findOne(id)
    }

    @Post()
    createCountry(@Body() country: createCountryDto): Promise<Country | HttpException> {
        return this.countryService.create(country)
    }

    @Patch(':id')
    updateCountry(@Param('id', ParseIntPipe) id: number, @Body() country: updateCountryDto) {
        return this.countryService.update(id, country)
    }

    @Delete(':id')
    deleteCountry(@Param('id', ParseIntPipe) id: number) {
        return this.countryService.delete(id)
    }
}
