import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Patch,
  HttpException,
  UseGuards,
  UseInterceptors,
  Post,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
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
  getUsers(@Req() req: Request): Promise<User[]> {
    const { page, name, role, ascName, ascSurname } = req.query;

    return this.userService.findAll(+page, name, +role, +ascName, +ascSurname);
  }

  @Get('count')
  @Roles(RoleEnum.Admin)
  count(@Req() req: Request) {
    const { name, role } = req.query;

    return this.userService.count(name, +role);
  }

  @Get('admin')
  @Roles(RoleEnum.User, RoleEnum.Doctor)
  getAdmin(): Promise<User | HttpException> {
    return this.userService.findAdmin();
  }

  @Get('id/:id')
  @Roles(RoleEnum.User, RoleEnum.Doctor, RoleEnum.Admin)
  getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<User | HttpException> {
    return this.userService.findOneById(id);
  }

  @Get(':dni')
  @Roles(RoleEnum.User, RoleEnum.Doctor, RoleEnum.Admin)
  getUser(@Param('dni') dni: string): Promise<User | HttpException> {
    return this.userService.findOneByDni(dni);
  }

  @Patch('healthInsurance/:id')
  @Roles(RoleEnum.User, RoleEnum.Doctor, RoleEnum.Admin)
  addHealthInsurance(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    { healthInsuranceId, cod }: { healthInsuranceId: number; cod: string },
  ) {
    return this.userService.addHealthInsurance(id, healthInsuranceId, cod);
  }

  @Patch(':id')
  @Roles(RoleEnum.User, RoleEnum.Doctor, RoleEnum.Admin)
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: updateUserDto,
  ) {
    return this.userService.update(id, user);
  }

  @Patch('clearHI/:id')
  @Roles(RoleEnum.Admin)
  clearHI(@Param('id', ParseIntPipe) id: number) {
    return this.userService.clearHI(id);
  }

  @Delete('unsetHI/:hi_id')
  @UseGuards(AuthGuard)
  unsetHI(@Param('hi_id', ParseIntPipe) hi_id: number, @Req() req) {
    return this.userService.unsetHI(hi_id, req);
  }

  @Delete(':dni')
  @Roles(RoleEnum.Admin)
  deleteUser(@Param('dni') dni: string) {
    return this.userService.delete(dni);
  }

  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/api/uploads/user/images',
        filename: (req, file, cb) => {
          req.body.url =
            uuidv4() + '.' + file.originalname.split('.').slice(-1);
          cb(null, req.body.url);
        },
      }),
    }),
  )
  @Post(':dni/image')
  uploadImage(@Param('dni') dni: string, @Req() request: Request) {
    const { body } = request;

    return this.userService.uploadImage(dni, body.url);
  }

  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/api/uploads/user/healthInsurances',
        filename: (req, file, cb) => {
          req.body.url =
            uuidv4() + '.' + file.originalname.split('.').slice(-1);
          req.body.name = file.originalname;

          cb(null, req.body.url);
        },
      }),
    }),
  )
  @Post(':dni/healthInsurance')
  uploadHealthInsurance(@Param('dni') dni: string, @Req() request: Request) {
    const { body } = request;

    return this.userService.uploadHealthInsurance(
      dni,
      body.name,
      body.url,
      Number(body.healthInsuranceId),
    );
  }
}
