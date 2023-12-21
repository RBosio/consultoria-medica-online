import { Controller, Get, Body, Param, Delete, Patch, HttpException } from '@nestjs/common';
import { updateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';

@Controller('user')
export class UserController {

    constructor(private userService: UserService) {}

    @Get()
    getUsers(): Promise<User[]> {
        return this.userService.findAll()
    }
    
    @Get(':dni')
    getUser(@Param('dni') dni: string): Promise<User | HttpException> {
        return this.userService.findOneByDni(dni)
    }

    @Patch(':dni')
    updateUser(@Param('dni') dni: string, @Body() user: updateUserDto) {
        return this.userService.update(dni, user)
    }

    @Delete(':dni')
    deleteUser(@Param('dni') dni: string) {
        return this.userService.delete(dni)
    }
}
