import { Controller, Get, Post, Body, Param, Delete, Patch, HttpException, ParseIntPipe, UseGuards } from '@nestjs/common';
import { createBenefitDto } from './dto/create-benefit.dto';
import { updateBenefitDto } from './dto/update-benefit.dto';
import { BenefitService } from './benefit.service';
import { Benefit } from 'src/entities/benefit.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RoleEnum } from 'src/enums/role.enum';

@Controller('benefit')
@UseGuards(AuthGuard, RolesGuard)
export class BenefitController {

    constructor(private benefitService: BenefitService) {}
    
    @Get()
    @Roles(RoleEnum.User, RoleEnum.Doctor, RoleEnum.Admin)
    getBenefits(): Promise<Benefit[]> {
        return this.benefitService.findAll()
    }
    
    @Get(':id')
    @Roles(RoleEnum.User, RoleEnum.Doctor, RoleEnum.Admin)
    getBenefit(@Param('id', ParseIntPipe) id: number): Promise<Benefit | HttpException> {
        return this.benefitService.findOne(id)
    }

    @Post()
    @Roles(RoleEnum.Admin)
    createBenefit(@Body() benefit: createBenefitDto): Promise<Benefit | HttpException> {
        return this.benefitService.create(benefit)
    }

    @Patch(':id')
    @Roles(RoleEnum.Admin)
    updateBenefit(@Param('id', ParseIntPipe) id: number, @Body() benefit: updateBenefitDto) {
        return this.benefitService.update(id, benefit)
    }

    @Delete(':id')
    @Roles(RoleEnum.Admin)
    deleteBenefit(@Param('id', ParseIntPipe) id: number) {
        return this.benefitService.delete(id)
    }
}
