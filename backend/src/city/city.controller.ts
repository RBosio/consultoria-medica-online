import { Controller, Get, Post, Body, Param, Delete, Patch, HttpException, UseGuards } from '@nestjs/common';
import { createCityDto } from './dto/create-city.dto';
import { updateCityDto } from './dto/update-city.dto';
import { CityService } from './city.service';
import { City } from 'src/entities/city.entity';

@Controller('city')
export class CityController {

    constructor(private cityService: CityService) {}

    @Get()
    getCities(): Promise<City[]> {
        return this.cityService.findAll()
    }
    
    @Get(':zipCode')
    getCity(@Param('zipCode') zipCode: string): Promise<City | HttpException> {
        return this.cityService.findOne(zipCode)
    }

    @Post()
    createCity(@Body() city: createCityDto): Promise<City | HttpException> {
        return this.cityService.create(city)
    }

    @Patch(':zipCode')
    updateCity(@Param('zipCode') zipCode: string, @Body() city: updateCityDto) {
        return this.cityService.update(zipCode, city)
    }

    @Delete(':zipCode')
    deleteCity(@Param('zipCode') zipCode: string) {
        return this.cityService.delete(zipCode)
    }
}
