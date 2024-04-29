import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {
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
    if (!isUUID(payload.userId, 4)) {
      throw new ConflictException('Give valid ID');
    }
    const data = await this.#_prisma.notification.findMany({
      where: { OR: [{ userId: payload.userId }, { type: 'public' }] },
    });

    return data;
  }

  async getAllNotifications(): Promise<Notification[]> {
    return await this.#_prisma.notification.findMany();
  }

  async updateNotification(payload: UpdateNotificationRequest): Promise<null> {
    this.#_checkUUID(payload.id);
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
