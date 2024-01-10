import { Controller, Get, Post, Body, Param, Delete, Patch, HttpException, ParseIntPipe, UseGuards } from '@nestjs/common';
import { createPlanDto } from './dto/create-plan.dto';
import { updatePlanDto } from './dto/update-plan.dto';
import { PlanService } from './plan.service';
import { Plan } from 'src/entities/plan.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RoleEnum } from 'src/enums/role.enum';

@Controller('plan')
@UseGuards(AuthGuard, RolesGuard)
export class PlanController {

    constructor(private planService: PlanService) {}
    
    @Get()
    @Roles(RoleEnum.User, RoleEnum.Doctor, RoleEnum.Admin)
    getPlans(): Promise<Plan[]> {
        return this.planService.findAll()
    }
    
    @Get(':id')
    @Roles(RoleEnum.User, RoleEnum.Doctor, RoleEnum.Admin)
    getPlan(@Param('id', ParseIntPipe) id: number): Promise<Plan | HttpException> {
        return this.planService.findOne(id)
    }

    @Post()
    @Roles(RoleEnum.Admin)
    createPlan(@Body() plan: createPlanDto): Promise<Plan | HttpException> {
        return this.planService.create(plan)
    }

    @Patch(':id')
    @Roles(RoleEnum.Admin)
    updatePlan(@Param('id', ParseIntPipe) id: number, @Body() plan: updatePlanDto) {
        return this.planService.update(id, plan)
    }

    @Delete(':id')
    @Roles(RoleEnum.Admin)
    deletePlan(@Param('id', ParseIntPipe) id: number) {
        return this.planService.delete(id)
    }
}
