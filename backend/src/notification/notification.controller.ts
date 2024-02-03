import { Controller, Get, Post, Body, Param, Delete, Patch, HttpException, ParseIntPipe, UseGuards } from '@nestjs/common';
import { createNotificationDto } from './dto/create-notification.dto';
import { NotificationService } from './notification.service';
import { Notification } from 'src/entities/notification.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RoleEnum } from 'src/enums/role.enum';

@Controller('notification')
@UseGuards(AuthGuard, RolesGuard)
export class NotificationController {

    constructor(private notificationService: NotificationService) {}
    
    @Get(':userId')
    @Roles(RoleEnum.User, RoleEnum.Doctor, RoleEnum.Admin)
    getNotificationsByUser(@Param('userId', ParseIntPipe) id: number): Promise<Notification[]> {
        return this.notificationService.findAllByUser(id)
    }

    @Get('verification/:userId')
    @Roles(RoleEnum.User, RoleEnum.Doctor)
    getNotificationByUser(@Param('userId', ParseIntPipe) id: number): Promise<Notification> {
        return this.notificationService.findOneByUser(id)
    }
    
    @Post()
    @Roles(RoleEnum.User, RoleEnum.Doctor)
    createNotification(@Body() notification: createNotificationDto): Promise<Notification | HttpException> {
        return this.notificationService.create(notification)
    }

    @Patch('readAll/:userReceiveId')
    @Roles(RoleEnum.User, RoleEnum.Doctor, RoleEnum.Admin)
    readNotifications(@Param('userReceiveId', ParseIntPipe) userReceiveId: number): Promise<Notification[] | HttpException> {
        return this.notificationService.readNotifications(userReceiveId)
    }

    @Patch(':id')
    @Roles(RoleEnum.User, RoleEnum.Doctor, RoleEnum.Admin)
    readNotification(@Param('id', ParseIntPipe) id: number): Promise<Notification | HttpException> {
        return this.notificationService.readNotification(id)
    }
}
