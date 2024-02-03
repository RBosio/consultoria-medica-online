import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createNotificationDto } from './dto/create-notification.dto';
import { Notification } from 'src/entities/notification.entity';
import { UserService } from 'src/user/user.service';
import { MeetingService } from 'src/meeting/meeting.service';

@Injectable()
export class NotificationService {

    constructor(
        @InjectRepository(Notification) private notificationRepository: Repository<Notification>,
        private userService: UserService,
        private meetingService: MeetingService
        ) {}

    findAllByUser(id: number): Promise<Notification[]> {
        return this.notificationRepository.find({
            where: {
                userReceive: {
                    id
                }
            },
            relations: {
                userSend: true,
                meeting: true
            },
            order: {
                created_at: 'desc'
            }
        })
    }

    findOneByUser(id: number): Promise<Notification> {
        return this.notificationRepository.findOne({
            where: {
                userSend: {
                    id
                },
                type: 'verification'
            }
        })
    }

    async create(notification: createNotificationDto): Promise<Notification | HttpException> {
        const newNotification = this.notificationRepository.create(notification)

        const userSend = await this.userService.findOne(notification.userIdSend)
        const userReceive = await this.userService.findOne(notification.userIdReceive)

        newNotification.userSend = userSend
        newNotification.userReceive = userReceive

        if(notification.meetingUserId && notification.meetingStartDatetime) {
            const meetingFound = await this.meetingService.findOne(notification.meetingUserId, notification.meetingStartDatetime)

            newNotification.meeting = meetingFound
        }

        return this.notificationRepository.save(newNotification)
    }

    async readNotification(id: number): Promise<Notification | HttpException> {
        const notificationFound = await this.notificationRepository.findOne({
            where: {
                id
            }
        })

        notificationFound.readed = true
        
        return this.notificationRepository.save(notificationFound)
    }
    async readNotifications(id: number): Promise<Notification[] | HttpException> {
        const notificationsFound = await this.notificationRepository.find({
            where: {
                userReceive: {
                    id
                }
            }
        })

        notificationsFound.map(n => {
            n.readed = true
        })
        
        return this.notificationRepository.save(notificationsFound)
    }
}
