import { Controller, Get, Body, Param, Delete, Patch, HttpException, UseInterceptors, Post, Req } from '@nestjs/common';
import { updateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';

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

    @UseInterceptors(
        FileInterceptor(
            'file',
            {
                storage: diskStorage({
                    destination: './public/uploads/user',
                    filename: (req, file, cb) => {
                        req.body.url = uuidv4() + '.' + file.originalname.split('.').slice(-1)
                        cb(null, req.body.url)
                    }
                })
            }
        )
    )
    @Post(':dni/image')
    uploadFile(@Param('dni') dni: string, @Req() request: Request) {
        const { body } = request

        return this.userService.uploadFile(dni, body.url)
    }
}
