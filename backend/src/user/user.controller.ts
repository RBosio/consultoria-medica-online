import { Controller, Get, Body, Param, Delete, Patch, HttpException, UseGuards, UseInterceptors, Post, Req, ParseIntPipe } from '@nestjs/common';
import { updateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RoleEnum } from 'src/enums/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';

@Controller('user')
@UseGuards(AuthGuard, RolesGuard)
export class UserController {

    constructor(private userService: UserService) {}

    @Get()
    @Roles(RoleEnum.Admin)
    getUsers(): Promise<User[]> {
        return this.userService.findAll()
    }
    
    @Get('admin')
    @Roles(RoleEnum.User, RoleEnum.Doctor)
    getAdmin(): Promise<User | HttpException> {
        return this.userService.findAdmin()
    }
    
    @Get(':dni')
    @Roles(RoleEnum.User, RoleEnum.Doctor, RoleEnum.Admin)
    getUser(@Param('dni') dni: string): Promise<User | HttpException> {
        return this.userService.findOneByDni(dni)
    }

    @Patch(':id')
    @Roles(RoleEnum.User, RoleEnum.Doctor)
    updateUser(@Param('id', ParseIntPipe) id: number, @Body() user: updateUserDto) {
        return this.userService.update(id, user)
    }

    @Delete(':dni')
    @Roles(RoleEnum.Admin)
    deleteUser(@Param('dni') dni: string) {
        return this.userService.delete(dni)
    }

    @UseInterceptors(
        FileInterceptor(
            'file',
            {
                storage: diskStorage({
                    destination: './public/uploads/user/images',
                    filename: (req, file, cb) => {
                        req.body.url = uuidv4() + '.' + file.originalname.split('.').slice(-1)
                        cb(null, req.body.url)
                    }
                })
            }
        )
    )
    @Post(':dni/image')
    uploadImage(@Param('dni') dni: string, @Req() request: Request) {
        const { body } = request

        return this.userService.uploadImage(dni, body.url)
    }

    @UseInterceptors(
        FileInterceptor(
            'file',
            {
                storage: diskStorage({
                    destination: './public/uploads/user/healthInsurances',
                    filename: (req, file, cb) => {
                        req.body.url = uuidv4() + '.' + file.originalname.split('.').slice(-1)
                        cb(null, req.body.url)
                    }
                })
            }
        )
    )
    @Post('healthInsurance')
    uploadHealthInsurance(@Req() request: Request) {
        const { body } = request

        return this.userService.uploadHealthInsurance(body.id, body.healthInsuranceId, body.url)
    }
}
