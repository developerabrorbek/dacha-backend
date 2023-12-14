import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {
  CreateNotificationRequest,
  GetNotificationListRequest,
  UpdateNotificationRequest,
} from './interfaces';
import { Notification } from '@prisma/client';

@Injectable()
export class NotificationService {
  #_prisma: PrismaService;

  constructor(prisma: PrismaService) {
    this.#_prisma = prisma;
  }

  async createNotification(payload: CreateNotificationRequest): Promise<void> {
    await this.#_prisma.notification.create({
      data: {
        message: payload.message,
        userId: payload.userId,
        type: payload.type,
        createdBy: payload.createdBy,
      },
    });
  }

  async getNotificationList(
    payload: GetNotificationListRequest,
  ): Promise<Notification[]> {
    const data = await this.#_prisma.notification.findMany({
      where: { userId: payload.userId, type: 'public' },
    });

    return data;
  }

  async updateNotification(payload: UpdateNotificationRequest): Promise<null> {
    const notification = await this.#_prisma.notification.findFirst({
      where: { id: payload.id },
    });

    if (
      payload.userId == notification.userId &&
      notification.type == 'personal'
    ) {
      await this.#_prisma.notification.update({
        where: { id: payload.id },
        data: { status: payload.status },
      });
      return null;
    }

    await this.#_prisma.notification.update({
      where: { id: payload.id },
      data: {
        watchedUsers: {
          push: payload.watchedUserId,
        },
      },
    });
    return null;
  }

  async deleteNotification(id: string): Promise<void> {
    await this.#_prisma.notification.update({
      where: { id },
      data: { status: 'seen' },
    });
  }
}
