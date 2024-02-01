import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createNotificationDto } from './dto/create-notification.dto';
import { Notification } from 'src/entities/notification.entity';

@Injectable()
export class NotificationService {

    constructor(@InjectRepository(Notification) private notificationRepository: Repository<Notification>) {}

    findAllByUser(id: number): Promise<Notification[]> {
        return this.notificationRepository.find({
            where: {
                userReceive: {
                    id
                }
            }
        })
    }

    async create(notification: createNotificationDto): Promise<Notification | HttpException> {
        const newNotification = this.notificationRepository.create(notification)

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
}
