import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {
  CreateNotificationForAllRequest,
  CreateNotificationRequest,
  GetNotificationListRequest,
  UpdateNotificationRequest,
} from './interfaces';
import { Notification } from '@prisma/client';
import { isUUID } from 'class-validator';

@Injectable()
export class NotificationService {
  #_prisma: PrismaService;

  constructor(prisma: PrismaService) {
    this.#_prisma = prisma;
  }

  async createNotificationForSingle(
    payload: CreateNotificationRequest,
  ): Promise<void> {
    await this.#_prisma.notification.create({
      data: {
        message: payload.message,
        users: {
          connect: {
            id: payload.userId,
          },
        },
        type: payload.type,
      },
    });
  }

  async createNotificationForAll(
    payload: CreateNotificationForAllRequest,
  ): Promise<void> {
    const allUsers = await this.#_prisma.user.findMany();

    const notification = await this.#_prisma.notification.create({
      data: {
        message: payload.message,
        type: payload.type,
      },
    });

    allUsers.forEach(async (u) => {
      await this.#_prisma.user_Notification.create({
        data: {
          notificationId: notification.id,
          userId: u.id,
        },
      });
    });
  }

  async getNotificationList(
    payload: GetNotificationListRequest,
  ): Promise<Notification[]> {
    if (!isUUID(payload.userId, 4)) {
      throw new ConflictException('Give valid ID');
    }
    const data = await this.#_prisma.notification.findMany({
      where: {
        users: {
          some: {
            userId: payload.userId,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return data;
  }

  async getAllNotifications(): Promise<Notification[]> {
    return await this.#_prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateNotification(payload: UpdateNotificationRequest): Promise<void> {
    this.#_checkUUID(payload.notificationId);

    const notification = await this.#_prisma.notification.findFirst({
      where: { id: payload.notificationId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    const user = await this.#_prisma.user.findFirst({
      where: { id: payload.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userNotification = await this.#_prisma.user_Notification.findFirst({
      where: { userId: payload.userId, notificationId: payload.notificationId },
    });

    if (!userNotification) {
      throw new NotFoundException('User notification not found');
    }

    await this.#_prisma.user_Notification.update({
      where: { id: userNotification.id },
      data: {
        isRead: payload.isRead,
      },
    });
  }

  async deleteNotification(id: string): Promise<void> {
    this.#_checkUUID(id);
    await this.#_prisma.notification.delete({
      where: { id },
    });
  }

  #_checkUUID(id: string): void {
    if (!isUUID(id, 4)) {
      throw new ConflictException('Please provide a valid UUID');
    }
  }
}
