import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createNotificationDto } from './dto/create-notification.dto';
import { Notification } from 'src/entities/notification.entity';
import { UserService } from 'src/user/user.service';
import { MeetingService } from 'src/meeting/meeting.service';
import { HealthInsuranceService } from 'src/health-insurance/health-insurance.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private userService: UserService,
    private meetingService: MeetingService,
    private healthInsuranceService: HealthInsuranceService,
  ) {}

  async findAllByUser(id: number): Promise<Notification[]> {
    let notifications = await this.notificationRepository.find({
      where: {
        userReceive: {
          id,
        },
      },
      relations: {
        userSend: true,
        meeting: true,
        healthInsurance: true,
      },
      order: {
        created_at: 'desc',
      },
    });

    notifications = notifications.map((n) => {
      delete n.userSend.password;
      return n;
    });

    return notifications;
  }

  async findOneByUser(id: number): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: {
        userSend: {
          id,
        },
        type: 'verification',
      },
    });

    if (notification) {
      delete notification.userSend?.password;
    }

    return notification;
  }

  async create(
    notification: createNotificationDto,
  ): Promise<Notification | HttpException> {
    const newNotification = this.notificationRepository.create(notification);

    const userSend = await this.userService.findOne(notification.userIdSend);
    const userReceive = await this.userService.findOne(
      notification.userIdReceive,
    );

    newNotification.userSend = userSend;
    newNotification.userReceive = userReceive;

    if (notification.meetingUserId && notification.meetingStartDatetime) {
      const meetingFound = await this.meetingService.findOne(
        notification.meetingUserId,
        notification.meetingStartDatetime,
      );

      newNotification.meeting = meetingFound;

      if (notification.mStartDOld && notification.mStartDNew) {
        newNotification.mStartDOld = notification.mStartDOld;
        newNotification.mStartDNew = notification.mStartDNew;
      }
    }

    if (notification.healthInsuranceId) {
      const hi = await this.healthInsuranceService.findOne(
        notification.healthInsuranceId,
      );

      newNotification.healthInsurance = hi;
    }

    return this.notificationRepository.save(newNotification);
  }

  async readNotification(id: number): Promise<Notification | HttpException> {
    const notificationFound = await this.notificationRepository.findOne({
      where: {
        id,
      },
    });

    notificationFound.readed = true;

    return this.notificationRepository.save(notificationFound);
  }
  async readNotifications(id: number): Promise<Notification[] | HttpException> {
    const notificationsFound = await this.notificationRepository.find({
      where: {
        userReceive: {
          id,
        },
      },
    });

    notificationsFound.map((n) => {
      n.readed = true;
      delete n?.userReceive?.password;
    });

    return this.notificationRepository.save(notificationsFound);
  }
}
