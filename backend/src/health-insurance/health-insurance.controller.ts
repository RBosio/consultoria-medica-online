import { Controller, Get, Post, Body, Param, Delete, Patch, HttpException, ParseIntPipe, UseGuards } from '@nestjs/common';
import { createHealthInsuranceDto } from './dto/create-health-insurance.dto';
import { updateHealthInsuranceDto } from './dto/update-health-insurance.dto';
import { HealthInsuranceService } from './health-insurance.service';
import { HealthInsurance } from 'src/entities/health-insurance.entity';

@Controller('healthInsurance')
export class HealthInsuranceController {

    constructor(private healthInsuranceService: HealthInsuranceService) {}
    
    @Get()
    getCountries(): Promise<HealthInsurance[]> {
        return this.healthInsuranceService.findAll()
    }
    
    @Get(':id')
    getHealthInsurance(@Param('id', ParseIntPipe) id: number): Promise<HealthInsurance | HttpException> {
        return this.healthInsuranceService.findOne(id)
    }

    @Post()
    createHealthInsurance(@Body() healthInsurance: createHealthInsuranceDto): Promise<HealthInsurance | HttpException> {
        return this.healthInsuranceService.create(healthInsurance)
    }

    @Patch(':id')
    updateHealthInsurance(@Param('id', ParseIntPipe) id: number, @Body() healthInsurance: updateHealthInsuranceDto) {
        return this.healthInsuranceService.update(id, healthInsurance)
    }

    @Delete(':id')
    deleteHealthInsurance(@Param('id', ParseIntPipe) id: number) {
        return this.healthInsuranceService.delete(id)
    }
}
