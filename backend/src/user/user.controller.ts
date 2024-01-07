import { Controller, Get, Body, Param, Delete, Patch, HttpException, UseGuards } from '@nestjs/common';
import { updateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RoleEnum } from 'src/enums/role.enum';

@Controller('user')
@UseGuards(AuthGuard, RolesGuard)
export class UserController {

    constructor(private userService: UserService) {}

    @Get()
    @Roles(RoleEnum.Admin)
    getUsers(): Promise<User[]> {
        return this.userService.findAll()
    }
    
    @Get(':dni')
    @Roles(RoleEnum.User, RoleEnum.Admin)
    getUser(@Param('dni') dni: string): Promise<User | HttpException> {
        return this.userService.findOneByDni(dni)
    }

    @Patch(':dni')
    @Roles(RoleEnum.User)
    updateUser(@Param('dni') dni: string, @Body() user: updateUserDto) {
        return this.userService.update(dni, user)
    }

    @Delete(':dni')
    @Roles(RoleEnum.Admin)
    deleteUser(@Param('dni') dni: string) {
        return this.userService.delete(dni)
    }
}
